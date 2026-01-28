'use client';

import { cn } from '@/lib/utils';
import { COACH_LEVELS, COACH_ROLES } from '@/types';
import type { IntakeFormData, CoachLevel, CoachRole } from '@/types';

interface CoachInfoProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function CoachInfo({ data, onChange }: CoachInfoProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Coaching level */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What level do you coach/train at?
        </h3>
        <div className="grid gap-2">
          {COACH_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ coachLevel: level.value as CoachLevel })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachLevel === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary role */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What&apos;s your primary role?
        </h3>
        <div className="grid gap-2">
          {COACH_ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => onChange({ coachRole: role.value as CoachRole })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachRole === role.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
