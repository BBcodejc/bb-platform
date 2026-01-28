'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PlayerInfoSection,
  FourteenSpotSection,
  DeepDistanceSection,
  BackRimSection,
  BallFlightSection,
  FadesSection,
  FinalNotesSection,
  ReviewSection,
} from '@/components/shooting-eval';
import { useShootingEval, EVAL_STEPS, type EvalStep } from '@/hooks/useShootingEval';
import { cn } from '@/lib/utils';

export default function PortalPage() {
  const params = useParams();
  const router = useRouter();
  const prospectId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    currentStep,
    formData,
    isLoaded,
    updateSection,
    nextStep,
    prevStep,
    goToStep,
    clearData,
    isSectionComplete,
    getCompletionPercentage,
  } = useShootingEval(prospectId);

  const currentStepIndex = EVAL_STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === EVAL_STEPS.length - 1;

  // Check if all required sections are complete
  const allRequiredComplete =
    isSectionComplete('player_info') &&
    isSectionComplete('fourteen_spot') &&
    isSectionComplete('deep_distance') &&
    isSectionComplete('back_rim') &&
    isSectionComplete('ball_flight') &&
    isSectionComplete('fades');

  const handleSubmit = async () => {
    if (!allRequiredComplete) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/portal/${prospectId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospect_id: prospectId,
          submission_timestamp: new Date().toISOString(),
          ...formData,
        }),
      });

      if (response.ok) {
        clearData();
        router.push(`/portal/${prospectId}/success`);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  };

  // Render current step content
  const renderStep = () => {
    switch (currentStep) {
      case 'player_info':
        return (
          <PlayerInfoSection
            data={formData.player_info || {}}
            onChange={(data) => updateSection('player_info', data)}
          />
        );
      case 'fourteen_spot':
        return (
          <FourteenSpotSection
            data={formData.fourteen_spot || {}}
            onChange={(data) => updateSection('fourteen_spot', data)}
          />
        );
      case 'deep_distance':
        return (
          <DeepDistanceSection
            data={formData.deep_distance || {}}
            onChange={(data) => updateSection('deep_distance', data)}
          />
        );
      case 'back_rim':
        return (
          <BackRimSection
            data={formData.back_rim || {}}
            onChange={(data) => updateSection('back_rim', data)}
          />
        );
      case 'ball_flight':
        return (
          <BallFlightSection
            data={formData.ball_flight || {}}
            onChange={(data) => updateSection('ball_flight', data)}
          />
        );
      case 'fades':
        return (
          <FadesSection
            data={formData.fades || {}}
            onChange={(data) => updateSection('fades', data)}
          />
        );
      case 'final_notes':
        return (
          <FinalNotesSection
            data={formData.final_notes || {}}
            onChange={(data) => updateSection('final_notes', data)}
          />
        );
      case 'review':
        return (
          <ReviewSection
            data={formData}
            onEditSection={goToStep}
            isSectionComplete={isSectionComplete}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-gold-500 font-bold tracking-wider text-sm">
              BB SHOOTING EVALUATION
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {getCompletionPercentage()}% complete
              </span>
              <div className="w-20 h-1.5 bg-bb-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Step Progress */}
      <div className="border-b border-bb-border bg-bb-dark/30">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {EVAL_STEPS.map((step, index) => {
              const sectionKey = step.id === 'review' ? null : step.id as keyof typeof formData;
              const isComplete = sectionKey ? isSectionComplete(sectionKey) : allRequiredComplete;
              const isCurrent = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                    isCurrent
                      ? 'bg-gold-500 text-black'
                      : isComplete
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-bb-card text-gray-400 hover:bg-bb-border'
                  )}
                >
                  {isComplete && !isCurrent && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  <span>{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Step Title */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <p className="text-xs text-gold-500 font-medium tracking-wide uppercase">
          Step {currentStepIndex + 1} of {EVAL_STEPS.length}
        </p>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="animate-fade-in" key={currentStep}>
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto px-4 py-6 border-t border-bb-border mt-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={isFirstStep || isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={!allRequiredComplete || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Evaluation
                </>
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} className="gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Autosave indicator */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Your progress is automatically saved
        </p>
      </div>
    </main>
  );
}
