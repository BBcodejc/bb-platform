'use client';

import Link from 'next/link';
import { Target, Zap, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';

const PATH_OPTIONS = [
  {
    id: 'shooting',
    icon: Target,
    title: 'Fix My Shooting',
    subtitle: 'BB Shooting Evaluation — $250',
    description:
      'I mainly want to calibrate my shot. Get your personalized shooting profile with test protocols and a custom roadmap.',
    badge: 'POPULAR',
    href: '/start/shooting',
    highlight: true,
  },
  {
    id: 'full-assessment',
    icon: Zap,
    title: 'Transform My Entire Game',
    subtitle: 'BB Full Assessment — Application',
    description:
      'I want help with shooting, movement, and deception. Apply for the 3-month BB Mentorship covering every dimension of your game.',
    badge: null,
    href: '/start/full-assessment',
    highlight: false,
  },
  {
    id: 'coach',
    icon: GraduationCap,
    title: 'Coach / Trainer',
    subtitle: 'BB Certification — Application',
    description:
      'I want to learn the BB lens and get certified to use it with my players.',
    badge: null,
    href: '/start/coach',
    highlight: false,
  },
  {
    id: 'organization',
    icon: Users,
    title: 'Team / Organization',
    subtitle: 'Program Integration — Inquiry',
    description:
      "I'm inquiring for a program, academy, or team that wants BB installed system-wide.",
    badge: null,
    href: '/start/organization',
    highlight: false,
  },
];

export default function StartPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent={false} />

      <div className="pt-24 pb-20 px-4">
        {/* Hero */}
        <div
          ref={heroRef}
          className={`max-w-2xl mx-auto text-center mb-14 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-3xl md:text-5xl font-barlow font-extrabold text-white mb-4">
            What Best Describes You?
          </h1>
          <p className="text-site-muted text-lg">
            Choose your path to get started with Basketball Biomechanics.
          </p>
        </div>

        {/* Options */}
        <div className="max-w-2xl mx-auto space-y-4">
          {PATH_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.id} href={option.href}>
                <div
                  className={`group relative border rounded-xl p-5 sm:p-6 transition-all duration-300 cursor-pointer hover:border-site-gold/40 ${
                    option.highlight
                      ? 'border-site-gold/30 bg-gradient-to-r from-site-gold/10 via-site-gold/5 to-transparent'
                      : 'border-site-border bg-site-card hover:bg-site-card-hover'
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        option.highlight
                          ? 'bg-site-gold text-site-primary'
                          : 'bg-site-secondary text-site-gold'
                      }`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">
                          {option.title}
                        </h3>
                        {option.badge && (
                          <span className="px-2 py-0.5 bg-site-gold text-site-primary text-[10px] font-bold uppercase tracking-wider rounded">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-site-gold mb-1.5 font-medium">
                        {option.subtitle}
                      </p>
                      <p className="text-sm text-site-muted leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 pt-1">
                      <ArrowRight className="w-5 h-5 text-site-dim group-hover:text-site-gold transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help text */}
        <div className="max-w-2xl mx-auto mt-10 text-center">
          <p className="text-sm text-site-dim">
            Not sure which is right for you?{' '}
            <Link
              href="/start/shooting"
              className="text-site-gold hover:text-site-gold-hover transition-colors"
            >
              Start with the Shooting Evaluation
            </Link>{' '}
            — you can always upgrade later.
          </p>
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
