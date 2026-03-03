'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BBHeaderProps {
  variant?: 'default' | 'admin' | 'minimal';
  showNav?: boolean;
  transparent?: boolean;
}

export function BBHeader({ variant = 'default', showNav = true, transparent = true }: BBHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const headerBg = transparent && !scrolled
    ? 'bg-transparent'
    : 'bg-site-primary/90 backdrop-blur-lg border-b border-site-border/50';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/players/bb-logo.png"
                alt="Basketball Biomechanics"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-white font-bold tracking-[0.15em] text-xs sm:text-sm hidden sm:block">
                BASKETBALL BIOMECHANICS
              </span>
            </Link>

            {/* Desktop Navigation */}
            {showNav && variant === 'default' && (
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/masterclass"
                  className="text-sm text-site-muted hover:text-white transition-colors"
                >
                  Masterclass
                </Link>
                <Link
                  href="/gear"
                  className="text-sm text-site-muted hover:text-white transition-colors"
                >
                  BB Gear
                </Link>
                <Link
                  href="/player-info"
                  className="text-sm font-semibold bg-site-gold hover:bg-site-gold-hover text-site-primary px-5 py-2 rounded-md transition-colors"
                >
                  Get Evaluated
                </Link>
              </nav>
            )}

            {/* Mobile Hamburger */}
            {showNav && variant === 'default' && (
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-white p-2"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-72 bg-site-primary border-l border-site-border shadow-2xl animate-slide-in-right">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-site-muted hover:text-white p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Links */}
            <nav className="flex flex-col px-6 gap-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-white font-medium py-3 border-b border-site-border/50"
              >
                Home
              </Link>
              <Link
                href="/masterclass"
                onClick={() => setMobileOpen(false)}
                className="text-site-muted hover:text-white py-3 border-b border-site-border/50 transition-colors"
              >
                Masterclass
              </Link>
              <Link
                href="/gear"
                onClick={() => setMobileOpen(false)}
                className="text-site-muted hover:text-white py-3 border-b border-site-border/50 transition-colors"
              >
                BB Gear
              </Link>
              <Link
                href="/inquiry"
                onClick={() => setMobileOpen(false)}
                className="text-site-muted hover:text-white py-3 border-b border-site-border/50 transition-colors"
              >
                Coaches / Orgs
              </Link>
              <div className="pt-4">
                <Link
                  href="/player-info"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center font-semibold bg-site-gold hover:bg-site-gold-hover text-site-primary px-5 py-3 rounded-md transition-colors"
                >
                  Get Evaluated
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
      `}</style>
    </>
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
      <span className="text-white font-bold tracking-[0.15em] text-sm hidden sm:block">
        BB
      </span>
    </Link>
  );
}
