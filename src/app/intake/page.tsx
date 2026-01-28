'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ui/progress-steps';
import {
  RoleSelection,
  // Player
  PlayerLevelGoals,
  PlayerShotFeel,
  PlayerProblems,
  PlayerTraining,
  PlayerLookingFor,
  PlayerContact,
  // Parent
  ParentChildInfo,
  ParentIssuesGoals,
  ParentExperience,
  ParentInterest,
  ParentContact,
  // Coach
  CoachInfo,
  CoachPlayerIssues,
  CoachMethods,
  CoachLookingFor,
  CoachContact,
  // Org
  OrgInfo,
  OrgProblems,
  OrgSupport,
  OrgTimeline,
  OrgContact,
} from '@/components/intake';
import { useIntakeForm, getStepsForRole, validateStep, getRoutingRecommendation } from '@/hooks/useIntakeForm';
import type { Role } from '@/types';

export default function IntakePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    currentStep,
    role,
    setField,
    setFields,
    nextStep,
    prevStep,
    reset,
    ...formData
  } = useIntakeForm();

  // Get steps for current role
  const steps = getStepsForRole(role);

  // Handle next button
  const handleNext = async () => {
    // Validate current step
    const validationErrors = validateStep(currentStep, role, { role, ...formData });
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        if (err.includes('First name')) errorMap.firstName = err;
        if (err.includes('Last name')) errorMap.lastName = err;
        if (err.includes('Email')) errorMap.email = err;
      });
      setErrors(errorMap);
      return;
    }
    setErrors({});

    // If on final step, submit
    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        // Compute routing recommendation
        const routing = getRoutingRecommendation({ role, ...formData });

        // Submit to API
        await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role,
            ...formData,
            routingRecommendation: routing,
          }),
        });

        // Redirect to thank you page with routing info
        router.push(`/intake/thank-you?routing=${routing}&role=${role}`);
      } catch (error) {
        console.error('Intake error:', error);
        setIsSubmitting(false);
      }
      return;
    }

    nextStep();
  };

  // Render current step content
  const renderStep = () => {
    // Step 0: Role selection (all paths)
    if (currentStep === 0) {
      return (
        <RoleSelection
          value={role}
          onChange={(newRole) => setField('role', newRole)}
        />
      );
    }

    // Role-specific flows
    switch (role) {
      case 'player':
        switch (currentStep) {
          case 1:
            return <PlayerLevelGoals data={formData} onChange={setFields} />;
          case 2:
            return <PlayerShotFeel data={formData} onChange={setFields} />;
          case 3:
            return <PlayerProblems data={formData} onChange={setFields} />;
          case 4:
            return <PlayerTraining data={formData} onChange={setFields} />;
          case 5:
            return <PlayerLookingFor data={formData} onChange={setFields} />;
          case 6:
            return <PlayerContact data={formData} onChange={setFields} errors={errors} />;
        }
        break;

      case 'parent':
        switch (currentStep) {
          case 1:
            return <ParentChildInfo data={formData} onChange={setFields} />;
          case 2:
            return <ParentIssuesGoals data={formData} onChange={setFields} />;
          case 3:
            return <ParentExperience data={formData} onChange={setFields} />;
          case 4:
            return <ParentInterest data={formData} onChange={setFields} />;
          case 5:
            return <ParentContact data={formData} onChange={setFields} errors={errors} />;
        }
        break;

      case 'coach':
        switch (currentStep) {
          case 1:
            return <CoachInfo data={formData} onChange={setFields} />;
          case 2:
            return <CoachPlayerIssues data={formData} onChange={setFields} />;
          case 3:
            return <CoachMethods data={formData} onChange={setFields} />;
          case 4:
            return <CoachLookingFor data={formData} onChange={setFields} />;
          case 5:
            return <CoachContact data={formData} onChange={setFields} errors={errors} />;
        }
        break;

      case 'organization':
        switch (currentStep) {
          case 1:
            return <OrgInfo data={formData} onChange={setFields} />;
          case 2:
            return <OrgProblems data={formData} onChange={setFields} />;
          case 3:
            return <OrgSupport data={formData} onChange={setFields} />;
          case 4:
            return <OrgTimeline data={formData} onChange={setFields} />;
          case 5:
            return <OrgContact data={formData} onChange={setFields} errors={errors} />;
        }
        break;
    }

    return null;
  };

  // Get button text for current step
  const getButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    if (currentStep === steps.length - 1) {
      return 'Submit';
    }
    return 'Continue';
  };

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-gold-500 font-bold tracking-wider text-sm">
            BASKETBALL BIOMECHANICS
          </span>
          <button
            onClick={() => {
              reset();
              router.push('/');
            }}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <ProgressSteps steps={steps} currentStep={currentStep} className="mb-8" />

        {/* Form content */}
        <div className="animate-fade-in">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-bb-border">
          <Button
            variant="ghost"
            onClick={prevStep}
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
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {getButtonText()}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
