'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, Clock, FileText, Zap, Activity, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PortalSuccessPage() {
  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/players/bb-logo.png"
                alt="BB"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-gold-500 font-bold tracking-wider text-xs">
                BASKETBALL BIOMECHANICS
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="animate-fade-in flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="animate-fade-in">
          <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-green-500 text-sm font-medium mb-4">
            Evaluation Submitted
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Your Data is In!
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Thank you for completing your BB Shooting Evaluation. Our team will
            analyze your results and build your personalized BB Profile.
          </p>

          {/* Timeline */}
          <div className="bg-bb-card border border-bb-border rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gold-500 mb-4 uppercase tracking-wide">
              What Happens Next
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-white">Analysis Phase</p>
                  <p className="text-sm text-gray-400">
                    Our team reviews your test data and video footage
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-white">3-5 Business Days</p>
                  <p className="text-sm text-gray-400">
                    You&apos;ll receive your complete BB Profile via email
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium text-white">Personalized Protocols</p>
                  <p className="text-sm text-gray-400">
                    Your profile includes specific drills and progressions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Training Now */}
          <div className="bg-gradient-to-b from-gold-500/10 to-transparent border border-gold-500/30 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gold-500 mb-2 uppercase tracking-wide">
              Start Training Now
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              While you wait for your personalized profile, get started with our BB Protocols:
            </p>

            <div className="space-y-3">
              <Link href="/protocols/game-day">
                <Card variant="glass" hover className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Game Day Protocol</p>
                      <p className="text-gray-500 text-xs">15-20 min • Pre-game calibration</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                </Card>
              </Link>

              <Link href="/protocols/practice-day">
                <Card variant="glass" hover className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Practice Day Protocol</p>
                      <p className="text-gray-500 text-xs">25-35 min • Full training session</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                </Card>
              </Link>

              <Link href="/protocols/off-day">
                <Card variant="glass" hover className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Off Day Protocol</p>
                      <p className="text-gray-500 text-xs">10-18 min • Maintain + sharpen</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/protocols">
              <Button>
                View All Protocols
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
