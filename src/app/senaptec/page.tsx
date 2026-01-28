'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye,
  Brain,
  Zap,
  Target,
  ArrowRight,
  Play,
  CheckCircle2,
  ChevronDown,
  Clock,
  Shield,
} from 'lucide-react';

const protocolLevels = [
  {
    level: 1,
    title: 'Foundational Strobe Drills',
    subtitle: 'No Defense',
    description:
      'Build comfort with visual disruption through controlled ball handling and form shooting.',
    drills: [
      {
        name: 'Ball Handling Block',
        duration: '5-7 min',
        focus:
          'Stationary dribbles, eyes forward. Mix heights: low, mid, high. Stay relaxed when vision cuts out.',
      },
      {
        name: 'Form Shooting Block',
        duration: '5-7 min',
        focus:
          'Close range shots, 2-3 spots. Track ball flight to back rim. Feel over sight.',
      },
    ],
  },
  {
    level: 2,
    title: 'Shooting Under Visual Stress',
    subtitle: 'Game Spots',
    description:
      'Apply strobe training to real shooting situations from your actual game positions.',
    drills: [
      {
        name: '3PT "See Less, Trust More"',
        duration: '10 min',
        focus:
          '5 spots around the arc, 3-5 shots per spot. See the rim early, then trust your motor plan.',
      },
      {
        name: 'Finger Flash Progression',
        duration: 'Optional',
        focus:
          'Add a passer holding fingers up as the ball leaves your hand. Decision layer.',
      },
    ],
  },
  {
    level: 3,
    title: 'Live Decision Layer',
    subtitle: 'Advanced',
    description:
      'Full game application with live defense and real-time decisions under incomplete vision.',
    drills: [
      {
        name: '1-on-1 with Strobes',
        duration: 'Variable',
        focus:
          '2-3 dribbles max. Must shoot or pass on a call. Clean decisions with incomplete vision.',
      },
      {
        name: 'Guided Defense Reads',
        duration: 'Variable',
        focus:
          'Defense gives different looks. React to what you see in the flash windows.',
      },
    ],
  },
];

const benefits = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'See Less, Process More',
    description:
      'Strobes limit visual information, forcing your brain to make faster decisions with less data—exactly like real games.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Nervous System Adaptation',
    description:
      'Train in visual chaos so game situations feel slower. Your system adapts to handle more stress with less panic.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Ball-Flight Calibration',
    description:
      'Learn to track the ball and rim in flash windows, building deep motor patterns that transfer to competition.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Reflexive Execution',
    description:
      'Move from conscious to subconscious control. When vision is impaired, your body learns to trust itself.',
  },
];

const stats = [
  { value: '2-3x', label: 'per week is optimal' },
  { value: '15-20', label: 'minutes per session' },
  { value: '3', label: 'progressive levels' },
];

export default function SenaptecPage() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Hero Section - Cinematic */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gold-500/10 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] translate-y-1/2" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201, 169, 97, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201, 169, 97, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto">
            {/* Partnership badge */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
              <div className="flex items-center gap-3 bg-bb-card/80 backdrop-blur-sm border border-gold-500/30 rounded-full px-6 py-3">
                <span className="text-gold-500 font-bold tracking-widest text-sm">
                  BASKETBALL BIOMECHANICS
                </span>
                <span className="text-gold-500/50">×</span>
                <span className="text-white font-semibold tracking-wide text-sm">
                  SENAPTEC
                </span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center leading-[0.9] tracking-tight animate-slide-up">
              <span className="text-white">Train the</span>
              <br />
              <span className="text-gradient-gold">Visual System</span>
              <br />
              <span className="text-white">Behind Your Game</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 text-center max-w-3xl mx-auto mt-8 leading-relaxed animate-fade-in">
              Most players train their handle and jumper.{' '}
              <span className="text-white">Almost nobody trains their eyes.</span>
              <br className="hidden md:block" />
              Senaptec Strobes + BB Protocol = calm under chaos.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-in">
              <a
                href="https://senaptec.com/products/senaptec-strobe?ref=bb-biomechanics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xl" className="group min-w-[280px]">
                  Get Strobes + BB Protocol
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => setIsVideoPlaying(true)}
                className="min-w-[280px]"
              >
                <Play className="mr-2 w-5 h-5" />
                See Strobes in Action
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-col items-center animate-fade-in">
              <p className="text-gray-500 text-sm mb-4 tracking-wide">
                USED BY BB CLIENTS FROM YOUTH TO NBA
              </p>
              <div className="flex items-center gap-8 text-gray-400">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">Visual Stress</p>
                  <p className="text-xs text-gray-500">Training Tool</p>
                </div>
                <div className="w-px h-8 bg-bb-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">BB Protocol</p>
                  <p className="text-xs text-gray-500">Included Free</p>
                </div>
                <div className="w-px h-8 bg-bb-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">Game Transfer</p>
                  <p className="text-xs text-gray-500">Not Just Practice</p>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-gold-500/50" />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem / Solution Section */}
      <section className="py-24 bg-gradient-to-b from-bb-black to-bb-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Problem */}
              <div className="animate-fade-in">
                <span className="text-red-500 font-semibold text-sm tracking-wider">
                  THE REALITY
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  In Real Games, You&apos;re Not in an Empty Gym
                </h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  You&apos;ve got defenders closing out. Help rotations. Bodies flying
                  everywhere. Crowd noise. Your nervous system{' '}
                  <span className="text-white">knows the difference</span> between
                  practice and pressure.
                </p>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  That&apos;s why players shoot 45% in practice and 32% in games. The
                  environment changed. The{' '}
                  <span className="text-white">visual chaos</span> is real.
                </p>
                <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-gray-300">
                    <span className="text-red-400 font-semibold">The Gap:</span>{' '}
                    Traditional training doesn&apos;t prepare your visual system for
                    game-speed chaos. You&apos;re building skills that don&apos;t transfer.
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="animate-fade-in">
                <span className="text-gold-500 font-semibold text-sm tracking-wider">
                  THE BB SOLUTION
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Senaptec Strobes + BB Protocol
                </h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  Strobes flash on and off, limiting your visual information. Your brain
                  is <span className="text-white">forced to process faster</span> with
                  less data—exactly like game conditions.
                </p>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  When you train in visual chaos,{' '}
                  <span className="text-white">real games feel slower</span>. The rim
                  looks bigger. Time expands. Your nervous system has already adapted to
                  worse.
                </p>
                <div className="p-5 bg-gold-500/10 border border-gold-500/30 rounded-xl">
                  <p className="text-gray-300">
                    <span className="text-gold-500 font-semibold">The Result:</span>{' '}
                    Skills that show up when it matters. Practice performance that
                    transfers to games.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Visual Stress Works */}
      <section className="py-24 bg-bb-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <span className="text-gold-500 font-semibold text-sm tracking-wider">
                THE SCIENCE
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
                Why Visual Stress Training Works
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                This isn&apos;t a gimmick. It&apos;s how your nervous system learns to
                perform under pressure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="animate-fade-in">
                  <Card variant="glass" hover className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-400 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BB Strobe Protocol */}
      <section className="py-24 bg-gradient-to-b from-bb-dark to-bb-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Included Free with BB Link Purchase
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-white">The BB × Senaptec</span>
                <br />
                <span className="text-gradient-gold">Strobe Protocol</span>
              </h2>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Not just cool glasses—a complete 3-level system for training your visual
                system specifically for basketball.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-bb-card rounded-xl border border-bb-border">
                  <p className="text-3xl md:text-4xl font-bold text-gold-500 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Protocol Levels */}
            <div className="space-y-4">
              {protocolLevels.map((level) => (
                <div
                  key={level.level}
                  className="bg-bb-card border border-bb-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-gold-500/30"
                >
                  <button
                    onClick={() =>
                      setActiveLevel(activeLevel === level.level ? null : level.level)
                    }
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-bb-black font-bold text-2xl shadow-lg shadow-gold-500/20">
                        {level.level}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          {level.title}
                        </h3>
                        <p className="text-gold-500 font-medium">{level.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                        activeLevel === level.level ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeLevel === level.level && (
                    <div className="px-6 md:px-8 pb-8 animate-fade-in">
                      <div className="border-t border-bb-border pt-6">
                        <p className="text-gray-400 mb-6 text-lg">{level.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          {level.drills.map((drill, idx) => (
                            <div
                              key={idx}
                              className="bg-bb-dark rounded-xl p-5 border border-bb-border"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-white text-lg">
                                  {drill.name}
                                </h4>
                                <span className="text-xs text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {drill.duration}
                                </span>
                              </div>
                              <p className="text-gray-400">{drill.focus}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key reminder */}
            <div className="mt-8 p-6 bg-bb-card border border-gold-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">
                    Remember: Strobes Are a Stress Tool
                  </h4>
                  <p className="text-gray-400">
                    2-3x per week is optimal. Start with Level 1 + 2, add Level 3 later.
                    This isn&apos;t something you wear all day—it&apos;s targeted visual
                    stress training that makes real games feel easier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-bb-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-2xl md:text-4xl font-medium text-white italic leading-relaxed animate-fade-in">
              &quot;If you only train in perfect conditions, you&apos;ll only perform in
              perfect conditions. Games are never perfect.&quot;
            </blockquote>
            <p className="text-gold-500 mt-6 font-semibold text-lg">
              — Basketball Biomechanics
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-t from-gold-500/10 to-bb-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gold-500/5" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/10 rounded-full blur-[120px]" />

        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <span className="text-gold-500 font-semibold text-sm tracking-wider">
                START TRAINING YOUR VISUAL SYSTEM
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
                Get Senaptec Strobes
                <br />
                <span className="text-gradient-gold">+ The BB Protocol</span>
              </h2>

              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Every purchase through BB includes our exclusive Strobe Protocol—the same
                visual stress training system we use with NBA clients.
              </p>

              <a
                href="https://senaptec.com/products/senaptec-strobe?ref=bb-biomechanics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xl" className="group min-w-[320px]">
                  Shop Senaptec Strobes
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  BB Strobe Protocol Included
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  3-Level Training System
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  Exclusive BB Partnership
                </span>
              </div>

              <div className="mt-12 pt-8 border-t border-bb-border">
                <p className="text-gray-500">
                  Want the full BB movement + shooting system?{' '}
                  <Link
                    href="/intake"
                    className="text-gold-500 hover:text-gold-400 font-medium underline underline-offset-4"
                  >
                    Get Your BB Profile →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-bb-border bg-bb-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-gold-500 font-bold tracking-widest text-sm">
                BASKETBALL BIOMECHANICS
              </span>
              <span className="text-gold-500/30">×</span>
              <span className="text-white font-semibold text-sm">SENAPTEC</span>
            </div>

            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Basketball Biomechanics. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="https://twitter.com/BBiomechanics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gold-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/BBiomechanics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gold-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal (placeholder) */}
      {isVideoPlaying && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="relative max-w-4xl w-full aspect-video bg-bb-card rounded-2xl border border-bb-border flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <p className="text-gray-400">Video placeholder</p>
              <p className="text-sm text-gray-500 mt-2">Click anywhere to close</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
