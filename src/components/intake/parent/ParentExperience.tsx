'use client';

import { cn } from '@/lib/utils';
import { WEEKLY_TRAINING_HOURS } from '@/types';
import type { IntakeFormData, WeeklyTrainingHours } from '@/types';

interface ParentExperienceProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function ParentExperience({ data, onChange }: ParentExperienceProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Training hours */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How much time do they have to train per week outside of games/practices?
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {WEEKLY_TRAINING_HOURS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ weeklyTrainingHours: option.value as WeeklyTrainingHours })}
              className={cn(
                'text-center px-4 py-4 rounded-lg border transition-all',
                data.weeklyTrainingHours === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Previous experience */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Have you invested in trainers or programs before? What was missing?
        </h3>
        <textarea
          value={data.previousTrainerExperience || ''}
          onChange={(e) => onChange({ previousTrainerExperience: e.target.value })}
          placeholder="Tell us about your experience (if any)..."
          className="w-full h-28 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>
    </div>
  );
}
