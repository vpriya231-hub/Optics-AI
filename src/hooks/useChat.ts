import { useState, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { ChatSession, Message, Role } from "../types";

const SYSTEM_INSTRUCTION = `You are Optics AI, a dedicated tutor for NEET and JEE aspirants. 

Your primary and only function right now is 'Ask Tutor'.

How to respond:
- When a student asks a doubt in Physics, Chemistry, or Biology, provide a step-by-step clear explanation.
- Use simple language and include necessary formulas.
- If the user asks about other features like 'Quiz History' or 'Study Planner', politely inform them that those features are 'Coming Soon' and you are currently focused on helping them as a Tutor.
- Keep the tone encouraging and academic.
- Always identify yourself as Optics AI.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("optics_ai_sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  useEffect(() => {
    localStorage.setItem("optics_ai_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Session",
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const sendMessage = useCallback(async (content: string) => {
    let targetSessionId = currentSessionId;
    if (!targetSessionId) {
      targetSessionId = createNewSession();
    }

    const userMessage: Message = {
      role: Role.USER,
      content,
      timestamp: Date.now(),
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === targetSessionId
          ? {
              ...s,
              messages: [...s.messages, userMessage],
              updatedAt: Date.now(),
              title: s.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : s.title,
            }
          : s
      )
    );

    setIsTyping(true);

    try {
      const history = sessions.find(s => s.id === targetSessionId)?.messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })) || [];

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [...history, { role: Role.USER, parts: [{ text: content }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const aiMessage: Message = {
        role: Role.AI,
        content: response.text || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? { ...s, messages: [...s.messages, aiMessage], updatedAt: Date.now() }
            : s
        )
      );
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMessage: Message = {
        role: Role.AI,
        content: "I encountered an error connecting to my wisdom banks. Please check your internet or try again in a moment.",
        timestamp: Date.now(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? { ...s, messages: [...s.messages, errorMessage] }
            : s
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, [currentSessionId, createNewSession, sessions]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    setCurrentSessionId,
    sendMessage,
    createNewSession,
    deleteSession,
    isTyping,
  };
}
