'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/lib/hooks';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';

/* ─── check icon ───────────────────────────────────────────────────────── */
function Check() {
  return (
    <svg
      className="w-4 h-4 text-site-gold shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─── page ──────────────────────────────────────────────────────────────── */
export default function PlayerInfoPage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal(0.05);

  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent={false} />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        {/* ── Headline ──────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          className={`max-w-3xl mx-auto text-center pt-12 mb-14 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="font-barlow font-bold text-site-gold text-xs tracking-[0.2em] uppercase">
            For Players
          </span>
          <h1 className="font-barlow font-extrabold text-3xl sm:text-4xl md:text-5xl text-white mt-4 leading-tight">
            Choose Your Path
          </h1>
          <p className="text-site-muted text-lg max-w-xl mx-auto mt-4">
            Whether you need your shot calibrated or a complete game transformation,
            we have a program built for you.
          </p>
        </div>

        {/* ── Two Cards ─────────────────────────────────────────────── */}
        <div
          ref={cardsRef}
          className={`max-w-5xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* ── Card 1: Shooting Evaluation ──────────────────────── */}
          <div className="bg-site-card border border-site-gold/20 rounded-2xl p-7 sm:p-8 flex flex-col glow-site-gold-sm">
            {/* Badge + Price */}
            <div className="flex items-center justify-between mb-5">
              <span className="px-3 py-1 bg-site-gold/15 text-site-gold text-xs font-bold uppercase tracking-wider rounded-full border border-site-gold/30">
                Most Popular
              </span>
              <span className="font-barlow font-extrabold text-2xl text-white">$250</span>
            </div>

            <h2 className="font-barlow font-extrabold text-2xl text-white mb-2">
              Shooting Evaluation
            </h2>
            <p className="text-site-muted text-sm leading-relaxed mb-6">
              Get your personalized BB Shooting Profile. We assess your miss patterns,
              energy system, and deep-distance calibration to build a custom shooting
              protocol that actually works.
            </p>

            {/* What's included */}
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              What&apos;s Included
            </h3>
            <ul className="space-y-2.5 mb-8 flex-1">
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Full BB Lens shooting assessment via film breakdown</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Written BB Shooting Profile (miss patterns, energy diagnosis, limiting factors)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">7-day calibration plan based on YOUR specific constraints</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">BB Standard levels 1–4 tracking &amp; progression benchmarks</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Film submission instructions sent within 24 hours of payment</span>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/shooting-evaluation/intake"
              className="block w-full text-center font-barlow font-bold text-sm tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-6 py-4 rounded-lg transition-all glow-site-gold-sm hover:glow-site-gold"
            >
              Get Your Shooting Evaluation — $250
            </Link>
          </div>

          {/* ── Card 2: 1:1 Coaching ─────────────────────────────── */}
          <div className="bg-site-card border border-site-border rounded-2xl p-7 sm:p-8 flex flex-col">
            {/* Badge */}
            <div className="mb-5">
              <span className="px-3 py-1 bg-white/5 text-site-muted text-xs font-bold uppercase tracking-wider rounded-full border border-site-border">
                Application
              </span>
            </div>

            <h2 className="font-barlow font-extrabold text-2xl text-white mb-2">
              1:1 Coaching
            </h2>
            <p className="text-site-muted text-sm leading-relaxed mb-6">
              The full BB experience. We assess every dimension of your game — shooting,
              movement, and deception — then build a 3-month custom program to transform
              how you play.
            </p>

            {/* What's included */}
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              What&apos;s Included
            </h3>
            <ul className="space-y-2.5 mb-8 flex-1">
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Full BB Lens assessment across all domains (shooting, movement, deception)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Custom weekly programming tailored to your limiting factors</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Weekly video reviews with detailed feedback</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Monthly 1-on-1 coaching calls + group calls</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">Equipment guidance &amp; constraint recommendations</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check />
                <span className="text-white/80 text-sm">3-month commitment with progression benchmarks</span>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/start/coaching"
              className="block w-full text-center font-barlow font-bold text-sm tracking-wider uppercase border-2 border-site-gold text-site-gold hover:bg-site-gold hover:text-site-primary px-6 py-4 rounded-lg transition-all"
            >
              Apply for 1:1 Coaching
            </Link>
          </div>
        </div>

        {/* ── Bottom note ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-site-dim text-sm">
            Not sure which is right?{' '}
            <span className="text-site-muted">
              Start with the Shooting Evaluation — you can always upgrade to 1:1 Coaching later.
            </span>
          </p>
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
