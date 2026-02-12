'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DynamicPlayerProfile } from '@/types/dynamic-profile';

interface PlayerDashboardLayoutProps {
  children: ReactNode;
  player?: DynamicPlayerProfile | null;
  onSettings?: () => void;
  onLogout?: () => void;
}

export function PlayerDashboardLayout({
  children,
  player,
  onSettings,
  onLogout,
}: PlayerDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/players/bb-logo.png"
                alt="BB"
                width={36}
                height={36}
                className="rounded-lg"
              />
              {player ? (
                <div>
                  <h1 className="text-white font-semibold">
                    {player.firstName} {player.lastName}
                  </h1>
                  <p className="text-gray-500 text-xs">
                    {player.adherenceStreak} day streak
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-white font-semibold">BB Player</h1>
                  <p className="text-gray-500 text-xs">Training Dashboard</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              {onLogout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom Navigation (Mobile-friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#1A1A1A] md:hidden">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-gold-500">
            <User className="w-5 h-5" />
            <span className="text-[10px]">Today</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px]">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px]">Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </nav>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block border-t border-[#1A1A1A] py-6 mt-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-xs">
            Basketball Biomechanics • Player Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
