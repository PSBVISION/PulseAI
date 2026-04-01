'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Home, Users, MessageCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavHeaderProps {
  showUserProfile?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  showUserProfile = false,
  userName,
  onLogout,
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Bot className="w-6 h-6 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Desk Bot
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant={isActive('/register') ? 'default' : 'ghost'}
              size="sm"
            >
              Register
            </Button>
          </Link>
          <Link href="/recognize">
            <Button
              variant={isActive('/recognize') ? 'default' : 'ghost'}
              size="sm"
            >
              Login
            </Button>
          </Link>
          <Link href="/users">
            <Button
              variant={isActive('/users') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Users
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {showUserProfile && userName && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Welcome back</p>
                <p className="text-xs text-cyan-400">{userName}</p>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
