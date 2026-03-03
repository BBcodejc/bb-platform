'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Target,
  Ruler,
  ArrowUpDown,
  Settings,
  ChevronDown,
  Check,
  X,
  ArrowRight,
  Star,
  BookOpen,
  Clock,
  Zap,
  Award,
  TrendingUp,
  Play,
  ExternalLink,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const THINKIFIC_URL = 'https://bbcode.thinkific.com/enroll/3585033';

const CASE_STUDIES = [
  {
    name: 'Tobias Harris',
    team: 'Detroit Pistons',
    before: 18,
    after: 47.2,
    metric: '3PT%',
    timeline: 'Mid-season, 7 hours of BB methods',
    description: 'Back rim calibration, deep distance protocol, ball flight exploration',
    quote: "Coach Tommy's brain is like AI",
  },
  {
    name: 'Jabari Smith',
    team: 'Houston Rockets',
    before: 28.6,
    after: 50.0,
    metric: '3PT%',
    timeline: 'Oct 2024 \u2192 Jan 2025 via remote consults',
    description: 'Month-by-month: Oct 28.6% \u2192 Nov 38.2% \u2192 Dec 34.3% \u2192 Jan 50.0%',
    quote: null,
  },
  {
    name: 'Tyler Burton',
    team: 'Memphis Grizzlies',
    before: 29,
    after: 44,
    metric: '3PT%',
    timeline: 'Under 2 weeks, only 5 sessions',
    description: 'From 18/63 to 15/34 — in-season transformation at Villanova',
    quote: "You're the smartest basketball coach I've ever been around.",
  },
  {
    name: 'OG Anunoby',
    team: 'New York Knicks',
    before: 36,
    after: 59.1,
    metric: '3PT% (Mar 2022 stretch)',
    timeline: 'BB consultation began 2022',
    description: 'Ball flight and miss-pattern awareness targeting',
    quote: null,
  },
  {
    name: 'Paul Reed',
    team: 'Philadelphia 76ers',
    before: 15,
    after: 40,
    metric: '3PT%',
    timeline: 'In-season transformation',
    description: '7 made threes in 3 years to 21 made 3\'s in 3 months',
    quote: null,
  },
  {
    name: 'Trey Drexler',
    team: 'HS D1 Commit',
    before: null,
    after: 44,
    metric: '3PT% \u00b7 26+ PPG',
    timeline: 'High school calibration program',
    description: '44% from three and 26+ PPG using BB calibration methods',
    quote: 'Calibration really works!!! Instead of worrying about my form I\'m only focused on the back-rim',
  },
];

const CURRICULUM = [
  {
    chapter: 1,
    title: 'Introduction to Shooting Calibration',
    lessons: ['Welcome & Orientation', 'What We\'ve Discovered', 'How to Follow the Masterclass'],
    highlight: false,
  },
  {
    chapter: 2,
    title: 'Origins of Basketball Biomechanics',
    lessons: ['The Origin Story', 'BB Glossary PDF'],
    highlight: false,
  },
  {
    chapter: 3,
    title: 'BB Game Day Shooting Calibration',
    lessons: ['Back-Rim Focus Protocol', 'Game Day Prep Protocols', 'Pre-Game Calibration Flow'],
    highlight: false,
  },
  {
    chapter: 4,
    title: 'Professional Case Studies',
    lessons: ['Tyler Burton: 29% \u2192 43% In-Season Breakdown'],
    highlight: false,
  },
  {
    chapter: 5,
    title: 'Coaches, Start Here',
    lessons: ['Coaching-Specific Guidance & Implementation'],
    highlight: false,
  },
  {
    chapter: 6,
    title: '14-Day Implementation Protocol',
    lessons: [
      'Day 1: Deep Distance Calibration Intro',
      'Day 2: Impulse Calibration',
      'Day 3: Ball Flight Spectrum Work',
      'Day 4: Dip & Rhythm Exploration',
      'Day 5: Stress Test #1',
      'Day 6: Hops & Movement Bandwidth',
      'Day 7: Visual Stress Protocol',
      'Day 8: Drifts & Fades',
      'Day 9: Phase II — Deep Distance Progression',
      'Day 10: Phase II — Impulse Progression',
      'Day 11: Phase II — Ball Flight Progression',
      'Day 12: Phase II — Combined Stress',
      'Day 13: Phase II — Movement Integration',
      'Day 14: Final Calibration Test-Out',
      'Protocol Recap & Next Steps',
      'Tracking Sheet PDF',
      'Implementation FAQ',
    ],
    highlight: true,
  },
  {
    chapter: 7,
    title: 'Cognitive Layering Protocol',
    lessons: ['Tobias Harris Cognitive Layering Video', 'Full Breakdown & Application', 'Implementation Guide'],
    highlight: false,
  },
  {
    chapter: 8,
    title: 'Immediate Shot Enhancement Protocol',
    lessons: ['The Single-Session Protocol', 'Application Guide'],
    highlight: false,
  },
  {
    chapter: 9,
    title: 'What is Motor Learning?',
    lessons: ['The Science Behind Why This Works'],
    highlight: false,
  },
  {
    chapter: 10,
    title: 'Ball Flight Calibration & Energy Principles',
    lessons: ['Live On-Court: Energy Transfer', 'Force Through Movement Patterns', 'Workout Program', 'Visual Evidence Compilation'],
    highlight: false,
  },
  {
    chapter: 11,
    title: 'Ball Flight Exploration',
    lessons: ['Live Session: Ball Flight from 3', 'BB Test-Out Protocol', 'Workout Program', 'Visual Evidence', 'Advanced Exploration'],
    highlight: false,
  },
  {
    chapter: 12,
    title: 'Deep Distance Calibration',
    lessons: ['Live Session: Deep Distance Protocol', 'Matisse Thybulle Video Example', 'Workout Program', 'Visual Evidence', 'Progressive Overload Guide'],
    highlight: false,
  },
  {
    chapter: 13,
    title: 'Free Throw Module',
    lessons: ['Free Throw Calibration Live Session', 'Free Throw Protocol PDF'],
    highlight: false,
  },
  {
    chapter: 14,
    title: 'Next Steps',
    lessons: ['How to Go Deeper with BB'],
    highlight: false,
  },
];

const FAQ_ITEMS = [
  {
    question: 'How long do I have access?',
    answer: 'Lifetime. Once you enroll, you keep access forever. That includes any updates and new content we add over time.',
  },
  {
    question: 'What level is this for?',
    answer: 'Every level. The same motor learning principles apply whether you\'re in high school, college, overseas, or the NBA. The physics don\'t change. We\'ve seen results from middle school players through NBA All-Stars using these exact methods.',
  },
  {
    question: 'Do I need special equipment?',
    answer: 'A hoop, a ball, and a way to track makes and misses. That\'s it.',
  },
  {
    question: 'How is this different from other shooting programs?',
    answer: 'Most programs teach "perfect form" through blocked reps. We train your nervous system to calibrate under stress through intentional variability, strategic missing, and constraint-based methods. It\'s the difference between hoping your shot transfers and engineering it to.',
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Many players report noticeable improvement within a single session. The 14-day protocol is designed for measurable improvement in two weeks. Tyler Burton jumped from 29% to 44% in under two weeks of consultation.',
  },
  {
    question: 'I\'m a coach. Is this for me too?',
    answer: 'Absolutely. Chapter 5 is specifically for coaches, and the entire system is designed to be applied to your players. You\'ll understand the "why" behind every protocol so you can implement it with your roster.',
  },
];

const FOUR_PILLARS = [
  {
    icon: Target,
    title: 'The Intentional Back Rim Miss Protocol',
    what: 'You intentionally miss back rim from flat ball flights to build distance awareness.',
    why: 'Back rim miss is the closest miss to a make. When you miss intentionally, you create sensory information about impulse control that "trying to make it" never gives you.',
    result: 'Distance calibration you can feel. Ability to adjust after one miss. Left-right precision.',
  },
  {
    icon: Ruler,
    title: 'Deep Distance Calibration',
    what: 'Shooting 3+ steps behind the three-point line with flat ball flights.',
    why: 'When you calibrate from deep, game range feels easy. Your internal joint velocities increase. Exit speed becomes automatic.',
    result: 'Step-backs feel effortless. Contested shots from normal range become simple. Range extension without losing accuracy.',
  },
  {
    icon: ArrowUpDown,
    title: 'Ball Flight Exploration Spectrum',
    what: 'Training flat arcs (25-45\u00b0), medium arcs (45-52\u00b0), and high arcs (55-70\u00b0) to expand trajectory bandwidth.',
    why: 'If you only shoot one ball flight, you can\'t adapt when adrenaline changes your energy state. Exploration builds adaptability.',
    result: 'Adjust arc based on contest. Control over entry angle. No more being "stuck" in one pattern.',
  },
  {
    icon: Settings,
    title: 'Constraint-Based Training',
    what: 'Shooting with peripheral vision tasks, strobes, oversized balls, and cognitive layering.',
    why: 'You stress the system in training so games feel easier. Constraints force the adaptability that empty gym reps never will.',
    result: 'Shoot well under pressure. Visual processing under stress. Game transfer that actually works.',
  },
];

// ─── CUSTOM HOOKS ─────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const start = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, start };
}

function useStickyCTA() {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('mc-hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return showBar;
}

// ─── CTA BUTTON COMPONENT ────────────────────────────────────────────────────

function CTAButton({ size = 'lg', className = '' }: { size?: 'lg' | 'xl'; className?: string }) {
  return (
    <a
      href={THINKIFIC_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2
        bg-mc-amber hover:bg-mc-amber-light
        text-mc-navy font-bold
        rounded-lg transition-all duration-200
        hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]
        active:scale-[0.98]
        ${size === 'xl' ? 'px-10 py-4 text-lg' : 'px-8 py-3.5 text-base'}
        ${className}
      `}
    >
      GET INSTANT ACCESS &mdash; $150
      <ArrowRight className="w-5 h-5" />
    </a>
  );
}

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section id="mc-hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mc-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,166,35,0.08)_0%,_transparent_60%)]" />
      {/* Subtle court line pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mc-navy to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 text-center">
        {/* Pre-headline */}
        <p className="font-oswald text-mc-amber text-xs sm:text-sm tracking-[0.25em] uppercase mb-6 animate-fade-in">
          The system NBA players use to transform their shooting in weeks
        </p>

        {/* Main headline */}
        <h1 className="font-oswald font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 animate-slide-up">
          An NBA VET went from{' '}
          <span className="text-gradient-amber">18% to 47%</span>{' '}
          from three.{' '}
          <span className="text-mc-muted font-medium text-3xl sm:text-4xl md:text-5xl lg:text-5xl block mt-2">
            Mid-season. In 7 hours of BB methods.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-mc-muted text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          The Shooting Calibration Masterclass gives you the exact same protocols: back rim calibration, deep distance calibration, and ball flight exploration so your shot holds up when you&apos;re in a real game.
        </p>

        {/* YouTube VSL */}
        <div className="max-w-2xl mx-auto mb-10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(245,166,35,0.1)] border border-mc-border">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/AnlxxTYX0a0?rel=0"
              title="BB Shooting Calibration Masterclass"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mb-6">
          <CTAButton size="xl" />
        </div>
        <p className="text-mc-muted/60 text-sm">
          One-time payment &middot; Lifetime access &middot; 14 chapters &middot; 51 lessons
        </p>

        {/* Proof bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm">
          {[
            { stat: '20+', label: 'NBA Players Calibrated' },
            { stat: 'MULTIPLE', label: 'In-Season Jumps in the NBA' },
            { stat: '\u2713', label: 'Transfers At Every Level' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-mc-amber font-bold text-lg">{item.stat}</span>
              <span className="text-mc-muted/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2: THE PROBLEM ──────────────────────────────────────────────────

function ProblemSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="bg-mc-charcoal py-20 sm:py-28">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white text-center mb-10 uppercase tracking-wide">
          You&apos;ve done the reps. It still doesn&apos;t transfer.
        </h2>

        <div className="max-w-2xl mx-auto mb-16 space-y-4 text-mc-muted text-base sm:text-lg leading-relaxed text-center">
          <p>500 makes from 5 spots. Form shooting to start every session. You look automatic in the empty gym.</p>
          <p>Then the game starts and it falls apart. Rushed shots. Inconsistent misses. You can&apos;t find your rhythm under pressure.</p>
          <p className="text-white font-semibold">Here&apos;s why: traditional shooting training is built on a broken model.</p>
          <p>Blocked reps from the same spot. &ldquo;Elbow in, follow through.&rdquo; Try to make every shot. Hope it shows up in games.</p>
          <p>Your motor system doesn&apos;t learn from repetition. It learns from solving problems under stress.</p>
          <p className="text-mc-amber font-semibold">That empty gym confidence? It&apos;s Fake.</p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional — BAD */}
          <div className="bg-mc-card border border-mc-red/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-mc-red/10 flex items-center justify-center">
                <X className="w-5 h-5 text-mc-red" />
              </div>
              <h3 className="font-oswald font-bold text-xl text-white uppercase tracking-wide">Traditional Rep Shooting</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Same spot, same arc, same release',
                '"Fix your form" \u2014 elbow in, follow through',
                'Try to make every shot',
                'No stress, no constraints, no variability',
                'Hope it transfers to games',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-mc-muted">
                  <X className="w-4 h-4 text-mc-red/60 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-mc-red/10">
              <p className="text-mc-red text-sm font-semibold">Result: Plateau. Inconsistency. Falls apart under pressure.</p>
            </div>
          </div>

          {/* BB Calibration — GOOD */}
          <div className="bg-mc-card border border-mc-amber/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(245,166,35,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-mc-amber/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-mc-amber" />
              </div>
              <h3 className="font-oswald font-bold text-xl text-white uppercase tracking-wide">BB Shooting Calibration Method</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Intentional variability \u2014 distance, location, constraints',
                'Strategic missing to build distance awareness',
                'External cueing \u2014 ball flight, back rim, target',
                'Stress the system so games feel easy',
                'Test everything under live conditions',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-mc-muted">
                  <Check className="w-4 h-4 text-mc-green mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-mc-amber/10">
              <p className="text-mc-green text-sm font-semibold">Result: Adaptability. Consistency. In-game confidence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3: CASE STUDIES ─────────────────────────────────────────────────

function StatCounter({ end, suffix = '%', label }: { end: number; suffix?: string; label: string }) {
  const { count, start } = useCounter(end, 1800);
  const { ref, isVisible } = useScrollReveal(0.3);

  useEffect(() => {
    if (isVisible) start();
  }, [isVisible, start]);

  return (
    <div ref={ref} className="text-center">
      <span className="font-oswald font-bold text-3xl sm:text-4xl text-mc-amber">
        {end % 1 === 0 ? Math.round(count) : count.toFixed(1)}{suffix}
      </span>
      <p className="text-mc-muted/60 text-xs mt-1">{label}</p>
    </div>
  );
}

function CaseStudiesSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="bg-mc-navy py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="font-oswald text-mc-amber text-xs sm:text-sm tracking-[0.25em] uppercase mb-3">Documented Results</p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wide">
            The results speak for themselves.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CASE_STUDIES.map((cs, i) => (
            <CaseStudyCard key={i} study={cs} index={i} />
          ))}
        </div>

        {/* CTA after case studies */}
        <div className="text-center mt-14">
          <CTAButton size="lg" />
          <p className="text-mc-muted/50 text-sm mt-3">Same methods. Your turn.</p>
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ study, index }: { study: typeof CASE_STUDIES[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`bg-mc-card border border-mc-border rounded-2xl p-6 transition-all duration-700 delay-${index * 100}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        hover:border-mc-amber/30 hover:shadow-[0_0_30px_rgba(245,166,35,0.05)]
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-oswald font-bold text-lg text-white">{study.name}</h3>
        <p className="text-mc-muted/60 text-sm">{study.team}</p>
      </div>

      {/* Stats */}
      {study.before !== null && study.after !== null && (
        <div className="flex items-center gap-3 mb-4">
          <div className="text-center">
            <span className="font-oswald font-bold text-xl text-mc-muted/40">
              {study.before % 1 === 0 ? study.before : study.before.toFixed(1)}%
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-mc-amber flex-shrink-0" />
          <div className="text-center">
            <span className="font-oswald font-bold text-2xl text-mc-amber">
              {study.after % 1 === 0 ? study.after : study.after.toFixed(1)}%
            </span>
          </div>
          {study.metric && (
            <span className="text-mc-muted/40 text-xs ml-1">{study.metric}</span>
          )}
        </div>
      )}
      {study.before === null && study.after !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="font-oswald font-bold text-2xl text-mc-amber">
            {study.after % 1 === 0 ? study.after : study.after.toFixed(1)}%
          </span>
          {study.metric && (
            <span className="text-mc-muted/40 text-xs">{study.metric}</span>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-mc-amber/60" />
        <span className="text-mc-muted/70 text-sm">{study.timeline}</span>
      </div>

      {/* Description */}
      <p className="text-mc-muted text-sm mb-4">{study.description}</p>

      {/* Quote */}
      {study.quote && (
        <div className="border-l-2 border-mc-amber/30 pl-3 mt-auto">
          <p className="text-mc-muted/80 text-sm italic">&ldquo;{study.quote}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

// ─── SECTION 4: HOW IT WORKS (4 PILLARS) ────────────────────────────────────

function HowItWorksSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="bg-mc-charcoal py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="font-oswald text-mc-amber text-xs sm:text-sm tracking-[0.25em] uppercase mb-3">The Method</p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wide mb-4">
            The four calibration pillars
          </h2>
          <p className="text-mc-muted text-base sm:text-lg max-w-2xl mx-auto">
            This isn&apos;t another shooting course. It&apos;s a complete re-education of how your motor system learns to shoot under game stress.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {FOUR_PILLARS.map((pillar, i) => (
            <PillarCard key={i} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: typeof FOUR_PILLARS[0]; index: number }) {
  const { ref, isVisible } = useScrollReveal(0.2);
  const Icon = pillar.icon;

  return (
    <div
      ref={ref}
      className={`bg-mc-card border border-mc-border rounded-2xl p-6 sm:p-8 transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        hover:border-mc-amber/20
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-mc-amber/10 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-mc-amber" />
      </div>
      <h3 className="font-oswald font-bold text-lg text-white uppercase tracking-wide mb-4">{pillar.title}</h3>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-mc-amber font-semibold text-xs uppercase tracking-wider">What</span>
          <p className="text-mc-muted mt-1">{pillar.what}</p>
        </div>
        <div>
          <span className="text-mc-amber font-semibold text-xs uppercase tracking-wider">Why</span>
          <p className="text-mc-muted mt-1">{pillar.why}</p>
        </div>
        <div>
          <span className="text-mc-green font-semibold text-xs uppercase tracking-wider">Result</span>
          <p className="text-mc-muted mt-1">{pillar.result}</p>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 5: CURRICULUM ───────────────────────────────────────────────────

function CurriculumSection() {
  const { ref, isVisible } = useScrollReveal();
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  const totalLessons = CURRICULUM.reduce((acc, ch) => acc + ch.lessons.length, 0);

  return (
    <section className="bg-mc-navy py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="font-oswald text-mc-amber text-xs sm:text-sm tracking-[0.25em] uppercase mb-3">Full Curriculum</p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wide mb-4">
            Everything inside the masterclass
          </h2>
          <p className="text-mc-muted text-base sm:text-lg">
            {CURRICULUM.length} chapters. {totalLessons} lessons. A complete 14-day implementation protocol plus deep-dive modules on every calibration method.
          </p>
        </div>

        <div className="space-y-2">
          {CURRICULUM.map((chapter) => (
            <div
              key={chapter.chapter}
              className={`rounded-xl border overflow-hidden transition-colors ${
                chapter.highlight
                  ? 'border-mc-amber/30 bg-mc-amber/5'
                  : 'border-mc-border bg-mc-card'
              }`}
            >
              <button
                onClick={() => setOpenChapter(openChapter === chapter.chapter ? null : chapter.chapter)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`font-oswald font-bold text-sm ${chapter.highlight ? 'text-mc-amber' : 'text-mc-muted/40'}`}>
                    {String(chapter.chapter).padStart(2, '0')}
                  </span>
                  <div>
                    <span className={`font-semibold text-sm sm:text-base ${chapter.highlight ? 'text-mc-amber' : 'text-white'}`}>
                      {chapter.title}
                    </span>
                    <span className="text-mc-muted/40 text-xs ml-2">
                      {chapter.lessons.length} {chapter.lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>
                  {chapter.highlight && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-mc-amber/20 text-mc-amber uppercase tracking-wider">
                      Core
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-mc-muted/40 transition-transform duration-200 flex-shrink-0 ${
                    openChapter === chapter.chapter ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openChapter === chapter.chapter ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                  <ul className="space-y-2 ml-8">
                    {chapter.lessons.map((lesson, i) => (
                      <li key={i} className="flex items-center gap-2 text-mc-muted text-sm">
                        <Play className="w-3 h-3 text-mc-amber/40 flex-shrink-0" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after curriculum */}
        <div className="text-center mt-14">
          <CTAButton size="lg" />
          <p className="text-mc-muted/50 text-sm mt-3">Start today. Go at your own pace.</p>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6: ABOUT THE CREATOR ────────────────────────────────────────────

function CreatorSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="bg-mc-charcoal py-20 sm:py-28">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <p className="font-oswald text-mc-amber text-xs sm:text-sm tracking-[0.25em] uppercase mb-3 text-center">The Creator</p>
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white text-center uppercase tracking-wide mb-10">
          Built by Coach Tommy Tempesta
        </h2>

        <div className="bg-mc-card border border-mc-amber/20 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-mc-amber/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-mc-amber" />
            </div>
            <div>
              <h3 className="font-oswald font-bold text-xl text-white">Coach Tommy Tempesta, NBA Consultant</h3>
              <p className="text-mc-muted/60 text-sm">Founder, Basketball Biomechanics</p>
            </div>
          </div>

          <div className="space-y-4 text-mc-muted leading-relaxed">
            <p>
              Doctorate in Physical Therapy with a background spanning kinesiology, biomechanics, motor learning, neuroscience, and the physics of ball flight. 15+ years pressure-testing these methods with youth, college, and professional athletes.
            </p>
            <p>
              7+ years running a coaching company in NYC built around live competitive sessions. Has consulted with Tobias Harris, Jabari Smith, OG Anunoby, Kyle Lowry, Georges Niang, Tyler Burton, Dylan Cardwell, Paul Reed, Spencer Dinwiddie, and others.
            </p>
            <p className="text-white font-semibold">
              This is not theory. It&apos;s method application under game-like stress with documented, measurable results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 7: TWO PATHS ───────────────────────────────────────────────────

function TwoPathsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="bg-mc-navy py-20 sm:py-28">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white text-center uppercase tracking-wide mb-12">
          You have two options
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left — Status Quo (muted) */}
          <div className="bg-mc-card/50 border border-mc-border/50 rounded-2xl p-6 sm:p-8 opacity-60">
            <h3 className="font-oswald font-bold text-xl text-mc-muted/60 uppercase tracking-wide mb-6">
              Keep doing what you&apos;re doing
            </h3>
            <ul className="space-y-3 text-mc-muted/50 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-mc-muted/30 flex-shrink-0" />
                Same spot shooting. Same drills from Instagram.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-mc-muted/30 flex-shrink-0" />
                Same plateau. Hope something clicks in games.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-mc-muted/30 flex-shrink-0" />
                Keep wondering why practice confidence doesn&apos;t transfer.
              </li>
            </ul>
          </div>

          {/* Right — Action (highlighted) */}
          <div className="bg-mc-card border border-mc-amber/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,166,35,0.08)]">
            <h3 className="font-oswald font-bold text-xl text-mc-amber uppercase tracking-wide mb-6">
              Calibrate your shot with the system NBA players use
            </h3>
            <ul className="space-y-3 text-mc-muted text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-mc-green mt-0.5 flex-shrink-0" />
                14-day implementation protocol. Step by step.
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-mc-green mt-0.5 flex-shrink-0" />
                Proven at every level from high school to the NBA.
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-mc-green mt-0.5 flex-shrink-0" />
                Backed by motor learning science, not just reps.
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-mc-green mt-0.5 flex-shrink-0" />
                $150 for lifetime access to methods that cost NBA players thousands.
              </li>
            </ul>
            <div className="mt-8">
              <CTAButton size="lg" className="w-full justify-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 8: FAQ ──────────────────────────────────────────────────────────

function FAQSection() {
  const { ref, isVisible } = useScrollReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-mc-charcoal py-20 sm:py-28">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white text-center uppercase tracking-wide mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border border-mc-border rounded-xl overflow-hidden bg-mc-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white text-sm sm:text-base pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-mc-muted/40 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 text-mc-muted text-sm leading-relaxed">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 9: FINAL CTA ───────────────────────────────────────────────────

function FinalCTASection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative bg-mc-navy py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(245,166,35,0.1)_0%,_transparent_60%)]" />

      <div
        ref={ref}
        className={`relative z-10 max-w-3xl mx-auto px-4 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wide mb-6">
          Stop hoping your shot transfers.{' '}
          <span className="text-gradient-amber">Start calibrating it.</span>
        </h2>
        <p className="text-mc-muted text-base sm:text-lg mb-3">
          $150. Lifetime access. The same system that took Tobias Harris from 18% to 47%.
        </p>
        <p className="text-mc-muted/50 text-sm mb-10">
          14 chapters &middot; 51 lessons &middot; 14-day implementation protocol &middot; Professional case studies
        </p>

        <CTAButton size="xl" />
        <p className="text-mc-muted/40 text-sm mt-4">
          One-time payment &middot; Lifetime access &middot; Instant enrollment
        </p>
      </div>
    </section>
  );
}

// ─── STICKY CTA BAR ──────────────────────────────────────────────────────────

function StickyCTABar() {
  const showBar = useStickyCTA();

  return (
    <div
      className={`fixed z-50 transition-transform duration-300 ease-in-out
        bottom-0 left-0 right-0 md:top-0 md:bottom-auto
        ${showBar ? 'translate-y-0' : 'translate-y-full md:-translate-y-full'}
        bg-mc-navy/95 backdrop-blur-lg border-t md:border-b md:border-t-0 border-mc-amber/10
      `}
    >
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-3">
          <Zap className="w-4 h-4 text-mc-amber" />
          <span className="text-white font-semibold text-sm">Shooting Calibration Masterclass</span>
          <span className="text-mc-muted/50 text-sm">&middot; $150 lifetime access</span>
        </div>
        <span className="sm:hidden text-mc-muted text-sm font-medium">$150 &middot; Lifetime access</span>
        <a
          href={THINKIFIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-mc-amber hover:bg-mc-amber-light text-mc-navy font-bold px-5 py-2 rounded-lg text-sm transition-all hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]"
        >
          Enroll Now
        </a>
      </div>
    </div>
  );
}

// ─── MINI HEADER ─────────────────────────────────────────────────────────────

function MasterclassHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/players/bb-logo.png"
            alt="Basketball Biomechanics"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-mc-amber font-bold tracking-wider text-xs hidden sm:block">
            BASKETBALL BIOMECHANICS
          </span>
        </Link>
        <a
          href={THINKIFIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-mc-amber hover:text-mc-amber-light transition-colors font-medium flex items-center gap-1.5"
        >
          Enroll Now
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function MasterclassFooter() {
  return (
    <footer className="bg-mc-charcoal border-t border-mc-border py-10">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <Image
            src="/players/bb-logo.png"
            alt="Basketball Biomechanics"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-mc-muted/60 font-bold tracking-wider text-xs">BASKETBALL BIOMECHANICS</span>
        </Link>
        <p className="text-mc-muted/30 text-xs">
          &copy; {new Date().getFullYear()} Basketball Biomechanics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function MasterclassPage() {
  return (
    <div className="bg-mc-navy min-h-screen text-white">
      <MasterclassHeader />
      <HeroSection />
      <ProblemSection />
      <CaseStudiesSection />
      <HowItWorksSection />
      <CurriculumSection />
      <CreatorSection />
      <TwoPathsSection />
      <FAQSection />
      <FinalCTASection />
      <MasterclassFooter />
      <StickyCTABar />
    </div>
  );
}
