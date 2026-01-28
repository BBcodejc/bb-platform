'use client';

import { cn } from '@/lib/utils';
import { MOTOR_LEARNING_FAMILIARITY, PLAYER_COUNTS, COACH_OPEN_TO_COACHING } from '@/types';
import type { IntakeFormData, MotorLearningFamiliarity, PlayerCount, CoachOpenToCoaching } from '@/types';

interface CoachMethodsProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function CoachMethods({ data, onChange }: CoachMethodsProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Motor learning familiarity */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How familiar are you with motor learning / constraints-led / ecological approaches?
        </h3>
        <div className="grid gap-2">
          {MOTOR_LEARNING_FAMILIARITY.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ motorLearningFamiliarity: option.value as MotorLearningFamiliarity })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.motorLearningFamiliarity === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Player count */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How many players do you work with consistently?
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLAYER_COUNTS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ coachPlayerCount: option.value as PlayerCount })}
              className={cn(
                'text-center px-4 py-4 rounded-lg border transition-all',
                data.coachPlayerCount === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              <span className="text-lg font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What constraints do you have? (time / space / staff)
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Example: &quot;We only have 60 minutes per practice and 2 baskets for 15 guys...&quot;
        </p>
        <textarea
          value={data.coachConstraints || ''}
          onChange={(e) => onChange({ coachConstraints: e.target.value })}
          placeholder="Describe your constraints..."
          className="w-full h-24 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>

      {/* Open to being coached */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Are you open to being coached on your film and methods?
        </h3>
        <div className="grid gap-2">
          {COACH_OPEN_TO_COACHING.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ coachOpenToCoaching: option.value as CoachOpenToCoaching })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.coachOpenToCoaching === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
