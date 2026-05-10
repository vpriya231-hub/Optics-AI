import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, User, Sparkles, GraduationCap, ChevronRight, BookOpen, Calculator, Atom } from "lucide-react";
import { Message, Role, ChatSession } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ChatWindowProps {
  session: ChatSession | undefined;
  onSendMessage: (content: string) => void;
  isTyping: boolean;
}

export function ChatWindow({ session, onSendMessage, isTyping }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  if (!session) {
    return (
      <div className="flex-1 bg-[#f9fafb] dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-8 transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 dark:shadow-blue-900/20">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-sans font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome to <span className="text-blue-600">Optics AI</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
              Your vision for learning. I'm here to simplify concepts for NEET, JEE, and Board exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { icon: BookOpen, title: "Clarify Doubts", desc: "Get deep conceptual explanations" },
              { icon: Calculator, title: "Step-by-Step", desc: "Master numerical problems easily" },
              { icon: Atom, title: "Analogies", desc: "Learn with real-life examples" }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
                <item.icon className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button 
              onClick={() => onSendMessage("Hello Optics AI! Can you help me with a physics concept?")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-full font-medium hover:bg-black dark:hover:bg-blue-700 transition-colors shadow-lg shadow-gray-200 dark:shadow-blue-900/20"
            >
              Start Learning <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#111] relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-48 -mt-48 opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -ml-32 -mb-32 opacity-40 pointer-events-none" />

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative z-10"
      >
        {session.messages.map((message, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-4xl mx-auto",
              message.role === Role.USER ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-sm",
              message.role === Role.AI ? "bg-blue-600" : "bg-gray-100 dark:bg-white/10"
            )}>
              {message.role === Role.AI ? (
                <Sparkles className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            
            <div className={cn(
              "flex flex-col space-y-2 max-w-[85%]",
              message.role === Role.USER ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "p-4 md:p-6 rounded-3xl text-sm md:text-base leading-relaxed overflow-hidden",
                message.role === Role.USER 
                  ? "bg-gray-900 dark:bg-blue-600 text-white rounded-tr-none shadow-lg shadow-gray-100 dark:shadow-blue-900/10" 
                  : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-xl shadow-gray-50 dark:shadow-none"
              )}>
                <div className="markdown-body prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-50 dark:prose-pre:bg-black/50 prose-pre:text-gray-800 dark:prose-pre:text-gray-200">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 px-2">
                {message.role === Role.AI ? "Optics AI • Assistant" : "You"}
              </span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 rounded-3xl rounded-tl-none shadow-lg shadow-gray-50 dark:shadow-none flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 md:p-8 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-white/10 relative z-20">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-end gap-3 relative"
        >
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Optics AI anything about NEET/JEE..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Optics AI - Your Vision for Learning
        </p>
      </div>
    </div>
  );
}
