'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/lib/middleware/auth';

interface EliteLayoutProps {
  children: ReactNode;
  user?: AuthUser | null;
  isEditing?: boolean;
  onLogout?: () => void;
}

export function EliteLayout({ children, user, isEditing, onLogout }: EliteLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Elite Admin Bar - Only visible when authenticated */}
      {user && (
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D] border-b border-gold-500/20">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gold-500" />
              <span className="text-gold-500 text-sm font-medium tracking-wide uppercase">
                Elite Profile • {isEditing ? 'Edit Mode' : 'View Mode'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                {user.name || user.email}
              </span>
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
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Elite Footer */}
      <footer className="border-t border-[#1A1A1A] py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/players/bb-logo.png"
              alt="BB"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-gray-500 text-sm">Basketball Biomechanics</span>
          </div>
          <span className="text-gray-600 text-xs">Elite Player System</span>
        </div>
      </footer>
    </div>
  );
}
