import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for 1:1 Coaching | Basketball Biomechanics',
  description:
    'Apply to be coached through the Basketball Biomechanics lens. The same research-driven system used with NBA players, college athletes, and serious competitors.',
};

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-bb-black text-white">
      {/* Minimal Header */}
      <header className="w-full pt-8 pb-4">
        <div className="max-w-2xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/players/bb-logo.png"
              alt="BB"
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-gold-500 font-bold text-xs tracking-wider group-hover:text-gold-400 transition-colors">
              BASKETBALL BIOMECHANICS
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            This is not a training program.
            <br />
            <span className="text-gradient-gold">This is system integration.</span>
          </h1>
        </div>
      </section>

      {/* Body Copy */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <p className="text-gray-400 text-lg leading-relaxed">
            You&apos;re applying to be coached through the Basketball Biomechanics lens. The same
            research-driven system used with NBA players, college athletes, and serious high school
            competitors who want real change in how they move, shoot, and see the game.
          </p>
          <p className="text-white text-lg leading-relaxed font-medium">
            We review every application. Not everyone gets in.
          </p>
        </div>
      </section>

      {/* What We Expect */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-8">What we expect from you:</h2>
          <div className="space-y-5">
            <p className="text-gray-300 text-lg leading-relaxed">
              You&apos;re done chasing perfect form and ready to explore calibration.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              You&apos;re willing to train perception, movement, and decision-making as one system.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              You&apos;ll show up to structured protocols consistently.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              You take full ownership of your development.
            </p>
          </div>
          <p className="text-gray-400 text-lg mt-10">If that&apos;s you, continue below.</p>
        </div>
      </section>

      {/* Proof Section */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Tobias Harris */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/players/tobiasharrislandingpage.webp"
                  alt="Tobias Harris"
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-14 h-14"
                />
                <div>
                  <p className="text-white font-semibold">Tobias Harris</p>
                  <p className="text-gray-500 text-sm">NBA Forward</p>
                </div>
              </div>
              <p className="text-gold-500 font-bold text-lg mb-3">
                29% → 47% 3PT% in &lt; 100 days
              </p>
              <p className="text-gray-400 text-sm italic">
                &quot;Coach Tempesta&apos;s brain is like AI.&quot;
              </p>
            </div>

            {/* Tyler Burton */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/players/tylerburtonlandingpage.jpg"
                  alt="Tyler Burton"
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-14 h-14"
                />
                <div>
                  <p className="text-white font-semibold">Tyler Burton</p>
                  <p className="text-gray-500 text-sm">Villanova / G-League</p>
                </div>
              </div>
              <p className="text-gold-500 font-bold text-lg mb-3">
                29% → 43% 3PT% in-season
              </p>
              <p className="text-gray-400 text-sm italic">
                &quot;You&apos;re the smartest basketball coach I&apos;ve ever been around.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-4 pb-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Link href="/apply">
            <Button size="xl" className="text-lg px-12">
              Continue Application →
            </Button>
          </Link>
          <p className="text-gray-500 text-sm mt-5">
            Spots are limited. Applications are reviewed to ensure fit.
          </p>
        </div>
      </section>
    </main>
  );
}
