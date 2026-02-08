'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BBHeaderProps {
  variant?: 'default' | 'admin' | 'minimal';
  showNav?: boolean;
}

export function BBHeader({ variant = 'default', showNav = true }: BBHeaderProps) {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/players/bb-logo.png"
              alt="Basketball Biomechanics"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-gold-500 font-bold tracking-wider text-sm hidden sm:block">
              BASKETBALL BIOMECHANICS
            </span>
          </Link>

          {/* Navigation */}
          {showNav && variant === 'default' && (
            <nav className="flex items-center gap-6">
              <Link
                href="/start-here"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Start Here
              </Link>
              <Link
                href="/gear"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                BB Gear
              </Link>
              <Link
                href="/start/shooting"
                className="text-sm text-gold-500 hover:text-gold-400 transition-colors font-medium"
              >
                Get Evaluated
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export function BBLogo({ size = 40 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/players/bb-logo.png"
        alt="Basketball Biomechanics"
        width={size}
        height={size}
        className="rounded-lg"
      />
      <span className="text-gold-500 font-bold tracking-wider text-sm hidden sm:block">
        BB
      </span>
    </Link>
  );
}
