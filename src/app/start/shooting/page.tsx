'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';
import { Loader2, ChevronDown } from 'lucide-react';

const LEVELS = ['Youth', 'High School', 'College', 'Pro', 'Overseas', 'Coach'];
const POSITIONS = ['Guard', 'Wing', 'Forward', 'Center', 'Coach/Trainer'];
const HOW_HEARD = ['Instagram', 'Referral', 'Google', 'Masterclass', 'Other'];

const FAQ_ITEMS = [
  {
    q: 'What happens after I apply?',
    a: "You'll receive an email within 24 hours with film submission instructions.",
  },
  {
    q: 'Do I need game film?',
    a: "Game film is ideal, but constrained drill footage works too. We'll guide you.",
  },
  {
    q: 'How long until I get my assessment?',
    a: '3-5 business days after we receive your film.',
  },
];

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';

export default function ShootingEvaluationPage() {
  const router = useRouter();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [position, setPosition] = useState('');
  const [threePt, setThreePt] = useState('');
  const [frustration, setFrustration] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full_assessment_application',
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          email,
          phone,
          age: parseInt(age),
          level: currentLevel,
          position,
          currentSituation: `3PT%: ${threePt || 'Unknown'}. Level: ${currentLevel}. Position: ${position}.`,
          biggestProblems: frustration,
          whatTried: '',
          commitmentLevel: 'committed',
          howHeard,
        }),
      });

      if (res.ok) {
        router.push(
          `/start/thank-you?type=shooting&name=${encodeURIComponent(name.split(' ')[0])}`
        );
      } else {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent={false} />

      <div className="pt-24 pb-20 px-4">
        {/* Hero */}
        <div
          ref={heroRef}
          className={`max-w-xl mx-auto text-center mb-10 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-barlow font-extrabold text-white mb-3">
            Start Your Shooting Evaluation
          </h1>
          <p className="text-site-muted">
            Fill out the form below to begin. You&apos;ll receive instructions for film
            submission within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-site-card border border-site-border rounded-xl p-6 sm:p-8 space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </div>

          {/* Age */}
          <div>
            <label className={labelClass}>Age *</label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              className={inputClass}
            />
          </div>

          {/* Current Level */}
          <div>
            <label className={labelClass}>Current Level *</label>
            <select
              required
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className={`${inputClass} ${!currentLevel ? 'text-site-dim' : ''}`}
            >
              <option value="">Select level...</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div>
            <label className={labelClass}>Position *</label>
            <select
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={`${inputClass} ${!position ? 'text-site-dim' : ''}`}
            >
              <option value="">Select position...</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* 3PT% */}
          <div>
            <label className={labelClass}>Current 3PT% if known</label>
            <input
              type="text"
              value={threePt}
              onChange={(e) => setThreePt(e.target.value)}
              placeholder="e.g. 35%"
              className={inputClass}
            />
          </div>

          {/* Frustration */}
          <div>
            <label className={labelClass}>
              What&apos;s your biggest frustration with your shot right now? *
            </label>
            <textarea
              required
              value={frustration}
              onChange={(e) => setFrustration(e.target.value)}
              placeholder="Describe what you're struggling with..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* How Heard */}
          <div>
            <label className={labelClass}>How did you hear about BB? *</label>
            <select
              required
              value={howHeard}
              onChange={(e) => setHowHeard(e.target.value)}
              className={`${inputClass} ${!howHeard ? 'text-site-dim' : ''}`}
            >
              <option value="">Select...</option>
              {HOW_HEARD.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-site-gold w-4 h-4"
            />
            <span className="text-sm text-site-muted">
              I understand this is a $250 evaluation application
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-site-gold hover:bg-site-gold-hover text-site-primary font-barlow font-bold uppercase tracking-wider py-3.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application — $250'
            )}
          </button>
        </form>

        {/* FAQ */}
        <div className="max-w-xl mx-auto mt-12 space-y-3">
          <h2 className="text-lg font-barlow font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border border-site-border rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium text-sm hover:bg-site-card/50 transition-colors"
              >
                {item.q}
                <ChevronDown
                  className={`w-4 h-4 text-site-muted transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-site-muted">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
