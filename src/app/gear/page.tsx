'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    description: 'Catch variety → back-rim ladder → 7-spot',
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
    <main className="min-h-screen bg-bb-black">
      {/* Sticky Header with Logo */}
      <header className="sticky top-0 z-50 bg-bb-black/90 backdrop-blur-lg border-b border-bb-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/players/bb-logo.png"
                alt="BB"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-gold-500 font-bold tracking-wider text-xs hidden sm:block">
                BASKETBALL BIOMECHANICS
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/start-here"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Start Here
              </Link>
              <Link href="/start/shooting">
                <Button size="sm" className="text-xs">
                  Get Evaluated
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px] -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <span className="text-gold-500 font-bold tracking-widest text-sm">
              BB GEAR PORTAL
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center max-w-4xl mx-auto leading-tight">
            Stop Guessing.
            <br />
            <span className="text-gradient-gold">Start Calibrating.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 text-center max-w-3xl mx-auto mt-6">
            Get the BB Gear + Protocols that make the rim feel bigger. Strobes + oversized ball + BB methods—the same constraint system we use to create rapid in-season jumps.
          </p>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-16 bg-gradient-to-b from-bb-black to-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image / Visual */}
            <div className="relative">
              <Card variant="glass" className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gold-500/20 via-bb-card to-bb-dark flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <Eye className="w-16 h-16 text-gold-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">BB Visual Stress System</h3>
                    <p className="text-gray-400">Senaptec Strobes + BB Protocols</p>
                  </div>
                </div>
              </Card>

              {/* Disclaimer */}
              <div className="mt-4 p-4 bg-bb-card/50 rounded-lg border border-bb-border">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">
                    BB provides the training protocols and setup guidance. Hardware is fulfilled via our partner Senaptec.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <span className="text-gold-500 font-semibold text-sm tracking-wider">
                  BB STROBES (VISUAL STRESS)
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                  With BB Protocol Pack
                </h2>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8">
                {strobeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <Card variant="glass" className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What You Get</h3>
                  <div className="space-y-3">
                    {bundleIncludes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500">
                          {item.icon}
                        </div>
                        <span className="text-gray-300 text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price & CTA */}
              <Card variant="gold" className="p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-white">$400</span>
                  <span className="text-gray-400">one-time</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Includes Senaptec Strobes + Full BB Protocol Pack
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
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
      <section className="py-16 bg-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              INCLUDED PROTOCOLS
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">
              3 Ready-to-Run Workouts
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stop guessing how to use strobes. These protocols are battle-tested with NBA players and designed for immediate implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {protocols.map((protocol, index) => (
              <Card key={index} variant="glass" className="h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{protocol.name}</h3>
                  <p className="text-gold-500 text-sm mb-3">{protocol.duration}</p>
                  <p className="text-gray-400 text-sm">{protocol.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Strobes Section */}
      <section className="py-16 bg-bb-black">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Visual Stress Training?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">The Problem</h3>
                <p className="text-gray-400 text-sm mb-4">
                  You practice with full vision in controlled environments. Then the game arrives with crowd noise, defenders closing out, and pressure—and your shot breaks down.
                </p>
                <p className="text-gray-400 text-sm">
                  Your nervous system wasn't trained for chaos. It's only calibrated for comfort.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">The BB Solution</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Visual occlusion forces bottom-up, reflexive control. When you remove visual information strategically, your body finds more efficient movement solutions.
                </p>
                <p className="text-gold-500 text-sm font-medium">
                  Result: When you remove the constraint, the game feels slow and the rim looks huge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upsell Section */}
      <section className="py-16 bg-gradient-to-t from-gold-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Want a Complete BB Profile First?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get your exact BB shooting profile before adding gear. The evaluation tells you which constraints to prioritize—so you're not guessing which protocols to run.
          </p>
          <Link href="/start/shooting">
            <Button variant="secondary" size="lg" className="group">
              Get Your BB Profile — $250
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-bb-border bg-bb-black">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gold-500 font-bold tracking-wider text-sm">
              BASKETBALL BIOMECHANICS
            </p>
            <p className="text-gray-500 text-sm mt-1">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/start" className="hover:text-white transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
