// ============================================
// COACHING CLIENT SYSTEM TYPES
// ============================================

import type {
  PlayerInfo,
  FourteenSpotData,
  DeepDistanceData,
  BackRimData,
  BallFlightData,
  FadesData,
} from './shooting-eval';

export interface CoachingClient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  level: 'youth' | 'high-school' | 'college' | 'pro' | 'recreational';
  team?: string;
  age?: number;
  slug: string;
  coachAssigned?: string;
  enrollmentDate?: string;
  programType: 'standard' | 'elite' | 'remote';
  currentWeek: number;
  isActive: boolean;
  onboardingComplete: boolean;
  prospectId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WEEK 0 ASSESSMENT
// ============================================

export type Week0Step =
  | 'player_info'
  | 'fourteen_spot'
  | 'deep_distance'
  | 'back_rim'
  | 'ball_flight'
  | 'fades'
  | 'oversize_ball'
  | 'live_video'
  | 'vertical_jump'
  | 'movement_patterns'
  | 'review';

export interface OversizeBallData {
  score_regular: number;
  score_oversize: number;
  difference: number;
  spots_tested: number;
  notes?: string;
  video_url?: string;
}

export interface LiveVideoClip {
  id: string;
  url: string;
  court_position: string;
  tag: string;
  uploaded_at: string;
}

export interface LiveVideoData {
  clips: LiveVideoClip[];
  total_clips: number;
  drive_folder_url?: string;
}

export interface VerticalJumpData {
  standing_reach_inches?: number;
  max_vert_inches: number;
  approach_type: 'one_foot' | 'two_foot' | 'both';
  notes?: string;
  video_url?: string;
}

export type MovementRating = 1 | 2 | 3 | 4 | 5;

export interface MovementPatternAssessment {
  rating?: MovementRating;
  notes?: string;
  video_url?: string;
}

export interface MovementPatternsData {
  trail_leg: MovementPatternAssessment;
  stops: MovementPatternAssessment;
  hip_mobility: MovementPatternAssessment;
}

export interface Week0FormState {
  player_info?: Partial<PlayerInfo>;
  fourteen_spot?: Partial<FourteenSpotData>;
  deep_distance?: Partial<DeepDistanceData>;
  back_rim?: Partial<BackRimData>;
  ball_flight?: Partial<BallFlightData>;
  fades?: Partial<FadesData>;
  oversize_ball?: Partial<OversizeBallData>;
  live_video?: Partial<LiveVideoData>;
  vertical_jump?: Partial<VerticalJumpData>;
  movement_patterns?: Partial<MovementPatternsData>;
}

export interface Week0Assessment {
  id: string;
  clientId: string;
  status: 'in_progress' | 'submitted' | 'reviewed' | 'complete';
  currentStep: Week0Step;
  formData: Week0FormState;
  coachNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const COURT_POSITION_OPTIONS = [
  { value: 'wing_left', label: 'Left Wing' },
  { value: 'wing_right', label: 'Right Wing' },
  { value: 'top_of_key', label: 'Top of Key' },
  { value: 'corner_left', label: 'Left Corner' },
  { value: 'corner_right', label: 'Right Corner' },
  { value: 'post_left', label: 'Left Post' },
  { value: 'post_right', label: 'Right Post' },
  { value: 'transition', label: 'Transition' },
  { value: 'full_court', label: 'Full Court' },
];

export const PLAY_TAG_OPTIONS = [
  { value: 'iso', label: 'Isolation' },
  { value: 'drive', label: 'Drive' },
  { value: 'pull_up', label: 'Pull-Up' },
  { value: 'post_up', label: 'Post Up' },
  { value: 'pick_and_roll', label: 'Pick & Roll' },
  { value: 'catch_and_shoot', label: 'Catch & Shoot' },
  { value: 'off_ball', label: 'Off-Ball Movement' },
  { value: 'defense', label: 'Defense' },
  { value: 'general', label: 'General' },
];

export const APPROACH_TYPE_OPTIONS = [
  { value: 'one_foot', label: 'One Foot' },
  { value: 'two_foot', label: 'Two Feet' },
  { value: 'both', label: 'Both' },
];

export const MOVEMENT_RATING_OPTIONS = [
  { value: '1', label: '1 - Needs Work' },
  { value: '2', label: '2 - Developing' },
  { value: '3', label: '3 - Average' },
  { value: '4', label: '4 - Good' },
  { value: '5', label: '5 - Advanced' },
];
