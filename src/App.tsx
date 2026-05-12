/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { useChat } from "./hooks/useChat";
import { useTheme } from "./hooks/useTheme";
import { ViewState } from "./types";
import { Menu } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.TUTOR);
  
  const {
    sessions,
    currentSession,
    currentSessionId,
    setCurrentSessionId,
    sendMessage,
    createNewSession,
    deleteSession,
    isTyping,
  } = useChat();

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setView(ViewState.TUTOR);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={() => {
            createNewSession();
            setView(ViewState.TUTOR);
            setIsSidebarOpen(false);
          }}
          onDeleteSession={deleteSession}
          theme={theme}
          setTheme={setTheme}
          onClose={() => setIsSidebarOpen(false)}
          view={view}
          onViewChange={setView}
        />
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/10 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="font-bold dark:text-white truncate max-w-[120px]">
              Optics AI
            </span>
          </div>
          <div className="w-10" />
        </div>

        <ChatWindow 
          session={currentSession} 
          onSendMessage={sendMessage}
          isTyping={isTyping}
        />
      </main>
    </div>
  );
}
