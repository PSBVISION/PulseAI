'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WebcamCapture } from '@/components/webcam-capture';
import Spinner from '@/components/ui/spinner';
import { faceRecognitionManager } from '@/lib/face-recognition';
import { storageManager } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

type RecognitionStep = 'select' | 'recognizing' | 'result';

export default function RecognizePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<RecognitionStep>('select');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    const loadedUsers = storageManager.getAllUsers();
    setUsers(loadedUsers);
    if (loadedUsers.length === 0) {
      setError('No registered users found. Please register first.');
    }
  }, []);

  const handleStartRecognition = async () => {
    if (users.length === 0) {
      setError('No registered users found. Please register first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await faceRecognitionManager.loadModels();
      setStep('recognizing');
      setIsRecognizing(false);
    } catch (err) {
      setError('Failed to load face recognition. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceCapture = async (canvas: HTMLCanvasElement) => {
    setIsRecognizing(true);
    setError(null);

    try {
      const result = await faceRecognitionManager.recognizeUser(
        canvas,
        users
      );

      if (result.recognized && result.user) {
        setRecognizedUser(result.user);
        setConfidence(result.confidence || 0);
        setStep('result');
      } else {
        setError('Face not recognized. Please register first or try again.');
        setStep('recognizing');
      }
    } catch (err) {
      setError('Failed to process face. Please try again.');
      console.error('Face recognition error:', err);
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleProceedToChat = () => {
    if (recognizedUser) {
      router.push(`/assistant?userId=${recognizedUser.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NavHeader />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-3xl">Face Login</CardTitle>
              <CardDescription>
                Let your desk bot recognize you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="flex gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 text-sm font-medium mb-1">
                        {error}
                      </p>
                      {error.includes('not recognized') && (
                        <p className="text-xs text-red-400">
                          <a href="/register" className="underline hover:text-red-300">
                            Register as a new user
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step: Select */}
                <AnimatePresence>
                  {step === 'select' && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 flex gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-300 text-sm font-medium">
                            {users.length} user{users.length !== 1 ? 's' : ''} registered
                          </p>
                          <p className="text-xs text-blue-400 mt-1">
                            Position your face in good lighting and we'll recognize you
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleStartRecognition}
                        disabled={isLoading || users.length === 0}
                        size="lg"
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <Spinner size="sm" />
                            Loading...
                          </span>
                        ) : (
                          'Start Face Recognition'
                        )}
                      </Button>

                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-sm text-slate-400 mb-4">
                          Don't have an account?
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => router.push('/register')}
                          className="w-full"
                        >
                          Register Now
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step: Recognizing */}
                <AnimatePresence>
                  {step === 'recognizing' && (
                    <motion.div
                      key="recognizing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <WebcamCapture
                        onCapture={handleFaceCapture}
                        isCapturing={isRecognizing}
                        showCapture={true}
                      />

                      <Button
                        variant="outline"
                        onClick={() => {
                          setStep('select');
                          setError(null);
                        }}
                        disabled={isRecognizing}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step: Result */}
                <AnimatePresence>
                  {step === 'result' && recognizedUser && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 text-center"
                    >
                      <div className="flex justify-center">
                        <motion.div
                          className="p-4 rounded-full bg-green-500/10"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.6 }}
                        >
                          <CheckCircle className="w-12 h-12 text-green-400" />
                        </motion.div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          Welcome back, {recognizedUser.nickname || recognizedUser.name}!
                        </h3>
                        <p className="text-slate-400">
                          Your desk bot recognized you with{' '}
                          <span className="text-cyan-400 font-semibold">
                            {(confidence * 100).toFixed(0)}%
                          </span>{' '}
                          confidence.
                        </p>
                      </div>

                      <Card className="bg-slate-700/50 border-slate-600">
                        <CardContent className="pt-6">
                          <div className="space-y-2 text-left">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Name:</span>
                              <span className="font-medium">
                                {recognizedUser.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">
                                Personality:
                              </span>
                              <span className="font-medium capitalize">
                                {recognizedUser.personality}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm text-slate-400 mb-1">
                                Recognition Confidence
                              </div>
                              <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-cyan-500"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${confidence * 100}%`,
                                  }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Button
                        onClick={handleProceedToChat}
                        size="lg"
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                      >
                        Chat with Your Desk Bot
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setStep('select');
                          setRecognizedUser(null);
                          setError(null);
                        }}
                        className="w-full"
                      >
                        Try Different User
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
