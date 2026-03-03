'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useScrollReveal, useCounter, useStickyCTA } from '@/lib/hooks';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';

// ─── DATA CONSTANTS ──────────────────────────────────────────────────────────

const CASE_STUDIES = [
  {
    name: 'Tobias Harris',
    label: 'NBA Forward',
    level: 'NBA',
    before: 18,
    after: 47,
    metric: '3PT%',
    timeframe: '< 100 Days',
    quote: "Coach Tempesta's brain is like AI.",
    photo: '/players/tobiasharrislandingpage.webp',
    initials: 'TH',
  },
  {
    name: 'Paul Reed',
    label: 'NBA Center',
    level: 'NBA',
    before: 15,
    after: 40,
    metric: '3PT%',
    timeframe: '5 Months',
    quote: 'My shot feels effortless now after doing calibration.',
    photo: '/players/paulreedlandngpage.webp',
    initials: 'PR',
  },
  {
    name: 'Tyler Burton',
    label: 'G-League Guard',
    level: 'College / G-League',
    before: 29,
    after: 43,
    metric: '3PT%',
    timeframe: 'In-Season',
    quote: "Coach Tommy is the smartest basketball coach I've ever been around.",
    photo: '/players/tylerburtonlandingpage.jpg',
    initials: 'TB',
  },
  {
    name: 'OG Anunoby',
    label: 'NBA Wing',
    level: 'NBA',
    before: null,
    after: 60,
    metric: '3PT%',
    timeframe: '1 Month',
    quote: 'OG shot near career highs while being consulted by Coach Tempesta.',
    photo: '/players/OGA landing page.jpeg',
    initials: 'OA',
    beforeLabel: 'Slump',
  },
];

const PLAYER_LEVELS = ['NBA', 'G-League', 'College', 'High School', 'Youth'];

const SYSTEM_CARDS = [
  {
    title: 'Shooting',
    description: 'Miss profile, ball-flight spectrum, deep-distance impulse, back-rim standards.',
    icon: '🎯',
  },
  {
    title: 'Movement & Deception',
    description: 'Trail legs, stops, hinges, gallops, delayed accelerations, and full-foot control.',
    icon: '⚡',
  },
  {
    title: 'Vision & Decision Making',
    description: 'Reception time/location, visual search strategy, and passing solutions.',
    icon: '👁️',
  },
];

const RESEARCH_PILLARS = [
  {
    title: 'Motor Learning Science',
    description: 'External focus of attention, implicit learning, and the Action Effect Hypothesis drive our cueing system.',
  },
  {
    title: 'Ecological Dynamics',
    description: 'Movement is self-organizing. We change task constraints, not your form — letting your body find optimal solutions.',
  },
  {
    title: 'Visual-Motor Control',
    description: 'Strategic visual occlusion forces bottom-up, reflexive control that transfers to game speed.',
  },
  {
    title: 'Dynamic Systems Theory',
    description: 'We identify attractor states and use fluctuators to destabilize inefficient patterns.',
  },
];

const LIMITING_FACTORS = [
  {
    tag: 'Predictable',
    title: 'Movement Bandwidth',
    description: "You can't access enough movement patterns. Linear only, always on your toes, no hip hinge, missing gallops or delayed accelerations.",
    example: 'You drive in straight lines and defenders read you before you move.',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  {
    tag: 'Blind',
    title: 'Visual Search',
    description: "Your eyes don't scan. You stare at the ball or rim, look down under stress, and can't read help rotations — so you guess instead of react.",
    example: 'You get surprised by help defense that everyone else saw coming.',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  {
    tag: 'Rushed',
    title: 'Ball Manipulation',
    description: "Reception location and timing issues. You catch too close to your body, dribble too low/fast, no float — so you have no time to organize feet or decisions.",
    example: 'You rush every catch and your first dribble is always a reaction, never a choice.',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    tag: 'Fragile',
    title: 'Shooting & Energy Transfer',
    description: "You can't control horizontal distance or rely only on arc. Hitch in your shot, two-motion push, or internal cues that break down at game speed.",
    example: 'Your shot looks different every game and you never know which version will show up.',
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  {
    tag: 'Panicked',
    title: 'Response to Stress',
    description: "Under pressure you revert to stubborn habits: pick the ball up early, turn your back, stop scanning, lose all movement options. Fight-or-flight takes over.",
    example: 'In clutch moments, you become a different player — and not the good version.',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
];

const BB_LEVELS = [
  { level: 1, title: 'Foundation', subtitle: 'Energy Awareness', benchmark: '10/14 makes' },
  { level: 2, title: 'Calibrated', subtitle: 'Precise back rim on target', benchmark: 'Back rim command' },
  { level: 3, title: 'Adaptive', subtitle: 'Oversized ball gauntlet + strobes', benchmark: 'Constraint mastery' },
  { level: 4, title: 'Master', subtitle: 'Professional level BB calibrated shooter', benchmark: 'Can shoot at any level' },
];

const TEAM_STEPS = [
  {
    step: 1,
    title: 'BB Lens Audit',
    description: "We start by evaluating your roster and environment through the BB Lens. Film breakdown, live practice observation, and shooting assessments reveal each player's Limiting Factors — movement bandwidth, visual search, ball manipulation, shooting, and stress response. You get a written report: who is limiting your offense, why, and what needs to change first.",
  },
  {
    step: 2,
    title: 'System Build-Out',
    description: "Next, we build BB Blocks that plug directly into your existing practice plan. Shooting calibration progressions, movement and deception work, visual-stress drills, and constraint-based small-sided games — designed around your schemes and personnel, not generic drills. You leave with a seasonal progression, position standards, and a menu of practice blocks you can plug in week to week.",
  },
  {
    step: 3,
    title: 'Staff Certification & Support',
    description: "We train your staff to see the game through the BB Lens. Live or virtual clinics, film labs, and on-court sessions show coaches how to identify Limiting Factors in real time and adjust constraints on the fly. Ongoing support includes monthly strategy calls, updates to protocols, and access to our BB library so your staff keeps evolving with your players.",
  },
];

const BENEFITS = [
  'Understand WHY you miss, not just that you miss',
  'Protocols based on YOUR constraints, not generic drills',
  'A written BB Profile: your main Limiting Factors + priority roadmap',
  'Track progress with objective standards (BB Levels 1-4)',
  'Option to apply for 3-month mentorship with full equipment (oversized ball, strobes, blockers)',
];

const TESTIMONIALS = [
  {
    quote: "Tommy, I've never hit shots like this.",
    name: 'Matisse Thybulle',
    context: '',
    photo: '/players/mattiselandingpage.jpg',
    initials: 'MT',
  },
  {
    quote: "Tommy does a great job of adding a dynamic to skill development with different scenarios and obstacles that allow a player to try new things! Tommy has been someone I look to with advice for the depth of my shot the movement on defense and also my reads on offense!",
    name: 'Georges Niang',
    context: '',
    photo: '/players/georges-niang.jpg',
    initials: 'GN',
  },
  {
    quote: "I've never been coached like that in my life.",
    name: 'Tyler Burton',
    context: 'On the removal of his mechanical hitch',
    photo: '/players/tylerburtonlandingpage.jpg',
    initials: 'TB',
  },
];

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────

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

function SectionSubhead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-site-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      {children}
    </p>
  );
}

function StatCounter({ end, suffix = '%', label, color = 'text-white' }: { end: number; suffix?: string; label?: string; color?: string }) {
  const { ref, isVisible } = useScrollReveal(0.3);
  const { count, start } = useCounter(end);

  useEffect(() => {
    if (isVisible) start();
  }, [isVisible, start]);

  return (
    <div ref={ref}>
      <span className={`font-barlow font-extrabold text-3xl sm:text-4xl ${color}`}>
        {count % 1 === 0 ? Math.round(count) : count.toFixed(1)}{suffix}
      </span>
      {label && <span className="text-site-dim text-xs ml-1.5">{label}</span>}
    </div>
  );
}

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section id="site-hero" className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-site-primary via-site-primary to-site-secondary" />
      <div className="absolute inset-0 bg-grid-subtle opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-site-gold/[0.03] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Pre-headline */}
        <p className="font-barlow font-bold text-site-gold text-[11px] sm:text-[13px] tracking-[0.2em] uppercase mb-6 animate-fade-in">
          THE SYSTEM NBA PLAYERS USE TO TRANSFORM THEIR SHOOTING
        </p>

        {/* Main headline */}
        <h1 className="font-barlow font-extrabold text-white text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 animate-slide-up">
          Stop Guessing.{' '}
          <span className="text-gradient-site-gold">Start Calibrating.</span>
        </h1>

        {/* Subheadline */}
        <p className="font-dm-sans text-site-muted text-base sm:text-lg md:text-xl max-w-[680px] mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Basketball Biomechanics is a research-driven system for shooting, movement, and deception that has taken NBA players from career lows to over 47% from three — now available to players and coaches at every level.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/player-info"
            className="w-full sm:w-auto font-barlow font-bold text-sm tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-8 py-3.5 rounded-md transition-all glow-site-gold-sm hover:glow-site-gold"
          >
            I&apos;M A PLAYER
          </Link>
          <Link
            href="/inquiry"
            className="w-full sm:w-auto font-barlow font-bold text-sm tracking-wider uppercase border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-md transition-all hover:bg-white/5"
          >
            I&apos;M A COACH
          </Link>
          <Link
            href="/inquiry"
            className="w-full sm:w-auto font-barlow font-bold text-sm tracking-wider uppercase border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-md transition-all hover:bg-white/5"
          >
            I&apos;M AN ORGANIZATION
          </Link>
        </div>

        {/* Trust Bar */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-site-dim text-[10px] sm:text-xs tracking-[0.15em] uppercase mb-3">
            Trusted by players at every level
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {PLAYER_LEVELS.map((level, i) => (
              <span key={level} className="flex items-center gap-3 sm:gap-5">
                <span className="text-site-muted text-xs sm:text-sm font-medium">{level}</span>
                {i < PLAYER_LEVELS.length - 1 && (
                  <span className="text-site-border">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>IN-SEASON TRANSFORMATIONS</SectionLabel>
          <SectionHeadline>Calibration, Not Form Changes</SectionHeadline>
          <SectionSubhead>
            These aren&apos;t offseason rebuilds. These are in-season results achieved by changing how players calibrate — not how they look.
          </SectionSubhead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={study.name} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ study, index }: { study: typeof CASE_STUDIES[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`bg-site-card border border-site-border rounded-xl p-5 transition-all duration-700 hover:border-site-gold/20 hover:bg-site-card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Photo */}
      <div className="relative w-14 h-14 rounded-full overflow-hidden mb-4 border-2 border-site-border">
        <Image src={study.photo} alt={study.name} fill className="object-cover" />
      </div>

      {/* Name & Level */}
      <h3 className="font-barlow font-bold text-white text-lg">{study.name}</h3>
      <p className="text-site-dim text-xs mb-4">{study.label} · {study.level}</p>

      {/* Stats */}
      <div className="flex items-center gap-2 mb-4">
        {study.before !== null ? (
          <>
            <StatCounter end={study.before} color="text-site-danger" />
            <span className="text-site-dim text-lg">→</span>
          </>
        ) : study.beforeLabel ? (
          <>
            <span className="font-barlow font-extrabold text-3xl sm:text-4xl text-site-danger">{study.beforeLabel}</span>
            <span className="text-site-dim text-lg">→</span>
          </>
        ) : null}
        <StatCounter end={study.after} color="text-site-success" label={study.metric} />
      </div>

      {/* Timeline */}
      <p className="text-site-dim text-xs mb-3">{study.timeframe}</p>

      {/* Quote */}
      <p className="text-site-muted text-sm italic leading-relaxed">
        &ldquo;{study.quote}&rdquo;
      </p>
    </div>
  );
}

function SystemSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>THE SYSTEM</SectionLabel>
          <SectionHeadline>What Is Basketball Biomechanics?</SectionHeadline>
          <div className="max-w-3xl mx-auto">
            <SectionSubhead>
              Basketball Biomechanics (BB) is a method-based development system built on motor-learning science, ecological dynamics, and visual-motor control — not opinions about &quot;pretty&quot; form. Instead of changing how you look, we measure how you calibrate under stress.
            </SectionSubhead>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {SYSTEM_CARDS.map((card, index) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.1);
            return (
              <div
                key={card.title}
                ref={cardRef}
                className={`bg-site-card border border-site-border rounded-xl p-6 transition-all duration-700 hover:border-site-gold/20 ${
                  cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="text-3xl mb-4 block">{card.icon}</span>
                <h3 className="font-barlow font-bold text-white text-lg mb-2">{card.title}</h3>
                <p className="text-site-muted text-sm leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>

        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-site-muted text-sm sm:text-base max-w-2xl mx-auto">
            The result is a clear <span className="text-site-gold font-semibold">BB Profile</span> that tells you exactly what&apos;s limiting you and gives you protocols that scale from youth to NBA.
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const { ref, isVisible } = useScrollReveal();

  const team = [
    {
      name: 'Tommy Tempesta',
      title: 'Founder & Head of Methodology',
      photo: '/players/tommylandingpage.JPEG',
      initials: 'TT',
      bio: 'Tommy Tempesta is the founder of Basketball Biomechanics and the architect of the BB methodology. With a background in physical therapy, strength & conditioning, and 25+ years studying motor-learning and movement science, he\'s built assessment-based systems used by NBA players, high-major programs, and serious skill coaches around the world. Tommy\'s lens isolates real limiting factors — movement, vision, and energy transfer — and turns them into repeatable methods, not one-off drills. Coach Tempesta has coached thousands of players over the past 25 years.',
    },
    {
      name: 'Jake Cioe',
      title: 'BB-Certified Coach & Implementation Lead',
      photo: '/players/COACHJAKELANDING.JPEG',
      initials: 'JC',
      bio: 'Jake Cioe is a BB-certified Coach and former Division I guard at the University of San Francisco. Jake runs day-to-day implementation of BB protocols with pros, college players, and high-level youth, translating the research into on-court language players benefit from all over the world. He leads the BB online education, shooting calibration masterclass, and 1-on-1 mentorships for athletes and coaches.',
    },
  ];

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>THE TEAM</SectionLabel>
          <SectionHeadline>Who Are We?</SectionHeadline>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((person, index) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.1);
            return (
              <div
                key={person.name}
                ref={cardRef}
                className={`bg-site-card border border-site-border rounded-xl p-6 sm:p-8 transition-all duration-700 ${
                  cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-site-gold/30 shrink-0">
                    <Image src={person.photo} alt={person.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-barlow font-bold text-white text-xl">{person.name}</h3>
                    <p className="text-site-gold text-sm">{person.title}</p>
                  </div>
                </div>
                <p className="text-site-muted text-sm leading-relaxed">{person.bio}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>THE INDUSTRY PROBLEM</SectionLabel>
          <SectionHeadline>The &ldquo;Great Transfer&rdquo; Lie</SectionHeadline>

          <div className="mt-8 space-y-5 text-site-muted text-base sm:text-lg leading-relaxed">
            <p>
              Players dominate in practice but fail in games. Traditional coaching focuses on cosmetic mechanics in sterile environments — no pressure, no fatigue, no consequences.
            </p>
            <p>
              They tell you to &ldquo;tuck your elbow&rdquo; and &ldquo;snap your wrist.&rdquo; Research shows this internal focus causes choking under pressure and relies on conscious control that vanishes in games.
            </p>
          </div>

          <div className="mt-8 border-l-4 border-site-danger pl-5 py-2">
            <p className="text-white text-lg sm:text-xl font-medium">
              The Result: You&apos;re building <span className="text-site-gold">&ldquo;false confidence&rdquo;</span> with blocked reps that don&apos;t transfer to competition.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>THE BB SOLUTION</SectionLabel>
          <SectionHeadline>Strategic Failure</SectionHeadline>

          <div className="mt-8 space-y-5 text-site-muted text-base sm:text-lg leading-relaxed">
            <p>
              We make training harder than the game. Oversized balls. Visual occlusion. Deep distance. Your nervous system learns to function while missing.
            </p>
            <p>
              When the game arrives, the rim looks huge. Time slows down. Your &ldquo;fight or flight&rdquo; response quiets because you&apos;ve already trained in chaos.
            </p>
          </div>

          <div className="mt-8 border-l-4 border-site-success pl-5 py-2">
            <p className="text-white text-lg sm:text-xl font-medium">
              The Result: <span className="text-site-gold">Calibrated confidence under stress</span> — skills that actually show up when it matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>SCIENCE-DRIVEN</SectionLabel>
          <SectionHeadline>Research-Backed Methodology</SectionHeadline>
          <SectionSubhead>
            25+ years of research in motor learning, motor control, and movement science. Not opinions — peer-reviewed principles applied to basketball.
          </SectionSubhead>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {RESEARCH_PILLARS.map((pillar, index) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.1);
            return (
              <div
                key={pillar.title}
                ref={cardRef}
                className={`bg-site-card border border-site-border rounded-xl p-6 transition-all duration-700 hover:border-site-gold/20 ${
                  cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="font-barlow font-bold text-white text-lg mb-3">{pillar.title}</h3>
                <p className="text-site-muted text-sm leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-site-dim text-xs sm:text-sm">
          Grounded in: Dynamic Systems Theory · Ecological Dynamics · Constraints-Led Approach · Action Effect Hypothesis · Implicit Learning · Visual-Motor Integration
        </p>
      </div>
    </section>
  );
}

function LimitingFactorsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>THE BB LENS</SectionLabel>
          <SectionHeadline>What&apos;s Actually Limiting You?</SectionHeadline>
          <SectionSubhead>
            Limiting Factors are specific restrictions within your integrated systems that dictate failure when competition stress is applied. They&apos;re functional bottlenecks, not cosmetic &quot;bad form.&quot;
          </SectionSubhead>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LIMITING_FACTORS.map((factor, index) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.1);
            return (
              <div
                key={factor.tag}
                ref={cardRef}
                className={`bg-site-card border border-site-border rounded-xl p-6 transition-all duration-700 hover:border-site-gold/20 ${
                  cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className={`inline-block text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border mb-4 ${factor.color}`}>
                  {factor.tag}
                </span>
                <h3 className="font-barlow font-bold text-white text-lg mb-2">{factor.title}</h3>
                <p className="text-site-muted text-sm leading-relaxed mb-4">{factor.description}</p>
                <div className="bg-site-primary/50 rounded-lg p-3">
                  <p className="text-site-dim text-xs italic">{factor.example}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BBStandardSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>THE BB STANDARD</SectionLabel>
          <SectionHeadline>A Hierarchy of Adaptability</SectionHeadline>
          <SectionSubhead>
            This is not a participation trophy system. You don&apos;t advance until you execute the specific energy demands without &quot;bad misses&quot; (left/right/short). The standards are objective and non-negotiable.
          </SectionSubhead>
        </div>

        <div className="space-y-4">
          {BB_LEVELS.map((item, index) => {
            const { ref: rowRef, isVisible: rowVisible } = useScrollReveal(0.1);
            return (
              <div
                key={item.level}
                ref={rowRef}
                className={`flex items-center gap-5 bg-site-card border border-site-border rounded-xl p-5 transition-all duration-700 hover:border-site-gold/20 ${
                  rowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-site-gold/40 flex items-center justify-center shrink-0">
                  <span className="font-barlow font-extrabold text-site-gold text-lg">{item.level}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-barlow font-bold text-white text-lg">{item.title}</h3>
                  <p className="text-site-muted text-sm">{item.subtitle}</p>
                </div>
                <span className="hidden sm:block text-site-dim text-xs text-right whitespace-nowrap">{item.benchmark}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EvaluationCTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`bg-site-card border border-site-gold/20 rounded-2xl p-8 sm:p-10 text-center transition-all duration-700 glow-site-gold-sm ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <SectionHeadline>What You Get — $250 One-Time</SectionHeadline>

          <ul className="text-left max-w-xl mx-auto mt-8 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-site-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-site-muted text-sm sm:text-base">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <span className="font-barlow font-extrabold text-site-gold text-5xl glow-site-gold-sm">$250</span>
            <span className="text-site-dim text-sm ml-2">one-time</span>
          </div>

          <div className="mt-6">
            <Link
              href="/start/shooting"
              className="inline-block font-barlow font-bold text-sm tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-10 py-4 rounded-md transition-all glow-site-gold-sm hover:glow-site-gold"
            >
              Start Your Evaluation →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrganizationsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>FOR TEAMS & PROGRAMS</SectionLabel>
          <SectionHeadline>From Individual Fixes to System-Wide Change</SectionHeadline>
          <SectionSubhead>
            BB isn&apos;t a drill pack. It&apos;s a framework your entire program can run on — integrated into your practices, player development, and staff language.
          </SectionSubhead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {TEAM_STEPS.map((item, index) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.1);
            return (
              <div
                key={item.step}
                ref={cardRef}
                className={`bg-site-card border border-site-border rounded-xl p-6 transition-all duration-700 ${
                  cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-site-gold/10 border border-site-gold/20 flex items-center justify-center mb-4">
                  <span className="font-barlow font-bold text-site-gold">{item.step}</span>
                </div>
                <h3 className="font-barlow font-bold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-site-muted text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/start/organization"
            className="inline-block font-barlow font-bold text-sm tracking-wider uppercase border border-site-gold/30 hover:border-site-gold text-site-gold hover:bg-site-gold/5 px-8 py-3.5 rounded-md transition-all"
          >
            Apply for Team / Organization Integration →
          </Link>
          <p className="text-site-dim text-xs mt-3">For colleges, pro teams, academies, and serious high school programs.</p>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-secondary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionLabel>TESTIMONIALS</SectionLabel>
          <SectionHeadline>What Players Say</SectionHeadline>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {TESTIMONIALS.map((t, index) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.1);
            return (
              <div
                key={t.name}
                ref={cardRef}
                className={`bg-site-card border border-site-border rounded-xl p-6 transition-all duration-700 ${
                  cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <svg className="w-8 h-8 text-site-gold/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-site-border">
                    <Image src={t.photo} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-barlow font-bold text-white text-sm">{t.name}</p>
                    {t.context && <p className="text-site-dim text-xs">{t.context}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standalone quote */}
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-site-muted text-lg sm:text-xl italic leading-relaxed">
            &ldquo;If you are making every shot in practice, you are wasting your time. We calibrate for the miss so we can master the make.&rdquo;
          </p>
          <p className="text-site-dim text-sm mt-3">— Basketball Biomechanics</p>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section-padding bg-site-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-site-gold/[0.03] to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeadline>Ready to Find Your Limiting Factors?</SectionHeadline>
          <p className="text-site-muted text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Join the players who stopped guessing and started calibrating. Get your personalized BB Profile — your Limiting Factors exposed, your roadmap built.
          </p>
          <Link
            href="/start/shooting"
            className="inline-block font-barlow font-bold tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-10 py-4 rounded-md transition-all text-base glow-site-gold-sm hover:glow-site-gold"
          >
            Get Your BB Profile — $250 →
          </Link>
          <p className="text-site-dim text-xs mt-4">High-ticket 3-month mentorship available for qualified candidates</p>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const showStickyCTA = useStickyCTA('site-hero');

  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent />

      <HeroSection />
      <CaseStudiesSection />
      <SystemSection />
      <TeamSection />
      <ProblemSection />
      <SolutionSection />
      <ResearchSection />
      <LimitingFactorsSection />
      <BBStandardSection />
      <EvaluationCTASection />
      <OrganizationsSection />
      <TestimonialsSection />
      <FinalCTASection />

      <BBFooter />

      {/* Sticky CTA Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-site-primary/95 backdrop-blur-lg border-t border-site-border/50 transition-all duration-300 ${
          showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="hidden sm:block text-site-muted text-sm">
            BB Shooting Evaluation — <span className="text-site-gold font-semibold">$250</span>
          </p>
          <Link
            href="/start/shooting"
            className="w-full sm:w-auto text-center font-barlow font-bold text-sm tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-6 py-2.5 rounded-md transition-colors"
          >
            Get Evaluated →
          </Link>
        </div>
      </div>
    </main>
  );
}
