/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { useChat } from "./hooks/useChat";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, setTheme } = useTheme();
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

  return (
    <div className="flex h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden font-sans transition-colors duration-300">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={createNewSession}
        onDeleteSession={deleteSession}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatWindow 
          session={currentSession} 
          onSendMessage={sendMessage}
          isTyping={isTyping}
        />
      </main>
    </div>
  );
}
