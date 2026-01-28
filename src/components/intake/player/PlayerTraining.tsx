'use client';

import { cn } from '@/lib/utils';
import { DAYS_PER_WEEK } from '@/types';
import type { IntakeFormData, DaysPerWeek } from '@/types';

interface PlayerTrainingProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function PlayerTraining({ data, onChange }: PlayerTrainingProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Days per week */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How many days per week can you realistically commit to a plan?
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {DAYS_PER_WEEK.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ daysPerWeek: option.value as DaysPerWeek })}
              className={cn(
                'text-center px-4 py-4 rounded-lg border transition-all',
                data.daysPerWeek === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              <span className="text-lg font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
