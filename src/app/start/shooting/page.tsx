'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  PLAYER_LEVELS,
  PLAYER_MAIN_GOALS,
  THREE_PT_PERCENTAGES,
  PLAYER_PROBLEMS,
  WORKOUT_STYLES,
  DAYS_PER_WEEK,
} from '@/types';

const STEPS = [
  { id: 'level', title: 'Level & Goals' },
  { id: 'shot', title: 'Your Shot' },
  { id: 'problems', title: 'Problems' },
  { id: 'training', title: 'Training' },
  { id: 'contact', title: 'Contact' },
];

export default function ShootingEvaluationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerLevel: '',
    playerMainGoal: [] as string[],
    gameVsWorkout: '',
    threePtPercentage: '',
    playerProblem: '',
    workoutStyle: '',
    daysPerWeek: '',
    playerAge: '',
    playerLocation: '',
    playerInstagram: '',
    selectedProduct: 'shooting_eval' as 'shooting_eval' | 'masterclass',
  });

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleGoal = (goal: string) => {
    const current = formData.playerMainGoal;
    if (current.includes(goal)) {
      handleChange('playerMainGoal', current.filter((g) => g !== goal));
    } else if (current.length < 2) {
      handleChange('playerMainGoal', [...current, goal]);
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Level & Goals
        if (!formData.playerLevel) newErrors.playerLevel = 'Please select your level';
        if (formData.playerMainGoal.length === 0) newErrors.playerMainGoal = 'Please select at least one goal';
        break;
      case 1: // Shot Feel
        // gameVsWorkout and threePtPercentage are optional but encouraged
        break;
      case 2: // Problems
        if (!formData.playerProblem) newErrors.playerProblem = 'Please select which problem sounds most like you';
        break;
      case 3: // Training
        if (!formData.daysPerWeek) newErrors.daysPerWeek = 'Please select how many days you can commit';
        break;
      case 4: // Contact
        if (!formData.firstName.trim()) newErrors.firstName = 'Required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Required';
        if (!formData.email.trim()) {
          newErrors.email = 'Required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email';
        }
        if (!formData.selectedProduct) newErrors.selectedProduct = 'Please select a product';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final step - submit
    setIsSubmitting(true);

    try {
      // If masterclass selected, redirect to Thinkific
      if (formData.selectedProduct === 'masterclass') {
        window.location.href = 'https://bbcode.thinkific.com/order?ct=9d9ec913-83a2-486e-8e7a-5fa25bcbe931';
        return;
      }

      // Otherwise proceed with shooting evaluation checkout
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
            playerMainGoal: formData.playerMainGoal,
            gameVsWorkout: formData.gameVsWorkout,
            threePtPercentage: formData.threePtPercentage,
            playerProblem: formData.playerProblem,
            workoutStyle: formData.workoutStyle,
            daysPerWeek: formData.daysPerWeek,
            playerAge: formData.playerAge ? parseInt(formData.playerAge) : null,
            playerLocation: formData.playerLocation,
            playerInstagram: formData.playerInstagram,
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

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Level & Goals
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What level do you currently play at?
              </h3>
              <div className="grid gap-2">
                {PLAYER_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleChange('playerLevel', level.value)}
                    className={cn(
                      'text-left px-4 py-3 rounded-lg border transition-all',
                      formData.playerLevel === level.value
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
              {errors.playerLevel && <p className="text-red-400 text-sm mt-2">{errors.playerLevel}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What&apos;s the main thing you want to improve right now?
              </h3>
              <p className="text-sm text-gray-400 mb-4">Pick 1-2</p>
              <div className="grid gap-2">
                {PLAYER_MAIN_GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => toggleGoal(goal.value)}
                    className={cn(
                      'text-left px-4 py-3 rounded-lg border transition-all',
                      formData.playerMainGoal.includes(goal.value)
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
                    )}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
              {errors.playerMainGoal && <p className="text-red-400 text-sm mt-2">{errors.playerMainGoal}</p>}
            </div>
          </div>
        );

      case 1: // Shot Feel
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How does your shot feel in games vs workouts?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Describe it in your own words. Example: &quot;I shoot great in workouts but hesitate in games&quot;
              </p>
              <textarea
                value={formData.gameVsWorkout}
                onChange={(e) => handleChange('gameVsWorkout', e.target.value)}
                placeholder="Tell us how your shot feels..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What&apos;s your current 3PT % in games?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                If you don&apos;t know, leave an estimate
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {THREE_PT_PERCENTAGES.map((pct) => (
                  <button
                    key={pct.value}
                    type="button"
                    onClick={() => handleChange('threePtPercentage', pct.value)}
                    className={cn(
                      'text-center px-4 py-3 rounded-lg border transition-all',
                      formData.threePtPercentage === pct.value
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
                    )}
                  >
                    {pct.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Problems
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Which problem sounds most like you?
              </h3>
              <div className="grid gap-2">
                {PLAYER_PROBLEMS.map((problem) => (
                  <button
                    key={problem.value}
                    type="button"
                    onClick={() => handleChange('playerProblem', problem.value)}
                    className={cn(
                      'text-left px-4 py-3 rounded-lg border transition-all',
                      formData.playerProblem === problem.value
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
                    )}
                  >
                    {problem.label}
                  </button>
                ))}
              </div>
              {errors.playerProblem && <p className="text-red-400 text-sm mt-2">{errors.playerProblem}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What does your typical shooting workout look like right now?
              </h3>
              <div className="grid gap-2">
                {WORKOUT_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => handleChange('workoutStyle', style.value)}
                    className={cn(
                      'text-left px-4 py-3 rounded-lg border transition-all',
                      formData.workoutStyle === style.value
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Training
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How many days per week can you realistically commit to a plan?
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {DAYS_PER_WEEK.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('daysPerWeek', option.value)}
                    className={cn(
                      'text-center px-4 py-4 rounded-lg border transition-all',
                      formData.daysPerWeek === option.value
                        ? 'border-gold-500 bg-gold-500/10 text-white'
                        : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
                    )}
                  >
                    <span className="text-lg font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
              {errors.daysPerWeek && <p className="text-red-400 text-sm mt-2">{errors.daysPerWeek}</p>}
            </div>
          </div>
        );

      case 4: // Contact
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Almost done! Let&apos;s get your info.
              </h3>
              <p className="text-sm text-gray-400">
                Choose your option below.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="First name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Last name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone (optional but preferred)
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  value={formData.playerAge}
                  onChange={(e) => handleChange('playerAge', e.target.value)}
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <Input
                  value={formData.playerLocation}
                  onChange={(e) => handleChange('playerLocation', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram
                </label>
                <Input
                  value={formData.playerInstagram}
                  onChange={(e) => handleChange('playerInstagram', e.target.value)}
                  placeholder="@handle"
                />
              </div>
            </div>

            {/* Product options */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-medium text-gray-300">Choose your option:</h4>

              {/* Shooting Evaluation */}
              <button
                type="button"
                onClick={() => handleChange('selectedProduct', 'shooting_eval')}
                className={cn(
                  'w-full p-4 rounded-lg border text-left transition-all',
                  formData.selectedProduct === 'shooting_eval'
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-bb-border bg-bb-card hover:border-gold-500/50'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">BB Shooting Evaluation</p>
                    <p className="text-sm text-gray-400">Personalized profile + roadmap</p>
                  </div>
                  <p className="text-xl font-bold text-white">$250</p>
                </div>
                <ul className="text-xs text-gray-400 space-y-1 border-t border-bb-border pt-3">
                  <li>• How does it work?</li>
                  <li>• Complete BB Standard Calibration Test (Info Emailed after purchase)</li>
                  <li>• BB Profile built depending on the test + video submission</li>
                  <li>• Full Assessment of Your Shot Reviewed</li>
                  <li>• Personalized Protocols Installed In a Weekly Plan</li>
                </ul>
              </button>

              {/* Masterclass */}
              <button
                type="button"
                onClick={() => handleChange('selectedProduct', 'masterclass')}
                className={cn(
                  'w-full p-4 rounded-lg border text-left transition-all',
                  formData.selectedProduct === 'masterclass'
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-bb-border bg-bb-card hover:border-gold-500/50'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">BB Masterclass</p>
                    <p className="text-sm text-gray-400">Learn the complete system</p>
                  </div>
                  <p className="text-xl font-bold text-white">$150</p>
                </div>
                <ul className="text-xs text-gray-400 space-y-1 border-t border-bb-border pt-3">
                  <li>• Learn the Complete System</li>
                  <li>• Live Coaching Sessions</li>
                  <li>• Behind the Scenes of NBA Case Studies</li>
                  <li>• For Coaches and Players who want to know the Why</li>
                </ul>
              </button>
            </div>
            {errors.selectedProduct && <p className="text-red-400 text-sm">{errors.selectedProduct}</p>}
          </div>
        );
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  index < currentStep
                    ? 'bg-gold-500 text-bb-black'
                    : index === currentStep
                    ? 'bg-gold-500/20 text-gold-500 border border-gold-500'
                    : 'bg-bb-card text-gray-500 border border-bb-border'
                )}
              >
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-12 h-0.5 mx-2',
                    index < currentStep ? 'bg-gold-500' : 'bg-bb-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Hero (only on first step) */}
        {currentStep === 0 && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              BB Shooting Evaluation
            </h1>
            <p className="text-gray-400">
              $250 • Your personalized shooting profile + roadmap
            </p>
          </div>
        )}

        {/* Form content */}
        <Card variant="glass">
          <CardContent className="p-6 md:p-8">
            {renderStep()}

            {/* Error message */}
            {errors.form && (
              <div className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{errors.form}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-bb-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === STEPS.length - 1 ? (
                  <>
                    {formData.selectedProduct === 'masterclass' ? 'Get Masterclass - $150' : 'Continue to Payment - $250'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What you get (only show on first step) */}
        {currentStep === 0 && (
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
        )}
      </div>
    </main>
  );
}
