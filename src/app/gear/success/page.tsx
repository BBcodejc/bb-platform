'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Download,
  Video,
  Mail,
  ArrowRight,
  Loader2,
} from 'lucide-react';

function GearSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you'd verify the session and trigger email delivery
    // For now, we'll just show the success state
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Processing your order...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bb-black">
      <div className="max-w-2xl mx-auto px-4 py-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            You&apos;re In. Let&apos;s Calibrate.
          </h1>
          <p className="text-gray-400 text-lg">
            Your BB Strobes order is confirmed. Here&apos;s what happens next.
          </p>
        </div>

        {/* What's Coming */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white mb-6">What You&apos;re Getting</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-bb-card rounded-lg border border-bb-border">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Check Your Email</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Your BB Quickstart PDF and protocol pack are being sent to your email right now.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-bb-card rounded-lg border border-bb-border">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Download Your Protocol Pack</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    3 ready-to-run workouts: Game Day, Practice Day, and Off Day protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-bb-card rounded-lg border border-bb-border">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">&quot;Start Here&quot; Video</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    3-5 minute walkthrough showing you exactly how to run your first session.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hardware Info */}
        <Card className="bg-gold-500/10 border-gold-500/30 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-white mb-2">About Your Strobes</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your Senaptec Strobes will be shipped directly from our partner. You&apos;ll receive tracking information via email within 1-2 business days.
            </p>
            <p className="text-xs text-gray-400">
              Questions about shipping? Reply to your confirmation email or contact bbcodejc@gmail.com
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            While you wait for your gear, consider getting your BB Profile to know exactly which protocols to prioritize.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/start/shooting">
              <Button size="lg" className="group w-full sm:w-auto">
                Get Your BB Profile
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function GearSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    }>
      <GearSuccessContent />
    </Suspense>
  );
}
