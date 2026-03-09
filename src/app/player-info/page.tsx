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
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal(0.05);

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
            1:1 Coaching
          </h1>
          <p className="text-site-muted text-lg max-w-xl mx-auto mt-4">
            The full BB experience. We assess every dimension of your game — shooting,
            movement, and deception — then build a custom program to transform how you play.
          </p>
        </div>

        {/* ── Single Card ─────────────────────────────────────────── */}
        <div
          ref={cardRef}
          className={`max-w-xl mx-auto transition-all duration-700 ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-site-card border border-site-gold/20 rounded-2xl p-7 sm:p-8 flex flex-col glow-site-gold-sm">
            {/* Badge */}
            <div className="mb-5">
              <span className="px-3 py-1 bg-site-gold/15 text-site-gold text-xs font-bold uppercase tracking-wider rounded-full border border-site-gold/30">
                Now Open
              </span>
            </div>

            <h2 className="font-barlow font-extrabold text-2xl text-white mb-2">
              1:1 Coaching Program
            </h2>
            <p className="text-site-muted text-sm leading-relaxed mb-6">
              We assess every dimension of your game — shooting, movement, and deception —
              then build a 3-month custom program to transform how you play.
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
              className="block w-full text-center font-barlow font-bold text-sm tracking-wider uppercase bg-site-gold hover:bg-site-gold-hover text-site-primary px-6 py-4 rounded-lg transition-all glow-site-gold-sm hover:glow-site-gold"
            >
              Apply for 1:1 Coaching →
            </Link>
          </div>
        </div>

        {/* ── Bottom note ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-site-dim text-sm">
            Have questions?{' '}
            <Link href="/inquiry" className="text-site-gold hover:underline">
              Reach out to our team
            </Link>
            {' '}— we&apos;re happy to help.
          </p>
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
