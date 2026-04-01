'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Robot, 
  Camera, 
  Brain, 
  Zap, 
  Shield, 
  ArrowRight,
  Smile,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { NavHeader } from '@/components/nav-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RobotAvatar } from '@/components/robot-avatar';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Camera,
      title: 'Smart Face Recognition',
      description: 'Register and be recognized by your personal desk bot through webcam',
    },
    {
      icon: Brain,
      title: 'AI-Powered Responses',
      description: 'Intelligent answers powered by Google Gemini API',
    },
    {
      icon: Smile,
      title: 'Personalized Interaction',
      description: 'Choose your assistant personality: friendly, formal, energetic, or calm',
    },
    {
      icon: MessageSquare,
      title: 'Natural Conversation',
      description: 'Chat with your desk bot like talking to a helpful colleague',
    },
    {
      icon: Lightbulb,
      title: 'Knowledge Assistant',
      description: 'Get help with questions, ideas, and information',
    },
    {
      icon: Zap,
      title: 'Real-time Interaction',
      description: 'Fast, responsive conversations tailored to your preferences',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NavHeader />

      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Personal
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Desk Bot Assistant
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                An intelligent AI companion that recognizes you, understands your personality, and provides personalized assistance. The future of desk productivity starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/register')}
                size="lg"
                className="gap-2 bg-cyan-600 hover:bg-cyan-700"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => router.push('/recognize')}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                Sign In
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400 pt-4">
              <Shield className="w-4 h-4" />
              <p>Private • Browser-based • No data stored externally</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-slate-800 rounded-3xl p-12 border border-slate-700">
                <RobotAvatar isActive isListening={false} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need for a personalized AI assistant experience
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
                  <CardHeader>
                    <div className="p-2 w-fit rounded-lg bg-cyan-500/10 mb-2">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="max-w-4xl mx-auto px-4 py-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-500/30">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to meet your desk bot?
            </h3>
            <p className="text-slate-300 mb-6">
              Create a profile in seconds and experience personalized AI assistance like never before.
            </p>
            <Button
              onClick={() => router.push('/register')}
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            >
              Start Now <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
          <p>© 2025 Desk Bot Assistant. A prototype for personalized AI companions.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
