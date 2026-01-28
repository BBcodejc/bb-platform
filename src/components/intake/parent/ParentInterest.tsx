'use client';

import { cn } from '@/lib/utils';
import { PARENT_INTERESTS, PARENT_INVOLVEMENT_LEVELS, INVESTMENT_LEVELS } from '@/types';
import type { IntakeFormData, ParentInterest as ParentInterestType, ParentInvolvement, InvestmentLevel } from '@/types';

interface ParentInterestProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function ParentInterest({ data, onChange }: ParentInterestProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Interest type */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Are you more interested in...
        </h3>
        <div className="grid gap-2">
          {PARENT_INTERESTS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ parentInterest: option.value as ParentInterestType })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.parentInterest === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Parent involvement */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          As the parent, how involved are you willing to be?
        </h3>
        <div className="grid gap-2">
          {PARENT_INVOLVEMENT_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ parentInvolvement: level.value as ParentInvolvement })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.parentInvolvement === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Investment mindset */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Which best describes your investment mindset?
        </h3>
        <div className="grid gap-2">
          {INVESTMENT_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ parentInvestmentLevel: level.value as InvestmentLevel })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.parentInvestmentLevel === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
