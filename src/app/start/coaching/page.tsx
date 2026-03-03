'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';

const LEVELS = ['Youth (Under 14)', 'High School', 'College', 'Pro / G-League / Overseas', 'NBA'];
const POSITIONS = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
const HOW_HEARD = ['Instagram', 'Referral', 'Google', 'Masterclass', 'YouTube', 'Other'];
const COMMITMENT_OPTIONS = ["I'm okay with where I'm at", 'I want to get better', "I'm all in and committed to do whatever it takes"];

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';

export default function CoachingApplicationPage() {
  const router = useRouter();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [position, setPosition] = useState('');
  const [threePt, setThreePt] = useState('');
  const [filmLink, setFilmLink] = useState('');
  const [goals, setGoals] = useState('');
  const [whatTried, setWhatTried] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [canCommit, setCanCommit] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const firstName = fullName.split(' ')[0];
      const lastName = fullName.split(' ').slice(1).join(' ');

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full_assessment_application',
          firstName,
          lastName,
          email,
          phone,
          playerAge: parseInt(age) || undefined,
          playerLevel: currentLevel,
          position,
          currentSituation: [
            threePt ? `3PT%: ${threePt}` : '',
            filmLink ? `Film: ${filmLink}` : '',
            `Commitment level: ${canCommit || 'Not specified'}`,
          ]
            .filter(Boolean)
            .join('. '),
          biggestProblems: goals,
          whatTried,
          commitmentLevel: canCommit === 'Yes' ? 'all_in' : canCommit === 'Need more info' ? 'ready' : 'curious',
          howHeard,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  /* ── Success state ───────────────────────────────────────── */
  if (submitted) {
    return (
      <main className="min-h-screen bg-site-primary font-dm-sans">
        <BBHeader transparent={false} />
        <div className="pt-24 pb-20 px-4">
          <div className="max-w-xl mx-auto text-center pt-20">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-barlow font-extrabold text-white mb-4">
              Application Received
            </h1>
            <p className="text-site-muted text-lg mb-3">
              We review every application personally. You&apos;ll hear from us within 48 hours.
            </p>
            <p className="text-site-dim text-sm mb-10">
              Keep an eye on your inbox for an email from jake@trainwjc.com.
            </p>
            <Link
              href="/"
              className="text-site-gold hover:text-site-gold-hover text-sm transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
        <BBFooter />
      </main>
    );
  }

  /* ── Form ────────────────────────────────────────────────── */
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
            Apply for 1:1 Coaching
          </h1>
          <p className="text-site-muted">
            Tell us about your game. We review every application personally and
            reach out within 48 hours.
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              min="10"
              max="50"
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
                <option key={l} value={l}>{l}</option>
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
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 3PT% */}
          <div>
            <label className={labelClass}>Current 3PT% (if known)</label>
            <input
              type="text"
              value={threePt}
              onChange={(e) => setThreePt(e.target.value)}
              placeholder="e.g. 35%"
              className={inputClass}
            />
          </div>

          {/* Instagram or Film Link */}
          <div>
            <label className={labelClass}>Instagram or Film Link (optional)</label>
            <input
              type="text"
              value={filmLink}
              onChange={(e) => setFilmLink(e.target.value)}
              placeholder="@handle or link to film"
              className={inputClass}
            />
          </div>

          {/* Goals */}
          <div>
            <label className={labelClass}>
              Top 2–3 goals for the next 3 months *
            </label>
            <textarea
              required
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="What do you want to improve or change about your game?"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* What hasn't worked */}
          <div>
            <label className={labelClass}>
              What have you tried that hasn&apos;t worked? *
            </label>
            <textarea
              required
              value={whatTried}
              onChange={(e) => setWhatTried(e.target.value)}
              placeholder="Trainers, programs, YouTube, drills — what didn't stick and why?"
              rows={3}
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
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Commitment */}
          <div>
            <label className={labelClass}>
              What is your commitment level to improving? *
            </label>
            <select
              required
              value={canCommit}
              onChange={(e) => setCanCommit(e.target.value)}
              className={`${inputClass} ${!canCommit ? 'text-site-dim' : ''}`}
            >
              <option value="">Select...</option>
              {COMMITMENT_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

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
              'Submit Application'
            )}
          </button>
        </form>

        {/* Shooting eval link */}
        <div className="max-w-xl mx-auto mt-10 text-center">
          <p className="text-sm text-site-dim">
            Just need your shot calibrated?{' '}
            <Link
              href="/player-info"
              className="text-site-gold hover:text-site-gold-hover transition-colors"
            >
              Get the Shooting Evaluation ($250)
            </Link>
          </p>
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
