'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortalSuccessPage() {
  return (
    <main className="min-h-screen bg-bb-black flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto px-4 text-center">
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
