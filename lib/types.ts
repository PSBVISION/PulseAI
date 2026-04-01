export type PersonalityType = "friendly" | "formal" | "energetic" | "calm";

export interface UserProfile {
  id: string;
  name: string;
  nickname?: string;
  personality: PersonalityType;
  faceDescriptor: Float32Array | number[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  userId: string;
  messages: ChatMessage[];
  startedAt: string;
}

export interface RecognitionResult {
  recognized: boolean;
  userId?: string;
  confidence?: number;
  user?: UserProfile;
}
