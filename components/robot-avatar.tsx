'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface RobotAvatarProps {
  isActive?: boolean;
  isListening?: boolean;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  isActive = true,
  isListening = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          scale: isActive ? [1, 1.05, 1] : 0.95,
          opacity: isActive ? 1 : 0.7,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {/* Head */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-3xl shadow-lg shadow-cyan-500/50" />

        {/* Left Eye */}
        <motion.div
          className="absolute top-5 left-4 w-4 h-4 bg-black rounded-full flex items-center justify-center"
          animate={{
            scale: isListening ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isListening ? Infinity : 0,
            repeatType: 'loop',
          }}
        >
          <div className="w-2 h-2 bg-cyan-300 rounded-full" />
        </motion.div>

        {/* Right Eye */}
        <motion.div
          className="absolute top-5 right-4 w-4 h-4 bg-black rounded-full flex items-center justify-center"
          animate={{
            scale: isListening ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isListening ? Infinity : 0,
            repeatType: 'loop',
          }}
        >
          <div className="w-2 h-2 bg-cyan-300 rounded-full" />
        </motion.div>

        {/* Mouth */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-1 bg-slate-900 rounded-full"
          animate={{
            scaleX: isListening ? [1, 1.3, 1] : 1,
            scaleY: isListening ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: 0.6,
            repeat: isListening ? Infinity : 0,
            repeatType: 'loop',
          }}
        />
      </motion.div>

      {/* Status */}
      <div className="text-center">
        <p className="text-sm font-medium text-cyan-400">
          {isActive ? 'Online' : 'Offline'}
        </p>
        {isListening && (
          <motion.div
            className="flex items-center gap-1 justify-center mt-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-cyan-300">Listening</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
