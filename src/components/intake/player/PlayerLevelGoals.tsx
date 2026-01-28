'use client';

import { cn } from '@/lib/utils';
import { PLAYER_LEVELS, PLAYER_MAIN_GOALS } from '@/types';
import type { IntakeFormData, PlayerLevel, PlayerMainGoal } from '@/types';

interface PlayerLevelGoalsProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function PlayerLevelGoals({ data, onChange }: PlayerLevelGoalsProps) {
  const toggleGoal = (goal: PlayerMainGoal) => {
    const current = data.playerMainGoal || [];
    if (current.includes(goal)) {
      onChange({ playerMainGoal: current.filter((g) => g !== goal) });
    } else if (current.length < 2) {
      onChange({ playerMainGoal: [...current, goal] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Level Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What level do you currently play at?
        </h3>
        <div className="grid gap-2">
          {PLAYER_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ playerLevel: level.value as PlayerLevel })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.playerLevel === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Goals */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What&apos;s the main thing you want to improve right now?
        </h3>
        <p className="text-sm text-gray-400 mb-4">Pick 1-2</p>
        <div className="grid gap-2">
          {PLAYER_MAIN_GOALS.map((goal) => (
            <button
              key={goal.value}
              onClick={() => toggleGoal(goal.value as PlayerMainGoal)}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.playerMainGoal?.includes(goal.value as PlayerMainGoal)
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
