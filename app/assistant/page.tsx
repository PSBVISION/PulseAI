'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Trash2, LogOut } from 'lucide-react';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage } from '@/components/chat-message';
import { RobotAvatar } from '@/components/robot-avatar';
import { WebcamCapture } from '@/components/webcam-capture';
import Spinner from '@/components/ui/spinner';
import { storageManager } from '@/lib/storage';
import { UserProfile, ChatMessage as ChatMessageType, ChatSession } from '@/lib/types';

export default function AssistantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializePage = () => {
      const userId = searchParams.get('userId');
      if (!userId) {
        router.push('/recognize');
        return;
      }

      const userProfile = storageManager.getUserById(userId);
      if (!userProfile) {
        setError('User not found. Please log in again.');
        setTimeout(() => router.push('/recognize'), 2000);
        return;
      }

      setUser(userProfile);

      // Load existing chat session or create new one
      const existingSession = storageManager.getSessions(userId);
      if (existingSession) {
        setMessages(existingSession.messages);
      } else {
        // Initialize with welcome message
        const welcomeMsg: ChatMessageType = {
          id: '1',
          role: 'assistant',
          content: `Hello ${userProfile.nickname || userProfile.name}! I'm your personal Desk Bot Assistant. I'm here to help you with questions, ideas, and have great conversations. What can I help you with today?`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMsg]);
      }

      setIsInitializing(false);
    };

    initializePage();
  }, [searchParams, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userName: user.name,
          userNickname: user.nickname,
          personality: user.personality,
          conversationHistory: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Sorry, I could not generate a response.',
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Save chat session
      const session: ChatSession = {
        userId: user.id,
        messages: finalMessages,
        startedAt: new Date().toISOString(),
      };
      storageManager.saveChatSession(session);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', err);
      // Remove the user message that failed
      setMessages(newMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (user && confirm('Clear all messages in this chat?')) {
      setMessages([]);
      storageManager.clearChat(user.id);
    }
  };

  const handleLogout = () => {
    setMessages([]);
    router.push('/recognize');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-slate-400">Loading your assistant...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <NavHeader
        showUserProfile={true}
        userName={user.nickname || user.name}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex gap-4 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Left Panel: Webcam & User Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col gap-4 w-80"
        >
          {/* Webcam */}
          {showWebcam && (
            <WebcamCapture
              showCapture={false}
              isCapturing={false}
            />
          )}

          {/* Toggle Webcam */}
          <Button
            variant="outline"
            onClick={() => setShowWebcam(!showWebcam)}
            className="w-full"
          >
            {showWebcam ? 'Hide Webcam' : 'Show Webcam'}
          </Button>

          {/* Avatar & Robot Status */}
          <Card className="bg-slate-800 border-slate-700 flex-1 flex flex-col items-center justify-center p-6">
            <RobotAvatar isActive={true} isListening={isLoading} />
          </Card>

          {/* User Profile Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Name</p>
                  <p className="font-semibold">{user.name}</p>
                </div>
                {user.nickname && (
                  <div>
                    <p className="text-xs text-slate-400">Nickname</p>
                    <p className="font-semibold">{user.nickname}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400">Personality</p>
                  <p className="font-semibold capitalize">
                    {user.personality}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    Registered:{' '}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel: Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col min-h-[calc(100vh-120px)] max-w-2xl"
        >
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Messages */}
          <Card className="flex-1 bg-slate-800 border-slate-700 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-slate-400">
                      Start a conversation with your desk bot!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      role={msg.role}
                      content={msg.content}
                      timestamp={new Date(msg.timestamp)}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg rounded-tl-none bg-slate-700 text-slate-100">
                        <div className="flex gap-2 items-center">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <span
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.15s' }}
                            />
                            <span
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.3s' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  placeholder="Ask your desk bot anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="gap-2 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="gap-2 flex-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 flex-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
