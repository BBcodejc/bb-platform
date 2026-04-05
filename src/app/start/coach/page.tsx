'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, GraduationCap } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';

const COACHING_ROLES = [
  { value: 'trainer', label: 'Skills Trainer' },
  { value: 'hs_coach', label: 'High School Coach' },
  { value: 'college_staff', label: 'College Staff' },
  { value: 'pro_staff', label: 'Pro Staff' },
  { value: 'academy', label: 'Academy / AAU Coach' },
  { value: 'other', label: 'Other' },
];

const PLAYER_LEVELS_WORK_WITH = [
  { value: 'youth', label: 'Youth' },
  { value: 'high_school', label: 'High School' },
  { value: 'college', label: 'College' },
  { value: 'pro', label: 'Pro' },
  { value: 'mixed', label: 'Mixed levels' },
];

const INVESTMENT_INTEREST = [
  { value: 'yes', label: 'Yes' },
  { value: 'possibly', label: 'Possibly' },
  { value: 'no', label: 'No' },
];

// Validation helpers — catches password manager garbage
function isValidPhone(val: string): boolean {
  if (!val) return true;
  const digits = val.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[\d\s\-().+]+$/.test(val);
}
function looksLikeGarbage(val: string): boolean {
  if (!val || val.length < 6) return false;
  const hasNoSpaces = !val.includes(' ');
  const hasMixedCase = /[a-z]/.test(val) && /[A-Z]/.test(val);
  const isAlphaOnly = /^[a-zA-Z]+$/.test(val);
  return hasNoSpaces && hasMixedCase && isAlphaOnly && val.length > 8;
}

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';

export default function CoachCertificationPage() {
  const router = useRouter();
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [coachingRole, setCoachingRole] = useState('');
  const [yearsCoaching, setYearsCoaching] = useState('');
  const [playerLevelWorkWith, setPlayerLevelWorkWith] = useState('');
  const [whyInterested, setWhyInterested] = useState('');
  const [currentTrainingStyle, setCurrentTrainingStyle] = useState('');
  const [investmentInterest, setInvestmentInterest] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone — catch password manager garbage
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone number (digits, dashes, and parentheses only).');
      return;
    }
    if (looksLikeGarbage(phone) || looksLikeGarbage(whyInterested)) {
      setError('Some fields appear to have been auto-filled incorrectly. Please clear and re-enter your information.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'coach_cert_application',
          firstName,
          lastName,
          email,
          phone,
          location,
          coachingRole,
          yearsCoaching,
          playerLevelWorkWith,
          whyInterested,
          currentTrainingStyle,
          investmentInterest,
        }),
      });

      if (res.ok) {
        router.push(
          `/start/thank-you?type=coach&name=${encodeURIComponent(firstName)}`
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
            <GraduationCap className="w-8 h-8 text-site-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-barlow font-extrabold text-white mb-3">
            BB Coach Certification
          </h1>
          <p className="text-site-muted">
            Learn the BB lens and get certified to use it with your players.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          data-form-type="other"
          className="max-w-xl mx-auto bg-site-card border border-site-border rounded-xl p-6 sm:p-8 space-y-5"
        >
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name *</label>
              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
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
                name="lastName"
                autoComplete="family-name"
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
              name="email"
              autoComplete="email"
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
              name="phone"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>City / Country</label>
            <input
              type="text"
              name="location"
              autoComplete="address-level2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Los Angeles, CA"
              className={inputClass}
            />
          </div>

          {/* Coaching role & years */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Coaching Role *</label>
              <select
                name="coachingRole"
                autoComplete="off"
                required
                value={coachingRole}
                onChange={(e) => setCoachingRole(e.target.value)}
                className={`${inputClass} ${!coachingRole ? 'text-site-dim' : ''}`}
              >
                <option value="">Select role...</option>
                {COACHING_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Years Coaching</label>
              <input
                type="number"
                name="yearsCoaching"
                autoComplete="off"
                min="0"
                max="50"
                value={yearsCoaching}
                onChange={(e) => setYearsCoaching(e.target.value)}
                placeholder="5"
                className={inputClass}
              />
            </div>
          </div>

          {/* Who they work with */}
          <div>
            <label className={labelClass}>Who do you mainly work with?</label>
            <select
              name="playerLevel"
              autoComplete="off"
              value={playerLevelWorkWith}
              onChange={(e) => setPlayerLevelWorkWith(e.target.value)}
              className={`${inputClass} ${!playerLevelWorkWith ? 'text-site-dim' : ''}`}
            >
              <option value="">Select level...</option>
              {PLAYER_LEVELS_WORK_WITH.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Why interested */}
          <div>
            <label className={labelClass}>
              Why are you interested in the Basketball Biomechanics lens? *
            </label>
            <textarea
              name="whyInterested"
              autoComplete="off"
              required
              value={whyInterested}
              onChange={(e) => setWhyInterested(e.target.value)}
              placeholder="What drew you to BB? What are you hoping to learn or change about how you train players?"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Current training style */}
          <div>
            <label className={labelClass}>
              How do you currently train players? (describe a typical session)
            </label>
            <textarea
              name="trainingStyle"
              autoComplete="off"
              value={currentTrainingStyle}
              onChange={(e) => setCurrentTrainingStyle(e.target.value)}
              placeholder="e.g., warm-up, form shooting, game shots, 1v1, etc."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Investment interest */}
          <div>
            <label className={labelClass}>
              Are you open to investing in a mentorship / certification if
              there&apos;s a good fit?
            </label>
            <div className="flex gap-3">
              {INVESTMENT_INTEREST.map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 text-center p-3.5 rounded-lg border cursor-pointer transition-all ${
                    investmentInterest === option.value
                      ? 'border-site-gold bg-site-gold/10'
                      : 'border-site-border hover:border-site-border/80 bg-site-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="investmentInterest"
                    value={option.value}
                    checked={investmentInterest === option.value}
                    onChange={(e) => setInvestmentInterest(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-white text-sm">{option.label}</span>
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
              We&apos;ll review your profile and reach out to discuss next steps
              for BB Certification.
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
            Need to test the methodology on yourself first?{' '}
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
