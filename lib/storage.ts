import { UserProfile, ChatSession } from './types';

const USERS_STORAGE_KEY = 'desk-bot-users';
const CHAT_SESSIONS_STORAGE_KEY = 'desk-bot-chat-sessions';

// Type guard for browser environment
const isClient = typeof window !== 'undefined';

export const storageManager = {
  // User management
  getAllUsers: (): UserProfile[] => {
    if (!isClient) return [];
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) return [];
      const users = JSON.parse(data);
      return users.map((u: any) => ({
        ...u,
        faceDescriptor: new Float32Array(u.faceDescriptor),
      }));
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  },

  saveUser: (user: UserProfile): UserProfile => {
    if (!isClient) return user;
    try {
      const users = storageManager.getAllUsers();
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      const userToSave = {
        ...user,
        faceDescriptor: Array.from(user.faceDescriptor),
      };
      
      if (existingIndex >= 0) {
        users[existingIndex] = userToSave;
      } else {
        users.push(userToSave);
      }
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      return user;
    }
  },

  getUserById: (id: string): UserProfile | null => {
    if (!isClient) return null;
    try {
      const users = storageManager.getAllUsers();
      return users.find(u => u.id === id) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  deleteUser: (id: string): void => {
    if (!isClient) return;
    try {
      const users = storageManager.getAllUsers();
      const filtered = users.filter(u => u.id !== id);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  },

  // Chat session management
  saveChatSession: (session: ChatSession): void => {
    if (!isClient) return;
    try {
      const sessions = storageManager.getAllChatSessions();
      const existingIndex = sessions.findIndex(s => s.userId === session.userId);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  },

  getSessions: (userId: string): ChatSession | null => {
    if (!isClient) return null;
    try {
      const sessions = storageManager.getAllChatSessions();
      return sessions.find(s => s.userId === userId) || null;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return null;
    }
  },

  getAllChatSessions: (): ChatSession[] => {
    if (!isClient) return [];
    try {
      const data = localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  },

  clearChat: (userId: string): void => {
    if (!isClient) return;
    try {
      const sessions = storageManager.getAllChatSessions();
      const filtered = sessions.filter(s => s.userId !== userId);
      localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  },
};
