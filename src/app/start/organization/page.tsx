'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';

const ORG_LEVELS = ['Pro', 'College', 'High School', 'Academy', 'AAU', 'Other'];
const HOW_HEARD = ['Instagram', 'Referral', 'Google', 'Masterclass', 'Other'];

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';

export default function OrganizationInquiryPage() {
  const router = useRouter();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [rosterSize, setRosterSize] = useState('');
  const [goals, setGoals] = useState('');
  const [howHeard, setHowHeard] = useState('');

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
          type: 'organization_inquiry',
          firstName: contactName.split(' ')[0],
          lastName: contactName.split(' ').slice(1).join(' '),
          email,
          phone,
          orgName,
          orgType: level,
          playerCount: rosterSize,
          currentChallenge: goals,
          howHeard,
          role,
        }),
      });

      if (res.ok) {
        router.push(
          `/start/thank-you?type=organization&name=${encodeURIComponent(contactName.split(' ')[0])}`
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
            Bring BB To Your Program
          </h1>
          <p className="text-site-muted">
            For colleges, pro teams, academies, and serious high school programs.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          data-form-type="other"
          className="max-w-xl mx-auto bg-site-card border border-site-border rounded-xl p-6 sm:p-8 space-y-5"
        >
          {/* Organization Name */}
          <div>
            <label className={labelClass}>Organization Name *</label>
            <input
              type="text"
              name="org-name"
              autoComplete="organization"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Team or program name"
              className={inputClass}
            />
          </div>

          {/* Contact Name */}
          <div>
            <label className={labelClass}>Contact Name *</label>
            <input
              type="text"
              name="contact-name"
              autoComplete="name"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.com"
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone *</label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </div>

          {/* Role/Title */}
          <div>
            <label className={labelClass}>Role / Title</label>
            <input
              type="text"
              name="role"
              autoComplete="organization-title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Head Coach, Director of Player Development"
              className={inputClass}
            />
          </div>

          {/* Organization Level */}
          <div>
            <label className={labelClass}>Organization Level *</label>
            <select
              name="org-level"
              autoComplete="off"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={`${inputClass} ${!level ? 'text-site-dim' : ''}`}
            >
              <option value="">Select level...</option>
              {ORG_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Roster Size */}
          <div>
            <label className={labelClass}>Roster Size</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="roster-size"
              autoComplete="off"
              value={rosterSize}
              onChange={(e) => setRosterSize(e.target.value)}
              placeholder="Number of players"
              className={inputClass}
            />
          </div>

          {/* Goals */}
          <div>
            <label className={labelClass}>What are you looking to address? *</label>
            <textarea
              name="goals"
              autoComplete="off"
              required
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Describe what your program needs..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* How Heard */}
          <div>
            <label className={labelClass}>How did you hear about BB? *</label>
            <select
              name="how-heard"
              autoComplete="off"
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
      </div>

      <BBFooter />
    </main>
  );
}
