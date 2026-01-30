'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const ORG_TYPES = [
  { value: 'nba', label: 'NBA Team' },
  { value: 'college', label: 'College Program' },
  { value: 'high_school', label: 'High School' },
  { value: 'aau', label: 'AAU / Club' },
  { value: 'academy', label: 'Training Academy' },
  { value: 'other', label: 'Other' },
];

const PLAYER_COUNT = [
  { value: '1-10', label: '1-10 players' },
  { value: '11-25', label: '11-25 players' },
  { value: '26-50', label: '26-50 players' },
  { value: '50+', label: '50+ players' },
];

const SUPPORT_NEEDS = [
  { value: 'player_development', label: 'Player development system' },
  { value: 'coach_training', label: 'Coach training & certification' },
  { value: 'assessment_tools', label: 'Assessment tools' },
  { value: 'full_integration', label: 'Full BB integration' },
  { value: 'consulting', label: 'Consulting / Strategy' },
];

export default function OrganizationInquiryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    orgName: '',
    orgType: '',
    playerCount: '',
    currentChallenge: '',
    idealOutcome: '',
    supportNeeded: '',
    timeline: '',
    additionalInfo: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactName.trim()) newErrors.contactName = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.orgName.trim()) newErrors.orgName = 'Required';
    if (!formData.orgType) newErrors.orgType = 'Required';
    if (!formData.currentChallenge.trim()) newErrors.currentChallenge = 'Required';

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
          type: 'organization_inquiry',
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/start/thank-you?type=organization&name=${encodeURIComponent(formData.contactName.split(' ')[0])}`);
      } else {
        throw new Error(data.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Inquiry error:', error);
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
            <Building2 className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Team & Organization Inquiry
          </h1>
          <p className="text-gray-400">
            Integrate the BB methodology into your program at scale.
          </p>
        </div>

        {/* Form */}
        <Card variant="glass">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <Input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="John Smith"
                  className={errors.contactName ? 'border-red-500' : ''}
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@org.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Organization Name & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organization Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.orgName}
                    onChange={(e) => handleChange('orgName', e.target.value)}
                    placeholder="Team / School name"
                    className={errors.orgName ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organization Type *
                  </label>
                  <select
                    value={formData.orgType}
                    onChange={(e) => handleChange('orgType', e.target.value)}
                    className={`w-full px-3 py-2 bg-bb-card border rounded-lg text-white focus:ring-2 focus:ring-gold-500 ${
                      errors.orgType ? 'border-red-500' : 'border-bb-border'
                    }`}
                  >
                    <option value="">Select type...</option>
                    {ORG_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Player Count */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How many players are in your program?
                </label>
                <select
                  value={formData.playerCount}
                  onChange={(e) => handleChange('playerCount', e.target.value)}
                  className="w-full px-3 py-2 bg-bb-card border border-bb-border rounded-lg text-white focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">Select range...</option>
                  {PLAYER_COUNT.map((count) => (
                    <option key={count.value} value={count.value}>
                      {count.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Challenge */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What&apos;s your biggest challenge with player development? *
                </label>
                <Textarea
                  value={formData.currentChallenge}
                  onChange={(e) => handleChange('currentChallenge', e.target.value)}
                  placeholder="e.g., Inconsistent shooting across the roster, lack of standardized development system..."
                  rows={3}
                  className={errors.currentChallenge ? 'border-red-500' : ''}
                />
              </div>

              {/* Ideal Outcome */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What would success look like for your program?
                </label>
                <Textarea
                  value={formData.idealOutcome}
                  onChange={(e) => handleChange('idealOutcome', e.target.value)}
                  placeholder="e.g., Every player has a clear development path, coaches share a common language..."
                  rows={3}
                />
              </div>

              {/* Support Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What type of support are you looking for?
                </label>
                <select
                  value={formData.supportNeeded}
                  onChange={(e) => handleChange('supportNeeded', e.target.value)}
                  className="w-full px-3 py-2 bg-bb-card border border-bb-border rounded-lg text-white focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">Select support type...</option>
                  {SUPPORT_NEEDS.map((need) => (
                    <option key={need.value} value={need.value}>
                      {need.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What&apos;s your timeline?
                </label>
                <Input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleChange('timeline', e.target.value)}
                  placeholder="e.g., Before next season, ASAP, exploratory..."
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Anything else we should know?
                </label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleChange('additionalInfo', e.target.value)}
                  placeholder="Any other context that would help us understand your needs..."
                  rows={3}
                />
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
                  <span className="text-white font-medium">This is an inquiry, not a commitment.</span>{' '}
                  We&apos;ll review your needs and reach out to discuss how BB can support your program.
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
                    Submit Inquiry
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Individual eval link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Looking for individual player development?{' '}
            <Link href="/start/shooting" className="text-gold-500 hover:underline">
              Get a BB Shooting Evaluation ($250)
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
