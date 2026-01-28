// ============================================
// BASKETBALL BIOMECHANICS - TYPE DEFINITIONS
// ============================================

// ---- ENUMS & CONSTANTS ----

export type Role = 'player' | 'parent' | 'coach' | 'organization';

export type PlayerLevel =
  | 'middle_school'
  | 'high_school'
  | 'prep_juco'
  | 'college'
  | 'pro_overseas'
  | 'rec';

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'combo_guard' | 'combo_forward';

export type AssessmentType = 'shot_only' | 'complete_game';

export type CommitmentLevel = 'casual' | 'serious' | 'elite';

export type PipelineStatus =
  | 'intake_started'
  | 'intake_completed'
  | 'payment_pending'
  | 'paid'
  | 'tests_pending'
  | 'tests_submitted'
  | 'review_in_progress'
  | 'profile_delivered'
  | 'high_ticket_invited'
  | 'enrolled_mentorship';

export type Struggle =
  | 'confidence'
  | 'distance'
  | 'consistency'
  | 'off_dribble'
  | 'game_transfer';

export type MissType =
  | 'make'
  | 'back_rim'
  | 'front_rim'
  | 'short'
  | 'long'
  | 'left'
  | 'right';

export type TestType =
  | 'fourteen_spot'
  | 'flat_flight'
  | 'deep_distance'
  | 'back_rim'
  | 'oversized_gauntlet'
  | 'speed_threshold'
  | 'spectrum_callout'
  | 'elite_standard';

export type BBLevel = 1 | 2 | 3 | 4;

// ---- NEW INTAKE FORM ENUMS ----

export type PlayerMainGoal =
  | 'spot_up_3pt'
  | 'off_dribble'
  | 'confidence'
  | 'beating_defender'
  | 'finishing'
  | 'scoring_package'
  | 'everything';

export type ThreePtPercentage =
  | 'under_20'
  | '20_29'
  | '30_34'
  | '35_39'
  | '40_plus';

export type PlayerProblem =
  | 'practice_not_games'
  | 'no_trust'
  | 'overthink_form'
  | 'deep_distance'
  | 'creating_space'
  | 'scared_shooter';

export type WorkoutStyle =
  | 'spot_up_reps'
  | 'gun_machine'
  | 'form_shooting'
  | 'random_shots'
  | 'constraints';

export type DaysPerWeek =
  | '2_3'
  | '4_5'
  | '6_7';

export type PlayerLookingFor =
  | 'self_paced_system'
  | 'personal_evaluation'
  | 'full_game_audit'
  | 'not_sure';

export type InvestmentLevel =
  | 'premium'
  | 'moderate'
  | 'low_cost';

// Parent types
export type ParentIssue =
  | 'hesitates_shoot'
  | 'misses_open_3s'
  | 'cant_create'
  | 'cant_beat_defenders'
  | 'poor_finishing'
  | 'mentally_weak'
  | 'other';

export type ChildConfidence =
  | 'very_low'
  | 'up_and_down'
  | 'solid'
  | 'very_high';

export type ParentGoal =
  | 'fix_shooting'
  | 'improve_scoring'
  | 'build_confidence'
  | 'prepare_level';

export type WeeklyTrainingHours =
  | '2_3'
  | '4_6'
  | '7_10'
  | '10_plus';

export type ParentInterest =
  | 'done_for_you'
  | 'personal_evaluation'
  | 'high_touch_mentorship';

export type ParentInvolvement =
  | 'very_involved'
  | 'somewhat_involved'
  | 'not_involved';

// Coach types
export type CoachLevel =
  | 'youth_middle'
  | 'high_school'
  | 'prep_aau'
  | 'college'
  | 'pro_overseas'
  | 'private_trainer';

export type CoachRole =
  | 'head_coach'
  | 'assistant_coach'
  | 'skills_trainer'
  | 'player_dev'
  | 'performance_sc';

export type CoachIssue =
  | 'cant_shoot_3'
  | 'inconsistent_game'
  | 'no_space_1on1'
  | 'lack_deception'
  | 'poor_finishing'
  | 'poor_decisions'
  | 'other';

export type CoachShootingStyle =
  | 'on_air_spotup'
  | 'machines'
  | 'form_shooting'
  | 'live_play'
  | 'mix';

export type MotorLearningFamiliarity =
  | 'very_familiar'
  | 'somewhat_familiar'
  | 'not_familiar';

export type CoachLookingFor =
  | 'masterclass'
  | 'shooting_system'
  | 'movement_blueprint'
  | 'consulting'
  | 'certification';

export type PlayerCount =
  | '1_5'
  | '6_15'
  | '16_30'
  | '30_plus';

export type CoachOpenToCoaching =
  | 'yes'
  | 'maybe'
  | 'no';

export type CoachNextStep =
  | 'on_demand_education'
  | 'playbook_system'
  | 'bb_lens_assessment'
  | 'live_consultation';

// Organization types
export type OrgType =
  | 'club_aau'
  | 'school'
  | 'college'
  | 'pro'
  | 'training_facility';

export type TeamCount =
  | '1_3'
  | '4_8'
  | '9_15'
  | '16_plus';

export type OrgProblem =
  | 'shooting_effectiveness'
  | 'offensive_creation'
  | 'no_dev_system'
  | 'no_deceptive_movers'
  | 'poor_transfer'
  | 'coaching_not_aligned';

export type OrgSupport =
  | 'full_audit'
  | 'shooting_calibration'
  | 'coach_education'
  | 'ongoing_consulting';

export type OrgReadiness =
  | 'very_ready'
  | 'open'
  | 'curious';

export type OrgTimeline =
  | 'within_month'
  | 'within_3_months'
  | '3_6_months'
  | 'gathering_info';

export type OrgBudget =
  | 'low_4_figures'
  | 'mid_4_figures'
  | 'high_4_low_5'
  | 'depends_on_scope';

// ---- INTAKE FORM ----

export interface IntakeFormData {
  // Step 1: Role
  role: Role;

  // Contact Info (shared across all)
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;

  // ========== PLAYER FIELDS ==========
  playerLevel?: PlayerLevel;
  playerMainGoal?: PlayerMainGoal[];
  gameVsWorkout?: string; // Open text
  threePtPercentage?: ThreePtPercentage;
  playerProblem?: PlayerProblem;
  workoutStyle?: WorkoutStyle;
  daysPerWeek?: DaysPerWeek;
  playerLookingFor?: PlayerLookingFor;
  investmentLevel?: InvestmentLevel;
  playerAge?: number;
  playerLocation?: string;
  playerInstagram?: string;

  // ========== PARENT FIELDS ==========
  childName?: string;
  childAge?: number;
  childLevel?: PlayerLevel;
  childStrengths?: string; // Open text
  parentIssues?: ParentIssue[];
  parentIssueOther?: string;
  childConfidence?: ChildConfidence;
  parentMainGoal?: ParentGoal;
  weeklyTrainingHours?: WeeklyTrainingHours;
  previousTrainerExperience?: string; // Open text
  parentInterest?: ParentInterest;
  parentInvolvement?: ParentInvolvement;
  parentInvestmentLevel?: InvestmentLevel;

  // ========== COACH FIELDS ==========
  coachLevel?: CoachLevel;
  coachRole?: CoachRole;
  coachIssues?: CoachIssue[];
  coachIssueOther?: string;
  coachShootingStyle?: CoachShootingStyle;
  motorLearningFamiliarity?: MotorLearningFamiliarity;
  coachLookingFor?: CoachLookingFor;
  coachPlayerCount?: PlayerCount;
  coachConstraints?: string; // Open text
  coachOpenToCoaching?: CoachOpenToCoaching;
  coachNextStep?: CoachNextStep;
  coachCertificationWants?: string; // Open text

  // ========== ORGANIZATION FIELDS ==========
  orgType?: OrgType;
  orgName?: string;
  teamCount?: TeamCount;
  orgProblems?: OrgProblem[];
  currentDevModel?: string; // Open text
  orgWin?: string; // Open text
  orgSupport?: OrgSupport;
  orgReadiness?: OrgReadiness;
  orgTimeline?: OrgTimeline;
  orgDecisionMakers?: string; // Open text
  orgBudget?: OrgBudget;

  // Assessment (for routing)
  assessmentType?: AssessmentType;

  // Computed routing recommendation
  routingRecommendation?: string;
}

// ---- DATABASE MODELS ----

export interface Prospect {
  id: string;
  created_at: string;
  updated_at: string;

  role: Role;
  assessment_type?: AssessmentType;

  email: string;
  phone?: string;
  first_name: string;
  last_name: string;

  // Player fields
  player_level?: PlayerLevel;
  player_main_goal?: PlayerMainGoal[];
  game_vs_workout?: string;
  three_pt_percentage?: ThreePtPercentage;
  player_problem?: PlayerProblem;
  workout_style?: WorkoutStyle;
  days_per_week?: DaysPerWeek;
  player_looking_for?: PlayerLookingFor;
  investment_level?: InvestmentLevel;
  player_age?: number;
  player_location?: string;
  player_instagram?: string;

  // Parent fields
  child_name?: string;
  child_age?: number;
  child_level?: PlayerLevel;
  child_strengths?: string;
  parent_issues?: ParentIssue[];
  parent_issue_other?: string;
  child_confidence?: ChildConfidence;
  parent_main_goal?: ParentGoal;
  weekly_training_hours?: WeeklyTrainingHours;
  previous_trainer_experience?: string;
  parent_interest?: ParentInterest;
  parent_involvement?: ParentInvolvement;
  parent_investment_level?: InvestmentLevel;

  // Coach fields
  coach_level?: CoachLevel;
  coach_role?: CoachRole;
  coach_issues?: CoachIssue[];
  coach_issue_other?: string;
  coach_shooting_style?: CoachShootingStyle;
  motor_learning_familiarity?: MotorLearningFamiliarity;
  coach_looking_for?: CoachLookingFor;
  coach_player_count?: PlayerCount;
  coach_constraints?: string;
  coach_open_to_coaching?: CoachOpenToCoaching;
  coach_next_step?: CoachNextStep;
  coach_certification_wants?: string;

  // Organization fields
  org_type?: OrgType;
  org_name?: string;
  team_count?: TeamCount;
  org_problems?: OrgProblem[];
  current_dev_model?: string;
  org_win?: string;
  org_support?: OrgSupport;
  org_readiness?: OrgReadiness;
  org_timeline?: OrgTimeline;
  org_decision_makers?: string;
  org_budget?: OrgBudget;

  // Legacy fields for compatibility
  player_height?: string;
  player_position?: Position;
  primary_struggle?: Struggle[];
  deep_distance_breakdown?: string;
  previous_coaching?: boolean;
  previous_coaching_details?: string;
  goals?: string;
  commitment_level?: CommitmentLevel;

  pipeline_status: PipelineStatus;
  high_ticket_prospect: boolean;
  notes?: string;
  routing_recommendation?: string;
}

export interface Payment {
  id: string;
  prospect_id: string;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  product_type: 'shooting_eval' | 'complete_eval' | 'mentorship';
  created_at: string;
}

// ---- TEST RESULTS ----

export interface SpotResult {
  shot1: MissType;
  shot2: MissType;
}

export interface FourteenSpotData {
  spot1: SpotResult; // Left corner
  spot2: SpotResult; // Left wing
  spot3: SpotResult; // Left elbow
  spot4: SpotResult; // Top of key
  spot5: SpotResult; // Right elbow
  spot6: SpotResult; // Right wing
  spot7: SpotResult; // Right corner
}

export interface DeepDistanceData {
  distanceBehindLine: number; // feet
  shots: Array<{
    rimContact: boolean;
    make: boolean;
    short: boolean;
  }>;
}

export interface BackRimData {
  spots: Array<{
    spotName: string;
    consecutiveHits: number;
    bestStreak: number;
  }>;
}

export interface TestResult {
  id: string;
  prospect_id: string;
  test_type: TestType;

  total_attempts?: number;
  makes?: number;

  // Type-specific data stored as JSONB
  spot_data?: FourteenSpotData;
  deep_distance_feet?: number;
  rim_contacts?: number;
  short_misses?: number;
  consecutive_back_rim?: number;
  target_arc?: '25' | '45' | '60';
  good_reps?: number;
  oversized_score?: number;
  release_time_avg?: number;

  bb_level_achieved?: BBLevel;

  notes?: string;
  video_links?: string[];
  submitted_at: string;
}

export interface VideoUpload {
  id: string;
  prospect_id: string;
  google_drive_folder_id?: string;
  google_drive_folder_url?: string;
  video_type: 'game_footage_makes' | 'game_footage_misses' | 'drill_footage' | 'test_footage';
  file_count: number;
  uploaded_at: string;
}

// ---- EVALUATIONS ----

export interface MissProfile {
  primary: MissType;
  secondary?: MissType;
  notes?: string;
}

export interface Evaluation {
  id: string;
  prospect_id: string;

  current_bb_level?: BBLevel;
  miss_profile?: MissProfile;
  deep_distance_analysis?: string;
  ball_flight_analysis?: string;
  energy_transfer_notes?: string;

  constraints_identified?: string[];

  priority_protocols?: string[];
  weekly_plan_summary?: string;
  four_week_focus?: string;

  full_assessment?: string;
  profile_pdf_url?: string;

  mentorship_fit_score?: number;
  mentorship_recommendation?: string;

  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  reviewed_by?: string;
  reviewed_at?: string;
  delivered_at?: string;

  created_at: string;
}

// ---- MENTORSHIP ----

export interface Mentorship {
  id: string;
  prospect_id: string;
  evaluation_id?: string;

  program_type: '3_month_blueprint';
  price: number;
  start_date?: string;
  end_date?: string;

  equipment_shipped: boolean;
  equipment_tracking?: string;
  equipment_items?: string[];

  check_in_frequency: 'weekly' | 'biweekly';
  next_check_in?: string;

  signwell_document_id?: string;
  contract_signed: boolean;
  contract_signed_at?: string;

  status: 'pending' | 'active' | 'completed' | 'cancelled';

  created_at: string;
}

// ---- UI TYPES ----

export interface IntakeStep {
  id: string;
  title: string;
  description?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

// ---- API TYPES ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PortalData {
  prospect: Prospect;
  tests: TestResult[];
  videos: VideoUpload[];
  evaluation?: Evaluation;
}

// ---- BB STANDARD SCORING ----

export interface BBScoring {
  fourteenSpotPass: number; // 10/14
  flatFlightPass: number;   // 7/10 (makes + back rim)
  deepDistancePass: number; // 8/10 rim contacts
  backRimPass: number;      // 3 in a row
  oversizedPass: number;    // +7 score
  speedThresholdPass: number; // 50% makes
  spectrumPass: number;     // 8/10 reactive makes
  elitePass: number;        // 2 back rim makes in a row at each spot
}

export const BB_PASSING_CRITERIA: BBScoring = {
  fourteenSpotPass: 10,
  flatFlightPass: 7,
  deepDistancePass: 8,
  backRimPass: 3,
  oversizedPass: 7,
  speedThresholdPass: 5,
  spectrumPass: 8,
  elitePass: 2,
};

// ---- FORM OPTIONS ----

export const PLAYER_LEVELS: SelectOption[] = [
  { value: 'middle_school', label: 'Middle School' },
  { value: 'high_school', label: 'High School' },
  { value: 'prep_juco', label: 'Prep / JUCO' },
  { value: 'college', label: 'College' },
  { value: 'pro_overseas', label: 'Pro / Overseas / G League' },
  { value: 'rec', label: 'Recreational / Men\'s League' },
];

export const PLAYER_MAIN_GOALS: SelectOption[] = [
  { value: 'spot_up_3pt', label: 'Spot-up 3PT shooting' },
  { value: 'off_dribble', label: 'Off-the-dribble shooting' },
  { value: 'confidence', label: 'Confidence shooting in games' },
  { value: 'beating_defender', label: 'Beating my man 1-on-1 / movement & deception' },
  { value: 'finishing', label: 'Finishing at the rim' },
  { value: 'scoring_package', label: 'Overall scoring package' },
  { value: 'everything', label: '"Everything – I feel behind"' },
];

export const THREE_PT_PERCENTAGES: SelectOption[] = [
  { value: 'under_20', label: 'Under 20%' },
  { value: '20_29', label: '20-29%' },
  { value: '30_34', label: '30-34%' },
  { value: '35_39', label: '35-39%' },
  { value: '40_plus', label: '40%+' },
];

export const PLAYER_PROBLEMS: SelectOption[] = [
  { value: 'practice_not_games', label: 'I shoot well in practice but not in games' },
  { value: 'no_trust', label: "I don't trust my shot" },
  { value: 'overthink_form', label: 'I overthink my form mid-shot' },
  { value: 'deep_distance', label: 'I struggle with deep distance / NBA line' },
  { value: 'creating_space', label: 'I struggle creating space off the dribble' },
  { value: 'scared_shooter', label: 'I\'m scared to shoot / labeled "non-shooter"' },
];

export const WORKOUT_STYLES: SelectOption[] = [
  { value: 'spot_up_reps', label: 'Mostly spot-up reps / same spots' },
  { value: 'gun_machine', label: 'Mostly gun / machine workouts' },
  { value: 'form_shooting', label: 'A lot of form shooting close to the rim' },
  { value: 'random_shots', label: 'Random "get shots up" with no structure' },
  { value: 'constraints', label: 'I use constraints' },
];

export const DAYS_PER_WEEK: SelectOption[] = [
  { value: '2_3', label: '2-3 days' },
  { value: '4_5', label: '4-5 days' },
  { value: '6_7', label: '6-7 days' },
];

export const PLAYER_LOOKING_FOR: SelectOption[] = [
  { value: 'self_paced_system', label: 'A self-paced shooting system I can follow step-by-step' },
  { value: 'personal_evaluation', label: 'A personal shooting evaluation and exact protocol for my shooting profile' },
  { value: 'full_game_audit', label: 'A full game audit (movement, deception, shot, finishing, decision-making)' },
  { value: 'not_sure', label: "Not sure – I just know I need help" },
];

export const INVESTMENT_LEVELS: SelectOption[] = [
  { value: 'premium', label: "I'm willing to invest in a premium program if it works" },
  { value: 'moderate', label: 'I can invest some money but need options' },
  { value: 'low_cost', label: "I'm just looking for low-cost education right now" },
];

// Parent options
export const PARENT_ISSUES: SelectOption[] = [
  { value: 'hesitates_shoot', label: 'They hesitate to shoot open shots' },
  { value: 'misses_open_3s', label: 'They miss a lot of open 3s' },
  { value: 'cant_create', label: "They struggle to create their own shot" },
  { value: 'cant_beat_defenders', label: "They can't get by defenders consistently" },
  { value: 'poor_finishing', label: "They don't finish well through contact" },
  { value: 'mentally_weak', label: 'A coach has called them "mentally weak" or "not confident"' },
  { value: 'other', label: 'Other' },
];

export const CHILD_CONFIDENCE_LEVELS: SelectOption[] = [
  { value: 'very_low', label: 'Very low – they avoid shots / plays' },
  { value: 'up_and_down', label: 'Up and down – some games good, some bad' },
  { value: 'solid', label: 'Solid – they believe in themselves but still inconsistent' },
  { value: 'very_high', label: "Very high – they're confident but need better tools" },
];

export const PARENT_GOALS: SelectOption[] = [
  { value: 'fix_shooting', label: "Fix their shooting so they're trusted as a shooter" },
  { value: 'improve_scoring', label: 'Improve their overall scoring (movement, deception, finishing)' },
  { value: 'build_confidence', label: 'Help them become more confident and aggressive' },
  { value: 'prepare_level', label: 'Prepare them for a specific level (HS varsity / college / pro)' },
];

export const WEEKLY_TRAINING_HOURS: SelectOption[] = [
  { value: '2_3', label: '2-3 hours/week' },
  { value: '4_6', label: '4-6 hours/week' },
  { value: '7_10', label: '7-10 hours/week' },
  { value: '10_plus', label: '10+ hours/week' },
];

export const PARENT_INTERESTS: SelectOption[] = [
  { value: 'done_for_you', label: 'A done-for-you structure they can follow on their own (videos + plan)' },
  { value: 'personal_evaluation', label: 'A personal evaluation where we tell them exactly what to work on' },
  { value: 'high_touch_mentorship', label: 'A high-touch mentorship (calls, film breakdown, accountability)' },
];

export const PARENT_INVOLVEMENT_LEVELS: SelectOption[] = [
  { value: 'very_involved', label: "Very involved – I'll help organize and hold them accountable" },
  { value: 'somewhat_involved', label: "Somewhat involved – I'll check in, but they're responsible" },
  { value: 'not_involved', label: "Not involved – they'll handle everything themselves" },
];

// Coach options
export const COACH_LEVELS: SelectOption[] = [
  { value: 'youth_middle', label: 'Youth / Middle School' },
  { value: 'high_school', label: 'High School' },
  { value: 'prep_aau', label: 'Prep / AAU' },
  { value: 'college', label: 'College' },
  { value: 'pro_overseas', label: 'Pro / Overseas' },
  { value: 'private_trainer', label: 'Private Skills Trainer (various levels)' },
];

export const COACH_ROLES: SelectOption[] = [
  { value: 'head_coach', label: 'Head Coach' },
  { value: 'assistant_coach', label: 'Assistant Coach' },
  { value: 'skills_trainer', label: 'Skills Trainer' },
  { value: 'player_dev', label: 'Player Development Director' },
  { value: 'performance_sc', label: 'Performance / S&C Coach' },
];

export const COACH_ISSUES: SelectOption[] = [
  { value: 'cant_shoot_3', label: "Can't shoot it well enough from 3" },
  { value: 'inconsistent_game', label: 'Good shooters in workouts, inconsistent in games' },
  { value: 'no_space_1on1', label: 'Struggle to create space 1-on-1' },
  { value: 'lack_deception', label: 'Lack deception / fakes / pace changes' },
  { value: 'poor_finishing', label: 'Struggle finishing vs length/pressure' },
  { value: 'poor_decisions', label: 'Poor decision-making (reads, passes)' },
  { value: 'other', label: 'Other' },
];

export const COACH_SHOOTING_STYLES: SelectOption[] = [
  { value: 'on_air_spotup', label: 'Mostly on-air reps / spot-up shooting' },
  { value: 'machines', label: 'Heavy usage of machines (Gun / Dr. Dish)' },
  { value: 'form_shooting', label: 'Mostly "form shooting" + basic drills' },
  { value: 'live_play', label: 'Live play based (small-sided, constraints, etc.)' },
  { value: 'mix', label: 'Mix of all of the above' },
];

export const MOTOR_LEARNING_FAMILIARITY: SelectOption[] = [
  { value: 'very_familiar', label: 'Very familiar – I already use these concepts' },
  { value: 'somewhat_familiar', label: "Somewhat familiar – I've heard of them" },
  { value: 'not_familiar', label: 'Not familiar – I just know standard drills' },
];

export const COACH_LOOKING_FOR: SelectOption[] = [
  { value: 'masterclass', label: "A Coach's Masterclass so I can run these methods myself" },
  { value: 'shooting_system', label: 'A shooting system I can plug in for my players' },
  { value: 'movement_blueprint', label: 'A movement & deception blueprint for my players' },
  { value: 'consulting', label: 'Consulting for how to design practices & progressions' },
  { value: 'certification', label: 'BB Certification / long-term partnership' },
];

export const PLAYER_COUNTS: SelectOption[] = [
  { value: '1_5', label: '1-5' },
  { value: '6_15', label: '6-15' },
  { value: '16_30', label: '16-30' },
  { value: '30_plus', label: '30+' },
];

export const COACH_OPEN_TO_COACHING: SelectOption[] = [
  { value: 'yes', label: "Yes – I'm ready to adapt what I do" },
  { value: 'maybe', label: "Maybe – I'm curious but skeptical" },
  { value: 'no', label: 'No – I mainly just want ideas / drills' },
];

export const COACH_NEXT_STEPS: SelectOption[] = [
  { value: 'on_demand_education', label: 'Access to on-demand education (coach masterclass)' },
  { value: 'playbook_system', label: 'A playbook + system we can plug in for shooting' },
  { value: 'bb_lens_assessment', label: 'A deeper BB lens assessment of our players & methods' },
  { value: 'live_consultation', label: 'A live consultation to go over our whole setup' },
];

// Organization options
export const ORG_TYPES: SelectOption[] = [
  { value: 'club_aau', label: 'Club / AAU Program' },
  { value: 'school', label: 'Middle School / High School Program' },
  { value: 'college', label: 'College Program' },
  { value: 'pro', label: 'Pro Team' },
  { value: 'training_facility', label: 'Training Facility / Individual Coach' },
];

export const TEAM_COUNTS: SelectOption[] = [
  { value: '1_3', label: '1-3 teams' },
  { value: '4_8', label: '4-8 teams' },
  { value: '9_15', label: '9-15 teams' },
  { value: '16_plus', label: '16+ teams' },
];

export const ORG_PROBLEMS: SelectOption[] = [
  { value: 'shooting_effectiveness', label: 'Overall shooting effectiveness' },
  { value: 'offensive_creation', label: 'Offensive creation / advantage generation' },
  { value: 'no_dev_system', label: 'Player development system (no structure)' },
  { value: 'no_deceptive_movers', label: 'Lack of deceptive movers / 1-on-1 scoring' },
  { value: 'poor_transfer', label: 'Poor transfer from workouts to games' },
  { value: 'coaching_not_aligned', label: 'Coaching staff not aligned on development model' },
];

export const ORG_SUPPORTS: SelectOption[] = [
  { value: 'full_audit', label: 'A full BB Lens audit of our program (film + methods + structure)' },
  { value: 'shooting_calibration', label: 'A shooting-only calibration install across teams' },
  { value: 'coach_education', label: 'Coach education (masterclass + live calls for staff)' },
  { value: 'ongoing_consulting', label: 'Ongoing consulting / partnership over a season' },
];

export const ORG_READINESS_LEVELS: SelectOption[] = [
  { value: 'very_ready', label: "Very ready – we're looking for a new development model now" },
  { value: 'open', label: 'Open – willing to layer new methods into what we do' },
  { value: 'curious', label: "Curious – just exploring what's out there" },
];

export const ORG_TIMELINES: SelectOption[] = [
  { value: 'within_month', label: 'Within the next month' },
  { value: 'within_3_months', label: 'Within 3 months' },
  { value: '3_6_months', label: '3-6 months' },
  { value: 'gathering_info', label: 'Just gathering info' },
];

export const ORG_BUDGETS: SelectOption[] = [
  { value: 'low_4_figures', label: 'Low four figures' },
  { value: 'mid_4_figures', label: 'Mid four figures' },
  { value: 'high_4_low_5', label: 'High four to low five figures' },
  { value: 'depends_on_scope', label: "We don't know yet – depends on scope" },
];
