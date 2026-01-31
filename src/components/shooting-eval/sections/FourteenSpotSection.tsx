'use client';

import { RadioGroup } from '../RadioGroup';
import { NumberInput } from '../NumberInput';
import { VideoUrlInput } from '../VideoUrlInput';
import { MISS_PROFILE_OPTIONS } from '@/types/shooting-eval';
import type { FourteenSpotData, FourteenSpotRound, MissProfile } from '@/types/shooting-eval';

interface FourteenSpotSectionProps {
  data: Partial<FourteenSpotData>;
  onChange: (data: Partial<FourteenSpotData>) => void;
}

function RoundInput({
  roundNumber,
  data,
  onChange,
}: {
  roundNumber: 1 | 2 | 3;
  data?: Partial<FourteenSpotRound>;
  onChange: (data: Partial<FourteenSpotRound>) => void;
}) {
  return (
    <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white">Round {roundNumber}</h4>
        <span className="text-xs text-gray-500">14 shots</span>
      </div>

      <NumberInput
        label="Score"
        value={data?.score}
        onChange={(score) => onChange({ ...data, score })}
        min={0}
        max={14}
        required
        helper="Makes out of 14"
      />

      <RadioGroup
        label="Miss Profile"
        options={MISS_PROFILE_OPTIONS}
        value={data?.miss_profile}
        onChange={(profile) => onChange({ ...data, miss_profile: profile as MissProfile })}
        required
        columns={3}
      />
    </div>
  );
}

export function FourteenSpotSection({ data, onChange }: FourteenSpotSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">14-Spot Baseline</h2>
        <p className="text-sm text-gray-400 mb-4">
          14 spots around the arc, 1 shot per spot, 3 full rounds
        </p>
        <div className="bg-bb-card border border-bb-border rounded-lg p-3 text-xs text-gray-400">
          <strong className="text-gold-500">Pattern:</strong> Corner → Wing → Slot → Top of Key → Other Slot → Other Wing → Other Corner,
          then double up and come back around (7 spots × 2 = 14 per round).
        </div>
      </div>

      <div className="space-y-4">
        <RoundInput
          roundNumber={1}
          data={data.round_1}
          onChange={(round_1) => onChange({ ...data, round_1: round_1 as FourteenSpotRound })}
        />
        <RoundInput
          roundNumber={2}
          data={data.round_2}
          onChange={(round_2) => onChange({ ...data, round_2: round_2 as FourteenSpotRound })}
        />
        <RoundInput
          roundNumber={3}
          data={data.round_3}
          onChange={(round_3) => onChange({ ...data, round_3: round_3 as FourteenSpotRound })}
        />
      </div>

      {/* Average display */}
      {data.round_1?.score !== undefined && data.round_2?.score !== undefined && data.round_3?.score !== undefined && (
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400">Average Score</p>
          <p className="text-2xl font-bold text-gold-500">
            {((data.round_1.score + data.round_2.score + data.round_3.score) / 3).toFixed(1)} / 14
          </p>
        </div>
      )}

      <VideoUrlInput
        label="14-Spot Video"
        value={data.video_url}
        onChange={(video_url) => onChange({ ...data, video_url })}
      />
    </div>
  );
}
