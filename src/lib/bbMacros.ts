// BB Coach Macros - Pre-written templates for fast evaluation fulfillment
// To add/edit templates: Update the arrays below. Each macro has:
// - id: unique identifier
// - label: what shows in the dropdown
// - tags: for auto-selection logic (short, leftRight, long, default, etc.)
// - templateString: the actual text with {{variables}}

export interface BBMacro {
  id: string;
  field: 'missProfile' | 'deepDistance' | 'backRim' | 'ballFlight';
  label: string;
  tags: string[];
  templateString: string;
}

export interface MacroVariables {
  playerName?: string;
  bbLevel?: number;
  primaryMiss?: string;
  secondaryMiss?: string;
  deepDistanceLine?: number;
  deepDistanceMakes?: number;
  deepDistanceAttempts?: number;
  backRimL1?: number;
  backRimL2?: number;
  backRimL3?: number;
  backRimNotes?: string;
  ballFlight25?: number;
  ballFlight45?: number;
  ballFlight60?: number;
  avgScore?: number;
}

// ============================================================
// MISS PROFILE SUMMARY MACROS
// ============================================================
export const missProfileMacros: BBMacro[] = [
  {
    id: 'miss-default',
    field: 'missProfile',
    label: 'General Default',
    tags: ['default'],
    templateString: `{{playerName}}'s miss pattern shows {{primaryMiss}} as the dominant tendency{{secondaryMiss}}.

BB Miss Framework:
• Good misses: front skid, back rim (straight up), in-and-out, multiple rim touches
• Bad misses: directional (left/right), short/dead short, back-and-away sail, airballs

We're training distance control + target control — not mechanics. The goal is: read the miss → adjust → solve. Mechanics-based cueing creates robotic, slow shooters under pressure.`,
  },
  {
    id: 'miss-short',
    field: 'missProfile',
    label: 'Short Miss Dominant',
    tags: ['short'],
    templateString: `{{playerName}}'s primary pattern is short misses — front rim or dead short{{secondaryMiss}}.

This is common in Level {{bbLevel}} shooters. Short misses indicate an energy/impulse gap — your system isn't generating enough force to consistently reach the target.

BB Miss Framework:
• Good misses: front skid, back rim (straight up), in-and-out
• Bad misses: short/dead short (energy gap), directional, sail

The fix isn't "shoot harder" — it's Deep Distance calibration. When you train from your furthest line repeatedly, your system learns the impulse demand. Short misses disappear because your baseline energy output rises.`,
  },
  {
    id: 'miss-long',
    field: 'missProfile',
    label: 'Long Miss Dominant',
    tags: ['long'],
    templateString: `{{playerName}}'s primary pattern is long misses{{secondaryMiss}}.

Important distinction:
• Back rim (straight up or back to you) = GOOD miss — you're controlling distance
• Back-and-away / sail = BAD miss — you're losing directional control

If your longs are "back rim," you're actually close to calibrated — just need minor energy adjustment. If your longs are "sail" (back and away from you), there's a release timing or direction issue.

BB Focus: We don't fix this with mechanics. We fix it with Deep Distance work and Back-Rim Command drills — your system learns to control the energy output naturally.`,
  },
  {
    id: 'miss-left',
    field: 'missProfile',
    label: 'Left Miss Dominant',
    tags: ['leftRight', 'left'],
    templateString: `{{playerName}}'s primary pattern is left-directional misses{{secondaryMiss}}.

Directional misses (left/right) are considered "bad misses" in the BB framework because they indicate target control issues — your system isn't consistently finding the center of the rim.

BB Miss Framework:
• Good: back rim, front skid, in-and-out (you're on target, just solving distance)
• Bad: directional left/right (target control), short, sail

The fix: Ball Flight Spectrum work across all angles. When you train 25°/45°/60° arcs intentionally, your system learns to organize the release path. Directional misses often come from a locked-in single flight pattern.`,
  },
  {
    id: 'miss-right',
    field: 'missProfile',
    label: 'Right Miss Dominant',
    tags: ['leftRight', 'right'],
    templateString: `{{playerName}}'s primary pattern is right-directional misses{{secondaryMiss}}.

Directional misses (left/right) are considered "bad misses" in the BB framework because they indicate target control issues — your system isn't consistently finding the center of the rim.

BB Miss Framework:
• Good: back rim, front skid, in-and-out (you're on target, just solving distance)
• Bad: directional left/right (target control), short, sail

The fix: Ball Flight Spectrum work across all angles. When you train 25°/45°/60° arcs intentionally, your system learns to organize the release path. Directional misses often come from a locked-in single flight pattern.`,
  },
  {
    id: 'miss-back-rim-good',
    field: 'missProfile',
    label: 'Back Rim (Good Pattern)',
    tags: ['backRim'],
    templateString: `{{playerName}}'s primary miss pattern is back rim — this is actually a GOOD sign{{secondaryMiss}}.

Back rim misses (straight up or back toward you) mean you're controlling distance and finding the target. You're solving the hard part. Small energy adjustments dial this in.

BB Miss Framework:
• Good: back rim, front skid, in-and-out, rattles
• Bad: directional, short, back-and-away sail

You're showing Level {{bbLevel}} distance awareness. Next step: convert more back rim misses into makes through repetition — not by changing anything mechanically.`,
  },
  {
    id: 'miss-mixed',
    field: 'missProfile',
    label: 'Mixed Pattern (No Clear Dominant)',
    tags: ['mixed'],
    templateString: `{{playerName}}'s miss pattern is mixed — no single dominant tendency{{secondaryMiss}}.

This is common at Level {{bbLevel}}. A mixed pattern means your system hasn't locked in consistent distance or target control yet. That's okay — it means you have room to improve in multiple areas.

BB Focus:
1. Deep Distance work to establish energy baseline
2. Back-Rim Command to lock in target control
3. Ball Flight Spectrum to build adaptability

We're not looking for "perfect" — we're looking for consistent "good misses" (back rim, front skid) instead of "bad misses" (directional, short, sail).`,
  },
];

// ============================================================
// DEEP DISTANCE DIAGNOSIS MACROS
// ============================================================
export const deepDistanceMacros: BBMacro[] = [
  {
    id: 'deep-default',
    field: 'deepDistance',
    label: 'General Default',
    tags: ['default'],
    templateString: `{{playerName}}'s Deep Distance Target Line is {{deepDistanceLine}} steps behind the 3PT line.

This is YOUR calibration anchor. Spend time here even if you don't hit rim early — that struggle is the point. Your system needs to feel the impulse/energy demand at your edge.

Protocol:
• 10 reps from your Deep Distance Line (back rim miss or make = success)
• Step in 1 step → 10 reps
• Step in again → 10 reps

Focus: Back rim control, not form. Let your system solve the distance problem. This wakes up your natural shooting adaptation.`,
  },
  {
    id: 'deep-short-miss',
    field: 'deepDistance',
    label: 'Short Miss Pattern',
    tags: ['short'],
    templateString: `{{playerName}}'s Deep Distance Line is {{deepDistanceLine}} steps behind the 3PT — and your short miss pattern tells us this is exactly where you need to train.

Short misses = energy gap. Your system hasn't learned the impulse demand for your range. The fix isn't "shoot harder" — it's repetition at your Deep Distance Line until your baseline energy output rises.

Key insight: Even if you're barely reaching the rim from deep, stay there. That struggle rewires your system. When you step in, everything feels easier because your energy baseline is now higher.

Focus cue: Back rim only. No form thoughts. Just solve the distance.`,
  },
  {
    id: 'deep-strong',
    field: 'deepDistance',
    label: 'Strong Deep Range',
    tags: ['strong'],
    templateString: `{{playerName}}'s Deep Distance Line at {{deepDistanceLine}} steps behind the 3PT shows strong energy output.

You're generating the impulse needed to shoot from range — that's a Level {{bbLevel}} indicator. Now the work is precision: can you control WHERE the ball lands from deep?

Protocol focus:
• Back rim command from your Deep Distance Line
• Off-dribble transfers (pull-ups, step-backs) from deep
• Energy consistency across multiple spots

Your system has the power. Now we train the control.`,
  },
  {
    id: 'deep-limited',
    field: 'deepDistance',
    label: 'Limited Deep Range',
    tags: ['limited'],
    templateString: `{{playerName}}'s Deep Distance Line is currently {{deepDistanceLine}} steps behind the 3PT — this is your starting point, not your ceiling.

Don't avoid this distance. Spend minutes here every session, even if shots feel short. Your system needs to experience the impulse demand repeatedly to adapt.

Why this works: Your neuromuscular system learns through struggle. When you train at your edge, your baseline energy output rises. Shots from the 3PT line start feeling easy because you've calibrated to something harder.

No form fixes. Just reps from your Deep Distance Line with back rim focus.`,
  },
  {
    id: 'deep-off-dribble',
    field: 'deepDistance',
    label: 'Off-Dribble Focus',
    tags: ['offDribble'],
    templateString: `{{playerName}}'s Deep Distance work needs to include off-the-dribble transfers.

Your Deep Distance Line ({{deepDistanceLine}} steps behind 3PT) is your anchor — but games ask for pull-ups, step-backs, and bounce pull-ups from range.

Protocol addition:
• 5 pull-ups from your Deep Distance Line
• 5 step-backs
• 5 bounce pull-ups (hang dribble → rise)
• Step in 1 step → repeat

This transfers your stationary calibration to live movement. Back rim focus stays the same.`,
  },
];

// ============================================================
// BACK-RIM CONTROL DIAGNOSIS MACROS
// ============================================================
export const backRimMacros: BBMacro[] = [
  {
    id: 'backrim-default',
    field: 'backRim',
    label: 'General Default',
    tags: ['default'],
    templateString: `{{playerName}}'s Back-Rim Control is developing at Level {{bbLevel}}.

Definition: You're a calibrated shooter when you can intentionally miss back rim, then make the next shot. That's the skill — reading and responding after a miss.

Benchmark: If it takes you 10+ shots to complete a back-rim sequence at a single spot, you need this protocol daily. Games don't give you 10 chances to figure it out.

The response after a miss is the whole point. Every game asks: "Can you adjust after missing?" This drill trains exactly that.`,
  },
  {
    id: 'backrim-struggling',
    field: 'backRim',
    label: 'Struggling with Back-Rim',
    tags: ['struggling'],
    templateString: `{{playerName}}'s back-rim control needs focused work.

If you're taking 10+ shots to hit back rim intentionally at a spot, that's normal for Level {{bbLevel}} — but it's also exactly what we need to fix.

Why this matters: Games don't give you unlimited attempts. You miss, you get the ball back, you have to respond. Back-Rim Command trains this exact skill — the read and adjust cycle.

Protocol:
• Pick one spot
• Hit back rim (miss or make that touches back rim)
• Then make
• Move to next spot

Repeat until this feels automatic. This is your daily calibration work.`,
  },
  {
    id: 'backrim-strong',
    field: 'backRim',
    label: 'Strong Back-Rim Control',
    tags: ['strong'],
    templateString: `{{playerName}} is showing solid back-rim control for Level {{bbLevel}}.

You can intentionally target back rim and adjust after misses — that's the core shooting skill. Most players never train this explicitly.

Next level work:
• Back-rim command under speed (catch and shoot quickly)
• Back-rim command off the dribble
• Back-rim command from your Deep Distance Line

The skill is locked in when you can do this from any spot, any distance, with any entry. Keep building.`,
  },
  {
    id: 'backrim-inconsistent',
    field: 'backRim',
    label: 'Inconsistent Back-Rim',
    tags: ['inconsistent'],
    templateString: `{{playerName}}'s back-rim control is inconsistent — good from some spots, not others.

This is typical at Level {{bbLevel}}. Your system has learned certain spots/distances but hasn't generalized the skill yet.

The fix:
• Start each session with 7-Spot Back-Rim Command
• At each spot: hit back rim → then make → move on
• Track which spots are hardest — those get extra reps

Calibration means: you can do this from anywhere, not just your comfortable spots. The inconsistent spots tell you where your system needs more exposure.`,
  },
  {
    id: 'backrim-distance-gap',
    field: 'backRim',
    label: 'Back-Rim + Distance Gap',
    tags: ['distanceGap'],
    templateString: `{{playerName}} shows back-rim control up close but loses it from distance.

This tells us: your target control is fine, but your energy calibration drops off at range. When you're far away, you're focused on just reaching the rim — back-rim command disappears.

Fix: Deep Distance + Back-Rim combo work.
• From your Deep Distance Line: hit back rim (not just "reach the rim")
• Step in 1 step: back rim focus
• Step in again: back rim focus

This forces your system to maintain target precision even when energy demand is high.`,
  },
];

// ============================================================
// BALL FLIGHT SPECTRUM NOTES MACROS
// ============================================================
export const ballFlightMacros: BBMacro[] = [
  {
    id: 'flight-default',
    field: 'ballFlight',
    label: 'General Default',
    tags: ['default'],
    templateString: `{{playerName}}'s Ball Flight Spectrum shows your default arc tendencies.

Your best flight angle tells you what your system naturally organizes toward. Your worst flight angle tells you what you avoid — and what you need to explore.

We train 25° (flat), 45° (normal), and 60° (high) even if you don't use them all in games. Why? Adaptability. A shooter who can only score with one arc is predictable and limited.

{{flightResults}}

Focus: Back rim at every angle. The arc changes, the target stays the same.`,
  },
  {
    id: 'flight-flat-dominant',
    field: 'ballFlight',
    label: 'Flat Arc Dominant',
    tags: ['flat', '25'],
    templateString: `{{playerName}} defaults to flat (25°) flight — this is your comfort zone.

Flat shooters often struggle with high arcs because it feels "wrong" or "slow." But games will ask for high releases over contests. You need both.

Your flat flight works. Now the work is:
• High flight (60°) exploration — let it feel weird at first
• Normal flight (45°) consistency — your game-day primary
• Flat flight maintenance — don't lose what you have

{{flightResults}}

A shooter who can score from any arc is unpredictable and effective.`,
  },
  {
    id: 'flight-high-dominant',
    field: 'ballFlight',
    label: 'High Arc Dominant',
    tags: ['high', '60'],
    templateString: `{{playerName}} defaults to high (60°) flight — this works well over contests but can be inconsistent from range.

High arc shooters sometimes struggle with flat releases because it feels "rushed." But flat flight is useful for quick releases and from deep.

Your high flight gives you a weapon over defenders. Now explore:
• Flat flight (25°) for speed situations
• Normal flight (45°) for your baseline
• High flight maintenance — your signature

{{flightResults}}

The more arcs you own, the more options you have in games.`,
  },
  {
    id: 'flight-balanced',
    field: 'ballFlight',
    label: 'Balanced Across Arcs',
    tags: ['balanced'],
    templateString: `{{playerName}} shows relatively balanced performance across flight angles — this is strong Level {{bbLevel}} adaptability.

{{flightResults}}

If you're consistently hitting 10+ makes out of 14 at a given angle, you're showing solid control there. The goal is to feel equally comfortable at any arc.

Keep exploring all three:
• Flat (25°) for quick releases, deep shots
• Normal (45°) for your baseline
• High (60°) for contested situations

Spectrum control = unpredictable shooter. Defenders can't time you.`,
  },
  {
    id: 'flight-struggling-flat',
    field: 'ballFlight',
    label: 'Struggling with Flat',
    tags: ['struggleFlat'],
    templateString: `{{playerName}} struggles with flat (25°) flight — this is common if you've trained mostly normal/high arcs.

{{flightResults}}

Flat flight feels "wrong" at first because your system wants to create space with arc. But flat is useful:
• Quick releases under pressure
• Deep shots where high arc costs energy
• Certain mid-range angles

The fix: Dedicated flat flight reps with back-rim focus. Let it feel weird. Your system will adapt if you stay consistent.`,
  },
  {
    id: 'flight-struggling-high',
    field: 'ballFlight',
    label: 'Struggling with High Arc',
    tags: ['struggleHigh'],
    templateString: `{{playerName}} struggles with high (60°) flight — this is common if you've trained mostly flat/normal arcs.

{{flightResults}}

High arc feels "slow" or "floaty" at first. But high arc is valuable:
• Over taller defenders
• Soft touch around the rim
• Certain angles where flat doesn't work

The fix: Dedicated high flight reps. Exaggerate the arc intentionally. Back rim is still the target — you're just getting there differently.`,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Renders a template string by replacing {{variables}} with actual values.
 * Gracefully handles missing values by omitting those lines or using empty string.
 */
export function renderTemplate(templateString: string, variables: MacroVariables): string {
  let result = templateString;

  // Player name
  result = result.replace(/\{\{playerName\}\}/g, variables.playerName || 'This player');

  // BB Level
  result = result.replace(/\{\{bbLevel\}\}/g, String(variables.bbLevel || 1));

  // Primary miss
  const primaryMissDisplay = variables.primaryMiss
    ? variables.primaryMiss.charAt(0).toUpperCase() + variables.primaryMiss.slice(1).replace(/_/g, ' ')
    : 'mixed';
  result = result.replace(/\{\{primaryMiss\}\}/g, primaryMissDisplay);

  // Secondary miss (with leading text if exists)
  const secondaryMissDisplay = variables.secondaryMiss
    ? `, with ${variables.secondaryMiss.replace(/_/g, ' ')} as a secondary pattern`
    : '';
  result = result.replace(/\{\{secondaryMiss\}\}/g, secondaryMissDisplay);

  // Deep distance
  result = result.replace(/\{\{deepDistanceLine\}\}/g, String(variables.deepDistanceLine || 'your furthest'));
  result = result.replace(/\{\{deepDistanceMakes\}\}/g, String(variables.deepDistanceMakes || '-'));
  result = result.replace(/\{\{deepDistanceAttempts\}\}/g, String(variables.deepDistanceAttempts || '-'));

  // Back rim notes
  if (variables.backRimNotes) {
    result = result.replace(/\{\{backRimNotes\}\}/g, variables.backRimNotes);
  } else {
    // Remove lines containing backRimNotes if not available
    result = result.replace(/.*\{\{backRimNotes\}\}.*\n?/g, '');
  }

  // Ball flight results - build a formatted string
  const flightResults = [];
  if (variables.ballFlight25 !== undefined) {
    flightResults.push(`• Flat (25°): ${variables.ballFlight25}/14`);
  }
  if (variables.ballFlight45 !== undefined) {
    flightResults.push(`• Normal (45°): ${variables.ballFlight45}/14`);
  }
  if (variables.ballFlight60 !== undefined) {
    flightResults.push(`• High (60°): ${variables.ballFlight60}/14`);
  }
  const flightResultsStr = flightResults.length > 0
    ? `Your results:\n${flightResults.join('\n')}`
    : '';
  result = result.replace(/\{\{flightResults\}\}/g, flightResultsStr);

  // Individual ball flight values
  result = result.replace(/\{\{ballFlight25\}\}/g, String(variables.ballFlight25 ?? '-'));
  result = result.replace(/\{\{ballFlight45\}\}/g, String(variables.ballFlight45 ?? '-'));
  result = result.replace(/\{\{ballFlight60\}\}/g, String(variables.ballFlight60 ?? '-'));

  // Avg score
  result = result.replace(/\{\{avgScore\}\}/g, String(variables.avgScore?.toFixed(1) || '-'));

  return result;
}

/**
 * Gets all macros for a specific field
 */
export function getMacrosForField(field: BBMacro['field']): BBMacro[] {
  switch (field) {
    case 'missProfile':
      return missProfileMacros;
    case 'deepDistance':
      return deepDistanceMacros;
    case 'backRim':
      return backRimMacros;
    case 'ballFlight':
      return ballFlightMacros;
    default:
      return [];
  }
}

/**
 * Auto-selects the best macro based on player data
 */
export function selectBestMacro(field: BBMacro['field'], variables: MacroVariables): BBMacro {
  const macros = getMacrosForField(field);
  const primaryMiss = variables.primaryMiss?.toLowerCase() || '';

  // Find matching macro based on tags
  let selected: BBMacro | undefined;

  if (field === 'missProfile') {
    if (primaryMiss.includes('short') || primaryMiss.includes('front')) {
      selected = macros.find(m => m.tags.includes('short'));
    } else if (primaryMiss.includes('left')) {
      selected = macros.find(m => m.tags.includes('left'));
    } else if (primaryMiss.includes('right')) {
      selected = macros.find(m => m.tags.includes('right'));
    } else if (primaryMiss.includes('long') || primaryMiss.includes('back')) {
      selected = macros.find(m => m.tags.includes('long'));
    }
  }

  if (field === 'deepDistance') {
    if (primaryMiss.includes('short')) {
      selected = macros.find(m => m.tags.includes('short'));
    } else if ((variables.deepDistanceLine || 0) >= 4) {
      selected = macros.find(m => m.tags.includes('strong'));
    } else if ((variables.deepDistanceLine || 0) <= 1) {
      selected = macros.find(m => m.tags.includes('limited'));
    }
  }

  if (field === 'backRim') {
    const l1 = variables.backRimL1 || 0;
    const l2 = variables.backRimL2 || 0;
    const l3 = variables.backRimL3 || 0;
    const total = l1 + l2 + l3;

    if (total >= 20) {
      selected = macros.find(m => m.tags.includes('strong'));
    } else if (total <= 10) {
      selected = macros.find(m => m.tags.includes('struggling'));
    }
  }

  if (field === 'ballFlight') {
    const flat = variables.ballFlight25 || 0;
    const normal = variables.ballFlight45 || 0;
    const high = variables.ballFlight60 || 0;

    const max = Math.max(flat, normal, high);
    const min = Math.min(flat, normal, high);

    if (max - min <= 2) {
      selected = macros.find(m => m.tags.includes('balanced'));
    } else if (flat === max) {
      selected = macros.find(m => m.tags.includes('flat'));
    } else if (high === max) {
      selected = macros.find(m => m.tags.includes('high'));
    } else if (flat === min && flat < 8) {
      selected = macros.find(m => m.tags.includes('struggleFlat'));
    } else if (high === min && high < 8) {
      selected = macros.find(m => m.tags.includes('struggleHigh'));
    }
  }

  // Fallback to default
  return selected || macros.find(m => m.tags.includes('default')) || macros[0];
}

/**
 * Auto-generates all diagnosis fields at once
 */
export function generateAllDiagnoses(variables: MacroVariables): {
  missProfile: string;
  deepDistance: string;
  backRim: string;
  ballFlight: string;
} {
  return {
    missProfile: renderTemplate(selectBestMacro('missProfile', variables).templateString, variables),
    deepDistance: renderTemplate(selectBestMacro('deepDistance', variables).templateString, variables),
    backRim: renderTemplate(selectBestMacro('backRim', variables).templateString, variables),
    ballFlight: renderTemplate(selectBestMacro('ballFlight', variables).templateString, variables),
  };
}
