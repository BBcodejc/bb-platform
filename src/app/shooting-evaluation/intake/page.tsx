'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader2, ChevronRight, ChevronLeft, Target, Dumbbell, Video, Brain, ShieldCheck } from 'lucide-react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';
import { useScrollReveal } from '@/lib/hooks';

/* ─── constants ────────────────────────────────────────────────────────── */

const LEVELS = [
  { value: 'middle_school', label: 'Middle School' },
  { value: 'high_school', label: 'High School' },
  { value: 'prep_juco', label: 'Prep / JUCO' },
  { value: 'college', label: 'College' },
  { value: 'pro_overseas', label: 'Pro / G-League / Overseas' },
  { value: 'rec', label: 'Recreational / Men\'s League' },
];

const POSITIONS = [
  { value: 'PG', label: 'Point Guard' },
  { value: 'SG', label: 'Shooting Guard' },
  { value: 'SF', label: 'Small Forward' },
  { value: 'PF', label: 'Power Forward' },
  { value: 'C', label: 'Center' },
  { value: 'combo_guard', label: 'Combo Guard' },
  { value: 'combo_forward', label: 'Combo Forward' },
];

const TRAINING_DAYS = [
  { value: '1_2', label: '1–2 days' },
  { value: '3_4', label: '3–4 days' },
  { value: '5_6', label: '5–6 days' },
  { value: 'daily', label: 'Every day' },
];

const COURT_ACCESS = [
  { value: 'full_gym', label: 'Full gym with regulation court' },
  { value: 'school_gym', label: 'School / rec center gym (scheduled)' },
  { value: 'outdoor', label: 'Outdoor court' },
  { value: 'limited', label: 'Limited / inconsistent access' },
];

const SEASON_STATUS = [
  { value: 'in_season', label: 'Currently in-season' },
  { value: 'offseason', label: 'Off-season' },
  { value: 'between', label: 'Between seasons (transitioning)' },
  { value: 'no_team', label: 'Not on a team right now' },
];

const STEPS = [
  { id: 'context', title: 'Player Context', icon: Target },
  { id: 'environment', title: 'Environment', icon: Dumbbell },
  { id: 'video', title: 'Video Prep', icon: Video },
  { id: 'expectation', title: 'Expectations', icon: Brain },
  { id: 'confirm', title: 'Confirm', icon: ShieldCheck },
];

/* ─── shared styles ───────────────────────────────────────────────────── */

const inputClass =
  'w-full bg-site-primary border border-site-border rounded-lg px-4 py-3 text-white placeholder:text-site-dim focus:border-site-gold/50 focus:outline-none focus:ring-1 focus:ring-site-gold/30 transition-colors';
const labelClass = 'block text-sm text-site-muted mb-1.5 font-medium';
const sectionTitleClass = 'font-barlow font-extrabold text-2xl text-white mb-1';
const sectionSubClass = 'text-site-muted text-sm mb-6';

/* ─── radio card component ────────────────────────────────────────────── */

function RadioCard({
  name,
  value,
  selected,
  onChange,
  label,
}: {
  name: string;
  value: string;
  selected: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const isActive = selected === value;
  return (
    <label
      className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
        isActive
          ? 'border-site-gold bg-site-gold/10'
          : 'border-site-border hover:border-site-border/80 bg-site-primary'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isActive}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          isActive ? 'border-site-gold' : 'border-site-dim'
        }`}
      >
        {isActive && <div className="w-2 h-2 rounded-full bg-site-gold" />}
      </div>
      <span className="text-white text-sm">{label}</span>
    </label>
  );
}

/* ─── checkbox component ──────────────────────────────────────────────── */

function CheckItem({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
      checked
        ? 'border-site-gold bg-site-gold/10'
        : 'border-site-border hover:border-site-border/80 bg-site-primary'
    }`}>
      <div className="mt-0.5">
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            checked ? 'border-site-gold bg-site-gold' : 'border-site-dim'
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-site-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-white/90 text-sm leading-relaxed">{children}</span>
    </label>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function ShootingEvalIntakePage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();

  // Current step (0-indexed)
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  // ── Section 1: Player Context ──
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');

  // ── Section 2: Environment & Commitment ──
  const [trainingDays, setTrainingDays] = useState('');
  const [courtAccess, setCourtAccess] = useState('');
  const [seasonStatus, setSeasonStatus] = useState('');

  // ── Section 3: Video Submission Prep ──
  const [canSubmitVideo, setCanSubmitVideo] = useState('');
  const [hasGameFilm, setHasGameFilm] = useState('');

  // ── Section 4: Expectation Framing ──
  const [openToUncomfortable, setOpenToUncomfortable] = useState('');
  const [quickFixOrDeep, setQuickFixOrDeep] = useState('');

  // ── Section 5: Confirmation ──
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [confirm3, setConfirm3] = useState(false);

  // ── State ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Scroll to form top on step change
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // ── Validation per step ──
  const validateStep = (s: number): string | null => {
    switch (s) {
      case 0:
        if (!firstName.trim()) return 'First name is required';
        if (!lastName.trim()) return 'Last name is required';
        if (!email.trim()) return 'Email is required';
        if (!age.trim()) return 'Age is required';
        if (!level) return 'Please select your current level';
        return null;
      case 1:
        if (!trainingDays) return 'Please select your training frequency';
        if (!courtAccess) return 'Please select your court access';
        if (!seasonStatus) return 'Please select your season status';
        return null;
      case 2:
        if (!canSubmitVideo) return 'Please indicate if you can submit video';
        return null;
      case 3:
        if (!openToUncomfortable) return 'Please answer the method question';
        if (!quickFixOrDeep) return 'Please select what you\'re looking for';
        return null;
      case 4:
        if (!confirm1 || !confirm2 || !confirm3) return 'Please confirm all three statements to proceed';
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      // Save to prospects table via /api/intake
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'player',
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          playerAge: parseInt(age) || undefined,
          playerLevel: level,
          playerLocation: team || undefined,
          playerInstagram: undefined,
          daysPerWeek: trainingDays,
          playerLookingFor: 'personal_evaluation',
          investmentLevel: 'moderate',
          gameVsWorkout: [
            `Court access: ${COURT_ACCESS.find(c => c.value === courtAccess)?.label || courtAccess}`,
            `Season: ${SEASON_STATUS.find(s => s.value === seasonStatus)?.label || seasonStatus}`,
            `Can submit video: ${canSubmitVideo === 'yes' ? 'Yes' : 'No'}`,
            `Has game film: ${hasGameFilm === 'yes' ? 'Yes' : hasGameFilm === 'some' ? 'Some clips' : 'No'}`,
            `Open to uncomfortable methods: ${openToUncomfortable === 'yes' ? 'Yes' : 'Somewhat'}`,
            `Looking for: ${quickFixOrDeep === 'deep' ? 'Deep understanding' : quickFixOrDeep === 'both' ? 'Both quick wins and depth' : 'Quick improvement'}`,
          ].join(' | '),
          playerProblem: undefined,
          workoutStyle: undefined,
          playerMainGoal: undefined,
          threePtPercentage: undefined,
          routingRecommendation: 'shooting_eval_payment',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.details || 'Failed to save your information. Please try again.');
      }
      const prospectId = data.prospectId;

      // Redirect to Stripe payment with client_reference_id so webhook can link payment to prospect
      const paymentUrl = new URL('https://buy.stripe.com/eVq5kD0x56EG7Kc6xD9AA0b');
      if (prospectId) {
        paymentUrl.searchParams.set('client_reference_id', prospectId);
      }
      window.location.href = paymentUrl.toString();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const allConfirmed = confirm1 && confirm2 && confirm3;
  const CurrentIcon = STEPS[step].icon;

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-site-primary font-dm-sans">
      <BBHeader transparent={false} />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          className={`max-w-2xl mx-auto text-center pt-8 mb-10 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="font-barlow font-bold text-site-gold text-xs tracking-[0.2em] uppercase">
            BB Shooting Evaluation
          </span>
          <h1 className="font-barlow font-extrabold text-3xl sm:text-4xl text-white mt-3 mb-3">
            Before We Calibrate Your Shot
          </h1>
          <p className="text-site-muted max-w-lg mx-auto">
            This is not a generic form. We need to understand your environment, your
            constraints, and your readiness — so your evaluation is actually useful.
          </p>
        </div>

        {/* ── Progress Bar ───────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (i < step) {
                      setError('');
                      setStep(i);
                    }
                  }}
                  disabled={i > step}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 transition-all ${
                    i > step ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-site-gold text-site-primary'
                        : isDone
                        ? 'bg-site-gold/20 text-site-gold'
                        : 'bg-site-card text-site-dim border border-site-border'
                    }`}
                  >
                    {isDone ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium tracking-wide ${
                      isActive ? 'text-site-gold' : isDone ? 'text-site-muted' : 'text-site-dim'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Progress line */}
          <div className="h-1 bg-site-card rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-site-gold rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ── Form Card ──────────────────────────────────────────── */}
        <div
          ref={formRef}
          className="max-w-2xl mx-auto bg-site-card border border-site-border rounded-xl p-6 sm:p-8"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-site-gold/15 flex items-center justify-center">
              <CurrentIcon className="w-5 h-5 text-site-gold" />
            </div>
            <div>
              <p className="text-xs text-site-gold font-bold tracking-wider uppercase">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="font-barlow font-extrabold text-xl text-white">
                {STEPS[step].title}
              </h2>
            </div>
          </div>

          {/* ── Step 0: Player Context ─────────────────────────── */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <p className={sectionSubClass}>
                We need to know who you are and where you play so we can build an
                evaluation protocol that matches your reality.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
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
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>
              </div>

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

              <div>
                <label className={labelClass}>Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Age *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="50"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={`${inputClass} ${!position ? 'text-site-dim' : ''}`}
                  >
                    <option value="">Select...</option>
                    {POSITIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Current Level *</label>
                <select
                  required
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={`${inputClass} ${!level ? 'text-site-dim' : ''}`}
                >
                  <option value="">Select level...</option>
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Team / Program (optional)</label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="e.g., Lincoln High Varsity, Ohio State, Ignite..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* ── Step 1: Environment & Commitment ──────────────── */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <p className={sectionSubClass}>
                Your training environment directly affects what protocol we prescribe.
                A player with daily gym access and no game schedule gets a different
                plan than someone in-season with limited court time.
              </p>

              <div>
                <label className={labelClass}>How many days per week do you currently train? *</label>
                <div className="space-y-2">
                  {TRAINING_DAYS.map((opt) => (
                    <RadioCard
                      key={opt.value}
                      name="trainingDays"
                      value={opt.value}
                      selected={trainingDays}
                      onChange={setTrainingDays}
                      label={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>What does your court access look like? *</label>
                <div className="space-y-2">
                  {COURT_ACCESS.map((opt) => (
                    <RadioCard
                      key={opt.value}
                      name="courtAccess"
                      value={opt.value}
                      selected={courtAccess}
                      onChange={setCourtAccess}
                      label={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Where are you in your season right now? *</label>
                <div className="space-y-2">
                  {SEASON_STATUS.map((opt) => (
                    <RadioCard
                      key={opt.value}
                      name="seasonStatus"
                      value={opt.value}
                      selected={seasonStatus}
                      onChange={setSeasonStatus}
                      label={opt.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Video Submission Prep ─────────────────── */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <p className={sectionSubClass}>
                After payment, you&apos;ll receive instructions for submitting shooting
                video. This is how we build your BB Shooting Profile — we need to
                see your shot, not just hear about it.
              </p>

              <div>
                <label className={labelClass}>
                  Can you record and submit video of yourself shooting within 48 hours of payment? *
                </label>
                <div className="space-y-2">
                  <RadioCard
                    name="canSubmitVideo"
                    value="yes"
                    selected={canSubmitVideo}
                    onChange={setCanSubmitVideo}
                    label="Yes — I can film and send within 48 hours"
                  />
                  <RadioCard
                    name="canSubmitVideo"
                    value="need_time"
                    selected={canSubmitVideo}
                    onChange={setCanSubmitVideo}
                    label="I'll need a few extra days but can get it done"
                  />
                  <RadioCard
                    name="canSubmitVideo"
                    value="no"
                    selected={canSubmitVideo}
                    onChange={setCanSubmitVideo}
                    label="Not sure — I may need help figuring out how"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Do you have recent game film available?
                </label>
                <div className="space-y-2">
                  <RadioCard
                    name="hasGameFilm"
                    value="yes"
                    selected={hasGameFilm}
                    onChange={setHasGameFilm}
                    label="Yes — I have full-game or highlight film"
                  />
                  <RadioCard
                    name="hasGameFilm"
                    value="some"
                    selected={hasGameFilm}
                    onChange={setHasGameFilm}
                    label="I have some clips but not full games"
                  />
                  <RadioCard
                    name="hasGameFilm"
                    value="no"
                    selected={hasGameFilm}
                    onChange={setHasGameFilm}
                    label="No game film available"
                  />
                </div>
              </div>

              {/* Info box */}
              <div className="p-4 bg-site-secondary border border-site-gold/20 rounded-lg">
                <p className="text-sm text-site-muted">
                  <span className="text-site-gold font-semibold">Note:</span>{' '}
                  Game film is optional but valuable. The required video is a specific
                  shooting test we&apos;ll send you after payment. You&apos;ll get full
                  instructions — just need a phone and a court.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Expectation Framing ───────────────────── */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <p className={sectionSubClass}>
                The BB method is different. We don&apos;t teach &quot;perfect form&quot; — we
                calibrate your shot based on how you actually move, your energy
                system, and your miss patterns. That means some of what we prescribe
                may feel counterintuitive.
              </p>

              <div>
                <label className={labelClass}>
                  Are you open to methods that might feel uncomfortable or
                  unfamiliar at first? *
                </label>
                <div className="space-y-2">
                  <RadioCard
                    name="openToUncomfortable"
                    value="yes"
                    selected={openToUncomfortable}
                    onChange={setOpenToUncomfortable}
                    label="Yes — I trust the process and I'm ready to be coached"
                  />
                  <RadioCard
                    name="openToUncomfortable"
                    value="open"
                    selected={openToUncomfortable}
                    onChange={setOpenToUncomfortable}
                    label="I'm open to it, but I'll need to understand the reasoning"
                  />
                  <RadioCard
                    name="openToUncomfortable"
                    value="unsure"
                    selected={openToUncomfortable}
                    onChange={setOpenToUncomfortable}
                    label="I'm not sure — I mainly want to stick with what feels natural"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  What are you looking for from this evaluation? *
                </label>
                <div className="space-y-2">
                  <RadioCard
                    name="quickFixOrDeep"
                    value="deep"
                    selected={quickFixOrDeep}
                    onChange={setQuickFixOrDeep}
                    label="Deep understanding — I want to know WHY my shot does what it does and how to fix it permanently"
                  />
                  <RadioCard
                    name="quickFixOrDeep"
                    value="both"
                    selected={quickFixOrDeep}
                    onChange={setQuickFixOrDeep}
                    label="Both — I want quick wins AND the deeper framework"
                  />
                  <RadioCard
                    name="quickFixOrDeep"
                    value="quick"
                    selected={quickFixOrDeep}
                    onChange={setQuickFixOrDeep}
                    label="Quick improvement — just tell me what to do and I'll do it"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Confirmation ──────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <p className={sectionSubClass}>
                Before we proceed to payment, confirm that you understand what the
                BB Shooting Evaluation includes and what&apos;s expected of you.
              </p>

              <div className="space-y-3">
                <CheckItem checked={confirm1} onChange={setConfirm1}>
                  <span className="font-medium">I understand this is a diagnostic evaluation, not a quick-fix program.</span>{' '}
                  BB will assess my miss patterns, energy system, and deep-distance
                  calibration to build a personalized 7-day protocol. Results come
                  from doing the work — not just reading the report.
                </CheckItem>

                <CheckItem checked={confirm2} onChange={setConfirm2}>
                  <span className="font-medium">I will submit the required shooting video within 48 hours of payment.</span>{' '}
                  I&apos;ll follow the test instructions sent to my email (from jake@trainwjc.com)
                  and upload my footage so the BB team can build my Shooting Profile.
                </CheckItem>

                <CheckItem checked={confirm3} onChange={setConfirm3}>
                  <span className="font-medium">I&apos;m ready to invest $250 in understanding my shot at a deeper level.</span>{' '}
                  I know this is a one-time evaluation fee and that the quality of my
                  results depends on my effort and honesty in the process.
                </CheckItem>
              </div>

              {/* Summary card */}
              <div className="p-5 bg-site-secondary border border-site-border rounded-lg">
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
                  What Happens Next
                </h3>
                <div className="space-y-2.5 text-sm text-site-muted">
                  <div className="flex items-start gap-2.5">
                    <span className="text-site-gold font-bold">1.</span>
                    <span>Complete payment ($250 one-time)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-site-gold font-bold">2.</span>
                    <span>Receive film submission instructions via email within 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-site-gold font-bold">3.</span>
                    <span>Submit your shooting test video</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-site-gold font-bold">4.</span>
                    <span>We build your BB Shooting Profile and 7-day calibration plan</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-site-gold font-bold">5.</span>
                    <span>Profile delivered with written breakdown + progression benchmarks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Error ──────────────────────────────────────────── */}
          {error && (
            <div className="mt-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ── Navigation ─────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-site-border">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-site-muted hover:text-white text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href="/player-info"
                className="flex items-center gap-2 text-site-muted hover:text-white text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Options
              </Link>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-site-gold hover:bg-site-gold-hover text-site-primary font-barlow font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-lg transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allConfirmed || isSubmitting}
                className="flex items-center gap-2 bg-site-gold hover:bg-site-gold-hover text-site-primary font-barlow font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Proceed to Payment — $250
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Bottom note ──────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-xs text-site-dim">
            Your information is saved securely and only used to build your evaluation.
            Questions? Email{' '}
            <a href="mailto:jake@trainwjc.com" className="text-site-gold hover:text-site-gold-hover transition-colors">
              jake@trainwjc.com
            </a>
          </p>
        </div>
      </div>

      <BBFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
