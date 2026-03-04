-- =====================================================
-- SESSION TEMPLATES — SEED DATA
-- Pre-built session templates for BB coaching platform
-- =====================================================

-- Clear existing templates (safe to re-run)
DELETE FROM session_templates WHERE created_by = 'system';

-- =====================================================
-- 1. SHOOTING CALIBRATION ASSESSMENT (the full eval)
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Shooting Calibration Assessment',
  'shooting-calibration-assessment',
  'The complete BB shooting evaluation — 14-Spot Baseline, Deep Distance, Back-Rim Challenge, Ball Flight Spectrum, and Fades. The standard test given to every evaluation.',
  'evaluation', 'assessment', 'ClipboardCheck', 'bg-orange-500/20 text-orange-400 border-orange-500/30', 1,
  'Shooting Calibration Assessment',
  'Full BB shooting calibration evaluation — all 5 core tests',
  60,
  ARRAY['14-spot', 'deep-distance', 'back-rim', 'ball-flight', 'fades', 'calibration'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: 14-SPOT BASELINE (15 min)\nPrinciples:\n• 3 rounds of 14 spots around the arc\n• Track miss profile each round (short/long/left/right/mixed)\n• Record video of at least one full round\n• Note dominant hand, player level, position\n\nSEGMENT 2: DEEP DISTANCE (10 min)\nPrinciples:\n• Find deep line (steps behind 3-point line where 7/10+ hit rim)\n• 10 shots from deep line — count rim hits\n• 10 contrast shots (step forward) — count rim hits\n• Record video\n\nSEGMENT 3: BACK-RIM CHALLENGE (10 min)\nPrinciples:\n• Level 1: 1 intentional back-rim → then make\n• Level 2: 2 intentional back-rims → then make\n• Level 3: 3 intentional back-rims → then make\n• Track total shots + time for each level\n• Record video\n\nSEGMENT 4: BALL FLIGHT SPECTRUM (10 min)\nPrinciples:\n• Flat arc (~25°) — 7 shots, count makes/back-rim\n• Normal arc (~45°) — 7 shots, count makes/back-rim\n• High arc (~60°) — 7 shots, count makes/back-rim\n• Track miss profile for each arc type\n• Record video\n\nSEGMENT 5: FADES (10 min)\nPrinciples:\n• Fade right — 7 shots, count makes/back-rim\n• Fade left — 7 shots, count makes/back-rim\n• Track miss profile for each direction\n• Record video',
  'Run full calibration. Watch for energy drift pattern, ball dip, follow-through hold. Note any limiting factors discovered.'
);

-- =====================================================
-- 2. DEEP DISTANCE + BACK RIM TRAINING
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Deep Distance + Back Rim',
  'deep-distance-back-rim',
  'Deep-line impulse work combined with back-rim intentional shooting. Core distance calibration session.',
  'training', 'shooting', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 2,
  'Deep Distance + Back Rim Training',
  'Focus: Deep line impulse, back-rim mastery, distance calibration',
  45,
  ARRAY['deep-distance', 'back-rim', 'calibration'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: DEEP DISTANCE (10 min)\nPrinciples to focus on:\n• Get off the ground\n• 10 rim hits from deep line\n• 10 one step in — back rim miss or makes only\n• Focus on impulse — explosion into the shot\n\nSEGMENT 2: BACK RIM INTENTIONAL (10 min)\nPrinciples to focus on:\n• Level 1: 1 back-rim → make (3 sets)\n• Level 2: 2 back-rims → make (3 sets)\n• Level 3: 3 back-rims → make (2 sets)\n• Stay patient with the arc\n\nSEGMENT 3: 3-POINT LINE — 5 SPOT ROTATION (15 min)\nPrinciples to focus on:\n• Back rim standard on every shot\n• 3 in a row from each spot — back rim miss or make\n• Corner → Wing → Top → Wing → Corner\n• Progress: regular ball → strobes → oversize ball\n\nSEGMENT 4: CONTRAST SHOOTING (10 min)\nPrinciples to focus on:\n• Alternate deep line → normal 3-point shots\n• Feel the distance change\n• Maintain same energy output\n• 5 sets of 2 (deep + normal)',
  'Watch for: energy drift on deep shots, follow-through hold, ball dip pattern changes between distances.'
);

-- =====================================================
-- 3. PRE-GAME CALIBRATION ROUTINE
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Pre-Game Calibration',
  'pre-game-calibration',
  'Standard pre-game shooting calibration routine. Quick back-rim sets, rhythm shooting, game-speed reps.',
  'pre-game', 'pregame', 'Target', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 3,
  'Pre-Game Calibration',
  'Pre-game shooting calibration + mental preparation',
  25,
  ARRAY['pre-game', 'calibration', 'back-rim', 'rhythm'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: BACK RIM WAKE-UP (5 min)\nPrinciples:\n• 3 back-rim misses from mid-range → make\n• 3 back-rim misses from 3-point → make\n• Feel the ball come off fingers\n• No rush — quality over quantity\n\nSEGMENT 2: SPOT RHYTHM (10 min)\nPrinciples:\n• 5 spots around the arc\n• 3 makes from each spot\n• Game-speed catch and shoot\n• Focus on footwork alignment\n\nSEGMENT 3: GAME SPEED REPS (7 min)\nPrinciples:\n• Off screen catch-and-shoot (5 each side)\n• Pull-up from wing (5 each side)\n• Step-back (3 each side)\n• Transition 3s (5 total)\n\nSEGMENT 4: MENTAL LOCK-IN (3 min)\nPrinciples:\n• 3 free throws — back rim standard\n• Visualize first shot of the game\n• Deep breaths\n• Lock in on 1 cue for tonight',
  'Cues for tonight: [fill in based on opponent scouting]'
);

-- =====================================================
-- 4. COGNITIVE SHOOTING (Strobes / Oversize Ball)
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Cognitive Shooting',
  'cognitive-shooting',
  'Shooting under cognitive stress — strobes, oversize ball, dual-task challenges. Builds automaticity.',
  'training', 'shooting', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 4,
  'Cognitive Shooting Session',
  'Focus: Shooting under cognitive stress — strobes, oversize ball, dual-task',
  40,
  ARRAY['cognitive', 'strobes', 'oversize-ball', 'automaticity'],
  ARRAY['strobes', 'oversize-ball'],
  ARRAY['court'],
  E'SEGMENT 1: OVERSIZE BALL WARM-UP (8 min)\nPrinciples:\n• 14-spot with oversize ball (1 round)\n• Track score vs regular ball baseline\n• Focus on hand placement and release\n• Note any mechanical changes\n\nSEGMENT 2: STROBE SHOOTING (12 min)\nPrinciples:\n• Strobes on medium setting\n• 5-spot rotation — 3 makes each\n• Catch and shoot with strobes\n• Pull-up with strobes (3 each wing)\n• Focus on feel over vision\n\nSEGMENT 3: DUAL-TASK CHALLENGE (10 min)\nPrinciples:\n• Shoot while counting backwards from 100 by 7s\n• Shoot while coach calls out colors → respond\n• Shoot with music/distraction\n• 3 makes before moving spots\n\nSEGMENT 4: CONTRAST — BACK TO REGULAR (10 min)\nPrinciples:\n• Remove strobes/oversize ball\n• Regular ball, no distractions\n• 14-spot round — should feel easier\n• Track score improvement\n• Cool down with rhythm shooting',
  'Compare oversize ball vs regular ball scores. Note if strobes improved focus or caused regression. Track progress over sessions.'
);

-- =====================================================
-- 5. MOVEMENT EXPLORATION
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Movement Exploration',
  'movement-exploration',
  'Movement pattern work — delayed acceleration, stops, body fakes, counters. With and without ball.',
  'training', 'movement', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 5,
  'Movement Exploration Session',
  'Focus: Movement patterns, deception, change of pace',
  45,
  ARRAY['movement', 'deception', 'acceleration', 'stops'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: BASE MOVEMENT — NO BALL (10 min)\nPrinciples:\n• Delayed acceleration → explode\n• Abrupt stops (1-2 count)\n• Smooth stop-and-goes\n• Walk steps into burst\n• Body fakes — head height change, postural shift\n\nSEGMENT 2: WITH BALL (10 min)\nPrinciples:\n• Same patterns with live dribble\n• Ball height changes (low → high, high → low)\n• Ball width changes (wide → narrow)\n• Cadence change on dribble\n\nSEGMENT 3: UPHILL / RESISTANCE (8 min)\nPrinciples:\n• Movement patterns on incline or with resistance band\n• Overhead ball carries while moving\n• On-shoulder ball while cutting\n• Focus on hip drive and trail leg\n\nSEGMENT 4: COUNTERS & READS (12 min)\nPrinciples:\n• 1-on-0 with imaginary defender\n• Read and react: drive → pull-up vs drive → step-back\n• Counter moves: crossover → between legs → behind back\n• Narrow stance vs wide stance entries\n\nSEGMENT 5: LIVE APPLICATION (5 min)\nPrinciples:\n• 1-on-1 limited dribbles (3 max)\n• Focus on first step advantage\n• Grade movement quality 1-5',
  'Focus on trail leg mechanics, hip separation, and head height deception. Film for review.'
);

-- =====================================================
-- 6. BALL MANIPULATION + DECEPTION
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Ball Manipulation + Deception',
  'ball-manipulation-deception',
  'Ball handling focus — height, width, cadence changes. Combined with visual deception and postural changes.',
  'training', 'ball-handling', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 6,
  'Ball Manipulation + Deception',
  'Focus: Ball height/width/cadence, visual deception, ball as tool',
  35,
  ARRAY['ball-handling', 'deception', 'manipulation'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: BALL HEIGHT & WIDTH (8 min)\nPrinciples:\n• Stationary: low dribble → high dribble transitions\n• Wide crossover → narrow crossover\n• Cadence changes: fast-fast-slow, slow-slow-fast\n• Both hands\n\nSEGMENT 2: VISUAL DECEPTION (10 min)\nPrinciples:\n• Head height change while dribbling\n• Postural changes — lean then explode opposite\n• Eye manipulation — look left, go right\n• Ball as deception tool — show ball high, go low\n\nSEGMENT 3: COMBO MOVES (10 min)\nPrinciples:\n• Between legs → behind back → crossover\n• Hesitation → crossover → burst\n• In-and-out → spin\n• 3 dribble combinations on the move\n\nSEGMENT 4: LIVE APPLICATION (7 min)\nPrinciples:\n• 1-on-1 from triple threat\n• Must use at least one deception move\n• Limited to 3 dribbles → score\n• Grade deception effectiveness 1-5',
  'Watch for over-dribbling. Quality of deception matters more than speed. Film the 1-on-1 reps.'
);

-- =====================================================
-- 7. LIVE PLAY SESSION
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Live Play Session',
  'live-play',
  'Live scoring session — solo or with partner. Defender proximity, limited dribbles, movement grading.',
  'training', 'live-play', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 7,
  'Live Play Session',
  'Focus: Live scoring, decision-making, game-speed application',
  45,
  ARRAY['live-play', 'scoring', 'decision-making'],
  ARRAY['defender'],
  ARRAY['court'],
  E'SEGMENT 1: PIVOT SCORING (10 min)\nPrinciples:\n• Catch in triple threat\n• Read defender: drive vs shoot vs pass\n• Pivot foot work — front/reverse pivots\n• Score from mid-range and 3\n\nSEGMENT 2: LIMITED DRIBBLES (12 min)\nPrinciples:\n• 1-on-1: 1 dribble only → score\n• 1-on-1: 2 dribbles only → score\n• 1-on-1: 3 dribbles only → score\n• Focus on first step advantage\n\nSEGMENT 3: DEFENDER PROXIMITY (12 min)\nPrinciples:\n• Closeout — catch and shoot vs drive\n• Defender hand up — shot fake → drive\n• Defender trailing — pull-up or step-back\n• Read distance and react\n\nSEGMENT 4: MOVEMENT GRADING (11 min)\nPrinciples:\n• Film each rep\n• Grade movement quality 1-5\n• Focus areas: deception, first step, finishing\n• 10 reps total — track scores\n• Review best and worst reps',
  'Grade each rep. Focus on decision quality over makes/misses. Film for review.'
);

-- =====================================================
-- 8. HIP MOBILITY + CABLE BLOCK
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Hip Mobility + Cable Block',
  'hip-mobility-cable-block',
  'Hip mobility progression and cable block protocol. Foundation for movement quality.',
  'training', 'movement', 'Heart', 'bg-green-500/20 text-green-400 border-green-500/30', 8,
  'Hip Mobility + Cable Block Protocol',
  'Focus: Hip mobility, cable block protocol, movement foundation',
  30,
  ARRAY['hip-mobility', 'cable-block', 'recovery', 'movement'],
  ARRAY['resistance-bands', 'foam-roller'],
  ARRAY['court', 'weight-room', 'home'],
  E'SEGMENT 1: FOAM ROLL + ACTIVATE (8 min)\nPrinciples:\n• Foam roll: quads, hip flexors, IT band, glutes\n• 60 seconds each area\n• Glute activation: banded walks, clamshells\n• Hip circles (10 each direction)\n\nSEGMENT 2: CABLE BLOCK PROTOCOL (12 min)\nPrinciples:\n• Hip flexor stretch (90/90 position) — 2 min each side\n• Hip internal rotation — 2 min each side\n• Hip external rotation — 2 min each side\n• Deep squat hold — 2 min\n\nSEGMENT 3: HIP PROGRESSIONS (10 min)\nPrinciples:\n• Walking hip circles\n• Lateral lunges with rotation\n• Single-leg RDL to hip open\n• Cossack squats\n• World''s greatest stretch (5 each side)',
  'Track range of motion improvements. Note any restrictions or pain points. Compare left vs right.'
);

-- =====================================================
-- 9. STRENGTH + EXPLOSIVENESS
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Strength + Explosiveness',
  'strength-explosiveness',
  'Pull/push/row template + explosive movements. Low-rim dunking for explosion training.',
  'training', 'strength', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 9,
  'Strength + Explosiveness',
  'Focus: Pull/push/row template, explosive movements, vert work',
  50,
  ARRAY['strength', 'explosiveness', 'vertical', 'power'],
  ARRAY['resistance-bands'],
  ARRAY['weight-room', 'court'],
  E'SEGMENT 1: WARM-UP + ACTIVATION (8 min)\nPrinciples:\n• Dynamic stretching\n• Banded activation (glutes, shoulders)\n• Jump rope or light cardio\n• Ankle/hip mobility\n\nSEGMENT 2: PULL/PUSH/ROW (20 min)\nPull (choose 1):\n• Pull-ups or lat pulldown — 3x8\n• Single-arm cable row — 3x10\nPush (choose 1):\n• DB bench press — 3x8\n• Push-ups (weighted vest) — 3x12\nRow (choose 1):\n• Bent-over row — 3x8\n• Inverted row — 3x10\n\nSEGMENT 3: EXPLOSIVE POWER (12 min)\nPrinciples:\n• Box jumps — 4x5 (focus on landing)\n• Broad jumps — 4x3\n• Low-rim dunking (if available) — 10 reps\n• Single-leg bounds — 3x5 each\n\nSEGMENT 4: CORE + FINISH (10 min)\nPrinciples:\n• Pallof press — 3x10 each side\n• Dead bugs — 3x10\n• Plank variations — 3x30s\n• Cool down stretch',
  '3x/week programming. Track weights and reps. Progress by 5% when all sets completed cleanly.'
);

-- =====================================================
-- 10. FILM REVIEW SESSION
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Film Review',
  'film-review',
  'Film breakdown session — game film, practice clips, or shooting mechanics review.',
  'film', 'film', 'Film', 'bg-purple-500/20 text-purple-400 border-purple-500/30', 10,
  'Film Review Session',
  'Focus: Film breakdown and mechanical analysis',
  30,
  ARRAY['film', 'review', 'mechanics'],
  '{}',
  ARRAY['home', 'court'],
  E'SEGMENT 1: CLIP SELECTION (5 min)\nPrinciples:\n• Select 5-8 key clips to review\n• Tag each clip: shooting, movement, decision-making\n• Organize by theme\n\nSEGMENT 2: MECHANICAL BREAKDOWN (15 min)\nPrinciples:\n• Watch each clip at full speed first\n• Then slow motion — frame by frame\n• Note: base, alignment, release, follow-through\n• Compare to reference clips if available\n• Identify 1-2 adjustments per clip\n\nSEGMENT 3: ACTION ITEMS (10 min)\nPrinciples:\n• Write down top 3 takeaways\n• Identify cues to focus on in next session\n• Note limiting factors discovered\n• Plan drills to address issues found',
  'Prepare clips before session. Have reference videos ready for comparison.'
);

-- =====================================================
-- 11. RECOVERY DAY
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Recovery Day',
  'recovery-day',
  'Active recovery session — foam rolling, stretching, light movement, mental recovery.',
  'recovery', 'recovery', 'Heart', 'bg-green-500/20 text-green-400 border-green-500/30', 11,
  'Recovery Session',
  'Focus: Active recovery, mobility, mental reset',
  30,
  ARRAY['recovery', 'mobility', 'mental'],
  ARRAY['foam-roller'],
  ARRAY['home', 'court', 'weight-room'],
  E'SEGMENT 1: FOAM ROLL (10 min)\nPrinciples:\n• Full body foam roll\n• 90 seconds each muscle group\n• Focus on tight areas\n• Calves, quads, hamstrings, glutes, upper back\n\nSEGMENT 2: STATIC STRETCHING (10 min)\nPrinciples:\n• Hip flexor stretch — 2 min each side\n• Hamstring stretch — 2 min each side\n• Shoulder stretch — 1 min each side\n• Spine rotation — 1 min each side\n\nSEGMENT 3: LIGHT MOVEMENT + MENTAL (10 min)\nPrinciples:\n• Walking or light jog (5 min)\n• Deep breathing — box breathing (4-4-4-4)\n• Visualization: next game or next session\n• Journal: 1 thing that went well, 1 area to improve',
  'Recovery is training. Don''t skip this. Track soreness levels and sleep quality.'
);

-- =====================================================
-- 12. QUICK CALIBRATION CHECK (short session)
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Quick Calibration Check',
  'quick-calibration',
  'Short calibration check — 14-spot + back-rim. Use to track progress between full assessments.',
  'evaluation', 'assessment', 'ClipboardCheck', 'bg-orange-500/20 text-orange-400 border-orange-500/30', 12,
  'Quick Calibration Check',
  'Short calibration: 14-spot + back-rim tracking',
  20,
  ARRAY['14-spot', 'back-rim', 'calibration', 'tracking'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: 14-SPOT (10 min)\nPrinciples:\n• 1 round of 14 spots\n• Track score out of 14\n• Note miss profile\n• Compare to last assessment baseline\n\nSEGMENT 2: BACK-RIM CHECK (10 min)\nPrinciples:\n• Level 1: 1 back-rim → make (3 attempts)\n• Level 2: 2 back-rims → make (3 attempts)\n• Track total shots needed\n• Compare to baseline',
  'Quick progress check. Record scores and compare to initial assessment.'
);

-- =====================================================
-- 13. OFF-DAY NO HOOP
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Off-Day (No Hoop)',
  'off-day-no-hoop',
  'Training day without court access. Ball handling, movement patterns, vision work, strength.',
  'training', 'movement', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 13,
  'Off-Day Training (No Hoop)',
  'Focus: Ball handling, movement, strength — no court needed',
  40,
  ARRAY['off-day', 'ball-handling', 'movement', 'strength'],
  '{}',
  ARRAY['home', 'no-hoop', 'outdoor'],
  E'SEGMENT 1: BALL HANDLING (10 min)\nPrinciples:\n• Stationary dribble series (both hands)\n• Figure 8s, wraps, pounds\n• Tennis ball + dribble dual-task\n• Eyes up the entire time\n\nSEGMENT 2: MOVEMENT PATTERNS (10 min)\nPrinciples:\n• Defensive slides\n• Lateral bounds\n• Deceleration drills\n• Change of direction — cone work or markers\n\nSEGMENT 3: BODYWEIGHT STRENGTH (15 min)\nPrinciples:\n• Push-ups — 3x15\n• Single-leg squats — 3x8 each\n• Plank series — 3x45s\n• Lateral lunges — 3x10 each\n• Calf raises — 3x20\n\nSEGMENT 4: VISION TRAINING (5 min)\nPrinciples:\n• Eye tracking exercises\n• Peripheral vision drills\n• Focus switching (near → far)',
  'Even without a hoop, maintain ball feel and movement quality. Track completion.'
);

-- =====================================================
-- 14. POST-GAME REVIEW
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Post-Game Review',
  'post-game-review',
  'Post-game analysis session. Shot-by-shot breakdown, pattern review, next-game adjustments.',
  'postgame', 'film', 'ClipboardList', 'bg-amber-500/20 text-amber-400 border-amber-500/30', 14,
  'Post-Game Review',
  'Shot-by-shot breakdown + pattern analysis',
  20,
  ARRAY['post-game', 'analysis', 'review'],
  '{}',
  ARRAY['home', 'court'],
  E'SEGMENT 1: QUICK STATS (5 min)\nPrinciples:\n• Record: minutes, points, 3PA/3PM\n• Overall feeling (1-5)\n• Shooting confidence (1-5)\n\nSEGMENT 2: SHOT LOG (10 min)\nPrinciples:\n• Log each 3-point attempt\n• Tag: shot type, result, miss type (if miss)\n• Note: time to shot, energy pattern, ball pattern\n• Note: follow-through, alignment\n\nSEGMENT 3: REFLECTION (5 min)\nPrinciples:\n• What worked tonight?\n• What to improve?\n• What am I hunting next game?\n• 1 cue to carry forward',
  'Focus on patterns, not individual shots. Look for trends across games.'
);

-- =====================================================
-- 15. BLOCKER TRAINING
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Blocker Training',
  'blocker-training',
  'Shooting with blockers/pads for simulated contest. Builds comfort shooting over defenders.',
  'training', 'shooting', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 15,
  'Blocker Training Session',
  'Focus: Shooting over contest with blockers',
  35,
  ARRAY['blockers', 'contest', 'shooting', 'release-point'],
  ARRAY['blockers', 'rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: WARM-UP — NO BLOCKERS (5 min)\nPrinciples:\n• 5-spot rhythm shooting\n• 2 makes per spot\n• Establish baseline feel\n\nSEGMENT 2: BLOCKER CATCH-AND-SHOOT (10 min)\nPrinciples:\n• Blocker held at contest height\n• Catch-and-shoot from 5 spots\n• 3 makes per spot\n• Focus on release point — get it over\n\nSEGMENT 3: BLOCKER PULL-UP (10 min)\nPrinciples:\n• 1-dribble pull-up into blocker contest\n• Both wings + top of key\n• 3 makes per spot\n• Focus on elevation and release timing\n\nSEGMENT 4: CONTRAST — NO BLOCKERS (10 min)\nPrinciples:\n• Remove blockers\n• Same spots, same shots\n• Should feel more open\n• Track make percentage improvement',
  'Blocker height should match likely defenders. Progress from stationary to moving blockers over sessions.'
);

-- =====================================================
-- 16. WEEK 0 LIVE PLAY ASSESSMENT
-- =====================================================
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes
) VALUES (
  'Week 0 — Live Play Assessment',
  'week0-live-play',
  'Initial live play assessment for new coaching clients. Movement grading, decision-making evaluation.',
  'evaluation', 'assessment', 'ClipboardCheck', 'bg-orange-500/20 text-orange-400 border-orange-500/30', 16,
  'Week 0 — Live Play Assessment',
  'Initial movement and live play assessment for new client',
  45,
  ARRAY['week-0', 'assessment', 'live-play', 'movement', 'grading'],
  ARRAY['defender'],
  ARRAY['court'],
  E'SEGMENT 1: MOVEMENT PATTERNS (10 min)\nPrinciples:\n• Trail leg assessment\n• Stop quality (1-5 rating)\n• Hip mobility check\n• Film all movements\n• Notes on each pattern\n\nSEGMENT 2: OVERSIZE BALL TEST (8 min)\nPrinciples:\n• Regular ball 14-spot score\n• Oversize ball 14-spot score\n• Calculate difference\n• Notes on mechanical changes\n\nSEGMENT 3: VERTICAL JUMP (5 min)\nPrinciples:\n• Standing reach measurement\n• Max vertical measurement\n• Approach type: 1-foot, 2-foot, or both\n• Notes\n\nSEGMENT 4: LIVE VIDEO (15 min)\nPrinciples:\n• Film 5-8 live play clips\n• Tag each: court position + play type\n• Solo and with partner/defender\n• Grade movement quality\n\nSEGMENT 5: DEBRIEF (7 min)\nPrinciples:\n• Review findings with player\n• Identify top 3 limiting factors\n• Set initial focus areas\n• Explain training plan approach',
  'This is the intake assessment. Be thorough with filming. These clips become the baseline comparison.'
);
