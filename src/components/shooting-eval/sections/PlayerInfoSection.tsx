'use client';

import { RadioGroup } from '../RadioGroup';
import { NumberInput } from '../NumberInput';
import {
  PLAYER_LEVEL_OPTIONS,
  POSITION_OPTIONS,
  DOMINANT_HAND_OPTIONS,
} from '@/types/shooting-eval';
import type { PlayerInfo } from '@/types/shooting-eval';

interface PlayerInfoSectionProps {
  data: Partial<PlayerInfo>;
  onChange: (data: Partial<PlayerInfo>) => void;
}

export function PlayerInfoSection({ data, onChange }: PlayerInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Player Info</h2>
        <p className="text-sm text-gray-400">Let&apos;s start with some basics</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Full Name <span className="text-gold-500">*</span>
        </label>
        <input
          type="text"
          value={data.full_name || ''}
          onChange={(e) => onChange({ ...data, full_name: e.target.value })}
          placeholder="Enter your full name"
          className="w-full h-10 px-4 rounded-lg border border-bb-border bg-bb-card text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
        />
      </div>

      {/* Age */}
      <NumberInput
        label="Age"
        value={data.age}
        onChange={(age) => onChange({ ...data, age })}
        min={8}
        max={60}
        required
        showStepper={false}
      />

      {/* Level */}
      <RadioGroup
        label="Level"
        options={PLAYER_LEVEL_OPTIONS}
        value={data.level}
        onChange={(level) => onChange({ ...data, level: level as PlayerInfo['level'] })}
        required
        columns={2}
      />

      {/* Position */}
      <RadioGroup
        label="Primary Position"
        options={POSITION_OPTIONS}
        value={data.primary_position}
        onChange={(pos) => onChange({ ...data, primary_position: pos as PlayerInfo['primary_position'] })}
        columns={3}
      />

      {/* Dominant Hand */}
      <RadioGroup
        label="Dominant Hand"
        options={DOMINANT_HAND_OPTIONS}
        value={data.dominant_hand}
        onChange={(hand) => onChange({ ...data, dominant_hand: hand as PlayerInfo['dominant_hand'] })}
        required
        columns={3}
      />
    </div>
  );
}
