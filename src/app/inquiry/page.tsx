'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';

const COACHING_LEVELS = ['Youth', 'High School', 'College', 'Pro', 'Private Trainer'];
const HOW_HEARD = ['Instagram', 'Referral', 'Google', 'Masterclass', 'Other'];

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';

export default function InquiryPage() {
  const router = useRouter();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const [activeTab, setActiveTab] = useState<'coach' | 'organization'>('coach');

  // Coach form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');
  const [years, setYears] = useState('');
  const [goals, setGoals] = useState('');
  const [howHeard, setHowHeard] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTabSwitch = (tab: 'coach' | 'organization') => {
    if (tab === 'organization') {
      router.push('/start/organization');
      return;
    }
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'coach_cert_application',
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          email,
          phone,
          coachRole: level,
          yearsCoaching: years,
          whyInterested: goals,
          howHeard,
        }),
      });

      if (res.ok) {
        router.push(
          `/start/thank-you?type=coach&name=${encodeURIComponent(name.split(' ')[0])}`
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
            Tell Us About Your Situation
          </h1>
          <p className="text-site-muted">
            Whether you&apos;re a coach seeking deeper understanding or an organization
            looking to install BB — start here.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="max-w-xl mx-auto flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => handleTabSwitch('coach')}
            className={`flex-1 py-3 rounded-lg font-barlow font-bold text-sm uppercase tracking-wider transition-colors ${
              activeTab === 'coach'
                ? 'bg-site-gold text-site-primary'
                : 'border border-site-border text-site-muted hover:text-white'
            }`}
          >
            Coach
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('organization')}
            className={`flex-1 py-3 rounded-lg font-barlow font-bold text-sm uppercase tracking-wider transition-colors ${
              activeTab === 'organization'
                ? 'bg-site-gold text-site-primary'
                : 'border border-site-border text-site-muted hover:text-white'
            }`}
          >
            Organization
          </button>
        </div>

        {/* Coach Form */}
        {activeTab === 'coach' && (
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

            {/* Coaching Level */}
            <div>
              <label className={labelClass}>Coaching Level *</label>
              <select
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={`${inputClass} ${!level ? 'text-site-dim' : ''}`}
              >
                <option value="">Select level...</option>
                {COACHING_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Years Coaching */}
            <div>
              <label className={labelClass}>Years Coaching</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="Number of years"
                className={inputClass}
              />
            </div>

            {/* Goals */}
            <div>
              <label className={labelClass}>
                What are you looking to learn or solve? *
              </label>
              <textarea
                required
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Describe what you're looking for..."
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
                'Submit Inquiry'
              )}
            </button>
          </form>
        )}
      </div>

      <BBFooter />
    </main>
  );
}
