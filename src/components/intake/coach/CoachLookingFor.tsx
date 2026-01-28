'use client';

import { cn } from '@/lib/utils';
import { COACH_LOOKING_FOR, COACH_NEXT_STEPS } from '@/types';
import type { IntakeFormData, CoachLookingFor as CoachLookingForType, CoachNextStep } from '@/types';

interface CoachLookingForProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function CoachLookingFor({ data, onChange }: CoachLookingForProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* What they're looking for */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What are you actually looking for from BB?
        </h3>
        <div className="grid gap-2">
          {COACH_LOOKING_FOR.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ coachLookingFor: option.value as CoachLookingForType })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachLookingFor === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Next step */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Which of these best matches what you want next?
        </h3>
        <div className="grid gap-2">
          {COACH_NEXT_STEPS.map((step) => (
            <button
              key={step.value}
              onClick={() => onChange({ coachNextStep: step.value as CoachNextStep })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachNextStep === step.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certification wants */}
      {data.coachLookingFor === 'certification' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            If we built a BB Certification Path, what would you want out of it?
          </h3>
          <textarea
            value={data.coachCertificationWants || ''}
            onChange={(e) => onChange({ coachCertificationWants: e.target.value })}
            placeholder="Tell us what you'd want from a certification..."
            className="w-full h-24 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
          />
        </div>
      )}
    </div>
  );
}
