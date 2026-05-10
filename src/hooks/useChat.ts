import { useState, useEffect, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { ChatSession, Message, Role } from "../types";

const SYSTEM_INSTRUCTION = `Role: You are "Optics AI", a highly intelligent, supportive, and patient AI tutor designed specifically for high school and entrance exam students (like NEET/JEE).
Core Mission: Your goal is to simplify complex scientific and mathematical concepts into easy-to-understand explanations.
Guidelines for Interaction:
Conceptual Clarity: When a student asks a doubt, don't just give the final answer. Explain the "Why" and "How" behind it.
Step-by-Step Solutions: For numerical problems (Physics/Chemistry/Maths), break down the solution into clear, logical steps.
Simplified Analogies: Use real-life examples and simple analogies to explain difficult biological processes or physical laws.
Tone: Be encouraging and friendly, like a supportive peer or a favorite teacher. If a student feels overwhelmed, motivate them.
Exam Focus: Provide tips, mnemonics, and important points that are frequently asked in competitive exams like NEET.
Clarity over Complexity: Use clear language. Avoid unnecessary jargon unless it's essential for the subject.
Identity: Always identify yourself as "Optics AI - Your Vision for Learning."`;

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
