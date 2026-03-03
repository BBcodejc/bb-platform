'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { Week0FormState, Week0Step } from '@/types/coaching-client';
import { COURT_POSITION_OPTIONS, PLAY_TAG_OPTIONS, APPROACH_TYPE_OPTIONS, MOVEMENT_RATING_OPTIONS } from '@/types/coaching-client';
import { MISS_PROFILE_OPTIONS } from '@/types/shooting-eval';

interface Week0ReviewSectionProps {
  data: Week0FormState;
  onEditSection: (step: Week0Step) => void;
  isSectionComplete: (section: keyof Week0FormState) => boolean;
}

function SectionSummary({
  title,
  stepId,
  isComplete,
  onEdit,
  children,
}: {
  title: string;
  stepId: Week0Step;
  isComplete: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bb-card border border-bb-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          )}
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-gold-500 hover:text-gold-400 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="text-sm text-gray-400 space-y-1">
        {children}
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function getMissLabel(val?: string) {
  return MISS_PROFILE_OPTIONS.find((o) => o.value === val)?.label || val || '—';
}

export function Week0ReviewSection({ data, onEditSection, isSectionComplete }: Week0ReviewSectionProps) {
  const pi = data.player_info;
  const fs = data.fourteen_spot;
  const dd = data.deep_distance;
  const br = data.back_rim;
  const bf = data.ball_flight;
  const fd = data.fades;
  const ob = data.oversize_ball;
  const lv = data.live_video;
  const vj = data.vertical_jump;
  const mp = data.movement_patterns;

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Review & Submit</h2>
        <p className="text-sm text-gray-400">
          Review your Week 0 assessment data. Tap &quot;Edit&quot; on any section to make changes.
        </p>
      </div>

      <SectionSummary title="Player Info" stepId="player_info" isComplete={isSectionComplete('player_info')} onEdit={() => onEditSection('player_info')}>
        <DataRow label="Name" value={pi?.full_name} />
        <DataRow label="Age" value={pi?.age} />
        <DataRow label="Level" value={pi?.level} />
        <DataRow label="Position" value={pi?.primary_position} />
        <DataRow label="Hand" value={pi?.dominant_hand} />
      </SectionSummary>

      <SectionSummary title="14-Spot Baseline" stepId="fourteen_spot" isComplete={isSectionComplete('fourteen_spot')} onEdit={() => onEditSection('fourteen_spot')}>
        <DataRow label="Round 1" value={fs?.round_1?.score !== undefined ? `${fs.round_1.score}/14 (${getMissLabel(fs.round_1.miss_profile)})` : undefined} />
        <DataRow label="Round 2" value={fs?.round_2?.score !== undefined ? `${fs.round_2.score}/14 (${getMissLabel(fs.round_2.miss_profile)})` : undefined} />
        <DataRow label="Round 3" value={fs?.round_3?.score !== undefined ? `${fs.round_3.score}/14 (${getMissLabel(fs.round_3.miss_profile)})` : undefined} />
      </SectionSummary>

      <SectionSummary title="Deep Distance" stepId="deep_distance" isComplete={isSectionComplete('deep_distance')} onEdit={() => onEditSection('deep_distance')}>
        <DataRow label="Steps Behind 3PT" value={dd?.deep_distance_steps_behind_line} />
        <DataRow label="Deep Rim Hits" value={dd?.deep_line_rim_hits_10 !== undefined ? `${dd.deep_line_rim_hits_10}/10` : undefined} />
        <DataRow label="Contrast Steps" value={dd?.contrast_steps_forward} />
      </SectionSummary>

      <SectionSummary title="Back-Rim Challenge" stepId="back_rim" isComplete={isSectionComplete('back_rim')} onEdit={() => onEditSection('back_rim')}>
        <DataRow label="Level 1" value={br?.level_1?.total_shots !== undefined ? `${br.level_1.total_shots} shots, ${br.level_1.time_seconds}s` : undefined} />
        <DataRow label="Level 2" value={br?.level_2?.total_shots !== undefined ? `${br.level_2.total_shots} shots, ${br.level_2.time_seconds}s` : undefined} />
        <DataRow label="Level 3" value={br?.level_3?.total_shots !== undefined ? `${br.level_3.total_shots} shots, ${br.level_3.time_seconds}s` : undefined} />
      </SectionSummary>

      <SectionSummary title="Ball Flight" stepId="ball_flight" isComplete={isSectionComplete('ball_flight')} onEdit={() => onEditSection('ball_flight')}>
        <DataRow label="Flat (25°)" value={bf?.flat?.makes_or_backrim_7 !== undefined ? `${bf.flat.makes_or_backrim_7}/7` : undefined} />
        <DataRow label="Normal (45°)" value={bf?.normal?.makes_or_backrim_7 !== undefined ? `${bf.normal.makes_or_backrim_7}/7` : undefined} />
        <DataRow label="High (60°)" value={bf?.high?.makes_or_backrim_7 !== undefined ? `${bf.high.makes_or_backrim_7}/7` : undefined} />
      </SectionSummary>

      <SectionSummary title="Fades" stepId="fades" isComplete={isSectionComplete('fades')} onEdit={() => onEditSection('fades')}>
        <DataRow label="Fade Right" value={fd?.fade_right?.makes_or_backrim_7 !== undefined ? `${fd.fade_right.makes_or_backrim_7}/7` : undefined} />
        <DataRow label="Fade Left" value={fd?.fade_left?.makes_or_backrim_7 !== undefined ? `${fd.fade_left.makes_or_backrim_7}/7` : undefined} />
      </SectionSummary>

      <SectionSummary title="Oversize Ball" stepId="oversize_ball" isComplete={isSectionComplete('oversize_ball')} onEdit={() => onEditSection('oversize_ball')}>
        <DataRow label="Regular Score" value={ob?.score_regular !== undefined ? `${ob.score_regular}/14` : undefined} />
        <DataRow label="Oversize Score" value={ob?.score_oversize !== undefined ? `${ob.score_oversize}/14` : undefined} />
        <DataRow label="Difference" value={ob?.score_regular !== undefined && ob?.score_oversize !== undefined ? `${ob.score_regular - ob.score_oversize} shots` : undefined} />
      </SectionSummary>

      <SectionSummary title="Live 1v1 Video" stepId="live_video" isComplete={isSectionComplete('live_video')} onEdit={() => onEditSection('live_video')}>
        <DataRow label="Clips Uploaded" value={lv?.clips?.length || 0} />
        <DataRow label="Drive Folder" value={lv?.drive_folder_url ? 'Provided' : undefined} />
      </SectionSummary>

      <SectionSummary title="Vertical Jump" stepId="vertical_jump" isComplete={isSectionComplete('vertical_jump')} onEdit={() => onEditSection('vertical_jump')}>
        <DataRow label="Standing Reach" value={vj?.standing_reach_inches !== undefined ? `${vj.standing_reach_inches}"` : undefined} />
        <DataRow label="Max Jump Reach" value={vj?.max_vert_inches !== undefined ? `${vj.max_vert_inches}"` : undefined} />
        {vj?.standing_reach_inches && vj?.max_vert_inches && (
          <DataRow label="Vertical" value={`${vj.max_vert_inches - vj.standing_reach_inches}"`} />
        )}
        <DataRow label="Approach" value={APPROACH_TYPE_OPTIONS.find((o) => o.value === vj?.approach_type)?.label} />
      </SectionSummary>

      <SectionSummary title="Movement Patterns" stepId="movement_patterns" isComplete={isSectionComplete('movement_patterns')} onEdit={() => onEditSection('movement_patterns')}>
        <DataRow label="Trail Leg" value={mp?.trail_leg?.rating !== undefined ? `${mp.trail_leg.rating}/5` : undefined} />
        <DataRow label="Stops" value={mp?.stops?.rating !== undefined ? `${mp.stops.rating}/5` : undefined} />
        <DataRow label="Hip Mobility" value={mp?.hip_mobility?.rating !== undefined ? `${mp.hip_mobility.rating}/5` : undefined} />
      </SectionSummary>
    </div>
  );
}
