'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useScrollReveal, useCounter } from '@/lib/hooks';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';

// ─── DATA ────────────────────────────────────────────────────────────────────

const LENS_AREAS = [
  {
    number: '01',
    title: 'Visual Search Strategy',
    tagline: 'Where your eyes go, your game follows.',
    description:
      'Analyzes eye scanning patterns — eyes, body, ball — to optimize Court IQ under stress. We measure what you look at, when you look at it, and what you miss.',
    details: [
      'Pre-catch scanning frequency and timing',
      'Gaze anchoring under defensive pressure',
      'Visual search degradation at constraint levels 4-6',
      'Anticipation vs. reaction decision splits',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="4" fill="currentColor" />
        <line x1="4" y1="24" x2="14" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="34" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="4" x2="24" y2="14" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="34" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    color: 'from-blue-500/20 to-blue-600/5',
    accent: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'bg-blue-500/10',
  },
  {
    number: '02',
    title: 'Response to Stress',
    tagline: 'Pressure reveals the real player.',
    description:
      'Identifies what movement patterns a player resorts to when space and time are constrained. Fight-or-flight tendencies, ball pickup habits, and postural collapse all surface here.',
    details: [
      'Behavior mapping at constraint levels 1-6',
      'Dribble pickup timing under help-side pressure',
      'Postural changes and visual shutdown patterns',
      'Decision quality degradation under fatigue',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 4" />
      </svg>
    ),
    color: 'from-purple-500/20 to-purple-600/5',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    glow: 'bg-purple-500/10',
  },
  {
    number: '03',
    title: 'Movement Bandwidth',
    tagline: 'How many ways can you move?',
    description:
      'Assesses energy patterns, deceleration efficiency, and rotational capacity beyond surface-level aesthetics. We measure the full movement vocabulary available under pressure.',
    details: [
      'Deceleration mechanics and stop variety',
      'Hip hinge depth and rotational range',
      'Trail leg patterns and gallop access',
      'Delayed acceleration and tempo control',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 40 C16 32, 20 16, 24 24 C28 32, 32 8, 40 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="8" cy="40" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.7" />
        <circle cx="40" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
    color: 'from-emerald-500/20 to-emerald-600/5',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500/10',
  },
  {
    number: '04',
    title: 'Ball Manipulation Nuance',
    tagline: 'Control the ball. Control the game.',
    description:
      'Evaluates control over dribble cadence, reception location (RL), and reception time (RT). The difference between an average handler and an elite one is measured in milliseconds and inches.',
    details: [
      'Reception Time (RT): how early the ball arrives in the shooting pocket',
      'Reception Location (RL): where the ball is relative to the shot window',
      'Dribble Time (DT): cadence manipulation and float control',
      'Ball height and width variation under constraint',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 20 C16 14, 32 14, 36 20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M12 20 C16 26, 32 26, 36 20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="24" y1="8" x2="24" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="24" cy="40" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="24" cy="36" r="1.5" fill="currentColor" opacity="0.4" />
        <line x1="24" y1="32" x2="24" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="2 2" />
      </svg>
    ),
    color: 'from-amber-500/20 to-amber-600/5',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'bg-amber-500/10',
  },
  {
    number: '05',
    title: 'Actionable Priority Blueprint',
    tagline: 'A roadmap, not a report card.',
    description:
      'Translates system analysis into a prescriptive roadmap to overcome identified limiting factors. Every player leaves with a ranked priority list and a Phase 1 protocol.',
    details: [
      'Ranked limiting factor identification',
      'Phase-based progression programming',
      'Constraint level assignment per drill category',
      'Weekly session template recommendations',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="14" y1="16" x2="34" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="14" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1="14" y1="28" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <line x1="14" y1="34" x2="22" y2="34" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
        <circle cx="36" cy="36" r="8" fill="currentColor" opacity="0.15" />
        <path d="M33 36L35.5 38.5L39.5 33.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-site-gold/20 to-site-gold/5',
    accent: 'text-site-gold',
    border: 'border-site-gold/20',
    glow: 'bg-site-gold/10',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Submit Film & Assessment Data',
    description:
      'Send us game film, shooting evaluation data, and any available testing metrics. We accept anything from full-game footage to practice clips.',
  },
  {
    step: '02',
    title: 'BB Lens Analysis',
    description:
      'Our team runs your footage and data through all five lens areas — visual search, stress response, movement, ball manipulation, and priority mapping.',
  },
  {
    step: '03',
    title: 'Receive Your BB Profile',
    description:
      'A detailed report ranking your limiting factors with specific constraint levels, phase assignments, and a prescriptive session plan to address each one.',
  },
  {
    step: '04',
    title: 'Begin Programming',
    description:
      'Start your Phase 1 protocol immediately. For organizations, we build team-wide session blocks that integrate into your existing practice structure.',
  },
];

const AUDIENCE_CARDS = [
  {
    title: 'Individual Players',
    description:
      'Get a complete BB Profile identifying your top limiting factors and a Phase 1 protocol to start training immediately.',
    cta: 'Get Evaluated',
    href: '/player-info',
    features: ['Full 5-area analysis', 'Written BB Profile', 'Phase 1 session plan', 'Equipment recommendations'],
  },
  {
    title: 'Teams & Organizations',
    description:
      'Roster-wide BB Lens audits, staff training, and seasonal programming that integrates into your existing practice structure.',
    cta: 'Contact Us',
    href: '/inquiry',
    features: ['Roster-wide analysis', 'Practice block design', 'Staff certification', 'Ongoing support'],
  },
  {
    title: '1:1 Coaching Clients',
    description:
      'The deepest level. Week 0 assessment, personalized programming, weekly session reviews, and direct coach access.',
    cta: 'Apply for Coaching',
    href: '/coaching',
    features: ['Week 0 deep assessment', 'Custom weekly programming', 'Video review & feedback', 'Direct coach access'],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-barlow font-bold text-site-gold text-xs sm:text-sm tracking-[0.2em] uppercase mb-4">
      {children}
    </p>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-barlow font-extrabold text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
      {children}
    </h2>
  );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-site-primary via-site-primary to-site-secondary" />
      <div className="absolute inset-0 bg-grid-subtle opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-site-gold/[0.04] rounded-full blur-[150px]" />

      {/* Decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full border border-site-gold/[0.06] opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full border border-site-gold/[0.04] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="font-barlow font-bold text-site-gold text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-6 animate-fade-in">
          Basketball Biomechanics
        </p>

        <h1 className="font-barlow font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-3 animate-slide-up">
          The BB Lens
        </h1>

        <p className="font-barlow font-light text-site-muted text-lg sm:text-xl md:text-2xl mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          Decoding the Athlete&apos;s Internal Systems
        </p>

        <p className="font-dm-sans text-site-muted text-sm sm:text-base md:text-lg max-w-[640px] mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
          A five-area diagnostic framework that goes beyond surface-level skill evaluation
          to identify the specific internal systems limiting your performance.
        </p>

        {/* 5 lens area pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: '0.45s' }}>
          {LENS_AREAS.map((area) => (
            <span
              key={area.number}
              className={`font-barlow text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border ${area.border} ${area.accent} bg-white/[0.02]`}
            >
              {area.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function LensOverviewSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-site-gold/[0.02] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>The Five Systems</SectionLabel>
          <SectionHeadline>
            What We <span className="text-gradient-site-gold">Evaluate</span>
          </SectionHeadline>
          <p className="text-site-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every player has a unique constellation of strengths and limiting factors.
            The BB Lens identifies the specific systems holding you back — then gives you the roadmap to fix them.
          </p>
        </div>

        {/* Lens area cards */}
        <div className="space-y-6">
          {LENS_AREAS.map((area, index) => (
            <LensAreaCard key={area.number} area={area} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LensAreaCard({ area, index }: { area: typeof LENS_AREAS[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`relative rounded-xl border ${area.border} bg-gradient-to-r ${area.color} backdrop-blur-sm overflow-hidden group hover:border-opacity-40 transition-all duration-300`}>
        {/* Glow accent */}
        <div className={`absolute top-0 left-0 w-32 h-32 ${area.glow} rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 opacity-50`} />

        <div className="relative p-6 sm:p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            {/* Left: number + icon */}
            <div className="flex items-center gap-4 md:flex-col md:items-center md:w-20 shrink-0">
              <div className={`${area.accent}`}>
                {area.icon}
              </div>
              <span className={`font-barlow font-extrabold text-2xl ${area.accent} opacity-30`}>
                {area.number}
              </span>
            </div>

            {/* Center: content */}
            <div className="flex-1">
              <h3 className="font-barlow font-extrabold text-white text-xl sm:text-2xl mb-1">
                {area.title}
              </h3>
              <p className={`font-barlow text-sm ${area.accent} tracking-wide mb-3`}>
                {area.tagline}
              </p>
              <p className="text-site-muted text-sm sm:text-base leading-relaxed mb-5">
                {area.description}
              </p>

              {/* Detail bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {area.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`${area.accent} text-xs mt-1.5 shrink-0`}>&#9670;</span>
                    <span className="text-site-dim text-xs sm:text-sm leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative">
      <div className="absolute inset-0 bg-grid-subtle opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>How It Works</SectionLabel>
          <SectionHeadline>
            From Film to <span className="text-gradient-site-gold">Framework</span>
          </SectionHeadline>
          <p className="text-site-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            The BB Lens process is designed to be fast, thorough, and immediately actionable.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStepCard({ step, index }: { step: typeof PROCESS_STEPS[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-full rounded-xl border border-site-border bg-site-card/50 p-6 sm:p-8 hover:border-site-gold/20 transition-colors duration-300">
        <span className="font-barlow font-extrabold text-4xl text-site-gold/10 absolute top-4 right-6">
          {step.step}
        </span>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-site-gold/10 flex items-center justify-center">
            <span className="font-barlow font-bold text-site-gold text-sm">{step.step}</span>
          </div>
          <h3 className="font-barlow font-bold text-white text-lg">{step.title}</h3>
        </div>
        <p className="text-site-muted text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

function AudienceSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>Get Started</SectionLabel>
          <SectionHeadline>
            Choose Your <span className="text-gradient-site-gold">Path</span>
          </SectionHeadline>
          <p className="text-site-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re an individual player, a team, or a coaching staff — the BB Lens adapts to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AUDIENCE_CARDS.map((card, index) => (
            <AudienceCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceCard({ card, index }: { card: typeof AUDIENCE_CARDS[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-full rounded-xl border border-site-border bg-site-card/50 p-6 sm:p-8 hover:border-site-gold/20 transition-all duration-300 group flex flex-col">
        <h3 className="font-barlow font-extrabold text-white text-xl mb-3 group-hover:text-site-gold transition-colors">
          {card.title}
        </h3>
        <p className="text-site-muted text-sm leading-relaxed mb-6">
          {card.description}
        </p>

        {/* Features */}
        <div className="space-y-2.5 mb-8 flex-1">
          {card.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-site-gold text-xs">&#10003;</span>
              <span className="text-site-dim text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Link
          href={card.href}
          className="font-barlow font-bold text-sm tracking-wider uppercase text-center bg-site-gold/10 hover:bg-site-gold hover:text-site-primary text-site-gold px-6 py-3 rounded-md transition-all duration-300 block"
        >
          {card.cta}
        </Link>
      </div>
    </div>
  );
}

function CtaSection() {
  return (
    <section className="section-padding bg-site-primary relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-site-gold/[0.03] rounded-full blur-[120px]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <SectionLabel>Ready to See Clearly?</SectionLabel>
        <h2 className="font-barlow font-extrabold text-white text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
          Stop training blind.{' '}
          <span className="text-gradient-site-gold">Start seeing the system.</span>
        </h2>
        <p className="text-site-muted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          The BB Lens gives players, coaches, and organizations the diagnostic clarity
          to train what actually matters.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/player-info"
            className="w-full sm:w-auto font-barlow font-bold text-sm tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-8 py-3.5 rounded-md transition-all glow-site-gold-sm hover:glow-site-gold"
          >
            Get Evaluated
          </Link>
          <Link
            href="/inquiry"
            className="w-full sm:w-auto font-barlow font-bold text-sm tracking-wider uppercase border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-md transition-all hover:bg-white/5"
          >
            Contact for Organizations
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function BBLensPage() {
  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent />

      <HeroSection />
      <LensOverviewSection />
      <ProcessSection />
      <AudienceSection />
      <CtaSection />

      <BBFooter />
    </main>
  );
}
