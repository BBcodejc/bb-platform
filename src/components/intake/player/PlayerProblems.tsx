'use client';

import { cn } from '@/lib/utils';
import { PLAYER_PROBLEMS, WORKOUT_STYLES } from '@/types';
import type { IntakeFormData, PlayerProblem, WorkoutStyle } from '@/types';

interface PlayerProblemsProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function PlayerProblems({ data, onChange }: PlayerProblemsProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Problem Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Which problem sounds most like you?
        </h3>
        <div className="grid gap-2">
          {PLAYER_PROBLEMS.map((problem) => (
            <button
              key={problem.value}
              onClick={() => onChange({ playerProblem: problem.value as PlayerProblem })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.playerProblem === problem.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {problem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Style */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What does your typical shooting workout look like right now?
        </h3>
        <div className="grid gap-2">
          {WORKOUT_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => onChange({ workoutStyle: style.value as WorkoutStyle })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.workoutStyle === style.value
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
}
