'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Target,
} from 'lucide-react';

const programs = [
  { id: 'calibration-7', label: '7-Day Shooting Calibration' },
  { id: 'assessment-30', label: 'Full Assessment + 30-Day Protocol' },
  { id: 'transformation-90', label: '3-Month Full Transformation' },
  { id: 'unsure', label: "Not sure yet — help me decide" },
];

const budgetRanges = [
  { id: 'entry', label: 'Entry level — looking for a starting point' },
  { id: 'mid', label: 'Mid-range — ready to invest in real development' },
  { id: 'committed', label: 'Fully committed — willing to do whatever it takes' },
];

const levels = [
  'NBA / Pro',
  'G-League / Overseas',
  'College (D1)',
  'College (D2/D3/NAIA)',
  'High School (Varsity)',
  'High School (JV / AAU)',
  'Youth / Travel',
  'Adult Rec / Other',
];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    level: '',
    team: '',
    position: '',
    program: '',
    budget: '',
    goals: '',
    challenges: '',
    howHeard: '',
  });

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full_assessment_application',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
          level: formData.level,
          position: formData.position,
          currentSituation: formData.goals,
          biggestProblems: formData.challenges,
          commitmentLevel: formData.budget,
          program: formData.program,
          howHeard: formData.howHeard,
          team: formData.team,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Submitted</h1>
          <p className="text-gray-400 mb-3">
            Thank you for applying to Basketball Biomechanics.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            We review every application within 24-48 hours. If you're a fit, we'll reach out to schedule a call and discuss next steps.
          </p>
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bb-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-bb-black/80 backdrop-blur-xl border-b border-bb-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/players/bb-logo.png"
              alt="BB"
              width={36}
              height={36}
              className="rounded"
            />
            <span className="text-gold-500 font-bold text-sm tracking-wider">BASKETBALL BIOMECHANICS</span>
          </Link>
          <Link href="/player-info">
            <Button variant="ghost" size="sm" className="text-xs">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Player Info
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-32 pb-20">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7 text-gold-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Apply to BB</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Fill out the application below. We'll review it and reach out within 24-48 hours if you're a fit.
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
              <Input
                label="Age"
                type="number"
                placeholder="e.g. 22"
                value={formData.age}
                onChange={(e) => update('age', e.target.value)}
              />
            </div>
          </div>

          {/* Basketball Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Basketball Background
            </h3>
            <div className="space-y-4">
              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Current Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => update('level', lvl)}
                      className={`px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                        formData.level === lvl
                          ? 'border-gold-500 bg-gold-500/10 text-white'
                          : 'border-bb-border bg-bb-card text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Team / School"
                  placeholder="e.g. UCLA, AAU team name"
                  value={formData.team}
                  onChange={(e) => update('team', e.target.value)}
                />
                <Input
                  label="Position"
                  placeholder="e.g. SG, PF, Wing"
                  value={formData.position}
                  onChange={(e) => update('position', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Program Interest */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Program Interest
            </h3>
            <div className="space-y-2">
              {programs.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => update('program', p.id)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                    formData.program === p.id
                      ? 'border-gold-500 bg-gold-500/10 text-white'
                      : 'border-bb-border bg-bb-card text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Qualifier */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Investment Level
            </h3>
            <p className="text-sm text-gray-500 mb-3">Where are you at in terms of commitment to your development?</p>
            <div className="space-y-2">
              {budgetRanges.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => update('budget', b.id)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                    formData.budget === b.id
                      ? 'border-gold-500 bg-gold-500/10 text-white'
                      : 'border-bb-border bg-bb-card text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goals & Challenges */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              About You
            </h3>
            <div className="space-y-4">
              <Textarea
                label="What are your goals?"
                placeholder="What do you want to improve? Where do you see yourself in 6 months?"
                value={formData.goals}
                onChange={(e) => update('goals', e.target.value)}
                className="min-h-[100px]"
                required
              />
              <Textarea
                label="What challenges are you facing?"
                placeholder="What's holding you back right now? Where do you feel stuck?"
                value={formData.challenges}
                onChange={(e) => update('challenges', e.target.value)}
                className="min-h-[100px]"
              />
              <Input
                label="How did you hear about BB?"
                placeholder="e.g. Instagram, a friend, NBA highlight"
                value={formData.howHeard}
                onChange={(e) => update('howHeard', e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={!formData.firstName || !formData.email || !formData.goals}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
            <p className="text-center text-gray-600 text-xs mt-3">
              Applications are reviewed within 24-48 hours.
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="border-t border-bb-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/players/bb-logo.png"
              alt="BB"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-gray-500 text-sm">Basketball Biomechanics</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
            <Link href="/player-info" className="hover:text-gray-400 transition-colors">Players</Link>
            <Link href="/inquiry" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
