'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Target,
  Crosshair,
  BarChart3,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  Quote,
  Brain,
  FlaskConical,
  Eye,
  TrendingUp,
  Scan,
  Hand,
  Activity,
  ShieldAlert,
  Users,
  ClipboardCheck,
  GraduationCap,
} from 'lucide-react';

// NBA & Pro Results
const caseStudies = [
  {
    name: 'Tobias Harris',
    label: 'NBA Forward',
    team: 'NBA',
    beforeStat: '29%',
    afterStat: '47%',
    metric: '3PT%',
    timeframe: '< 100 Days',
    quote: "Coach Tempesta's brain is like AI.",
    photo: '/players/tobiasharrislandingpage.webp',
  },
  {
    name: 'Paul Reed',
    label: 'NBA Center',
    team: 'NBA',
    beforeStat: '~15%',
    afterStat: '40%',
    metric: '3PT%',
    timeframe: '5 Months',
    quote: 'My shot feels effortless now after doing calibration.',
    photo: '/players/paulreedlandngpage.webp',
  },
  {
    name: 'Tyler Burton',
    label: 'G-League Guard',
    team: 'College / G-League',
    beforeStat: '29%',
    afterStat: '43%',
    metric: '3PT%',
    timeframe: 'In-Season',
    quote: "You're the smartest basketball coach I've ever been around.",
    photo: '/players/tylerburtonlandingpage.jpg',
  },
  {
    name: 'OG Anunoby',
    label: 'NBA Wing',
    team: 'NBA',
    beforeStat: 'Slump',
    afterStat: '~60%',
    metric: '3PT%',
    timeframe: '1 Month',
    quote: 'OG shot near career highs while being consulted by Coach Tempesta.',
    photo: '/players/OGA landing page.jpeg',
  },
];

// Player levels worked with (names removed for privacy)
const playerLevels = [
  'NBA',
  'G-League',
  'College',
  'High School',
  'Youth',
];

// Research pillars
const researchPillars = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Motor Learning Science',
    description: 'External focus of attention, implicit learning, and the Action Effect Hypothesis drive our cueing system.',
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: 'Ecological Dynamics',
    description: 'Movement is self-organizing. We change task constraints, not your form—letting your body find optimal solutions.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Visual-Motor Control',
    description: 'Strategic visual occlusion forces bottom-up, reflexive control that transfers to game speed.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Dynamic Systems Theory',
    description: 'We identify attractor states and use fluctuators to destabilize inefficient patterns.',
  },
];

// Limiting Factors - the BB Lens
const limitingFactors = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Movement Bandwidth',
    tag: 'Predictable',
    description: "You can't access enough movement patterns. Linear only, always on your toes, no hip hinge, missing gallops or delayed accelerations.",
    example: 'You drive in straight lines and defenders read you before you move.',
  },
  {
    icon: <Scan className="w-6 h-6" />,
    title: 'Visual Search',
    tag: 'Blind',
    description: "Your eyes don't scan. You stare at the ball or rim, look down under stress, and can't read help rotations—so you guess instead of react.",
    example: 'You get surprised by help defense that everyone else saw coming.',
  },
  {
    icon: <Hand className="w-6 h-6" />,
    title: 'Ball Manipulation',
    tag: 'Rushed',
    description: "Reception location and timing issues. You catch too close to your body, dribble too low/fast, no float—so you have no time to organize feet or decisions.",
    example: 'You rush every catch and your first dribble is always a reaction, never a choice.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Shooting & Energy Transfer',
    tag: 'Fragile',
    description: "You can't control horizontal distance or rely only on arc. Hitch in your shot, two-motion push, or internal cues that break down at game speed.",
    example: 'Your shot looks different every game and you never know which version will show up.',
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    title: 'Response to Stress',
    tag: 'Panicked',
    description: "Under pressure you revert to stubborn habits: pick the ball up early, turn your back, stop scanning, lose all movement options. Fight-or-flight takes over.",
    example: 'In clutch moments, you become a different player—and not the good version.',
  },
];

// Team integration steps
const teamSteps = [
  {
    step: 1,
    title: 'BB Lens Audit',
    description: "We start by evaluating your roster and environment through the BB Lens. Film breakdown, live practice observation, and shooting assessments reveal each player's Limiting Factors—movement bandwidth, visual search, ball manipulation, shooting, and stress response. You get a written report: who is limiting your offense, why, and what needs to change first.",
  },
  {
    step: 2,
    title: 'System Build-Out',
    description: "Next, we build BB Blocks that plug directly into your existing practice plan. Shooting calibration progressions, movement and deception work, visual-stress drills, and constraint-based small-sided games—designed around your schemes and personnel, not generic drills. You leave with a seasonal progression, position standards, and a menu of practice blocks you can plug in week to week.",
  },
  {
    step: 3,
    title: 'Staff Certification & Support',
    description: "We train your staff to see the game through the BB Lens. Live or virtual clinics, film labs, and on-court sessions show coaches how to identify Limiting Factors in real time and adjust constraints on the fly. Ongoing support includes monthly strategy calls, updates to protocols, and access to our BB library so your staff keeps evolving with your players.",
  },
];

const benefits = [
  'Understand WHY you miss, not just that you miss',
  'Protocols based on YOUR constraints, not generic drills',
  'A written BB Profile: your main Limiting Factors + priority roadmap',
  'Track progress with objective standards (BB Levels 1-4)',
  'Option to apply for 3-month mentorship with full equipment (oversized ball, strobes, blockers)',
];

const testimonials = [
  {
    quote: "Tommy, I've never hit shots like this.",
    name: 'Matisse Thybulle',
    context: '',
    photo: '/players/mattiselandingpage.jpg',
  },
  {
    quote: "Tommy does a great job of adding a dynamic to skill development with different scenarios and obstacles that allow a player to try new things! Tommy has been someone I look to with advice for the depth of my shot the movement on defense and also my reads on offense! I enjoy the basketball knowledge and honesty Tommy shares with me on a consistent basis",
    name: 'Georges Niang',
    context: '',
    photo: '/players/georges-niang.jpg',
  },
  {
    quote: "I've never been coached like that in my life.",
    name: 'Tyler Burton',
    context: 'On the removal of his mechanical hitch',
    photo: '/players/tylerburtonlandingpage.jpg',
  },
];

export default function LandingPage() {
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
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/gear"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                BB Gear
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

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-32">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <Image
                src="/players/bb-logo.png"
                alt="Basketball Biomechanics Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-gold-500 font-bold tracking-widest text-sm">
              BASKETBALL BIOMECHANICS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-4xl mx-auto leading-tight animate-slide-up">
            Stop Guessing.
            <br />
            <span className="text-gradient-gold">Start Calibrating.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 text-center max-w-3xl mx-auto mt-6 animate-fade-in">
            Basketball Biomechanics is a research-driven system for shooting, movement, and deception that has taken NBA players from career lows to over 45% from 3, now available to players/coaches at every level.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in">
            <Link href="/start">
              <Button size="xl" className="group">
                Get Your BB Profile
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="https://www.youtube.com/watch?v=Bpm-jAX8c38" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="xl">
                <Play className="mr-2 w-5 h-5" />
                Watch How It Works
              </Button>
            </a>
          </div>

          <div className="mt-12 text-center animate-fade-in">
            <p className="text-gray-500 text-sm mb-4">Trusted by players at every level</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-400 text-sm">
              {playerLevels.map((level) => (
                <span key={level} className="px-3 py-1 rounded-full border border-gold-500/30 text-gold-500/80">
                  {level}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NBA Results Section */}
      <section className="py-20 bg-gradient-to-b from-bb-black to-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              IN-SEASON TRANSFORMATIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Calibration, Not Form Changes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These aren&apos;t offseason rebuilds. These are in-season results achieved by changing how players calibrate—not how they look.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudies.map((study, index) => (
              <div key={index} className="animate-fade-in">
                <Card variant="glass" className="h-full overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center relative">
                    {study.photo ? (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-gold-500/50">
                        <Image
                          src={study.photo}
                          alt={study.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-bb-card border-2 border-gold-500/30 flex items-center justify-center">
                        <Target className="w-10 h-10 text-gold-500" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white">{study.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{study.label} • {study.team}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-red-400 text-xl font-bold">{study.beforeStat}</p>
                        <p className="text-xs text-gray-500">Before</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gold-500" />
                      <div className="text-center">
                        <p className="text-green-400 text-xl font-bold">{study.afterStat}</p>
                        <p className="text-xs text-gray-500">After</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-xs text-gray-400">{study.metric}</p>
                        <p className="text-xs text-gold-500">{study.timeframe}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 italic border-l-2 border-gold-500 pl-3">
                      &quot;{study.quote}&quot;
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is BB Section */}
      <section className="py-20 bg-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              THE SYSTEM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              What Is Basketball Biomechanics?
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 mb-6 animate-fade-in">
              Basketball Biomechanics (BB) is a method-based development system built on motor-learning science, ecological dynamics, and visual-motor control—not opinions about &quot;pretty&quot; form.
            </p>

            <p className="text-gray-400 mb-8 animate-fade-in">
              Instead of changing how you look, we measure how you calibrate under stress:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card variant="glass" className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Shooting</h3>
                  <p className="text-sm text-gray-400">
                    Miss profile, ball-flight spectrum, deep-distance impulse, back-rim standards.
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass" className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Movement & Deception</h3>
                  <p className="text-sm text-gray-400">
                    Trail legs, stops, hinges, gallops, delayed accelerations, and full-foot control.
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass" className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Vision & Decision Making</h3>
                  <p className="text-sm text-gray-400">
                    Reception time/location, visual search strategy, and passing solutions.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-gold-500/10 border border-gold-500/30 rounded-xl text-center animate-fade-in">
              <p className="text-gray-300">
                The result is a clear <span className="text-gold-500 font-semibold">BB Profile</span> that tells you exactly what&apos;s limiting you and gives you protocols that scale from youth to NBA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section */}
      <section className="py-20 bg-bb-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              THE TEAM
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Who Are We?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tommy Tempesta */}
            <Card variant="glass" className="animate-fade-in">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-gold-500/50 mb-4">
                    <Image
                      src="/players/tommylandingpage.JPEG"
                      alt="Coach Tommy Tempesta"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">Tommy Tempesta</h3>
                  <p className="text-gold-500 text-sm">Founder & Head of Methodology</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tommy Tempesta is the founder of Basketball Biomechanics and the architect of the BB methodology. With a background in physical therapy, strength & conditioning, and 25+ years studying motor-learning and movement science, he&apos;s built assessment-based systems used by NBA players, high-major programs, and serious skill coaches around the world. Tommy&apos;s lens isolates real limiting factors—movement, vision, and energy transfer—and turns them into repeatable methods, not one-off drills. Coach Tempesta has coached thousands of players over the past 25 years.
                </p>
              </CardContent>
            </Card>

            {/* Jake Cioe */}
            <Card variant="glass" className="animate-fade-in">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-gold-500/50 mb-4">
                    <Image
                      src="/players/COACHJAKELANDING.JPEG"
                      alt="Coach Jake Cioe"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">Jake Cioe</h3>
                  <p className="text-gold-500 text-sm">BB-Certified Coach & Implementation Lead</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Jake Cioe is a BB-certified Coach and former Division I guard at the University of San Francisco. Jake runs day-to-day implementation of BB protocols with pros, college players, and high-level youth, translating the research into on-court language players benefit from all over the world. He leads the BB online education, shooting calibration masterclass, and 1-on-1 mentorships for athletes and coaches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-red-500 font-semibold text-sm tracking-wider">
                THE INDUSTRY PROBLEM
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                The &quot;Great Transfer&quot; Lie
              </h2>
              <p className="text-gray-400 mb-6">
                Players dominate in practice but fail in games. Traditional coaching focuses on <span className="text-white">cosmetic mechanics</span> in <span className="text-white">sterile environments</span>—no pressure, no fatigue, no consequences.
              </p>
              <p className="text-gray-400 mb-6">
                They tell you to &quot;tuck your elbow&quot; and &quot;snap your wrist.&quot; Research shows this <span className="text-white">internal focus</span> causes choking under pressure and relies on conscious control that vanishes in games.
              </p>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="text-red-400 font-semibold">The Result:</span> You&apos;re building <span className="text-white">&quot;false confidence&quot;</span> with blocked reps that don&apos;t transfer to competition.
                </p>
              </div>
            </div>

            <div className="animate-fade-in">
              <span className="text-green-500 font-semibold text-sm tracking-wider">
                THE BB SOLUTION
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Strategic Failure
              </h2>
              <p className="text-gray-400 mb-6">
                We make training <span className="text-white">harder than the game</span>. Oversized balls. Visual occlusion. Deep distance. Your nervous system learns to function while missing.
              </p>
              <p className="text-gray-400 mb-6">
                When the game arrives, the rim looks huge. Time slows down. Your <span className="text-white">&quot;fight or flight&quot; response quiets</span> because you&apos;ve already trained in chaos.
              </p>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">The Result:</span> <span className="text-white">Calibrated confidence</span> under stress—skills that actually show up when it matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research-Backed Section */}
      <section className="py-20 bg-bb-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              SCIENCE-DRIVEN
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Research-Backed Methodology
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              25+ years of research in motor learning, motor control, and movement science. Not opinions—peer-reviewed principles applied to basketball.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchPillars.map((pillar) => (
              <div key={pillar.title} className="animate-fade-in">
                <Card variant="glass" hover className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                      {pillar.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-400">{pillar.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Grounded in: Dynamic Systems Theory • Ecological Dynamics • Constraints-Led Approach •
              Action Effect Hypothesis • Implicit Learning • Visual-Motor Integration
            </p>
          </div>
        </div>
      </section>

      {/* Limiting Factors Section */}
      <section className="py-20 bg-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              THE BB LENS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What&apos;s Actually Limiting You?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Limiting Factors are specific restrictions within your integrated systems that dictate failure when competition stress is applied. They&apos;re functional bottlenecks, not cosmetic &quot;bad form.&quot;
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {limitingFactors.map((lf) => (
              <div key={lf.title} className="animate-fade-in">
                <Card variant="glass" hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                        {lf.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                        {lf.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {lf.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{lf.description}</p>
                    <div className="p-3 bg-bb-black/50 rounded-lg border border-bb-border">
                      <p className="text-xs text-gray-500">
                        <span className="text-gold-500 font-semibold">Example:</span> {lf.example}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BB Standard Section */}
      <section className="py-20 bg-bb-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="text-gold-500 font-semibold text-sm tracking-wider">
                THE BB STANDARD
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                A Hierarchy of Adaptability
              </h2>
              <p className="text-gray-400 mb-8">
                This is not a participation trophy system. You don&apos;t advance until you execute the specific energy demands without &quot;bad misses&quot; (left/right/short). The standards are objective and non-negotiable.
              </p>

              <div className="space-y-4">
                {[
                  { level: 1, name: 'Foundation', desc: 'Energy Awareness', detail: '10/14 makes' },
                  { level: 2, name: 'Calibrated', desc: 'Precise back rim on target', detail: 'Back rim command' },
                  { level: 3, name: 'Adaptive', desc: 'Oversized ball gauntlet + strobes', detail: 'Constraint mastery' },
                  { level: 4, name: 'Master', desc: 'Professional level BB calibrated shooter', detail: 'Can shoot at any level' },
                ].map((item) => (
                  <div
                    key={item.level}
                    className="flex items-center gap-4 p-4 rounded-lg bg-bb-card border border-bb-border hover:border-gold-500/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-bb-black font-bold text-lg shrink-0">
                      {item.level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    <p className="text-sm text-gold-500 font-medium text-right hidden sm:block">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-in">
              <Card variant="gold" className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  What You Get — $250 One-Time
                </h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gold-500/30">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-white">$250</span>
                    <span className="text-gray-400">one-time</span>
                  </div>
                  <Link href="/start/shooting">
                    <Button size="lg" className="w-full">
                      Start Your Evaluation
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Organization Section - NEW */}
      <section className="py-20 bg-gradient-to-b from-bb-black to-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              FOR TEAMS & PROGRAMS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              From Individual Fixes to System-Wide Change
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              BB isn&apos;t a drill pack. It&apos;s a framework your entire program can run on—integrated into your practices, player development, and staff language.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {teamSteps.map((step) => (
              <div key={step.step} className="animate-fade-in">
                <Card variant="glass" className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-bb-black font-bold">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="animate-fade-in">
            <Card className="bg-gradient-to-r from-gold-500/10 to-gold-500/5 border-gold-500/30">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-8 h-8 text-gold-500" />
                      <h3 className="text-2xl font-bold text-white">Bring BB To Your Program</h3>
                    </div>
                    <p className="text-gray-400 mb-6">
                      We&apos;ve used this framework with NBA players, G-League guards, and high-level high school programs. The next step is installing it where it matters most—inside your practices, not just on film.
                    </p>
                    <Link href="/start/organization">
                      <Button size="lg" className="group">
                        Apply for Team / Organization Integration
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 mt-3">
                      For colleges, pro teams, academies, and serious high school programs.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gold-500/20 flex items-center justify-center">
                        <ClipboardCheck className="w-8 h-8 text-gold-500" />
                      </div>
                      <div className="w-16 h-16 rounded-lg bg-gold-500/20 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gold-500" />
                      </div>
                      <div className="w-16 h-16 rounded-lg bg-gold-500/20 flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-gold-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-bb-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              What Players Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-fade-in">
                <Card variant="glass" className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full border-2 border-gold-500/40 shrink-0 overflow-hidden relative">
                        <Image
                          src={testimonial.photo}
                          alt={testimonial.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <Quote className="w-8 h-8 text-gold-500/30" />
                    </div>
                    <p className="text-white text-lg mb-4 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="border-t border-bb-border pt-4">
                      <p className="text-gold-500 font-semibold">{testimonial.name}</p>
                      {testimonial.context && (
                        <p className="text-sm text-gray-500">{testimonial.context}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-20 bg-gradient-to-b from-bb-dark to-bb-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-white italic animate-fade-in">
            &quot;If you are making every shot in practice, you are wasting your time. We calibrate for the miss so we can master the make.&quot;
          </blockquote>
          <p className="text-gold-500 mt-4 font-semibold">
            — Basketball Biomechanics
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-t from-gold-500/10 to-bb-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Limiting Factors?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the players who stopped guessing and started calibrating. Get your personalized BB Profile—your Limiting Factors exposed, your roadmap built.
            </p>
            <Link href="/start">
              <Button size="xl" className="group">
                Get Your BB Profile — $250
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              High-ticket 3-month mentorship available for qualified candidates
            </p>
          </div>
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
            <Link href="/gear" className="hover:text-white transition-colors">
              BB Gear
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
