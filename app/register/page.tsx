'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WebcamCapture } from '@/components/webcam-capture';
import Spinner from '@/components/ui/spinner';
import { faceRecognitionManager } from '@/lib/face-recognition';
import { storageManager } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { UserProfile, PersonalityType } from '@/lib/types';
import { CheckCircle, AlertCircle } from 'lucide-react';

type RegistrationStep = 'profile' | 'webcam' | 'confirmation';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>('profile');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [personality, setPersonality] = useState<PersonalityType>('friendly');
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null);
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const personalityOptions: { value: PersonalityType; label: string; description: string }[] = [
    { value: 'friendly', label: '😊 Friendly', description: 'Warm and casual conversations' },
    { value: 'formal', label: '🎩 Formal', description: 'Professional and structured' },
    { value: 'energetic', label: '⚡ Energetic', description: 'Lively and enthusiastic' },
    { value: 'calm', label: '🧘 Calm', description: 'Soft and peaceful responses' },
  ];

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setError(null);
    // Initialize face recognition models
    setIsLoading(true);
    try {
      await faceRecognitionManager.loadModels();
      setStep('webcam');
    } catch (err) {
      setError('Failed to load face recognition. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceCapture = async (canvas: HTMLCanvasElement) => {
    setIsCapturing(true);
    setError(null);

    try {
      const descriptor = await faceRecognitionManager.detectAndExtractDescriptor(
        canvas
      );

      if (!descriptor) {
        setError(
          'No face detected. Please position your face clearly in the camera and try again.'
        );
        setIsCapturing(false);
        return;
      }

      setFaceDescriptor(descriptor);
      setStep('confirmation');
    } catch (err) {
      setError('Failed to process face. Please try again.');
      console.error('Face capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirmRegister = async () => {
    if (!faceDescriptor || !name.trim()) {
      setError('Missing profile or face data');
      return;
    }

    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: generateId(),
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        personality,
        faceDescriptor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      storageManager.saveUser(newUser);
      setRegisteredUser(newUser);

      // Redirect to assistant after 2 seconds
      setTimeout(() => {
        router.push(`/assistant?userId=${newUser.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
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
              <CardTitle className="text-3xl">Create Your Profile</CardTitle>
              <CardDescription>
                Register as a new user and teach your desk bot to recognize you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step Indicators */}
                <div className="flex gap-4 mb-8">
                  {(['profile', 'webcam', 'confirmation'] as const).map((s, idx) => (
                    <div
                      key={s}
                      className={`flex items-center gap-2 text-sm ${
                        step === s
                          ? 'text-cyan-400'
                          : step === 'confirmation' || 
                            (s === 'webcam' && step !== 'profile') ||
                            (s === 'confirmation' && step === 'confirmation')
                          ? 'text-blue-400'
                          : 'text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          step === s
                            ? 'bg-cyan-500'
                            : step === 'confirmation' ||
                              (s === 'webcam' && step !== 'profile')
                            ? 'bg-blue-500'
                            : 'bg-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="capitalize hidden sm:inline">{s}</span>
                    </div>
                  ))}
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="flex gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Step: Profile */}
                {step === 'profile' && (
                  <motion.form
                    onSubmit={handleProfileSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nickname">
                        Nickname (optional)
                      </Label>
                      <Input
                        id="nickname"
                        placeholder="Johnny, JD, etc."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="bg-slate-700 border-slate-600"
                      />
                      <p className="text-xs text-slate-400">
                        Your desk bot will use this to personalize greetings
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Assistant Personality *</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {personalityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setPersonality(option.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              personality === option.value
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                            }`}
                          >
                            <div className="font-medium text-sm">
                              {option.label}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Spinner size="sm" />
                          Loading...
                        </span>
                      ) : (
                        'Next: Face Recognition'
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* Step: Webcam */}
                {step === 'webcam' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="font-semibold mb-2">
                        Capture Your Face
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Position your face clearly in the camera and click "Capture Face" when ready.
                      </p>
                    </div>

                    <WebcamCapture
                      onCapture={handleFaceCapture}
                      isCapturing={isCapturing}
                      showCapture={true}
                    />

                    <Button
                      variant="outline"
                      onClick={() => setStep('profile')}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </motion.div>
                )}

                {/* Step: Confirmation */}
                {step === 'confirmation' && registeredUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-green-500/10">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Welcome, {registeredUser.name}!
                      </h3>
                      <p className="text-slate-400">
                        Your profile has been registered successfully. Your desk bot is ready to assist!
                      </p>
                    </div>

                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="pt-6">
                        <div className="space-y-3 text-left">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Name:</span>
                            <span className="font-medium">
                              {registeredUser.name}
                            </span>
                          </div>
                          {registeredUser.nickname && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">
                                Nickname:
                              </span>
                              <span className="font-medium">
                                {registeredUser.nickname}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              Personality:
                            </span>
                            <span className="font-medium capitalize">
                              {registeredUser.personality}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {isLoading && (
                      <div className="flex items-center justify-center gap-2 text-cyan-400">
                        <Spinner size="sm" />
                        Redirecting to chat...
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
