'use client';

import { RadioGroup } from '../RadioGroup';
import { NumberInput } from '../NumberInput';
import { VideoUrlInput } from '../VideoUrlInput';
import { MISS_PROFILE_OPTIONS } from '@/types/shooting-eval';
import type { FadesData, FadeDirection, MissProfile } from '@/types/shooting-eval';

interface FadesSectionProps {
  data: Partial<FadesData>;
  onChange: (data: Partial<FadesData>) => void;
}

function FadeInput({
  direction,
  data,
  onChange,
}: {
  direction: 'right' | 'left';
  data?: Partial<FadeDirection>;
  onChange: (data: Partial<FadeDirection>) => void;
}) {
  return (
    <div className="p-4 bg-bb-dark rounded-xl border border-bb-border space-y-4">
      <h4 className="font-semibold text-white capitalize">Fade {direction}</h4>

      <NumberInput
        label="Makes + Back-Rim"
        value={data?.makes_or_backrim_7}
        onChange={(makes_or_backrim_7) => onChange({ ...data, makes_or_backrim_7 })}
        min={0}
        max={7}
        required
        helper="Out of 7 attempts"
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

export function FadesSection({ data, onChange }: FadesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Fades</h2>
        <p className="text-sm text-gray-400 mb-4">
          Testing directional fade-away shots
        </p>
        <div className="bg-bb-card border border-bb-border rounded-lg p-3 text-xs text-gray-400">
          <strong className="text-gold-500">Goal:</strong> Take 7 fade shots in each direction.
          Count makes + back-rim hits as successes.
        </div>
      </div>

      <div className="space-y-4">
        <FadeInput
          direction="right"
          data={data.fade_right}
          onChange={(fade_right) => onChange({ ...data, fade_right: fade_right as FadeDirection })}
        />

        <FadeInput
          direction="left"
          data={data.fade_left}
          onChange={(fade_left) => onChange({ ...data, fade_left: fade_left as FadeDirection })}
        />
      </div>

      {/* Summary */}
      {data.fade_right?.makes_or_backrim_7 !== undefined &&
        data.fade_left?.makes_or_backrim_7 !== undefined && (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">Fade Right</p>
                <p className="text-xl font-bold text-white">{data.fade_right.makes_or_backrim_7}/7</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fade Left</p>
                <p className="text-xl font-bold text-gold-500">{data.fade_left.makes_or_backrim_7}/7</p>
              </div>
            </div>
          </div>
        )}

      <VideoUrlInput
        label="Fades Video"
        value={data.video_url}
        onChange={(video_url) => onChange({ ...data, video_url })}
      />
    </div>
  );
}
