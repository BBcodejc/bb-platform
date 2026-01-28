'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Mail, ClipboardList, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [prospectId, setProspectId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setProspectId('temp-id');
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Confirming your payment...</p>
        </div>
      </main>
    );
  }

  const nextSteps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Check Your Email',
      description: 'We sent detailed test instructions to your inbox',
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'Complete the Tests',
      description: '14-Spot, Deep Distance, and Back-Rim protocols',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Upload Your Videos',
      description: 'At least 3 makes and 3 misses from game footage',
    },
  ];

  return (
    <main className="min-h-screen bg-bb-black">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success animation */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Confirmation message */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Payment Confirmed!
          </h1>
          <p className="text-gray-400 text-lg">
            Your BB Shooting Evaluation has been activated. Let&apos;s get
            started on finding your profile.
          </p>
        </div>

        {/* Next steps */}
        <div className="space-y-4 mb-12 animate-fade-in">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Your Next Steps
          </h2>
          {nextSteps.map((step, index) => (
            <Card key={step.title} variant="glass">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                  <div className="text-gold-500">{step.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 animate-fade-in">
          {prospectId && (
            <Link href={`/portal/${prospectId}`}>
              <Button size="lg" className="group">
                Go to Test Portal
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
          <p className="text-sm text-gray-500">
            Can&apos;t find the email? Check your spam folder or contact support.
          </p>
        </div>

        {/* Helpful info card */}
        <div className="mt-12 animate-fade-in">
          <Card variant="gold">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-2">
                What Happens Next?
              </h3>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>Complete the test protocols at your own pace</li>
                <li>Upload your game footage (makes and misses)</li>
                <li>Submit everything through the test portal</li>
                <li>We&apos;ll review and build your BB Profile within 3-5 days</li>
                <li>Receive your personalized profile with recommendations</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <main className="min-h-screen bg-bb-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
