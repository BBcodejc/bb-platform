import { z } from 'zod';

// ============================================
// INTAKE FORM SCHEMAS
// ============================================

export const contactInfoSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const playerIntakeSchema = contactInfoSchema.extend({
  role: z.literal('player'),
  playerLevel: z.string().min(1, 'Please select your level'),
  playerMainGoal: z.string().min(1, 'Please select your main goal'),
  gameVsWorkout: z.string().optional(),
  threePtPercentage: z.string().optional(),
  playerProblem: z.string().min(1, 'Please select your main struggle'),
  workoutStyle: z.string().optional(),
  daysPerWeek: z.string().optional(),
  playerLookingFor: z.string().min(1, 'Please select what you\'re looking for'),
  investmentLevel: z.string().optional(),
  playerAge: z.string().optional(),
  playerLocation: z.string().optional(),
  playerInstagram: z.string().optional(),
});

export const parentIntakeSchema = contactInfoSchema.extend({
  role: z.literal('parent'),
  childName: z.string().min(1, 'Child\'s name is required'),
  childAge: z.string().min(1, 'Please select your child\'s age'),
  childLevel: z.string().min(1, 'Please select your child\'s level'),
  childStrengths: z.string().optional(),
  parentIssues: z.array(z.string()).optional(),
  parentIssueOther: z.string().optional(),
  childConfidence: z.string().optional(),
  parentMainGoal: z.string().min(1, 'Please select your main goal'),
  weeklyTrainingHours: z.string().optional(),
  previousTrainerExperience: z.string().optional(),
  parentInterest: z.string().min(1, 'Please select your interest level'),
  parentInvolvement: z.string().optional(),
  parentInvestmentLevel: z.string().optional(),
});

export const coachIntakeSchema = contactInfoSchema.extend({
  role: z.literal('coach'),
  coachLevel: z.string().min(1, 'Please select your coaching level'),
  coachRole: z.string().optional(),
  coachIssues: z.array(z.string()).optional(),
  coachIssueOther: z.string().optional(),
  coachShootingStyle: z.string().optional(),
  motorLearningFamiliarity: z.string().optional(),
  coachLookingFor: z.string().min(1, 'Please select what you\'re looking for'),
  coachPlayerCount: z.string().optional(),
  coachConstraints: z.string().optional(),
  coachOpenToCoaching: z.string().optional(),
  coachNextStep: z.string().optional(),
  coachCertificationWants: z.string().optional(),
});

export const orgIntakeSchema = contactInfoSchema.extend({
  role: z.literal('organization'),
  orgType: z.string().min(1, 'Please select your organization type'),
  orgName: z.string().min(1, 'Organization name is required'),
  teamCount: z.string().optional(),
  orgProblems: z.array(z.string()).optional(),
  currentDevModel: z.string().optional(),
  orgWin: z.string().optional(),
  orgSupport: z.string().min(1, 'Please select the support you need'),
  orgReadiness: z.string().optional(),
  orgTimeline: z.string().optional(),
  orgDecisionMakers: z.string().optional(),
  orgBudget: z.string().optional(),
});

export const intakeFormSchema = z.discriminatedUnion('role', [
  playerIntakeSchema,
  parentIntakeSchema,
  coachIntakeSchema,
  orgIntakeSchema,
]);

// ============================================
// SHOOTING EVALUATION SCHEMAS
// ============================================

export const playerInfoSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  age: z.number().min(8).max(99),
  level: z.string().min(1, 'Level is required'),
  primary_position: z.string().optional(),
  dominant_hand: z.enum(['right', 'left', 'both']),
});

export const fourteenSpotRoundSchema = z.object({
  score: z.number().min(0).max(14),
  miss_profile: z.enum(['mostly_short', 'mostly_long', 'mostly_left', 'mostly_right', 'mixed']),
});

export const fourteenSpotSchema = z.object({
  round_1: fourteenSpotRoundSchema,
  round_2: fourteenSpotRoundSchema,
  round_3: fourteenSpotRoundSchema,
  video_url: z.string().url().optional().or(z.literal('')),
});

export const deepDistanceSchema = z.object({
  deep_distance_steps_behind_line: z.number().min(0),
  deep_line_rim_hits_10: z.number().min(0).max(10),
  deep_line_total_shots_10: z.number().min(0).max(20),
  contrast_steps_forward: z.number().min(0),
  contrast_rim_hits_10: z.number().min(0).max(10),
  contrast_total_shots_10: z.number().min(0).max(20),
  video_url: z.string().url().optional().or(z.literal('')),
});

export const backRimLevelSchema = z.object({
  total_shots: z.number().min(1),
  time_seconds: z.number().min(1),
});

export const backRimSchema = z.object({
  level_1: backRimLevelSchema,
  level_2: backRimLevelSchema.optional(),
  level_3: backRimLevelSchema.optional(),
  video_url: z.string().url().optional().or(z.literal('')),
});

export const ballFlightArcSchema = z.object({
  makes_or_backrim_7: z.number().min(0).max(7),
  miss_profile: z.enum(['mostly_short', 'mostly_long', 'mostly_left', 'mostly_right', 'mixed']),
});

export const ballFlightSchema = z.object({
  flat: ballFlightArcSchema,
  normal: ballFlightArcSchema,
  high: ballFlightArcSchema,
  video_url: z.string().url().optional().or(z.literal('')),
});

export const fadeDirectionSchema = z.object({
  makes_or_backrim_7: z.number().min(0).max(7),
  miss_profile: z.enum(['mostly_short', 'mostly_long', 'mostly_left', 'mostly_right', 'mixed']),
});

export const fadesSchema = z.object({
  fade_right: fadeDirectionSchema,
  fade_left: fadeDirectionSchema,
  video_url: z.string().url().optional().or(z.literal('')),
});

export const shootingEvaluationSchema = z.object({
  player_info: playerInfoSchema,
  fourteen_spot: fourteenSpotSchema,
  deep_distance: deepDistanceSchema,
  back_rim: backRimSchema,
  ball_flight: ballFlightSchema,
  fades: fadesSchema,
  final_notes: z.object({
    anything_else: z.string().max(500).optional(),
  }).optional(),
});

// ============================================
// ADMIN SCHEMAS
// ============================================

export const evaluationReviewSchema = z.object({
  current_bb_level: z.number().min(0).max(4),
  miss_profile: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
  }),
  deep_distance_analysis: z.string().optional(),
  ball_flight_analysis: z.string().optional(),
  energy_transfer_notes: z.string().optional(),
  constraints_identified: z.array(z.string()).optional(),
  priority_protocols: z.array(z.string()).max(3).optional(),
  weekly_plan_summary: z.string().optional(),
  four_week_focus: z.string().optional(),
  full_assessment: z.string().min(1, 'Full assessment is required'),
  mentorship_fit_score: z.number().min(1).max(10).optional(),
  mentorship_recommendation: z.string().optional(),
  recommend_mentorship: z.boolean().optional(),
});

export const prospectUpdateSchema = z.object({
  pipeline_status: z.string(),
  internal_notes: z.string().optional(),
  high_ticket_prospect: z.boolean().optional(),
  value_estimate: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const checkoutSchema = z.object({
  productType: z.enum(['shooting_eval', 'complete_eval', 'mentorship', 'mentorship_subscription']),
  prospectId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  customAmount: z.number().positive().optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type IntakeFormData = z.infer<typeof intakeFormSchema>;
export type PlayerIntakeData = z.infer<typeof playerIntakeSchema>;
export type ParentIntakeData = z.infer<typeof parentIntakeSchema>;
export type CoachIntakeData = z.infer<typeof coachIntakeSchema>;
export type OrgIntakeData = z.infer<typeof orgIntakeSchema>;
export type ShootingEvaluationData = z.infer<typeof shootingEvaluationSchema>;
export type EvaluationReviewData = z.infer<typeof evaluationReviewSchema>;
export type ProspectUpdateData = z.infer<typeof prospectUpdateSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
