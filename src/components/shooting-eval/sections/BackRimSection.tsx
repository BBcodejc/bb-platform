'use client';

import { NumberInput } from '../NumberInput';
import { VideoUrlInput } from '../VideoUrlInput';
import type { BackRimData, BackRimLevel } from '@/types/shooting-eval';

interface BackRimSectionProps {
  data: Partial<BackRimData>;
  onChange: (data: Partial<BackRimData>) => void;
}

function LevelInput({
  level,
  description,
  data,
  onChange,
}: {
  level: 1 | 2 | 3;
  description: string;
  data?: Partial<BackRimLevel>;
  onChange: (data: Partial<BackRimLevel>) => void;
}) {
  return (
    <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 text-xs flex items-center justify-center font-bold">
            {level}
          </span>
          Level {level}
        </h4>
        <span className="text-xs text-gray-400">{description}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          label="Total Shots"
          value={data?.total_shots}
          onChange={(total_shots) => onChange({ ...data, total_shots })}
          min={1}
          max={100}
          required
          showStepper={false}
        />

        <NumberInput
          label="Time (seconds)"
          value={data?.time_seconds}
          onChange={(time_seconds) => onChange({ ...data, time_seconds })}
          min={1}
          max={600}
          required
          showStepper={false}
        />
      </div>
    </div>
  );
}

export function BackRimSection({ data, onChange }: BackRimSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Back-Rim Challenge</h2>
        <p className="text-sm text-gray-400 mb-4">
          All shots from 3PT top of key
        </p>
        <div className="bg-bb-card border border-bb-border rounded-lg p-3 text-xs text-gray-400">
          <strong className="text-gold-500">Goal:</strong> Hit back-rim shots in a row, then make the final shot.
          Record how many total shots it takes and how long.
        </div>
      </div>

      <div className="space-y-4">
        <LevelInput
          level={1}
          description="1 back-rim → make"
          data={data.level_1}
          onChange={(level_1) => onChange({ ...data, level_1: level_1 as BackRimLevel })}
        />

        <LevelInput
          level={2}
          description="2 back-rim → make"
          data={data.level_2}
          onChange={(level_2) => onChange({ ...data, level_2: level_2 as BackRimLevel })}
        />

        <LevelInput
          level={3}
          description="3 back-rim → make"
          data={data.level_3}
          onChange={(level_3) => onChange({ ...data, level_3: level_3 as BackRimLevel })}
        />
      </div>

      <VideoUrlInput
        label="Back-Rim Challenge Video"
        value={data.video_url}
        onChange={(video_url) => onChange({ ...data, video_url })}
      />
    </div>
  );
}
