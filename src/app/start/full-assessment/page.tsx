'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Zap } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';

const PLAYER_LEVELS = [
  { value: 'youth', label: 'Youth (Under 14)' },
  { value: 'high_school', label: 'High School' },
  { value: 'college', label: 'College' },
  { value: 'pro', label: 'Pro / G-League / Overseas' },
  { value: 'nba', label: 'NBA' },
];

const COMMITMENT_LEVELS = [
  { value: 'curious', label: 'Just curious' },
  { value: 'ready', label: 'Ready to invest' },
  { value: 'all_in', label: 'All in' },
];

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';

export default function FullAssessmentPage() {
  const router = useRouter();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [playerAge, setPlayerAge] = useState('');
  const [playerLevel, setPlayerLevel] = useState('');
  const [position, setPosition] = useState('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [biggestProblems, setBiggestProblems] = useState('');
  const [whatTried, setWhatTried] = useState('');
  const [commitmentLevel, setCommitmentLevel] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
          firstName,
          lastName,
          email,
          phone,
          playerAge: parseInt(playerAge) || undefined,
          playerLevel,
          position,
          currentSituation,
          biggestProblems,
          whatTried,
          commitmentLevel,
        }),
      });

      if (res.ok) {
        router.push(
          `/start/thank-you?type=full-assessment&name=${encodeURIComponent(firstName)}`
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
          <div className="w-16 h-16 rounded-full bg-site-gold/20 flex items-center justify-center mx-auto mb-5">
            <Zap className="w-8 h-8 text-site-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-barlow font-extrabold text-white mb-3">
            BB Full Assessment Application
          </h1>
          <p className="text-site-muted">
            Apply for the 3-month BB Mentorship. This covers movement, deception,
            and shooting transformation — every dimension of your game.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-site-card border border-site-border rounded-xl p-6 sm:p-8 space-y-5"
        >
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className={inputClass}
              />
            </div>
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

          {/* Age & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                min="8"
                max="50"
                value={playerAge}
                onChange={(e) => setPlayerAge(e.target.value)}
                placeholder="16"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Level *</label>
              <select
                required
                value={playerLevel}
                onChange={(e) => setPlayerLevel(e.target.value)}
                className={`${inputClass} ${!playerLevel ? 'text-site-dim' : ''}`}
              >
                <option value="">Select level...</option>
                {PLAYER_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Position & Current Situation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Primary Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="PG, SG, SF..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Current Situation</label>
              <input
                type="text"
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                placeholder="HS varsity, JUCO, Euro pro..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Biggest problems */}
          <div>
            <label className={labelClass}>
              What are the 2–3 biggest problems holding your game back? *
            </label>
            <textarea
              required
              value={biggestProblems}
              onChange={(e) => setBiggestProblems(e.target.value)}
              placeholder="Be specific. e.g., 'I can't create separation off the dribble', 'I freeze under pressure', 'My shot is inconsistent from game to game'..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* What they've tried */}
          <div>
            <label className={labelClass}>
              What have you already tried to fix it?
            </label>
            <textarea
              value={whatTried}
              onChange={(e) => setWhatTried(e.target.value)}
              placeholder="e.g., worked with trainers, watched YouTube, did shooting drills..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Commitment level */}
          <div>
            <label className={labelClass}>
              How serious are you about investing in your development over the next
              3–6 months? *
            </label>
            <div className="space-y-2">
              {COMMITMENT_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    commitmentLevel === level.value
                      ? 'border-site-gold bg-site-gold/10'
                      : 'border-site-border hover:border-site-border/80 bg-site-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="commitmentLevel"
                    value={level.value}
                    checked={commitmentLevel === level.value}
                    onChange={(e) => setCommitmentLevel(e.target.value)}
                    className="sr-only"
                    required
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      commitmentLevel === level.value
                        ? 'border-site-gold'
                        : 'border-site-dim'
                    }`}
                  >
                    {commitmentLevel === level.value && (
                      <div className="w-2 h-2 rounded-full bg-site-gold" />
                    )}
                  </div>
                  <span className="text-white text-sm">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 bg-site-secondary border border-site-border rounded-lg">
            <p className="text-sm text-site-muted">
              <span className="text-white font-medium">
                This is an application, not a purchase.
              </span>{' '}
              We review every application and reach out within 24–48 hours to
              discuss if the BB Mentorship is the right fit.
            </p>
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
              href="/start/shooting"
              className="text-site-gold hover:text-site-gold-hover transition-colors"
            >
              Get the BB Shooting Evaluation ($250)
            </Link>
          </p>
        </div>
      </div>

      <BBFooter />
    </main>
  );
}
