'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Target } from 'lucide-react';
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

export default function ShootingEvaluationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerLevel: '',
    playerAge: '',
    playerInstagram: '',
    struggle: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.playerLevel) {
      newErrors.playerLevel = 'Please select your level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            role: 'player',
            applicationType: 'shooting_evaluation',
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            playerLevel: formData.playerLevel,
            playerAge: formData.playerAge ? parseInt(formData.playerAge) : null,
            playerInstagram: formData.playerInstagram,
            playerProblem: formData.struggle,
            assessmentType: 'shooting',
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
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
          <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            BB Shooting Evaluation
          </h1>
          <p className="text-gray-400">
            Get your personalized shooting profile with test protocols and a priority roadmap.
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
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                  )}
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
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                  )}
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
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-gray-500">(optional but preferred)</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
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
                    className={`w-full px-3 py-2 bg-bb-card border rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
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
                  {errors.playerLevel && (
                    <p className="text-red-400 text-xs mt-1">{errors.playerLevel}</p>
                  )}
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram Handle <span className="text-gray-500">(optional)</span>
                </label>
                <Input
                  type="text"
                  value={formData.playerInstagram}
                  onChange={(e) => handleChange('playerInstagram', e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>

              {/* What they're struggling with */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What&apos;s the biggest problem with your shooting right now?
                </label>
                <Textarea
                  value={formData.struggle}
                  onChange={(e) => handleChange('struggle', e.target.value)}
                  placeholder="e.g., inconsistent from 3, struggle under pressure, miss short, can't hit in games..."
                  rows={3}
                />
              </div>

              {/* Error message */}
              {errors.form && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.form}</p>
                </div>
              )}

              {/* Price info */}
              <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">BB Shooting Evaluation</p>
                    <p className="text-sm text-gray-400">One-time payment</p>
                  </div>
                  <p className="text-2xl font-bold text-white">$250</p>
                </div>
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
                    Creating checkout...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Secure payment via Stripe. You&apos;ll receive test protocols immediately after payment.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* What you get */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">What&apos;s included:</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="px-3 py-1 bg-bb-card rounded-full">14-Spot Assessment</span>
            <span className="px-3 py-1 bg-bb-card rounded-full">Deep Distance Test</span>
            <span className="px-3 py-1 bg-bb-card rounded-full">Back-Rim Protocol</span>
            <span className="px-3 py-1 bg-bb-card rounded-full">Ball Flight Spectrum</span>
            <span className="px-3 py-1 bg-bb-card rounded-full">Written BB Profile</span>
            <span className="px-3 py-1 bg-bb-card rounded-full">Priority Roadmap</span>
          </div>
        </div>
      </div>
    </main>
  );
}
