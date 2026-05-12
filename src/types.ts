export enum Role {
  USER = "user",
  AI = "model",
}

export enum ViewState {
  TUTOR = "tutor",
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

export enum Subject {
  PHYSICS = "Physics",
  CHEMISTRY = "Chemistry",
  BIOLOGY = "Biology",
  MATHS = "Mathematics",
}
