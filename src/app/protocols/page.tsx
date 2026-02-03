'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Target,
  Zap,
  Clock,
  Calendar,
  Sun,
  Activity,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

const sessions = [
  {
    id: 'game-day',
    name: 'Game Day / Shootaround',
    duration: '15-20 min',
    icon: <Zap className="w-6 h-6" />,
    description: 'Feel calibrated fast. Make the game feel slower by making warm-up more demanding.',
    color: 'gold',
    href: '/protocols/game-day',
    best: 'Before games, shootarounds, or when you don\'t know what to do',
  },
  {
    id: 'practice-day',
    name: 'Practice Day',
    duration: '25-35 min',
    icon: <Activity className="w-6 h-6" />,
    description: 'Build the system. Expand bandwidth with speed, flight, distance, and miss response.',
    color: 'blue',
    href: '/protocols/practice-day',
    best: 'Full practice sessions when you have time to train',
  },
  {
    id: 'off-day',
    name: 'Off Day',
    duration: '10-18 min',
    icon: <Sun className="w-6 h-6" />,
    description: 'Maintain + sharpen without fatigue. Keep your calibration sharp.',
    color: 'green',
    href: '/protocols/off-day',
    best: 'Recovery days or when you want light maintenance work',
  },
];

const coreRules = [
  {
    rule: 'Back rim is "good information."',
    detail: 'Short misses and side misses are the ones that kill you in games.',
  },
  {
    rule: 'Explore ball flights (flat / normal / high).',
    detail: 'There is no single "perfect arc." Context decides.',
  },
  {
    rule: 'Explore speeds (fast / normal / slow).',
    detail: 'The game doesn\'t give you one tempo.',
  },
  {
    rule: 'Train misses on purpose sometimes.',
    detail: 'Because games give you misses whether you like it or not.',
  },
  {
    rule: 'External focus > internal cues.',
    detail: 'Focus on: target, flight, miss profile, distance control.',
  },
];

const trackingItems = [
  { name: 'Battle Distance', description: 'Where you start deep distance work' },
  { name: 'Back-Rim Ladder Time', description: 'How fast you complete the ladder' },
  { name: 'Ball Flight Control', description: 'Can you hit flat/normal/high on command?' },
  { name: 'Mini Test Out Score', description: '7 or 14 spot test results' },
];

export default function ProtocolsPage() {
  const [showRules, setShowRules] = useState(false);

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Sticky Header with Logo */}
      <header className="sticky top-0 z-50 bg-bb-black/90 backdrop-blur-lg border-b border-bb-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3">
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
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gold-500/20 text-gold-500 text-xs font-medium rounded">
                Internal Use Only
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px] -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-12">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <span className="text-gold-500 font-bold tracking-widest text-sm">
              BB SHOOTING CALIBRATION
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
              BB Protocols
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              3 Sessions + Simple Rules. Designed for in-season players. Works in 15-35 minutes. Minimal thinking. Max transfer.
            </p>
          </div>
        </div>
      </section>

      {/* Core Concept */}
      <section className="py-8 bg-bb-dark border-y border-bb-border">
        <div className="max-w-4xl mx-auto px-4">
          <Card variant="gold" className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">The Whole System in One Idea</h2>
                <p className="text-gray-300 mb-4">
                  <strong className="text-gold-500">Stop chasing &quot;perfect form.&quot;</strong> Calibration = preparing your system for whatever the game throws at you.
                </p>
                <p className="text-gray-400 text-sm">
                  We don&apos;t win by obsessing over body parts. We win by controlling outcomes: back-rim control, ball flight control, deep distance force production, speed under stress, and your response to misses.
                </p>
                <div className="mt-4 p-4 bg-bb-black/50 rounded-lg border border-gold-500/30">
                  <p className="text-white font-medium">
                    Your only job: <span className="text-gold-500">Read the miss → get the ball back to the target.</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">That&apos;s the skill.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Session Selection */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Pick Your Mode Today</h2>
            <p className="text-gray-400">If you don&apos;t know what to do: run Game Day. Always.</p>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <Link key={session.id} href={session.href}>
                <Card
                  variant="glass"
                  hover
                  className="p-6 cursor-pointer border-l-4 border-l-gold-500"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0`}>
                      {session.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">{session.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-500 text-xs font-medium">
                          {session.duration}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{session.description}</p>
                      <p className="text-gray-500 text-xs">
                        <span className="text-gold-500">Best for:</span> {session.best}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The BB Rules */}
      <section className="py-16 bg-bb-dark">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">The BB Rules (Simple)</h2>
              <p className="text-gray-400 text-sm mt-1">The only rules you need</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRules(!showRules)}
            >
              {showRules ? 'Hide' : 'Show All'}
            </Button>
          </div>

          <div className={`space-y-3 ${showRules ? '' : 'max-h-[300px] overflow-hidden relative'}`}>
            {coreRules.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-bb-card rounded-lg border border-bb-border"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-bb-black font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-medium">{item.rule}</p>
                  <p className="text-gray-400 text-sm mt-1">{item.detail}</p>
                </div>
              </div>
            ))}
            {!showRules && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bb-dark to-transparent" />
            )}
          </div>
        </div>
      </section>

      {/* Decision Tree */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">&quot;Where Do I Start?&quot;</h2>
            <p className="text-gray-400">Quick decision tree based on what you&apos;re experiencing</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card variant="glass" className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
                <div>
                  <p className="text-white font-medium">Missing short?</p>
                  <p className="text-gray-400 text-sm mt-1">Run Deep Distance Block A (Practice Day)</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 shrink-0" />
                <div>
                  <p className="text-white font-medium">Left/right spray?</p>
                  <p className="text-gray-400 text-sm mt-1">Run Back-Rim Response Ladder + Flight Spectrum</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 shrink-0" />
                <div>
                  <p className="text-white font-medium">Practice sniper, game miss?</p>
                  <p className="text-gray-400 text-sm mt-1">Run Speed variation + Miss → Fix</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                <div>
                  <p className="text-white font-medium">In a slump?</p>
                  <p className="text-gray-400 text-sm mt-1">Run Game Day protocol for 3 straight days</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Track */}
      <section className="py-16 bg-bb-dark">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">What to Track</h2>
            <p className="text-gray-400">Track only 4 things. That&apos;s enough to see progress without overcomplicating it.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {trackingItems.map((item, index) => (
              <Card key={index} variant="glass" className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/protocols/tracking">
              <Button variant="secondary" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Open Progress Tracker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-t from-gold-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Want It Personalized?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            If you want us to build your exact profile (miss tendencies + deep distance + flight + speed + stress response) and tell you what to run for the next 7 days:
          </p>
          <Link href="/start/shooting">
            <Button size="xl" className="group">
              Book a BB Shooting Evaluation - $250
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            You submit test data + video clips. We return your BB profile, limiting factors, and a 7-day implementation plan.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-bb-border bg-bb-black">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gold-500 font-bold tracking-wider text-sm">
            BASKETBALL BIOMECHANICS
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/gear" className="hover:text-white transition-colors">
              BB Gear
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
