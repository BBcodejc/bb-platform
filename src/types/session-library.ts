// =====================================================
// SESSION LIBRARY TYPES
// Types for the block-based session system
// =====================================================

export interface SessionBlock {
  id: string;
  blockId: string;           // 'SH-01', 'MV-02', etc.
  name: string;
  category: 'shooting' | 'movement' | 'ball_manipulation' | 'live_play' | 'evaluation';
  durationMinutes: number;
  durationDisplay: string;   // "15-20 min"
  minPhase: number;          // 1-5
  constraintLevelMin?: number | null;
  constraintLevelMax?: number | null;
  equipment: string[];
  description: string;
  externalCues: string[];
}

export interface SessionDayTemplate {
  id: string;
  templateId: string;         // 'system-day', 'game-day'
  name: string;
  totalDurationDisplay?: string;
  minPhase: number;
  blockIds: string[];
  blockNotes: Record<string, string>;
  daysUsed?: string;
  description?: string;
}

export interface SessionPlan {
  id: string;
  playerId: string;
  date: string;
  templateId?: string;
  templateName?: string;
  blockIds: string[];
  blockNotes: Record<string, string>;
  coachingNotes?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'skipped';
  completedBlocks: string[];
  playerNotes?: string;
  totalDurationMinutes?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Plan with resolved block details for the player-facing view
export interface SessionPlanWithBlocks extends SessionPlan {
  blocks: SessionBlock[];
}

// Category config for UI rendering — colors match the existing elite portal theme
export const BLOCK_CATEGORY_CONFIG: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}> = {
  shooting: {
    label: 'Shooting',
    color: 'text-gold-400',
    bgColor: 'bg-gold-500/10 border-gold-500/20',
    dotColor: 'bg-gold-500',
  },
  movement: {
    label: 'Movement',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    dotColor: 'bg-blue-500',
  },
  ball_manipulation: {
    label: 'Ball Manipulation',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    dotColor: 'bg-purple-500',
  },
  live_play: {
    label: 'Live Play',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    dotColor: 'bg-red-500',
  },
  evaluation: {
    label: 'Evaluation',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    dotColor: 'bg-orange-500',
  },
};

// Phase mapping: bb_level to max accessible phase
export function getMaxPhaseForBBLevel(bbLevel: number): number {
  return Math.min(bbLevel + 1, 5);
}

// Map DB row (snake_case) to SessionBlock (camelCase)
export function mapBlockRow(row: any): SessionBlock {
  return {
    id: row.id,
    blockId: row.block_id,
    name: row.name,
    category: row.category,
    durationMinutes: row.duration_minutes,
    durationDisplay: row.duration_display,
    minPhase: row.min_phase,
    constraintLevelMin: row.constraint_level_min,
    constraintLevelMax: row.constraint_level_max,
    equipment: row.equipment || [],
    description: row.description,
    externalCues: row.external_cues || [],
  };
}

// Map DB row to SessionDayTemplate
export function mapTemplateRow(row: any): SessionDayTemplate {
  return {
    id: row.id,
    templateId: row.template_id,
    name: row.name,
    totalDurationDisplay: row.total_duration_display,
    minPhase: row.min_phase,
    blockIds: row.block_ids || [],
    blockNotes: row.block_notes || {},
    daysUsed: row.days_used,
    description: row.description,
  };
}

// Map DB row to SessionPlan
export function mapPlanRow(row: any): SessionPlan {
  return {
    id: row.id,
    playerId: row.player_id,
    date: row.session_date,
    templateId: row.template_id,
    templateName: row.template_name,
    blockIds: row.block_ids || [],
    blockNotes: row.block_notes || {},
    coachingNotes: row.coaching_notes,
    status: row.status,
    completedBlocks: row.completed_blocks || [],
    playerNotes: row.player_notes,
    totalDurationMinutes: row.total_duration_minutes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
