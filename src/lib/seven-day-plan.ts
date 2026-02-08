// 7-Day Implementation Plan Types and Generators
// BB 7-Day Shooting Calibration Block (Level 1–2)

export interface PlanKnobs {
  // Session A - Deep Distance + Back Rim
  deepDistanceRepsPerBlock: number; // Default 10
  deepDistanceStepInReps: number; // Default 10
  offDribblePullUps: number; // Default 5
  offDribbleStepBacks: number; // Default 5
  offDribbleBouncePullUps: number; // Default 5
  energyTransferSpots: number; // Default 7
  energyTransferRepsPerPassType: number; // Default 1
  fourteenSpotTestOutEnabled: boolean; // Default true

  // Session B - Ball Flight Spectrum
  ballFlightSpotsPerAngle: number; // Default 2
  ballFlightRepsPerSpot: number; // Default 10
  ballFlightTestSeriesEnabled: boolean; // Default true (optional)
  cleanFinishSpots: number; // Default 7

  // Session C - Difficult Shooting + Fades
  fadeExplorationSpots: number; // Default 7
  fadeRepsPerDirection: number; // Default 1
  offDribbleFadeEnabled: boolean; // Default false
  deepFadeStartStepsBehind: number; // Default 3
  deepFadeBackRimHitsPhase1: number; // Default 2
  deepFadeBackRimHitsCloser: number; // Default 3
  deepFadeMakesClosest: number; // Default 2
  fadeTestOutEnabled: boolean; // Default true

  // Player logging
  playerLogEnabled: boolean;
}

export interface DayScheduleItem {
  day: number;
  session: 'A' | 'B' | 'C';
}

export interface WorkoutStep {
  instruction: string;
  reps?: number;
  notes?: string;
}

export interface WorkoutPart {
  title: string;
  time: string;
  steps: WorkoutStep[];
  totalShots?: number;
}

export interface SessionDefinition {
  id: 'A' | 'B' | 'C';
  name: string;
  fullName: string;
  days: string;
  totalTime: string;
  focusRule: string;
  parts: WorkoutPart[];
  totalVolume: string;
  volumeNote: string;
}

export interface StructuredSevenDayPlan {
  presetId: string;
  presetName: string;
  schedule: DayScheduleItem[];
  knobs: PlanKnobs;
  sessions: {
    A: SessionDefinition;
    B: SessionDefinition;
    C: SessionDefinition;
  };
  playerPlanLogEnabled: boolean;
  nonNegotiableRule: string;
  goal: string;
}

export interface DayLog {
  day: number;
  completed: boolean;
  notes: string;
  fourteenSpotScore?: number;
  deepDistanceLineUsed?: number;
  backRimStreakAchieved?: number;
  completedAt?: string;
}

export const DEFAULT_KNOBS: PlanKnobs = {
  // Session A
  deepDistanceRepsPerBlock: 10,
  deepDistanceStepInReps: 10,
  offDribblePullUps: 5,
  offDribbleStepBacks: 5,
  offDribbleBouncePullUps: 5,
  energyTransferSpots: 7,
  energyTransferRepsPerPassType: 1,
  fourteenSpotTestOutEnabled: true,

  // Session B
  ballFlightSpotsPerAngle: 2,
  ballFlightRepsPerSpot: 10,
  ballFlightTestSeriesEnabled: true,
  cleanFinishSpots: 7,

  // Session C
  fadeExplorationSpots: 7,
  fadeRepsPerDirection: 1,
  offDribbleFadeEnabled: false,
  deepFadeStartStepsBehind: 3,
  deepFadeBackRimHitsPhase1: 2,
  deepFadeBackRimHitsCloser: 3,
  deepFadeMakesClosest: 2,
  fadeTestOutEnabled: true,

  playerLogEnabled: true,
};

export const DEFAULT_SCHEDULE: DayScheduleItem[] = [
  { day: 1, session: 'A' },
  { day: 2, session: 'B' },
  { day: 3, session: 'A' },
  { day: 4, session: 'C' },
  { day: 5, session: 'B' },
  { day: 6, session: 'A' },
  { day: 7, session: 'C' },
];

export function generateSessionA(knobs: PlanKnobs): SessionDefinition {
  const deepDistanceTotal = knobs.deepDistanceRepsPerBlock + (knobs.deepDistanceStepInReps * 2);
  const offDribbleTotal = (knobs.offDribblePullUps + knobs.offDribbleStepBacks + knobs.offDribbleBouncePullUps) * 2;
  const energyTransferTotal = knobs.energyTransferSpots * 3 * knobs.energyTransferRepsPerPassType;
  const testOutTotal = knobs.fourteenSpotTestOutEnabled ? 14 : 0;
  const totalShots = deepDistanceTotal + offDribbleTotal + energyTransferTotal + testOutTotal;

  const parts: WorkoutPart[] = [
    {
      title: 'Part 1 — Deep Distance Line Calibration',
      time: '15 min',
      steps: [
        { instruction: 'Find your Deep Distance Line: The farthest spot where you barely reach the rim without forcing.' },
        { instruction: 'From that line:', notes: 'Block 1' },
        { instruction: 'Back rim miss OR back rim make', reps: knobs.deepDistanceRepsPerBlock },
        { instruction: 'Step In Progression:' },
        { instruction: 'Step in 1 large step', reps: knobs.deepDistanceStepInReps },
        { instruction: 'Step in 1 more step', reps: knobs.deepDistanceStepInReps },
      ],
      totalShots: deepDistanceTotal,
    },
    {
      title: 'Part 2 — Off-Dribble Distance Transfer',
      time: '10–12 min',
      steps: [
        { instruction: 'Go back to your deepest line.' },
        { instruction: 'From that line:' },
        { instruction: 'Pull-ups (1 dribble)', reps: knobs.offDribblePullUps },
        { instruction: 'Step-backs', reps: knobs.offDribbleStepBacks },
        { instruction: 'Bounce pull-ups (hang dribble → rise)', reps: knobs.offDribbleBouncePullUps },
        { instruction: 'Now step in one step:' },
        { instruction: `Repeat ${knobs.offDribblePullUps} + ${knobs.offDribbleStepBacks} + ${knobs.offDribbleBouncePullUps}` },
      ],
      totalShots: offDribbleTotal,
    },
    {
      title: 'Part 3 — Seven-Spot Energy Transfer Series',
      time: '10 min',
      steps: [
        { instruction: `Go to ${knobs.energyTransferSpots} spots around the arc.` },
        { instruction: 'At each spot:' },
        { instruction: 'Make off a high pass (dip + shoot)', reps: knobs.energyTransferRepsPerPassType, notes: 'per spot' },
        { instruction: 'Make off a middle pass', reps: knobs.energyTransferRepsPerPassType, notes: 'per spot' },
        { instruction: 'Make off a low pass', reps: knobs.energyTransferRepsPerPassType, notes: 'per spot' },
        { instruction: `That's ${knobs.energyTransferRepsPerPassType * 3} shots per spot` },
      ],
      totalShots: energyTransferTotal,
    },
  ];

  if (knobs.fourteenSpotTestOutEnabled) {
    parts.push({
      title: 'Part 4 — 14-Spot Back Rim Test Out',
      time: '8–10 min',
      steps: [
        { instruction: 'Full 14-spot test.' },
        { instruction: 'Rule: Every shot must be a back rim miss or make' },
        { instruction: 'Track makes if you want, but back rim is success' },
      ],
      totalShots: 14,
    });
  }

  return {
    id: 'A',
    name: 'Deep Distance + Back Rim Command',
    fullName: 'SESSION A — Deep Distance + Back Rim Command',
    days: 'Day 1, Day 3, Day 6',
    totalTime: '45–50 min',
    focusRule: 'Back rim only. No shorts. No mechanics. Just solve the distance.',
    parts,
    totalVolume: `~${totalShots} shots`,
    volumeNote: 'This is your calibration backbone.',
  };
}

export function generateSessionB(knobs: PlanKnobs): SessionDefinition {
  const flatTotal = knobs.ballFlightSpotsPerAngle * knobs.ballFlightRepsPerSpot;
  const highTotal = knobs.ballFlightSpotsPerAngle * knobs.ballFlightRepsPerSpot;
  const midTotal = knobs.ballFlightSpotsPerAngle * knobs.ballFlightRepsPerSpot;
  const testSeriesTotal = knobs.ballFlightTestSeriesEnabled ? 42 : 0; // 14 x 3 angles
  const finishTotal = knobs.cleanFinishSpots;
  const totalShots = flatTotal + highTotal + midTotal + finishTotal + (knobs.ballFlightTestSeriesEnabled ? 28 : 0); // only count 2 test series

  const parts: WorkoutPart[] = [
    {
      title: 'Part 1 — Flat Flight Calibration (25°)',
      time: '10 min',
      steps: [
        { instruction: `Pick ${knobs.ballFlightSpotsPerAngle} spots (corner + top is ideal)` },
        { instruction: 'At each spot:' },
        { instruction: 'Extremely flat arc, back rim only', reps: knobs.ballFlightRepsPerSpot, notes: 'per spot' },
        { instruction: 'Misses are fine — stay committed' },
      ],
      totalShots: flatTotal,
    },
    {
      title: 'Part 2 — High Flight Calibration (60°–90°)',
      time: '10 min',
      steps: [
        { instruction: `Pick ${knobs.ballFlightSpotsPerAngle} new spots` },
        { instruction: 'At each spot:' },
        { instruction: 'High arc, back rim only', reps: knobs.ballFlightRepsPerSpot, notes: 'per spot' },
        { instruction: 'Let the system organize' },
      ],
      totalShots: highTotal,
    },
    {
      title: 'Part 3 — Mid Flight Calibration (45°)',
      time: '8 min',
      steps: [
        { instruction: `Pick ${knobs.ballFlightSpotsPerAngle} more spots` },
        { instruction: 'At each spot:' },
        { instruction: 'Normal arc, back rim only', reps: knobs.ballFlightRepsPerSpot, notes: 'per spot' },
      ],
      totalShots: midTotal,
    },
  ];

  if (knobs.ballFlightTestSeriesEnabled) {
    parts.push({
      title: 'Part 4 — Ball Flight Test Series (Optional)',
      time: '10 min',
      steps: [
        { instruction: 'If you want to test:' },
        { instruction: '14-spot test at 25° (flat)' },
        { instruction: '14-spot test at 45° (normal)' },
        { instruction: '14-spot test at 60° (high)' },
        { instruction: '(Do 1–2 of these, not all, if fatigued.)' },
      ],
      totalShots: 28,
    });
  }

  parts.push({
    title: 'Finish — Clean Contrast',
    time: '5 min',
    steps: [
      { instruction: 'Normal ball, normal arc' },
      { instruction: `1 make per spot (${knobs.cleanFinishSpots} total)` },
    ],
    totalShots: finishTotal,
  });

  return {
    id: 'B',
    name: 'Ball Flight Spectrum',
    fullName: 'SESSION B — Ball Flight Spectrum (25° / 45° / 60°)',
    days: 'Day 2, Day 5',
    totalTime: '35–45 min',
    focusRule: 'Your system must learn to score from multiple arcs, not one tempo.',
    parts,
    totalVolume: '~70–90 shots',
    volumeNote: 'This is how you build true spectrum control.',
  };
}

export function generateSessionC(knobs: PlanKnobs): SessionDefinition {
  const fadeExplorationReps = knobs.offDribbleFadeEnabled ? 4 : 3;
  const fadeExplorationTotal = knobs.fadeExplorationSpots * fadeExplorationReps * knobs.fadeRepsPerDirection;

  // Deep fade progression: 2+2 at start, 2+2 deeper, 3+3 closer, 2+2 closest = 22 shots
  const deepFadeTotal = (knobs.deepFadeBackRimHitsPhase1 * 4) + (knobs.deepFadeBackRimHitsCloser * 2) + (knobs.deepFadeMakesClosest * 2);

  const fadeTestOutTotal = knobs.fadeTestOutEnabled ? 28 : 0;
  const totalShots = fadeExplorationTotal + deepFadeTotal + fadeTestOutTotal;

  const parts: WorkoutPart[] = [
    {
      title: 'Part 1 — Seven-Spot Fade Exploration',
      time: '15 min',
      steps: [
        { instruction: `At each of the ${knobs.fadeExplorationSpots} spots:` },
        { instruction: 'Fade right', reps: knobs.fadeRepsPerDirection },
        { instruction: 'Fade left', reps: knobs.fadeRepsPerDirection },
        { instruction: 'Fade backward / drift', reps: knobs.fadeRepsPerDirection },
        ...(knobs.offDribbleFadeEnabled ? [{ instruction: 'Off-dribble fade (optional)', reps: knobs.fadeRepsPerDirection }] : []),
      ],
      totalShots: fadeExplorationTotal,
    },
    {
      title: 'Part 2 — Deep Distance Fade Progression',
      time: '15 min',
      steps: [
        { instruction: `Start ${knobs.deepFadeStartStepsBehind} steps behind the 3PT line` },
        { instruction: 'From that spot:', notes: 'Phase 1 (Back Rim Hits)' },
        { instruction: `Fade left → hit back rim ${knobs.deepFadeBackRimHitsPhase1}x` },
        { instruction: `Fade right → hit back rim ${knobs.deepFadeBackRimHitsPhase1}x` },
        { instruction: 'Step back 1 step deeper:' },
        { instruction: `Fade left → back rim ${knobs.deepFadeBackRimHitsPhase1}x` },
        { instruction: `Fade right → back rim ${knobs.deepFadeBackRimHitsPhase1}x` },
        { instruction: 'Now step 1 step closer:' },
        { instruction: `Fade left → back rim ${knobs.deepFadeBackRimHitsCloser}x` },
        { instruction: `Fade right → back rim ${knobs.deepFadeBackRimHitsCloser}x` },
        { instruction: 'Step 1 more step closer:' },
        { instruction: `Fade left → make ${knobs.deepFadeMakesClosest}x` },
        { instruction: `Fade right → make ${knobs.deepFadeMakesClosest}x` },
      ],
      totalShots: deepFadeTotal,
    },
  ];

  if (knobs.fadeTestOutEnabled) {
    parts.push({
      title: 'Part 3 — 14-Spot Fade Test Out',
      time: '10–12 min',
      steps: [
        { instruction: 'Round 1: 14 spots fading left' },
        { instruction: 'Round 2: 14 spots fading right' },
        { instruction: 'Track score.' },
      ],
      totalShots: 28,
    });
  }

  return {
    id: 'C',
    name: 'Difficult Shooting + Fades',
    fullName: 'SESSION C — Difficult Shooting + Fade Adaptability',
    days: 'Day 4, Day 7',
    totalTime: '45 min',
    focusRule: 'Games demand awkward shots. We train that directly.',
    parts,
    totalVolume: `~${totalShots} shots`,
    volumeNote: 'This is where shooters become stress-proof.',
  };
}

export function generateStructuredPlan(
  knobs: PlanKnobs = DEFAULT_KNOBS,
  schedule: DayScheduleItem[] = DEFAULT_SCHEDULE,
  playerPlanLogEnabled: boolean = true
): StructuredSevenDayPlan {
  return {
    presetId: 'lvl1-2-standard-v1',
    presetName: 'Level 1–2 Standard Plan (3 Sessions)',
    schedule,
    knobs,
    sessions: {
      A: generateSessionA(knobs),
      B: generateSessionB(knobs),
      C: generateSessionC(knobs),
    },
    playerPlanLogEnabled,
    nonNegotiableRule: 'Back rim = good miss. Short misses are the enemy. Your only job is: control the ball to the target.',
    goal: "Build real shooting adaptability fast — not \"perfect form.\" We're training distance control, back-rim command, and response after misses.",
  };
}

// Convert structured plan to simple format for email/backward compatibility
export function planToSimpleFormat(plan: StructuredSevenDayPlan): Record<string, { warmup: string; mainWork: string; finish: string }> {
  const result: Record<string, { warmup: string; mainWork: string; finish: string }> = {};

  plan.schedule.forEach(({ day, session }) => {
    const sessionDef = plan.sessions[session];
    const dayKey = `day${day}`;

    result[dayKey] = {
      warmup: 'Catch variety + movement prep (3 min)',
      mainWork: `Session ${session}: ${sessionDef.name} (${sessionDef.totalVolume})`,
      finish: sessionDef.parts[sessionDef.parts.length - 1]?.title || '14-spot test out',
    };
  });

  return result;
}

// Get session for a specific day
export function getSessionForDay(plan: StructuredSevenDayPlan, day: number): SessionDefinition | null {
  const scheduleItem = plan.schedule.find(s => s.day === day);
  if (!scheduleItem) return null;
  return plan.sessions[scheduleItem.session];
}

// Get session letter for a specific day
export function getSessionLetterForDay(plan: StructuredSevenDayPlan, day: number): 'A' | 'B' | 'C' | null {
  const scheduleItem = plan.schedule.find(s => s.day === day);
  return scheduleItem?.session || null;
}

// Preset definitions
export const PLAN_PRESETS = [
  {
    id: 'lvl1-2-standard-v1',
    name: 'Level 1–2 Standard Plan',
    description: 'Full 7-day plan: ~95 shots (A), ~80 shots (B), ~80 shots (C)',
    knobs: DEFAULT_KNOBS,
    schedule: DEFAULT_SCHEDULE,
  },
  {
    id: 'lvl1-2-light-v1',
    name: 'Level 1–2 Light Plan',
    description: 'Reduced volume for younger players or recovery weeks',
    knobs: {
      ...DEFAULT_KNOBS,
      deepDistanceRepsPerBlock: 6,
      deepDistanceStepInReps: 6,
      offDribblePullUps: 3,
      offDribbleStepBacks: 3,
      offDribbleBouncePullUps: 3,
      ballFlightRepsPerSpot: 6,
      ballFlightTestSeriesEnabled: false,
      fadeTestOutEnabled: false,
    },
    schedule: DEFAULT_SCHEDULE,
  },
  {
    id: 'lvl1-2-intensive-v1',
    name: 'Level 1–2 Intensive Plan',
    description: 'Higher volume for advanced Level 1–2 players',
    knobs: {
      ...DEFAULT_KNOBS,
      deepDistanceRepsPerBlock: 15,
      deepDistanceStepInReps: 15,
      offDribblePullUps: 7,
      offDribbleStepBacks: 7,
      offDribbleBouncePullUps: 7,
      ballFlightRepsPerSpot: 15,
      fadeRepsPerDirection: 2,
      offDribbleFadeEnabled: true,
    },
    schedule: DEFAULT_SCHEDULE,
  },
];
