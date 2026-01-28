'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile view - just show current step */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span className="text-gold-400 font-medium">{steps[currentStep]?.title}</span>
        </div>
        <div className="mt-2 h-1 w-full bg-bb-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view - full steps */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  index < currentStep
                    ? 'bg-gold-500 border-gold-500'
                    : index === currentStep
                    ? 'border-gold-500 bg-gold-500/20'
                    : 'border-bb-border bg-bb-card'
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5 text-bb-black" />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      index === currentStep ? 'text-gold-400' : 'text-gray-500'
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center max-w-[80px]',
                  index <= currentStep ? 'text-white' : 'text-gray-500'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  index < currentStep ? 'bg-gold-500' : 'bg-bb-border'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
