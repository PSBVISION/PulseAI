'use client';

import React from 'react';
import { formatTime } from '@/lib/utils';
import clsx from 'clsx';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp = new Date(),
}) => {
  const isUser = role === 'user';

  return (
    <div
      className={clsx('flex gap-3 animate-in fade-in slide-in-from-bottom-2', {
        'justify-end': isUser,
      })}
    >
      <div
        className={clsx(
          'max-w-xs lg:max-w-md px-4 py-2 rounded-lg rounded-b-none whitespace-pre-wrap text-sm',
          {
            'bg-cyan-600 text-white rounded-tl-none': isUser,
            'bg-slate-700 text-slate-100 rounded-tr-none': !isUser,
          }
        )}
      >
        {content}
      </div>
      <span className="text-xs text-slate-400 flex items-end pb-1">
        {formatTime(timestamp)}
      </span>
    </div>
  );
};
