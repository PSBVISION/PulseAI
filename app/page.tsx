'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, LogOut } from 'lucide-react';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WebcamCapture } from '@/components/webcam-capture';
import Spinner from '@/components/ui/spinner';
import { faceRecognitionManager } from '@/lib/face-recognition';
import { storageManager } from '@/lib/storage';
import { useSpeechToText } from '@/lib/use-speech-to-text';
import { useTextToSpeech } from '@/lib/use-text-to-speech';
import { UserProfile } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'detect' | 'chat'>('detect');
  const [recognizedUser, setRecognizedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Speech-to-text for questions
  const {
    isListening,
    isSupported: isSpeechSupported,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({ language: 'en-US', continuous: false });

  // Text-to-speech for answers
  const {
    isSupported: isTTSSupported,
    isSpeaking,
    speak,
    stop: stopSpeech,
  } = useTextToSpeech();

  const [chatMessage, setChatMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  // Handle face capture
  const handleFaceCapture = async (canvas: HTMLCanvasElement) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all registered users
      const allUsers = storageManager.getAllUsers();

      if (allUsers.length === 0) {
        setError('No registered users. Please register first.');
        setIsLoading(false);
        return;
      }

      // Extract face descriptor
      const descriptor = await faceRecognitionManager.detectAndExtractDescriptor(canvas);
      if (!descriptor) {
        setError('No face detected. Please position your face clearly.');
        setIsLoading(false);
        return;
      }

      // Recognize user
      const result = await faceRecognitionManager.recognizeUser(canvas, allUsers);

      if (result.recognized && result.user) {
        setRecognizedUser(result.user);
        setStep('chat');
        // Welcome with voice
        const welcomeMsg = `Hello ${result.user.nickname || result.user.name}! I'm your desk bot. Ask me anything!`;
        speak(welcomeMsg);
      } else {
        setError('Face not recognized. Please try again or register first.');
      }
    } catch (err) {
      setError('Face detection failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice question
  useEffect(() => {
    if (transcript && recognizedUser) {
      handleQuestion(transcript);
      resetTranscript();
    }
  }, [transcript, recognizedUser]);

  const handleQuestion = async (question: string) => {
    if (!question.trim() || !recognizedUser) return;

    setChatMessage(question);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          userName: recognizedUser.name,
          userNickname: recognizedUser.nickname,
          personality: recognizedUser.personality,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', res.status, errorText);
        throw new Error(`Failed to get response: ${res.status}`);
      }

      const data = await res.json();
      const answer = data.message || 'Sorry, I could not generate a response.';
      setResponse(answer);

      // Speak the response
      speak(answer, { rate: 0.95 });
    } catch (err) {
      const errorMsg = `Error: ${err instanceof Error ? err.message : 'Something went wrong'}. Check browser console for details.`;
      console.error('Question error:', err);
      setResponse(errorMsg);
      setError(errorMsg);
      speak('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setRecognizedUser(null);
    setStep('detect');
    setChatMessage('');
    setResponse(null);
    stopSpeech();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NavHeader />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {step === 'detect' ? (
          // Face Detection Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800 border-slate-700 text-center">
              <CardContent className="pt-8 pb-6">
                <h1 className="text-3xl font-bold mb-2">Face Detector Bot</h1>
                <p className="text-slate-400 mb-6">
                  Let me recognize your face, then ask me anything!
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="mb-6">
                  <WebcamCapture
                    onCapture={handleFaceCapture}
                    isCapturing={isLoading}
                    showCapture={true}
                  />
                </div>

                <p className="text-slate-500 text-sm">
                  First time? Go to{' '}
                  <Button
                    variant="link"
                    onClick={() => router.push('/register')}
                    className="text-cyan-400 p-0 h-auto"
                  >
                    Register
                  </Button>
                  {' '}to add your face
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Voice Chat Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 pb-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    Hello, {recognizedUser?.nickname || recognizedUser?.name}! 👋
                  </h2>
                  <p className="text-slate-400">Ask me anything using your voice</p>
                </div>

                {/* Response Display */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg"
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">
                        <strong>You:</strong> {chatMessage}
                      </p>
                      <p className="text-slate-200">
                        <strong>🤖 Bot:</strong> {response}
                      </p>
                      {isTTSSupported && isSpeaking && (
                        <p className="text-sm text-blue-400 flex items-center gap-2">
                          <span className="animate-pulse">🔊</span>
                          Speaking...
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Voice Input Controls */}
                <div className="space-y-4">
                  {speechError && (
                    <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
                      ⚠️ {speechError}
                    </div>
                  )}

                  {(isListening || interimTranscript) && (
                    <div className="text-center py-4">
                      <div className="text-sm text-slate-400 mb-2">
                        🎤 Listening...
                      </div>
                      {interimTranscript && (
                        <p className="text-slate-200 italic">"{interimTranscript}"</p>
                      )}
                    </div>
                  )}

                  {isSpeechSupported ? (
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isLoading}
                      size="lg"
                      className={`w-full gap-2 ${
                        isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      {isListening ? 'Stop Listening' : 'Ask a Question'}
                    </Button>
                  ) : (
                    <p className="text-center text-slate-400 text-sm">
                      Speech input not supported in your browser
                    </p>
                  )}

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout & Detect New Face
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
