'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

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

export default function FullAssessmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerLevel: '',
    playerAge: '',
    position: '',
    currentSituation: '',
    biggestProblems: '',
    whatTried: '',
    commitmentLevel: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.playerLevel) newErrors.playerLevel = 'Required';
    if (!formData.biggestProblems.trim()) newErrors.biggestProblems = 'Required';
    if (!formData.commitmentLevel) newErrors.commitmentLevel = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full_assessment_application',
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/start/thank-you?type=full-assessment&name=${encodeURIComponent(formData.firstName)}`);
      } else {
        throw new Error(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      setErrors({ form: 'Something went wrong. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gold-500 font-bold tracking-wider text-sm">
            BASKETBALL BIOMECHANICS
          </Link>
          <Link href="/start" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            BB Full Assessment Application
          </h1>
          <p className="text-gray-400">
            Apply for the 3-month BB Mentorship. This covers movement, deception, and shooting transformation.
          </p>
        </div>

        {/* Form */}
        <Card variant="glass">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="John"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className={errors.phone ? 'border-red-500' : ''}
                />
              </div>

              {/* Age & Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age
                  </label>
                  <Input
                    type="number"
                    min="8"
                    max="50"
                    value={formData.playerAge}
                    onChange={(e) => handleChange('playerAge', e.target.value)}
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Level *
                  </label>
                  <select
                    value={formData.playerLevel}
                    onChange={(e) => handleChange('playerLevel', e.target.value)}
                    className={`w-full px-3 py-2 bg-bb-card border rounded-lg text-white focus:ring-2 focus:ring-gold-500 ${
                      errors.playerLevel ? 'border-red-500' : 'border-bb-border'
                    }`}
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

              {/* Position & Situation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Position
                  </label>
                  <Input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    placeholder="PG, SG, SF..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Situation
                  </label>
                  <Input
                    type="text"
                    value={formData.currentSituation}
                    onChange={(e) => handleChange('currentSituation', e.target.value)}
                    placeholder="HS varsity, JUCO, Euro pro..."
                  />
                </div>
              </div>

              {/* Biggest problems */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What are the 2–3 biggest problems holding your game back? *
                </label>
                <Textarea
                  value={formData.biggestProblems}
                  onChange={(e) => handleChange('biggestProblems', e.target.value)}
                  placeholder="Be specific. e.g., 'I can't create separation off the dribble', 'I freeze under pressure', 'My shot is inconsistent from game to game'..."
                  rows={4}
                  className={errors.biggestProblems ? 'border-red-500' : ''}
                />
              </div>

              {/* What they've tried */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What have you already tried to fix it?
                </label>
                <Textarea
                  value={formData.whatTried}
                  onChange={(e) => handleChange('whatTried', e.target.value)}
                  placeholder="e.g., worked with trainers, watched YouTube, did shooting drills..."
                  rows={3}
                />
              </div>

              {/* Commitment level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How serious are you about investing in your development over the next 3–6 months? *
                </label>
                <div className="space-y-2">
                  {COMMITMENT_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.commitmentLevel === level.value
                          ? 'border-gold-500 bg-gold-500/10'
                          : 'border-bb-border hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="commitmentLevel"
                        value={level.value}
                        checked={formData.commitmentLevel === level.value}
                        onChange={(e) => handleChange('commitmentLevel', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.commitmentLevel === level.value
                          ? 'border-gold-500'
                          : 'border-gray-500'
                      }`}>
                        {formData.commitmentLevel === level.value && (
                          <div className="w-2 h-2 rounded-full bg-gold-500" />
                        )}
                      </div>
                      <span className="text-white">{level.label}</span>
                    </label>
                  ))}
                </div>
                {errors.commitmentLevel && (
                  <p className="text-red-400 text-xs mt-1">{errors.commitmentLevel}</p>
                )}
              </div>

              {/* Error message */}
              {errors.form && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.form}</p>
                </div>
              )}

              {/* Info box */}
              <div className="p-4 bg-bb-card border border-bb-border rounded-lg">
                <p className="text-sm text-gray-400">
                  <span className="text-white font-medium">This is an application, not a purchase.</span>{' '}
                  We review every application and reach out within 24–48 hours to discuss if the BB Mentorship is the right fit.
                </p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Shooting eval link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Just need your shot calibrated?{' '}
            <Link href="/start/shooting" className="text-gold-500 hover:underline">
              Get the BB Shooting Evaluation ($250)
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
