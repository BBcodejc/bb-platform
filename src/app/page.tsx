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
  Trophy,
} from 'lucide-react';

// NBA & Pro Results (anonymized)
const caseStudies = [
  {
    label: 'NBA Forward',
    team: 'NBA',
    beforeStat: '29%',
    afterStat: '47%',
    metric: '3PT%',
    timeframe: '< 100 Days',
    quote: 'My brain is like AI.',
  },
  {
    label: 'NBA Center',
    team: 'NBA',
    beforeStat: '~15%',
    afterStat: '40%',
    metric: '3PT%',
    timeframe: '5 Months',
    quote: 'It feels easy.',
  },
  {
    label: 'G-League Guard',
    team: 'College / G-League',
    beforeStat: '29%',
    afterStat: '43%',
    metric: '3PT%',
    timeframe: 'In-Season',
    quote: "You're the smartest basketball coach I've ever been around.",
  },
  {
    label: 'NBA Wing',
    team: 'NBA',
    beforeStat: 'Slump',
    afterStat: '~60%',
    metric: '3PT%',
    timeframe: '1 Month',
    quote: "No one's ever broken down film this way.",
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

// Protocol features
const protocols = [
  {
    icon: <Target className="w-6 h-6" />,
    title: '14-Spot Assessment',
    description: 'Reveals your miss profile patterns across all court positions—short, long, left, right, front rim, back rim.',
  },
  {
    icon: <Crosshair className="w-6 h-6" />,
    title: 'Deep Distance Calibration',
    description: 'Shooting from 3-4 feet behind the line forces total impulse production. If you can hit from there, the regular line feels effortless.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Ball Flight Spectrum',
    description: 'Master flat (25°), standard (45°), and high (60°+) trajectories. Game situations demand adaptability, not one "perfect" arc.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Back-Rim Standards',
    description: 'If you can miss back rim on command, a swish is just removing 1% of force. This is calibration, not luck.',
  },
];

const benefits = [
  'Understand WHY you miss, not just that you miss',
  'Protocols based on YOUR constraints, not generic drills',
  'Know exactly what to work on every single day',
  'Track progress with objective standards (BB Levels 1-4)',
  'Optional path to 3-month mentorship with full equipment',
];

const testimonials = [
  {
    quote: "Tommy, I've never hit shots like this.",
    name: 'Matisse Thybulle',
    context: 'After implementing the dip and deep distance protocol',
    photo: '/players/matisse-thybulle.jpg',
  },
  {
    quote: "You're going to regret going down the wrong path, because you're a coach. In your heart, you're a coach.",
    name: 'Jenny Schottenheimer',
    context: 'Wife of NFL Coach Brian Schottenheimer',
    photo: '/players/jenny-schottenheimer.jpg',
  },
  {
    quote: "I've never been coached like that in my life.",
    name: 'Tyler Burton',
    context: 'On the removal of his mechanical hitch',
    photo: '/players/tyler-burton.jpg',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bb-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px] -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-32">
          <div className="text-center mb-8 animate-fade-in">
            <span className="text-gold-500 font-bold tracking-widest text-sm">
              BASKETBALL BIOMECHANICS
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-4xl mx-auto leading-tight animate-slide-up">
            Stop Guessing.
            <br />
            <span className="text-gradient-gold">Start Calibrating.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mt-6 animate-fade-in">
            The same methodology that took NBA players from career lows to elite
            efficiency—now available to serious players at every level.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in">
            <Link href="/intake">
              <Button size="xl" className="group">
                Get Your BB Profile
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="secondary" size="xl">
              <Play className="mr-2 w-5 h-5" />
              Watch How It Works
            </Button>
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
              PROVEN RESULTS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              From Career Lows to Elite Efficiency
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These aren&apos;t offseason transformations. These are in-season results
              achieved by changing how players calibrate, not how they look.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caseStudies.map((study, index) => (
              <div key={index} className="animate-fade-in">
                <Card variant="glass" className="h-full overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-gold-500/20 to-transparent flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-bb-card border-2 border-gold-500/30 flex items-center justify-center">
                      <Target className="w-10 h-10 text-gold-500" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white">{study.label}</h3>
                    <p className="text-sm text-gray-400 mb-4">{study.team}</p>

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

      {/* Leaderboard Banner */}
      <section className="py-12 bg-gradient-to-r from-gold-500/10 via-purple-500/10 to-gold-500/10 border-y border-gold-500/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-yellow-600 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">BB Leaderboard</h3>
                <p className="text-gray-400">See where enrolled players rank in proficiency and badges earned</p>
              </div>
            </div>
            <Link href="/leaderboard">
              <Button variant="secondary" size="lg" className="group">
                View Leaderboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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
                Players dominate in practice but fail in games. Traditional coaching
                focuses on <span className="text-white">cosmetic mechanics</span> in
                <span className="text-white"> sterile environments</span>—no pressure,
                no fatigue, no consequences.
              </p>
              <p className="text-gray-400 mb-6">
                They tell you to &quot;tuck your elbow&quot; and &quot;snap your wrist.&quot;
                Research shows this <span className="text-white">internal focus</span> causes
                choking under pressure and relies on conscious control that vanishes in games.
              </p>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="text-red-400 font-semibold">The Result:</span> You&apos;re
                  building &quot;false confidence&quot; with blocked reps that don&apos;t
                  transfer to competition.
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
                We make training <span className="text-white">harder than the game</span>.
                Oversized balls. Visual occlusion. Deep distance. Your nervous system
                learns to function while missing.
              </p>
              <p className="text-gray-400 mb-6">
                When the game arrives, the rim looks huge. Time slows down. Your
                <span className="text-white"> &quot;fight or flight&quot; response quiets</span> because
                you&apos;ve already trained in chaos.
              </p>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">The Result:</span> Skills
                  that actually show up when it matters. Game performance matches practice.
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
              25+ years of research in motor learning, motor control, and movement science.
              Not opinions—peer-reviewed principles applied to basketball.
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

      {/* Protocols Section */}
      <section className="py-20 bg-gradient-to-b from-bb-black to-bb-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-500 font-semibold text-sm tracking-wider">
              THE BB ASSESSMENT
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Protocols That Reveal Truth
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We don&apos;t guess. We assess. Four proprietary protocols that expose
              your limiting factors and create your custom roadmap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {protocols.map((protocol) => (
              <div key={protocol.title} className="animate-fade-in">
                <Card hover className="h-full">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                      {protocol.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {protocol.title}
                      </h3>
                      <p className="text-sm text-gray-400">{protocol.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BB Standard Section */}
      <section className="py-20 bg-bb-dark">
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
                This is not a participation trophy system. You don&apos;t advance
                until you execute the specific energy demands without &quot;bad misses&quot;
                (left/right/short). The standards are objective and non-negotiable.
              </p>

              <div className="space-y-4">
                {[
                  { level: 1, name: 'Foundation', desc: 'Energy Awareness', criteria: '10/14 makes + 7/10 flat flight reps' },
                  { level: 2, name: 'Calibrated', desc: 'Impulse & Precision', criteria: '8/10 rim contacts deep + 3 consecutive back rim' },
                  { level: 3, name: 'Adaptive', desc: 'Constraint Integration', criteria: '7/10 oversized ball gauntlet' },
                  { level: 4, name: 'Master', desc: 'Reflexive Dominance', criteria: '8/10 full spectrum under strobes' },
                ].map((item) => (
                  <div
                    key={item.level}
                    className="flex items-center gap-4 p-4 rounded-lg bg-bb-card border border-bb-border hover:border-gold-500/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-bb-black font-bold text-lg">
                      {item.level}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    <p className="text-xs text-gray-500 max-w-[120px] text-right">{item.criteria}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-in">
              <Card variant="gold" className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  What You Get
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
                  <Link href="/intake">
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

      {/* Testimonials Section */}
      <section className="py-20 bg-bb-black relative overflow-hidden">
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
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-500/10 border-2 border-gold-500/40 flex items-center justify-center shrink-0 overflow-hidden">
                        {testimonial.photo ? (
                          <Image
                            src={testimonial.photo}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-lg font-bold text-gold-500">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <Quote className="w-8 h-8 text-gold-500/30" />
                    </div>
                    <p className="text-white text-lg mb-4 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="border-t border-bb-border pt-4">
                      <p className="text-gold-500 font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.context}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-20 bg-gradient-to-b from-bb-black to-bb-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-white italic animate-fade-in">
            &quot;If you are making every shot in practice, you are wasting your
            time. We calibrate for the miss so we can master the make.&quot;
          </blockquote>
          <p className="text-gold-500 mt-4 font-semibold">
            — Basketball Biomechanics
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-t from-gold-500/10 to-bb-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Out Your BB Level?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the players who stopped guessing and started calibrating.
              Get your personalized shooting profile and custom protocols.
            </p>
            <Link href="/intake">
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
