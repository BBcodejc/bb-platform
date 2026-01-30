'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

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

export default function CoachCertificationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    coachingRole: '',
    yearsCoaching: '',
    playerLevelWorkWith: '',
    whyInterested: '',
    currentTrainingStyle: '',
    investmentInterest: '',
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
    if (!formData.coachingRole) newErrors.coachingRole = 'Required';
    if (!formData.whyInterested.trim()) newErrors.whyInterested = 'Required';

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
          type: 'coach_cert_application',
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/start/thank-you?type=coach&name=${encodeURIComponent(formData.firstName)}`);
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
            <GraduationCap className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            BB Coach Certification
          </h1>
          <p className="text-gray-400">
            Learn the BB lens and get certified to use it with your players.
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

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City / Country
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Los Angeles, CA"
                />
              </div>

              {/* Coaching role & years */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Coaching Role *
                  </label>
                  <select
                    value={formData.coachingRole}
                    onChange={(e) => handleChange('coachingRole', e.target.value)}
                    className={`w-full px-3 py-2 bg-bb-card border rounded-lg text-white focus:ring-2 focus:ring-gold-500 ${
                      errors.coachingRole ? 'border-red-500' : 'border-bb-border'
                    }`}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years Coaching
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsCoaching}
                    onChange={(e) => handleChange('yearsCoaching', e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Who they work with */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Who do you mainly work with?
                </label>
                <select
                  value={formData.playerLevelWorkWith}
                  onChange={(e) => handleChange('playerLevelWorkWith', e.target.value)}
                  className="w-full px-3 py-2 bg-bb-card border border-bb-border rounded-lg text-white focus:ring-2 focus:ring-gold-500"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Why are you interested in the Basketball Biomechanics lens? *
                </label>
                <Textarea
                  value={formData.whyInterested}
                  onChange={(e) => handleChange('whyInterested', e.target.value)}
                  placeholder="What drew you to BB? What are you hoping to learn or change about how you train players?"
                  rows={4}
                  className={errors.whyInterested ? 'border-red-500' : ''}
                />
              </div>

              {/* Current training style */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How do you currently train players? (describe a typical session)
                </label>
                <Textarea
                  value={formData.currentTrainingStyle}
                  onChange={(e) => handleChange('currentTrainingStyle', e.target.value)}
                  placeholder="e.g., warm-up, form shooting, game shots, 1v1, etc."
                  rows={3}
                />
              </div>

              {/* Investment interest */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Are you open to investing in a mentorship / certification if there&apos;s a good fit?
                </label>
                <div className="flex gap-3">
                  {INVESTMENT_INTEREST.map((option) => (
                    <label
                      key={option.value}
                      className={`flex-1 text-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.investmentInterest === option.value
                          ? 'border-gold-500 bg-gold-500/10'
                          : 'border-bb-border hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="investmentInterest"
                        value={option.value}
                        checked={formData.investmentInterest === option.value}
                        onChange={(e) => handleChange('investmentInterest', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
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
                  We&apos;ll review your profile and reach out to discuss next steps for BB Certification.
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
            Need to test the methodology on yourself first?{' '}
            <Link href="/start/shooting" className="text-gold-500 hover:underline">
              Get the BB Shooting Evaluation ($250)
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
