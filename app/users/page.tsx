'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, MessageSquare, Calendar } from 'lucide-react';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageManager } from '@/lib/storage';
import { UserProfile } from '@/lib/types';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = () => {
      const loadedUsers = storageManager.getAllUsers();
      setUsers(loadedUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      storageManager.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleChatWithUser = (userId: string) => {
    router.push(`/assistant?userId=${userId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NavHeader />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Registered Users</h1>
          <p className="text-slate-400">
            {users.length} user{users.length !== 1 ? 's' : ''} registered in this desk bot prototype
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-400 mb-6">
                No users registered yet. Create the first user profile!
              </p>
              <Button
                onClick={() => router.push('/register')}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Register Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {users.map((user) => (
              <motion.div key={user.id} variants={itemVariants}>
                <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500/50 transition-all h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        {user.nickname && (
                          <CardDescription>
                            Nickname: {user.nickname}
                          </CardDescription>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50">
                          <span className="text-xs font-medium text-cyan-400 capitalize">
                            {user.personality}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Registered{' '}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        <p>Face ID: {user.id.substring(0, 12)}...</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleChatWithUser(user.id)}
                        variant="default"
                        size="sm"
                        className="flex-1 gap-2 bg-cyan-600 hover:bg-cyan-700"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Chat
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>About This Prototype</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-400">
              <p>
                This is a full-stack prototype of a Personalized Desk Bot Assistant. All user data is stored locally in your browser using localStorage.
              </p>
              <p>
                <strong>Privacy:</strong> No data is sent to external servers except for the Gemini API calls needed for assistant responses. User profiles and chat history remain on your device.
              </p>
              <p>
                <strong>Face Recognition:</strong> Uses face-api.js for browser-based face detection. Your face data is never uploaded - only the face descriptor is stored locally.
              </p>
              <p>
                <strong>Future:</strong> This prototype can be extended with vector databases for memory, PostgreSQL for persistence, and IoT integration for real hardware.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
