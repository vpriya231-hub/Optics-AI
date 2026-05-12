import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  GraduationCap, 
  Sun, 
  Moon, 
  Monitor, 
  X
} from "lucide-react";
import { ChatSession, ViewState } from "../types";
import { cn } from "../lib/utils";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  onClose?: () => void;
  view: ViewState;
  onViewChange: (view: ViewState) => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  theme,
  setTheme,
  onClose,
  view,
  onViewChange,
}: SidebarProps) {
  const navItems = [
    { id: ViewState.TUTOR, label: "Ask Tutor", icon: MessageSquare, isComingSoon: false },
  ];

  return (
    <aside className="w-80 h-full bg-[#141414] dark:bg-[#0a0a0a] text-white flex flex-col border-r border-[#2a2a2a] dark:border-[#1a1a1a] relative">
      {/* Mobile Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-white z-50"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand Header */}
      <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-lg leading-tight">Optics AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Your Vision for Learning</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Portal Navigation */}
        <div className="px-4 py-4 space-y-1">
          <p className="px-2 text-[10px] uppercase tracking-widest text-[#666] font-bold mb-2">Portal</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                if (window.innerWidth < 1024 && onClose) onClose();
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border border-transparent group",
                view === item.id 
                  ? "bg-blue-600/10 border-blue-600/30 text-blue-100" 
                  : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4 shrink-0", view === item.id ? "text-blue-400" : "text-gray-600")} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.isComingSoon && (
                <span className="text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Chat History Section - Always Visible */}
        <div className="px-4 py-4 space-y-1 border-t border-[#2a2a2a] flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Chat History</p>
            <button 
              onClick={() => {
                onNewChat();
                onViewChange(ViewState.TUTOR);
              }}
              className="p-1 hover:bg-white/10 rounded-md text-blue-400 transition-colors"
              title="New Chat"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 min-h-0">
            {sessions.length === 0 ? (
              <p className="px-2 py-4 text-xs text-gray-600 italic text-center">No recent chats</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent",
                    currentSessionId === session.id && view === ViewState.TUTOR
                      ? "bg-white/5 border-white/10 text-white"
                      : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
                  )}
                  onClick={() => {
                    onSelectSession(session.id);
                    onViewChange(ViewState.TUTOR);
                    if (window.innerWidth < 1024 && onClose) onClose();
                  }}
                >
                  <MessageSquare className={cn("w-3.5 h-3.5 shrink-0 text-gray-600")} />
                  <span className="text-xs truncate pr-6 font-medium">{session.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Info & Theme Toggle */}
      <div className="p-4 border-t border-[#2a2a2a] dark:border-[#1a1a1a] space-y-4">
        <div className="flex items-center justify-between bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              "p-2 rounded-lg transition-all flex-1 flex justify-center",
              theme === 'light' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
            )}
            title="Light Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              "p-2 rounded-lg transition-all flex-1 flex justify-center",
              theme === 'dark' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
            )}
            title="Dark Mode"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={cn(
              "p-2 rounded-lg transition-all flex-1 flex justify-center",
              theme === 'system' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
            )}
            title="System Theme"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[#444] text-[10px] text-center font-mono">
          NEET/JEE SPECIALIST • V1.0.0
        </div>
      </div>
    </aside>
  );
}
