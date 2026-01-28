'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { PLAYER_LEVELS } from '@/types';
import type { IntakeFormData, PlayerLevel } from '@/types';

interface ParentChildInfoProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
}

export function ParentChildInfo({ data, onChange }: ParentChildInfoProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Child basic info */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Who is this for?
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Child&apos;s Name
            </label>
            <Input
              value={data.childName || ''}
              onChange={(e) => onChange({ childName: e.target.value })}
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Age
            </label>
            <Input
              type="number"
              value={data.childAge || ''}
              onChange={(e) => onChange({ childAge: parseInt(e.target.value) || undefined })}
              placeholder="Age"
            />
          </div>
        </div>
      </div>

      {/* Current level */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Current level
        </h3>
        <p className="text-sm text-gray-400 mb-4">HS, AAU, college, etc.</p>
        <div className="grid gap-2">
          {PLAYER_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange({ childLevel: level.value as PlayerLevel })}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all',
                data.childLevel === level.value
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-bb-border bg-bb-card hover:border-gold-500/50 text-gray-300'
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Child strengths */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What do you feel your son/daughter is best at on the court right now?
        </h3>
        <textarea
          value={data.childStrengths || ''}
          onChange={(e) => onChange({ childStrengths: e.target.value })}
          placeholder="Describe their strengths..."
          className="w-full h-24 px-4 py-3 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 resize-none"
        />
      </div>
    </div>
  );
}
