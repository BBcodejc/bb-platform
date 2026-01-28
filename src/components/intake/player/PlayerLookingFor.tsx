'use client';

import { cn } from '@/lib/utils';
import { PLAYER_LOOKING_FOR, INVESTMENT_LEVELS } from '@/types';
import type { IntakeFormData, PlayerLookingFor as PlayerLookingForType, InvestmentLevel } from '@/types';

interface PlayerLookingForProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function PlayerLookingFor({ data, onChange }: PlayerLookingForProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* What they're looking for */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What best describes what you&apos;re looking for?
        </h3>
        <div className="grid gap-2">
          {PLAYER_LOOKING_FOR.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ playerLookingFor: option.value as PlayerLookingForType })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.playerLookingFor === option.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Investment level */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How serious are you about investing in your development in the next 90 days?
        </h3>
        <div className="grid gap-2">
          {INVESTMENT_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ investmentLevel: level.value as InvestmentLevel })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.investmentLevel === level.value
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
