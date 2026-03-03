'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye,
  Target,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  FileText,
  Video,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';

const strobeFeatures = [
  'Visual stress forces real calibration (you can\'t fake it)',
  'Shrinks margin for error so normal shots feel effortless',
  'Includes BB Quickstart PDF + 7-14 day protocol delivered instantly',
  'Same constraint system used with NBA players',
];

const bundleIncludes = [
  { icon: <Eye className="w-5 h-5" />, text: 'Senaptec Strobes (ordered through BB link)' },
  { icon: <FileText className="w-5 h-5" />, text: 'BB Quickstart PDF (how to use + settings)' },
  { icon: <Target className="w-5 h-5" />, text: '3 starter workouts: Game Day / Practice Day / Off Day' },
  { icon: <Shield className="w-5 h-5" />, text: 'BB "Do/Don\'t" list (so you don\'t waste them)' },
  { icon: <Video className="w-5 h-5" />, text: '"Start Here" video walkthrough (3-5 min)' },
];

const protocols = [
  {
    name: 'Game Day Protocol',
    duration: '12-18 min',
    description: 'Catch variety \u2192 back-rim ladder \u2192 7-spot',
  },
  {
    name: 'Practice Day Protocol',
    duration: '20-30 min',
    description: 'Deep distance + ball flight + miss-response',
  },
  {
    name: 'Off Day Protocol',
    duration: '10-15 min',
    description: 'Low volume, high quality calibration',
  },
];

export default function GearPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gear/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'strobes_bundle' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-site-gold/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-site-gold/10 rounded-full blur-[120px] -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center text-site-muted hover:text-white mb-8 transition-colors">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <span className="font-barlow font-bold text-site-gold tracking-widest text-sm">
              BB GEAR PORTAL
            </span>
          </div>

          <h1 className="font-barlow text-4xl md:text-6xl font-bold text-center max-w-4xl mx-auto leading-tight">
            Stop Guessing.
            <br />
            <span className="text-site-gold">Start Calibrating.</span>
          </h1>

          <p className="text-lg md:text-xl text-site-muted text-center max-w-3xl mx-auto mt-6">
            Get the BB Gear + Protocols that make the rim feel bigger. Strobes + oversized ball + BB methods&mdash;the same constraint system we use to create rapid in-season jumps.
          </p>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-16 bg-gradient-to-b from-site-primary to-site-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image / Visual */}
            <div className="relative">
              <Card variant="glass" className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-site-gold/20 via-site-card to-site-secondary flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-site-gold/20 flex items-center justify-center">
                      <Eye className="w-16 h-16 text-site-gold" />
                    </div>
                    <h3 className="font-barlow text-2xl font-bold text-white mb-2">BB Visual Stress System</h3>
                    <p className="text-site-muted">Senaptec Strobes + BB Protocols</p>
                  </div>
                </div>
              </Card>

              {/* Disclaimer */}
              <div className="mt-4 p-4 bg-site-card/50 rounded-lg border border-site-border">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-site-muted shrink-0 mt-0.5" />
                  <p className="text-xs text-site-muted">
                    BB provides the training protocols and setup guidance. Hardware is fulfilled via our partner Senaptec.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <span className="font-barlow text-site-gold font-semibold text-sm tracking-wider">
                  BB STROBES (VISUAL STRESS)
                </span>
                <h2 className="font-barlow text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
                  With BB Protocol Pack
                </h2>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8">
                {strobeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-site-gold shrink-0 mt-0.5" />
                    <span className="text-site-muted">{feature}</span>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <Card variant="glass" className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-barlow text-lg font-semibold text-white mb-4">What You Get</h3>
                  <div className="space-y-3">
                    {bundleIncludes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-site-gold/10 flex items-center justify-center text-site-gold">
                          {item.icon}
                        </div>
                        <span className="text-site-muted text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price & CTA */}
              <Card variant="gold" className="p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-barlow text-4xl font-bold text-white">$400</span>
                  <span className="text-site-muted">one-time</span>
                </div>
                <p className="text-sm text-site-muted mb-6">
                  Includes Senaptec Strobes + Full BB Protocol Pack
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-site-danger text-sm">{error}</p>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full group"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Get BB Strobes + Protocol Pack
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Protocols Section */}
      <section className="py-16 bg-site-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-barlow text-site-gold font-semibold text-sm tracking-wider">
              INCLUDED PROTOCOLS
            </span>
            <h2 className="font-barlow text-3xl font-bold mt-2 mb-4 text-white">
              3 Ready-to-Run Workouts
            </h2>
            <p className="text-site-muted max-w-2xl mx-auto">
              Stop guessing how to use strobes. These protocols are battle-tested with NBA players and designed for immediate implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {protocols.map((protocol, index) => (
              <Card key={index} variant="glass" className="h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-site-gold/10 flex items-center justify-center text-site-gold mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-barlow text-lg font-semibold text-white mb-1">{protocol.name}</h3>
                  <p className="text-site-gold text-sm mb-3">{protocol.duration}</p>
                  <p className="text-site-muted text-sm">{protocol.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Strobes Section */}
      <section className="py-16 bg-site-primary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-barlow text-3xl font-bold mb-4 text-white">
              Why Visual Stress Training?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="font-barlow text-lg font-semibold text-white mb-3">The Problem</h3>
                <p className="text-site-muted text-sm mb-4">
                  You practice with full vision in controlled environments. Then the game arrives with crowd noise, defenders closing out, and pressure&mdash;and your shot breaks down.
                </p>
                <p className="text-site-muted text-sm">
                  Your nervous system wasn&apos;t trained for chaos. It&apos;s only calibrated for comfort.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="font-barlow text-lg font-semibold text-white mb-3">The BB Solution</h3>
                <p className="text-site-muted text-sm mb-4">
                  Visual occlusion forces bottom-up, reflexive control. When you remove visual information strategically, your body finds more efficient movement solutions.
                </p>
                <p className="text-site-gold text-sm font-medium">
                  Result: When you remove the constraint, the game feels slow and the rim looks huge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upsell Section */}
      <section className="py-16 bg-gradient-to-t from-site-gold/10 to-site-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-barlow text-2xl md:text-3xl font-bold mb-4 text-white">
            Want a Complete BB Profile First?
          </h2>
          <p className="text-site-muted mb-8 max-w-2xl mx-auto">
            Get your exact BB shooting profile before adding gear. The evaluation tells you which constraints to prioritize&mdash;so you&apos;re not guessing which protocols to run.
          </p>
          <Link href="/start/shooting">
            <Button variant="secondary" size="lg" className="group">
              Get Your BB Profile &mdash; $250
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <BBFooter />
    </main>
  );
}
