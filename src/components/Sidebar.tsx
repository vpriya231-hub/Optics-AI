import { Plus, MessageSquare, Trash2, GraduationCap, Sun, Moon, Monitor } from "lucide-react";
import { ChatSession } from "../types";
import { cn } from "../lib/utils";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  theme,
  setTheme,
}: SidebarProps) {
  return (
    <aside className="w-80 h-full bg-[#141414] dark:bg-[#0a0a0a] text-white flex flex-col border-r border-[#2a2a2a] dark:border-[#1a1a1a]">
      {/* Brand Header */}
      <div className="p-6 border-bottom border-[#2a2a2a] flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-lg leading-tight">Optics AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">Your Vision for Learning</p>
        </div>
      </div>

      {/* New Chat Action */}
      <div className="px-4 py-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
        >
          <div className="p-1 bg-blue-600 rounded-md group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm">New Session</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
        <p className="px-2 text-[10px] uppercase tracking-widest text-[#666] font-bold mb-2">History</p>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border border-transparent",
              currentSessionId === session.id
                ? "bg-blue-600/10 border-blue-600/30 text-blue-100"
                : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
            )}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare className={cn("w-4 h-4 shrink-0", currentSessionId === session.id ? "text-blue-400" : "text-gray-600")} />
            <span className="text-sm truncate pr-6 font-medium">{session.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
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
