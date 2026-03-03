'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Week0SuccessPage() {
  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/players/bb-logo.png"
                alt="BB"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </Link>
            <span className="text-gold-500 font-bold tracking-wider text-xs">
              BB WEEK 0 COMPLETE
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Week 0 Assessment Complete
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Your data is submitted. Coach Jake and the BB team will review your assessment
            and build your personalized program.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-bb-card border border-bb-border rounded-xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">What Happens Next</h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                <span className="text-gold-500 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Assessment Review</p>
                <p className="text-xs text-gray-400">We analyze your shooting data, movement patterns, vertical, and game film.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                <span className="text-gold-500 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Your BB Profile</p>
                <p className="text-xs text-gray-400">You&apos;ll receive your BB Level, miss profile, limiting factors, and priority protocols.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                <span className="text-gold-500 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Week 1 Programming</p>
                <p className="text-xs text-gray-400">Your personalized daily programming starts — shooting calibration, movement work, live play, and strength.</p>
              </div>
            </div>
          </div>
        </div>

        {/* While You Wait */}
        <div className="bg-bb-card border border-gold-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gold-500 mb-3">While You Wait</h2>
          <p className="text-sm text-gray-400 mb-4">
            Explore the BB Concepts Library to start learning the language and principles
            that will be part of your programming.
          </p>
          <Link href="/library">
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" />
              Browse the Library
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gold-500 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
