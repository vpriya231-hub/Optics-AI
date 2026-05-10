export enum Role {
  USER = "user",
  AI = "model",
}

export interface Message {
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
