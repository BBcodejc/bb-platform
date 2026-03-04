-- =====================================================
-- BB METHOD SESSIONS — COMPLETE LIBRARY
-- 21 official BB method session templates
-- From the BB Session Database document
-- =====================================================

-- Step 1: Add new columns (safe to re-run)
ALTER TABLE session_templates ADD COLUMN IF NOT EXISTS session_code TEXT;
ALTER TABLE session_templates ADD COLUMN IF NOT EXISTS constraint_level TEXT;
ALTER TABLE session_templates ADD COLUMN IF NOT EXISTS phase TEXT;
ALTER TABLE session_templates ADD COLUMN IF NOT EXISTS progression_notes TEXT;
ALTER TABLE session_templates ADD COLUMN IF NOT EXISTS regression_notes TEXT;

-- Step 2: Update category CHECK to include 'cognitive'
ALTER TABLE session_templates DROP CONSTRAINT IF EXISTS session_templates_category_check;
ALTER TABLE session_templates ADD CONSTRAINT session_templates_category_check
  CHECK (category IN (
    'shooting', 'movement', 'ball-handling', 'vision',
    'recovery', 'mental', 'live-play', 'film', 'assessment', 'strength', 'pregame', 'cognitive'
  ));

-- Step 3: Create index on session_code
CREATE INDEX IF NOT EXISTS idx_session_templates_code ON session_templates(session_code);

-- =====================================================
-- SHOOTING SESSIONS (S-01 through S-08)
-- =====================================================

-- S-01: Back Rim Miss Protocol (Foundation)
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-01: Back Rim Miss Protocol',
  's01-back-rim-miss-protocol',
  'Foundation shooting calibration — 14-spot back rim miss protocol. The starting point for every player.',
  'training', 'shooting', 'Target', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 101,
  'S-01', '1-2', '1',
  'Back Rim Miss Protocol',
  'Foundation calibration — 14-spot back rim miss protocol',
  30,
  ARRAY['back-rim', 'calibration', '14-spot', 'ball-flight'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: WARM-UP (5 min)\n• Close-range makes (5-8 feet)\n• No constraints\n• Cue: "Feel good. Build rhythm."\n\nSEGMENT 2: BACK RIM MISS PROTOCOL — 14 SPOTS (20 min)\n• 14 spots around 3pt line and mid-range\n• Change location after EVERY shot (never two from same spot)\n• Flat ball flight (25-45 degree arc)\n• Goal: Hit middle of back rim\n• Cue: "Shoot it flat. Control distance with exit speed, not loft."\n• Cue: "Middle of back rim. Not left or right edge."\n• Success: 7-10 out of 14 back rim misses = excellent\n• Track: back rim miss / make / other miss per spot\n\nSEGMENT 3: COOL-DOWN MAKES (5 min)\n• Regular shooting, no constraints\n• Cue: "Open it up. Just make shots."',
  'Watch for player ability to identify back rim miss vs other miss. Track data every session.',
  'Session 1-2: Introduce protocol, build back rim awareness. Session 3-4: Track data, push for 7+/14 back rim misses. When consistently hitting 7+/14: advance to S-02.',
  'If player cannot identify back rim miss vs other miss: slow down, use closer range (midrange only), emphasize flat ball flight cue.'
);

-- S-02: 7-Spot Flow + Oversized Ball
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-02: 7-Spot Flow + Oversized Ball',
  's02-7spot-flow-oversized',
  'Oversized ball calibration — 7-spot flow and +3 protocol. The Tobias Harris session structure.',
  'training', 'shooting', 'Target', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 102,
  'S-02', '3', '2',
  '7-Spot Flow + Oversized Ball',
  'Oversized ball calibration — 7-spot flow and +3 protocol',
  35,
  ARRAY['oversized-ball', '7-spot', 'calibration', 'contrast'],
  ARRAY['oversize-ball', 'rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: TEST OUT (5 min)\n• Oversized ball\n• Shoot from various spots\n• Cue: "Feel the difference. Rim looks smaller."\n\nSEGMENT 2: 7-SPOT CALIBRATION FLOW (15 min)\n• Oversized ball + flat ball flight\n• 7 spots around the arc\n• Back rim miss or make = advance to next spot\n• Any other miss = repeat spot\n• Cue: "Flat. Back rim. Next spot."\n\nSEGMENT 3: 7-SPOT +3 PROTOCOL (10 min)\n• Oversized ball\n• Same 7 spots\n• Must make 3 from each spot before advancing\n• Cue: "Earn it. Three makes, move on."\n\nSEGMENT 4: CONTRAST TEST OUT (5 min)\n• Switch to regular ball\n• Shoot freely\n• Cue: "Feel how big the rim looks now."',
  'This is the Tobias Harris session structure. Contrast between oversized and regular is critical. Never skip the test out.',
  'When 7-spot flow completed in under 8 minutes: add strobes (S-03). When +3 protocol completed in under 12 minutes: advance phase.',
  'Return to S-01 if back rim awareness is inconsistent with oversized ball.'
);

-- S-03: Visual Stress Layer
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-03: Visual Stress Layer',
  's03-visual-stress-layer',
  'Oversized ball + strobes + energy pattern exploration. Builds automaticity under visual stress.',
  'training', 'shooting', 'Target', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 103,
  'S-03', '4-5', '3',
  'Visual Stress Layer',
  'Oversized ball + strobes + energy pattern exploration',
  40,
  ARRAY['strobes', 'oversized-ball', 'visual-stress', 'energy-patterns'],
  ARRAY['oversize-ball', 'strobes', 'rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: TEST OUT (5 min)\n• Oversized ball, no strobes\n• Various spots\n\nSEGMENT 2: 7-SPOT CALIBRATION FLOW (12 min)\n• Oversized ball + flat ball flight\n• Same flow as S-02\n\nSEGMENT 3: STROBE SHOOTING (15 min)\n• Oversized ball + strobes\n• Start Level 3, progress to Level 4-5\n• Make 1 = next spot. Back rim miss = next spot.\n• Cue: "Trust your system. You don''t need to see it the whole way."\n\nSEGMENT 4: CONTRAST TEST OUT (5 min)\n• Regular ball, no strobes\n• Feel the contrast\n\nSEGMENT 5: ENERGY PATTERN EXPLORATION (10 min)\n• Regular ball\n• Early release exploration\n• Jump forward exploration\n• Aerial pause / fade variations\n• Cue: "Explore how momentum changes your shot. No right answer."',
  'Energy patterns are NOT drills. They are explorations. Player chooses which patterns to try. Coach observes what emerges.',
  'When player maintains calibration through strobes Level 5: advance to S-07 stacked constraints.',
  'If strobes cause significant regression: reduce to Level 2-3. If oversized ball + strobes is too much: remove strobes and stay at S-02.'
);

-- S-04: Deep Distance Calibration
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-04: Deep Distance Calibration',
  's04-deep-distance-calibration',
  'Deep distance protocol — 3-5 steps behind the line. Calibrates the system so game-range efficiency improves.',
  'training', 'shooting', 'Target', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 104,
  'S-04', '2-3', '2-3',
  'Deep Distance Calibration',
  'Deep line impulse work — calibrating distance and exit speed',
  30,
  ARRAY['deep-distance', 'calibration', 'exit-speed', 'movement-patterns'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: WARM-UP (5 min)\n• Close range makes\n\nSEGMENT 2: DEEP DISTANCE PROTOCOL (20 min)\n• 3-5 steps BEHIND three-point line\n• Flat ball flight emphasis (some loft acceptable at distance)\n• Cue: "Let it go. Don''t try to make it. Feel the exit speed."\n• Cue: "Your hands have to interact with the ball differently from here."\n• Track: back rim / make / short / long / left / right\n• Explore movement patterns INTO the shot:\n  - Trail leg step-back each way\n  - Bounding forward\n  - Delayed bounding\n  - Body fake delay\n  - Gallop\n  - Slide gallop\n• 3 players per rim, 3-4 rebounders\n• Methodically alter patterns (everyone does trail leg, then bounding, etc.)\n\nSEGMENT 3: LADDER DOWN (5 min)\n• Move progressively closer: deep > 3pt line > mid-range\n• Feel the contrast\n• Cue: "Game range should feel easy now."',
  'This is NOT about making shots from deep. It is about calibrating the system so game-range efficiency improves. Extreme joint velocities, extreme pressure on how hands interact at release, extreme pressure on guide hand.',
  'When deep shots consistently hit rim (not air-balls): integrate deep distance into other sessions as warm-up.',
  'If player air-balls consistently: move closer (1-2 steps behind line instead of 3-5). Focus on exit speed cue.'
);

-- S-05: Ball Flight Exploration Spectrum
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-05: Ball Flight Exploration',
  's05-ball-flight-exploration',
  'Ball flight spectrum — flat, medium, and high arc shooting. Expands trajectory bandwidth.',
  'training', 'shooting', 'Target', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 105,
  'S-05', '1-2', '1-2',
  'Ball Flight Exploration Spectrum',
  'Trajectory bandwidth — flat, medium, and high arc shooting',
  25,
  ARRAY['ball-flight', 'arc', 'trajectory', 'bandwidth'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: FLAT ARC SHOOTING (8 min)\n• 25-45 degree arc\n• Line drive feel\n• Various spots\n• Cue: "Flat. Like a laser."\n\nSEGMENT 2: MEDIUM ARC SHOOTING (8 min)\n• 45-52 degree arc\n• Standard game arc\n• Cue: "Regular rhythm. Let it fly."\n\nSEGMENT 3: HIGH ARC SHOOTING (8 min)\n• 55-70 degree arc\n• Rainbow feel\n• Cue: "Get it up. Feel the difference in release timing."\n\nSEGMENT 4: FREE EXPLORATION (5 min)\n• Player chooses arc based on spot and feel\n• Cue: "Shoot what feels right from each spot. No two shots the same."',
  'Most players are locked into one ball flight. This expands trajectory bandwidth so they can adapt based on contest.',
  'When player can intentionally vary arc on command: integrate into S-02/S-03 sessions.',
  'If player struggles with high arc: start with mid-range high arc before extending to three-point range.'
);

-- S-06: Peripheral Vision Shooting
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-06: Peripheral Vision Shooting',
  's06-peripheral-vision',
  'Shooting with peripheral vision challenges — arm count and number system. Builds visual processing.',
  'training', 'shooting', 'Eye', 'bg-gold-500/20 text-gold-400 border-gold-500/30', 106,
  'S-06', '3', '3',
  'Peripheral Vision Shooting',
  'Shooting with peripheral vision challenges and dual-task',
  30,
  ARRAY['peripheral-vision', 'dual-task', 'visual-processing'],
  ARRAY['rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: WARM-UP (5 min)\n• Regular shooting, no constraints\n\nSEGMENT 2: ONE ARM UP / TWO ARMS UP (10 min)\n• Coach stands in peripheral field (side of player)\n• Player central vision on rim\n• Coach shows 1 arm or 2 arms\n• 1 arm = shoot 1 shot. 2 arms = shoot 2 shots.\n• 20 total attempts\n• Progression: coach stationary > coach moving > add oversized ball > add back rim focus\n\nSEGMENT 3: NUMBER SYSTEM (10 min)\n• Coach holds up 1-5 fingers in peripheral field\n• Player calls number while shooting\n• Both must happen simultaneously\n• 20 attempts\n• Track: number correct + make/miss\n\nSEGMENT 4: COOL-DOWN (5 min)\n• No constraints\n• Cue: "Feel how automatic it is now."',
  'Requires a partner/coach for peripheral cues. Track number correct percentage alongside shooting percentage.',
  'When number correct is 90%+ while maintaining shooting baseline: combine with S-03 constraints.',
  'If shooting percentage drops more than 20% with peripheral task: simplify to just arm count (1 vs 2) before progressing to numbers.'
);

-- S-07: Stacked Constraint Shooting (Elite)
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-07: Stacked Constraint Shooting',
  's07-stacked-constraint',
  'Elite level — oversized ball + strobes + blockers. All constraints stacked. 3-5 makes out of 20 = excellent.',
  'training', 'shooting', 'Target', 'bg-red-500/20 text-red-400 border-red-500/30', 107,
  'S-07', '5-6', '4-5',
  'Stacked Constraint Shooting (Elite)',
  'All constraints stacked — oversized ball + strobes + blockers',
  40,
  ARRAY['stacked-constraints', 'strobes', 'blockers', 'oversized-ball', 'elite'],
  ARRAY['oversize-ball', 'strobes', 'blockers', 'rebounder'],
  ARRAY['court'],
  E'SEGMENT 1: STROBE SHOOTING (10 min)\n• Strobes Level 3-5\n• Various spots\n• Track makes\n\nSEGMENT 2: CONTRACT-RELAX WITH BLOCKER (10 min)\n• Coach holds blocker, varies position\n• Player catches, blocker reaches, player shoots\n• Cue: "React to the reach. Don''t pre-plan."\n• Progression: 0 dribbles > 1 dribble > 3-5 dribbles\n\nSEGMENT 3: COMBINED STACK (10 min)\n• Oversized ball + strobes + blocker\n• Just count makes\n• 3-5 makes out of 20 = excellent at this level\n• Cue: "If games were this hard, you''d be unstoppable."\n\nSEGMENT 4: LIVE 1v1 SHOOTING (10 min)\n• Regular ball, no equipment\n• 1v1 with dribble limits (0-3)\n• Test what shows up under game pressure',
  'Only for players who have completed Phases 1-3. This is elite-level constraint stacking.',
  'When player consistently gets 5+ makes out of 20 in combined stack: add defender (Level 6).',
  'If player cannot get any makes in combined stack: remove one constraint (usually strobes first), rebuild confidence, then re-add.'
);

-- S-08: Pre-Game Calibration Routine
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'S-08: Pre-Game Calibration',
  's08-pre-game-calibration',
  'Standard pre-game routine — oversized ball warm-up, deep distance dosage, movement patterns, regular ball test out.',
  'pre-game', 'pregame', 'Target', 'bg-orange-500/20 text-orange-400 border-orange-500/30', 108,
  'S-08', '2-3', 'Any',
  'Pre-Game Calibration',
  'Game-day calibration — oversized ball, deep distance, movement patterns',
  20,
  ARRAY['pre-game', 'calibration', 'oversized-ball', 'deep-distance', 'movement-patterns'],
  ARRAY['oversize-ball'],
  ARRAY['court'],
  E'SEGMENT 1: OVERSIZED BALL WARM-UP (5 min)\n• Shoot from 5-7 spots with oversized ball\n• Flat ball flight\n• No make counting\n\nSEGMENT 2: DEEP DISTANCE DOSAGE (5 min)\n• 3-5 shots from well behind the line\n• Extreme ball flight exploration\n• Cue: "Calibrate your system. Don''t worry about makes."\n\nSEGMENT 3: MOVEMENT PATTERN EXPLORATION (5 min)\n• Trail leg step-back each way\n• Bounding\n• Delayed bounding\n• Gallop\n• All from deep distance\n• Cue: "Explore the patterns you''ll use tonight."\n\nSEGMENT 4: REGULAR BALL TEST OUT (5 min)\n• Switch to game ball\n• Shoot from game spots\n• Cue: "Everything should feel easy now."',
  'All of your downtime preparing to shoot in games should resemble what the game presents with. Not just standing in one spot making shots with all variables absent.',
  NULL,
  NULL
);

-- =====================================================
-- MOVEMENT SESSIONS (M-01 through M-04)
-- =====================================================

-- M-01: Dowel Movement Foundation
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'M-01: Dowel Movement Foundation',
  'm01-dowel-movement-foundation',
  'Foundation movement work with dowel — full foot contact, trunk rotation, deceleration patterns. No ball.',
  'training', 'movement', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 201,
  'M-01', '1', '1',
  'Dowel Movement Foundation',
  'Foundation movement — full foot contact, trunk rotation, deceleration',
  25,
  ARRAY['dowel', 'full-foot-contact', 'trunk-rotation', 'deceleration'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: FULL FOOT CONTACT EXPLORATION (10 min)\n• Dowel across shoulders or behind back\n• Walk, then jog, focusing on full foot contact\n• Cue: "Feel your whole foot. Heel to toe."\n• Explore stances: staggered, offset lunge, wide, narrow\n• Hip hinge with dowel on back (feel trunk organization)\n\nSEGMENT 2: TRUNK ROTATION EXPLORATION (8 min)\n• Dowel across shoulders\n• Rotate trunk while walking, then jogging\n• Cue: "Let the trunk lead. Feel the rotation."\n• Progress to trunk rotation at acceleration\n• Cue: "When you speed up, the trunk should rotate."\n\nSEGMENT 3: DECELERATION PATTERNS (7 min)\n• Lead leg deceleration with trunk hinge\n• Dowel helps feel the hinge\n• Cue: "Stop on the lead leg. Hinge at the trunk. Feel force through back and glutes, not knee."\n• Explore hip external rotation at decel',
  'Foundation for all movement work. Dowel provides proprioceptive feedback on trunk organization.',
  'When patterns are fluid without ball: advance to M-02 (add ball).',
  'If trunk rotation is absent at acceleration: stay at M-01, increase reps of trunk rotation walks before jogging.'
);

-- M-02: Movement Bandwidth — Pattern Library
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'M-02: Movement Bandwidth Patterns',
  'm02-movement-bandwidth',
  'Movement pattern library — narrow-to-wide, gallop, delayed acceleration, walk steps, trail leg, BCD. With ball.',
  'training', 'movement', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 202,
  'M-02', '2', '2',
  'Movement Bandwidth — Pattern Library',
  'Full movement pattern exploration with ball — 8+ patterns',
  45,
  ARRAY['movement-bandwidth', 'gallop', 'delayed-acceleration', 'walk-steps', 'trail-leg', 'BCD'],
  ARRAY['blockers'],
  ARRAY['court'],
  E'SEGMENT 1: DOWEL/MOVEMENT REVIEW (5 min)\n• Quick review of full foot contact and trunk rotation\n• No ball\n\nSEGMENT 2: MOVEMENT PATTERN EXPLORATION WITH BALL (30 min)\nExplore each pattern for 3-4 min:\n• Narrow-to-wide: start tight, progressively widen while dribbling\n• Gallop (short-short-long): distorts timing for defender\n• Delayed acceleration: pause before exploding\n• Walk steps: slow controlled steps to address cushion\n• Smooth stop-and-go: gait cycle at varying speeds\n• Abrupt stop-and-go: sharp tempo change\n• Trail leg patterns: trail leg to shot, trail leg step-back\n• BCD (back-cross-drive)\n• Cue for all: "Feel the pattern. No defender yet. Just groove it."\n\nSEGMENT 3: 1v1 VS BLOCKER TEST (10 min)\n• Apply 2-3 patterns against blocker\n• Blocker varies: reach on reception, give cushion then close\n• Cue: "What pattern works here? Let your body choose."',
  'This is the full pattern library. Players need exposure to all patterns before specializing.',
  'When player can fluidly switch between 4+ patterns in live play: advance to M-03.',
  'If patterns break down with ball: return to M-01 dowel work, then re-add ball.'
);

-- M-03: Movement + Ball Manipulation Integration
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'M-03: Movement + Ball Manipulation',
  'm03-movement-ball-manipulation',
  'RT/RL/DT exploration integrated with movement patterns. Includes balloon protocol and blocker work.',
  'training', 'movement', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 203,
  'M-03', '2-3', '2-3',
  'Movement + Ball Manipulation Integration',
  'RT/RL/DT + movement patterns + balloon protocol',
  50,
  ARRAY['RT', 'RL', 'DT', 'movement-patterns', 'balloon', 'ball-manipulation'],
  ARRAY['blockers'],
  ARRAY['court'],
  E'SEGMENT 1: RT/RL/DT EXPLORATION (15 min)\n• Same-side dribbling focus\n• RT: vary height (5 levels) x force (3 levels)\n• RL: width work (further from body, wrapping, outside ball)\n• DT: force variation (feel airborne time)\n• Cue: "How long is the ball in your hand? Where is it relative to your body? How long is it in the air?"\n\nSEGMENT 2: MOVEMENT PATTERNS WITH BALL (15 min)\n• Narrow-to-wide with dribble\n• Gallop with dribble\n• Walk steps addressing cushion with optimal RL\n• Cue: "Trunk rotation at acceleration. Ball back and away."\n\nSEGMENT 3: BALLOON PROTOCOL (10 min)\n• Dribble while keeping balloon in air\n• Hit balloon forward (not just up), hard and soft\n• Explore: RT/RL/DT principles, head height changes, movement patterns\n• Cue: "Balloon is the constraint. Everything else is exploration."\n\nSEGMENT 4: 1v1 VS BLOCKER (10 min)\n• Full speed, blocker reaches\n• Test what patterns emerge\n• Cue: "Can you get close while keeping the ball? Can you address cushion?"',
  'Integration session — movement and ball manipulation must work together. Film for review.',
  'When RT/RL/DT awareness shows up reflexively in blocker work: advance to CL-01.',
  'If ball manipulation breaks down under movement stress: isolate with BM-01 RT/RL/DT foundation work.'
);

-- M-04: Pivoting Complex Exploration
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'M-04: Pivoting Complex',
  'm04-pivoting-complex',
  'Front pivot, reverse pivot, combination pivots with deception. Creating advantages without speed.',
  'training', 'movement', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 204,
  'M-04', '1-2', '2',
  'Pivoting Complex Exploration',
  'Front/reverse pivots, combinations, deception — creating from the pivot',
  30,
  ARRAY['pivoting', 'front-pivot', 'reverse-pivot', 'deception', 'triple-threat'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: FRONT PIVOT EXPLORATION (8 min)\n• Out of catch: various angles and speeds\n• Out of dribble: pick up into front pivot\n• Add deception: eyes one way, pivot another. Shoulder fake. Ball fake.\n• Cue: "Make the defender believe one thing. Do another."\n\nSEGMENT 2: REVERSE PIVOT EXPLORATION (8 min)\n• Same progressions as front pivot\n• Out of catch, out of dribble\n• Add shot off reverse pivot\n\nSEGMENT 3: COMBINATION PIVOTS (8 min)\n• Front to reverse\n• Reverse to front\n• Triple combination: fake, pivot, counter-pivot, attack\n• Cue: "How many options can you create from one pivot?"\n\nSEGMENT 4: LIVE APPLICATION (6 min)\n• 1v1 from catch: only pivots to create shot or drive\n• 0-1 dribble limit\n• Cue: "Your feet and deception create the advantage. Not speed."',
  'Pivoting is undervalued. This session builds the ability to create space without relying on athleticism.',
  'When player can create consistent advantage from pivot in live 1v1: integrate pivots into LP-02 constrained play.',
  'If pivoting is mechanical/robotic: focus on deception elements (eyes, shoulders, ball fakes) before full combinations.'
);

-- =====================================================
-- BALL MANIPULATION SESSIONS (BM-01, BM-02)
-- =====================================================

-- BM-01: RT/RL/DT Foundation Sequence (7-Day)
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'BM-01: RT/RL/DT Foundation',
  'bm01-rt-rl-dt-foundation',
  'Ball manipulation foundation — 7-day sequence covering Retention Time, Relative Location, and Dribble Time.',
  'training', 'ball-handling', 'Dumbbell', 'bg-purple-500/20 text-purple-400 border-purple-500/30', 301,
  'BM-01', '1-2', '1',
  'RT/RL/DT Foundation Sequence',
  '7-day ball manipulation sequence — RT, RL, DT, integration, balloon, blocker, live',
  40,
  ARRAY['RT', 'RL', 'DT', 'ball-manipulation', 'same-side', 'foundation'],
  '{}',
  ARRAY['court'],
  E'This is a 7-day sequence. Run one day per session.\n\nDAY 1: RT FOCUS (20 min)\n• Same-side dribbles, vary height (high/moderate/low)\n• Vary force (hard/moderate/soft)\n• 5 heights x 3 forces = 15 combinations to explore\n• Cue: "Feel the ball in your hand longer with height and width."\n• 4 manipulations at each combo: in-and-out, V-dribble, half-spin, wrap\n\nDAY 2: RL FOCUS (20 min)\n• Width work: dribble further from body (straight arm, bent arm)\n• Angle work: front-to-back V, side-to-side\n• Closeness application: walk toward wall/partner maintaining optimal RL\n• Cue: "Ball back and away. How close can you get while keeping it?"\n\nDAY 3: DT FOCUS (20 min)\n• Vary force, feel time ball is airborne\n• Soft dribbles to distort time and mask intentions\n• Hard dribbles to understand cadence\n• Cue: "Most players dribble one speed. You need five."\n\nDAY 4: INTEGRATE (20 min)\n• L-R manipulations with RT/RL/DT awareness\n• Same-side dribble BETWEEN every L-R move\n• Cue: "Same-side is the foundation. Cross only when you choose to."\n\nDAY 5: ADD BALLOON (20 min)\n• All RT/RL/DT principles under dynamic constraint\n• Hit balloon forward, hard and soft\n• Explore: high-to-low, low-to-low, pull-ups while controlling balloon\n• Cue: "Balloon forces you to modulate. Let it happen."\n\nDAY 6: ADD BLOCKER (20 min)\n• 1v1 with blocker focusing on RT/RL/DT\n• Blocker reaches on reception\n• Cue: "Is your RL good enough to survive the reach?"\n\nDAY 7: LIVE 1v1 (20 min)\n• Full speed, full court or half court\n• No dribble limits\n• Observe: Does RT/RL/DT awareness show up reflexively?',
  'This is the foundation for all ball manipulation work. Each day builds on the previous. Do not skip days.',
  'When RT/RL/DT awareness is reflexive in live 1v1 (Day 7): advance to M-03 integration.',
  'If player reverts to constant hard dribbling in live play: return to Day 3 (DT focus) and rebuild cadence variation.'
);

-- BM-02: Balloon Protocol (Standalone)
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'BM-02: Balloon Protocol',
  'bm02-balloon-protocol',
  'Balloon as dynamic constraint — dribble while keeping balloon in air. Works contract-relax and sensory modulation.',
  'training', 'ball-handling', 'Dumbbell', 'bg-purple-500/20 text-purple-400 border-purple-500/30', 302,
  'BM-02', '2', '2',
  'Balloon Protocol',
  'Balloon + dribble — contract-relax, sensory modulation, RT/RL/DT under constraint',
  20,
  ARRAY['balloon', 'contract-relax', 'sensory-modulation', 'RT', 'RL', 'DT'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: BASIC BALLOON + DRIBBLE (8 min)\n• Dribble with dominant hand, keep balloon up with off hand\n• Hit balloon forward (not just up)\n• Hit hard, hit soft\n• Cue: "Don''t let it hit the floor. Everything else is exploration."\n\nSEGMENT 2: BALLOON + MOVEMENT PATTERNS (7 min)\n• Add: gallop, body fakes, acceleration contacts\n• Explore: RT/RL/DT principles while balloon dictates urgency\n• Head height changes (up and down while controlling both)\n• Cue: "The balloon makes you modulate everything."\n\nSEGMENT 3: BALLOON + BLOCKER (5 min)\n• Partner holds blocker AND reaches for ball\n• Player must: control balloon, maintain RL, see blocker peripherally\n• Cue: "Central vision on balloon. Peripheral on blocker. Control the ball."',
  'The balloon works the same contract-relax mechanisms. The variation and intrinsic KP, the contraction states, how sensory information flows when you dribble hard then hit the balloon soft. This is NOT random balloon juggling. It is intentional RT/RL/DT work under dynamic constraint.',
  'When balloon protocol is fluid with blocker: integrate balloon into M-03 sessions.',
  'If player cannot maintain dribble while controlling balloon: start stationary (no movement patterns) and add movement once stationary is controlled.'
);

-- =====================================================
-- COGNITIVE LAYERING SESSION (CL-01)
-- =====================================================

INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'CL-01: Cognitive Layering + Live',
  'cl01-cognitive-layering',
  'Full cognitive layering session — strobes, blockers, oversized ball, live 1v1, and 2v2/3v3. Day 4 structure from Master Audit.',
  'training', 'cognitive', 'Eye', 'bg-amber-500/20 text-amber-400 border-amber-500/30', 401,
  'CL-01', '4-6', '4',
  'Cognitive Layering + Live Application',
  'Full cognitive stack — strobes, blockers, constraints, live play',
  65,
  ARRAY['cognitive', 'strobes', 'blockers', 'oversized-ball', 'live-play', 'contract-relax'],
  ARRAY['strobes', 'blockers', 'oversize-ball'],
  ARRAY['court'],
  E'SEGMENT 1: STROBE SHOOTING PROTOCOL (15 min)\n• Strobes Level 3-5\n• Shoot from various spots\n• Track makes\n\nSEGMENT 2: CONTRACT-RELAX WITH BLOCKER + STROBES (10 min)\n• Both constraints simultaneously\n• Coach varies blocker position\n• Cue: "React. Don''t think."\n\nSEGMENT 3: COMBINED CONSTRAINT STACK (10 min)\n• Oversized ball + strobes + blocker\n• Count makes out of 20\n• 3-5 = excellent\n\nSEGMENT 4: LIVE 1v1 WITH CONSTRAINTS (15 min)\n• Regular ball, blocker defender\n• Dribble limits (0-3)\n• Space reduction (1/3 court width)\n• Cue: "Create a shot. Any pattern."\n\nSEGMENT 5: 2v2 OR 3v3 WITH BB FOCUS (15 min)\n• Regular ball, no equipment\n• Coach observes: what patterns emerge? Vision up? RL optimal?\n• Specific focus areas called out before play',
  'This is the Day 4 structure from the Master Audit weekly plan. Only for players who have completed Phases 1-3.',
  'When patterns consistently emerge in 2v2/3v3: player is ready for LP-01 live play testing.',
  'If player regresses significantly under combined constraints: reduce to 2 constraints max and rebuild.'
);

-- =====================================================
-- LIVE PLAY SESSIONS (LP-01, LP-02)
-- =====================================================

-- LP-01: Live Play Testing + Film Review
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'LP-01: Live Play Test + Film',
  'lp01-live-play-film',
  'Full live play testing session — 3v3 or 5v5 at game speed with coach observation and film review.',
  'training', 'live-play', 'Trophy', 'bg-red-500/20 text-red-400 border-red-500/30', 501,
  'LP-01', 'Game', '5',
  'Live Play Testing + Film Review',
  'Game-speed live play — 3v3/5v5 with BB observation + film review',
  60,
  ARRAY['live-play', 'game-speed', 'film-review', 'observation'],
  '{}',
  ARRAY['court'],
  E'SEGMENT 1: CALIBRATION WARM-UP (10 min)\n• Quick shooting calibration (back rim + oversized if available)\n• 10 min only. Not a full session.\n\nSEGMENT 2: LIVE PLAY 3v3 OR 5v5 (30 min)\n• Full speed\n• Coach observes with specific BB focus:\n  - Do calibration patterns show up?\n  - Miss profile in live play vs practice\n  - Movement bandwidth visible?\n  - Vision quality under game stress?\n  - What new limiting factors emerge?\n\nSEGMENT 3: FILM REVIEW WITH PLAYER (15 min)\n• Review key possessions\n• Identify: what emerged, what broke down, what to adjust\n• Cue: "What did you feel? What did you see? Where did your eyes go?"\n\nSEGMENT 4: SESSION NOTES (5 min)\n• Document observations\n• Plan next week adjustments',
  'This is the ultimate test. Does the training show up under game conditions? Focus on pattern emergence, not outcomes.',
  'When patterns consistently emerge in live play: player is maintaining their training under game stress. Continue development.',
  'If patterns break down completely in live play: return to LP-02 constrained 1v1 before full live play.'
);

-- LP-02: Constrained Live Play (1v1 Variations)
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'LP-02: Constrained 1v1 Variations',
  'lp02-constrained-1v1',
  '1v1 with progressive constraints — 0 dribble, limited dribbles, blocker defender, reduced space.',
  'training', 'live-play', 'Trophy', 'bg-red-500/20 text-red-400 border-red-500/30', 502,
  'LP-02', '3-4', '3-4',
  'Constrained Live Play — 1v1 Variations',
  '1v1 with progressive constraints — the gauntlet',
  30,
  ARRAY['1v1', 'constrained-play', 'dribble-limits', 'space-reduction'],
  ARRAY['blockers'],
  ARRAY['court'],
  E'SEGMENT 1: 1v1 FULL COURT — 0 DRIBBLE (8 min)\n• Catch and shoot or catch and pass only\n• Forces: vision, movement to get open, decision-making without handle\n\nSEGMENT 2: 1v1 HALF COURT — 0-3 DRIBBLES (8 min)\n• Must create shot within 3 dribbles\n• Forces: efficient ball manipulation, movement pattern selection\n\nSEGMENT 3: 1v1 HALF COURT — BLOCKER DEFENDER (8 min)\n• Defender holds blocker (extended wingspan)\n• Reduced space and time\n• Cue: "Get your shot off against NBA length."\n\nSEGMENT 4: 1v1 — 1/3 COURT WIDTH (6 min)\n• Sideline to free throw lane width\n• No rim finishes (must create shot)\n• Maximum space/time pressure\n• Cue: "This is the gauntlet. Everything you''ve trained shows up here or it doesn''t."',
  'Progressive constraint 1v1 work. Each segment increases the pressure. Film all segments.',
  'When player can consistently create quality shots in 1/3 court width: ready for LP-01 full live play.',
  'If player cannot create any shots with 0 dribbles: work on off-ball movement and pivoting (M-04) first.'
);

-- =====================================================
-- EVALUATION SESSIONS (E-01, E-02)
-- =====================================================

-- E-01: BB Lens Full Assessment
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'E-01: BB Lens Full Assessment',
  'e01-bb-lens-full-assessment',
  'Complete BB Lens assessment — movement system, vision system, ball manipulation, shooting, and limiting factor identification.',
  'evaluation', 'assessment', 'ClipboardCheck', 'bg-orange-500/20 text-orange-400 border-orange-500/30', 601,
  'E-01', 'N/A', 'Entry',
  'BB Lens Full Assessment',
  'Complete evaluation — movement, vision, ball manipulation, shooting, limiting factors',
  75,
  ARRAY['assessment', 'BB-lens', 'movement', 'vision', 'ball-manipulation', 'shooting', 'limiting-factors'],
  '{}',
  ARRAY['court'],
  E'MOVEMENT SYSTEM ASSESSMENT (20 min)\nFilm and evaluate:\n• Full foot contact vs midfoot dominant\n• Trunk rotation at acceleration\n• Lead leg decel with trunk hinge\n• Dorsiflexion quality\n• External rotation of lead hip\n• Posture (hip hinge vs flexed spine)\n• Movement bandwidth (count distinct patterns under stress)\n• Stance variations\n\nVISION SYSTEM ASSESSMENT (15 min)\nFilm and evaluate:\n• Central vs peripheral usage\n• Gaze location during ball handling\n• Visual search strategy\n• Response time to defender movement\n• Eyes up percentage under pressure\n\nBALL MANIPULATION ASSESSMENT (15 min)\nFilm and evaluate:\n• RT adequate? (holds ball long enough to reposition)\n• RL optimal? (ball back and away at acceleration)\n• DT varied? (or constant hard/fast)\n• Cadence variation present?\n• Height/width modulation?\n• Same-side vs cross-body ratio\n\nSHOOTING ASSESSMENT (15 min)\nFilm and evaluate:\n• Miss profile (direction + distance)\n• Ball flight tendencies (flat/medium/high)\n• Energy patterns under stress\n• Back rim awareness\n• Stress shooting quality (contested, off-dribble, fatigued)\n\nLIMITING FACTOR IDENTIFICATION (10 min)\n• Rank top 3 limiting factors\n• Identify cascade effects\n• Determine Phase 1 focus\n• Write assessment report',
  'This is the comprehensive intake assessment. Film everything. Document everything. This determines the entire training trajectory.',
  NULL,
  NULL
);

-- E-02: Shooting Calibration Assessment (Entry-Level)
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'E-02: Shooting Calibration Assessment',
  'e02-shooting-calibration-assessment',
  'Entry-level shooting assessment — 14-spot back rim test, oversized ball contrast, miss profile analysis.',
  'evaluation', 'assessment', 'ClipboardCheck', 'bg-orange-500/20 text-orange-400 border-orange-500/30', 602,
  'E-02', 'N/A', 'Entry',
  'Shooting Calibration Assessment',
  'Entry assessment — 14-spot back rim, oversized ball contrast, miss profile',
  30,
  ARRAY['assessment', '14-spot', 'back-rim', 'oversized-ball', 'miss-profile'],
  ARRAY['oversize-ball', 'rebounder'],
  ARRAY['court'],
  E'14-SPOT BACK RIM TEST (10 min)\n• Standard back rim miss protocol\n• Track: back rim / make / other per spot\n• Establishes baseline calibration\n\nOVERSIZED BALL CONTRAST (10 min)\n• Same 14 spots with oversized ball\n• Track separately\n• Compare to regular ball\n\nMISS PROFILE ANALYSIS (10 min)\n• Categorize all misses: short / long / left / right / front rim / back rim\n• Identify tendencies\n• Determine calibration starting point',
  'This is the quick shooting assessment. Results determine whether player starts at S-01 or can skip to S-02.',
  'Based on results: 0-3 back rim misses out of 14 → start at S-01. 4-6 → S-01 with faster progression. 7+ → advance to S-02.',
  NULL
);

-- =====================================================
-- RECOVERY / OFF-COURT SESSIONS (R-01, R-02)
-- =====================================================

-- R-01: Beach Movement Session
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'R-01: Beach Movement Session',
  'r01-beach-movement',
  'Off-court recovery session — ankle mobility in sand, dowel work, jump rope, breathing.',
  'recovery', 'recovery', 'Heart', 'bg-green-500/20 text-green-400 border-green-500/30', 701,
  'R-01', '1', 'Any',
  'Beach Movement Session',
  'Off-court recovery — sand work, dowel, jump rope, breathing',
  45,
  ARRAY['recovery', 'beach', 'ankle-mobility', 'dowel', 'jump-rope', 'breathing'],
  ARRAY['resistance-bands'],
  ARRAY['outdoor'],
  E'SEGMENT 1: ANKLE MOBILITY IN SAND (10 min)\n• Barefoot ankle circles, dorsiflexion stretches\n• Sand provides natural instability\n• Cue: "Feel your feet. Full contact with the ground."\n\nSEGMENT 2: DOWEL MOVEMENT EXPLORATION (15 min)\n• Trunk rotation walks\n• Hip hinge patterns\n• Deceleration practice on sand (natural resistance)\n\nSEGMENT 3: JUMP ROPE PROTOCOL (10 min)\n• Movement bandwidth exploration\n• Add hip bands for glute activation\n• Gallop patterns, lateral movement, direction changes\n\nSEGMENT 4: BREATHING / COOL-DOWN (10 min)\n• Diaphragmatic breathing\n• Light stretching\n• Cue: "Recovery is part of the system."',
  'Recovery is training. This session maintains movement quality while allowing physical recovery.',
  NULL,
  NULL
);

-- R-02: S&C Integration + Fatigue Calibration
INSERT INTO session_templates (
  name, slug, description, session_type, category, icon, color, display_order,
  session_code, constraint_level, phase,
  default_title, default_description, default_duration_minutes,
  default_focus_areas, required_equipment, environment,
  default_notes, default_coaching_notes,
  progression_notes, regression_notes
) VALUES (
  'R-02: S&C + Fatigue Calibration',
  'r02-sc-fatigue-calibration',
  'Strength work to failure THEN shooting calibration under fatigue. Tests if the system holds when tired.',
  'training', 'strength', 'Dumbbell', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 702,
  'R-02', '3-4', '3',
  'S&C Integration + Fatigue Calibration',
  'Upper body to failure → shooting calibration → vert test → blocker → AquaVest',
  60,
  ARRAY['strength', 'fatigue-calibration', 'shooting-under-fatigue', 'AquaVest', 'blocker'],
  ARRAY['blockers', 'aqua-vest'],
  ARRAY['weight-room', 'court'],
  E'SEGMENT 1: UPPER BODY STRENGTH TO FAILURE (20 min)\n• Standard upper body work\n• Push to fatigue (this is intentional)\n\nSEGMENT 2: SHOOTING CALIBRATION UNDER FATIGUE (15 min)\n• Immediately to court after weights\n• Back rim protocol or 7-spot flow\n• Cue: "Your body is tired. Can your shot still find the target?"\n\nSEGMENT 3: MAXIMAL VERTICAL OUTPUT TEST (5 min)\n• Max effort jumps\n• Tests reflexive output under fatigue\n\nSEGMENT 4: CONTRACT-RELAX WITH BLOCKER (10 min)\n• Fatigued state + blocker constraint\n• Cue: "React. Don''t think. Your system knows what to do."\n\nSEGMENT 5: AQUAVEST MOVEMENT (10 min)\n• Weighted vest movement patterns\n• Tests if attractor states hold under load\n• Full foot contact, trunk rotation, deceleration',
  'The intentional fatigue is the point. Can the calibrated system hold when the body is depleted? This reveals true automaticity.',
  'When shooting calibration is maintained under fatigue (within 80% of fresh baseline): player has internalized the pattern.',
  'If shooting completely breaks down under fatigue: reduce strength volume, focus on maintaining calibration at lower fatigue levels first.'
);
