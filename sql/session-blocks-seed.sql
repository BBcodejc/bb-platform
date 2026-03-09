-- =====================================================
-- SESSION BLOCKS SEED DATA
-- 37 blocks from the BB Platform Session Library
-- Idempotent: deletes existing blocks first
-- =====================================================

DELETE FROM session_blocks WHERE block_id LIKE 'SH-%' OR block_id LIKE 'MV-%' OR block_id LIKE 'BM-%' OR block_id LIKE 'LP-%' OR block_id LIKE 'EV-%';

-- =====================================================
-- SHOOTING BLOCKS (SH-01 through SH-19)
-- =====================================================

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-01', 'Close Range Warm-Up', 'shooting', 5, '5 min', 1, 1, 1,
 ARRAY['Regulation ball'],
 E'Shoot from 5-8 feet. No constraints. Build rhythm and feel.\n- No counting. No tracking.\n- This is NOT practice. This is calibration warm-up.',
 ARRAY['Feel good. Find your rhythm.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-02', '14-Spot Back Rim Miss Protocol', 'shooting', 20, '15-20 min', 1, 1, 2,
 ARRAY['Regulation ball', 'Tracking sheet'],
 E'The foundational shooting calibration block. Every player starts here.\n\nSetup: 14 spots around the arc (corners, wings, slots, top, mid-range).\n- Change location after EVERY shot. Never two from the same spot.\n- Flat ball flight (25-45 degree arc).\n- Goal: Hit MIDDLE of back rim.\n\nTracking: At each spot, record: Back Rim / Make / Other Miss\n- 7-10 out of 14 back rim misses = excellent session\n- Less than 7 = more awareness work needed\n\nWhat the player learns:\n- Distance awareness that "makes" cannot teach\n- Flat ball flight control\n- Left-right calibration (back rim center, not edges)',
 ARRAY['Shoot it flat. Control distance with exit speed, not loft.', 'Middle of back rim. Not left or right edge.', 'Back rim miss IS success.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-03', '14-Spot Back Rim with Strobes', 'shooting', 20, '15-20 min', 3, 3, 4,
 ARRAY['Regulation ball', 'Strobes', 'Tracking sheet'],
 E'Same protocol as SH-02 but wearing strobes.\n- Start at Level 3.\n- Progress to Level 4-5 over sessions.\n- Track back rim contacts separately from non-strobe sessions.\n- Expect lower numbers initially. That is the point.',
 ARRAY['Trust your system. You don''t need to see the ball the entire way.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-04', '7-Spot Calibration Flow (Oversized Ball)', 'shooting', 12, '10-12 min', 2, 3, 3,
 ARRAY['Oversized ball'],
 E'7 spots around the arc: Corner, Wing, Slot, Top, Slot, Wing, Corner.\n- Oversized ball + flat ball flight\n- Back rim miss OR make = advance to next spot\n- Any other miss = repeat the spot\n- Track: time to complete all 7 spots\n\nThis is the Tobias Harris session structure.',
 ARRAY['Flat. Back rim. Next spot.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-05', '7-Spot +3 Protocol (Oversized Ball)', 'shooting', 15, '10-15 min', 2, 3, 3,
 ARRAY['Oversized ball'],
 E'Same 7 spots. Must make 3 from each spot before advancing.\n- Oversized ball\n- Track: time to complete',
 ARRAY['Earn it. Three makes, move on.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-06', '7-Spot Back Rim to Make Series', 'shooting', 12, '10-12 min', 2, 2, 2,
 ARRAY['Regulation ball'],
 E'At each of the 7 spots, the sequence MUST be:\n1. Intentional back rim miss\n2. Immediate make on the very next rep\n\nYou do not leave the spot until you complete back-rim then make in that exact order. Move through all 7 spots.\n\nThis trains the nervous system to calibrate distance (back rim) and then immediately apply that calibration (make).',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-07', 'Back Rim Ladder Challenge', 'shooting', 10, '10 min', 3, 2, 3,
 ARRAY['Regulation ball'],
 E'From one spot:\n- Miss back rim x1, then make\n- Miss back rim x2 in a row, then make\n- Miss back rim x3 in a row, then make\n- Record time to complete the full ladder\n\nThis builds intentional distance control and mental discipline.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-08', 'Contrast Test Out', 'shooting', 5, '5 min', 2, 1, 1,
 ARRAY['Regulation ball'],
 E'Switch from oversized ball (or strobes, or any constraint) to regular ball. Shoot freely from game spots.\n- No tracking. Just feel the contrast.\n\nNEVER skip the contrast test out. The learning happens in the transition.',
 ARRAY['Feel how big the rim looks now.', 'Feel how light the ball is.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-09', 'Deep Distance Calibration', 'shooting', 25, '20-25 min', 2, 2, 3,
 ARRAY['Regulation ball'],
 E'Progressive distance method (from the Udai blueprint):\n\nDistance 1: Near half court (~40+ feet)\n- Shot menu (each for 2 min): Trail leg step-back, Lateral bounds, Misdirection hops\n- 10 shots per movement pattern\n- Back rim contact or good miss = success\n- You WILL airball. Good. That is your body finding its force production limits.\n\nDistance 2: Step in (~35-37 feet)\n- Same shot menu. Body should feel slightly more organized.\n\nDistance 3: Step in again (~30-32 feet)\n- Same shot menu. Force production more controlled. Rhythm emerging.\n\nDistance 4: College/Game 3-point line (~22-23 feet)\n- Same shot menu + 1 min freestyle\n- This should feel SIGNIFICANTLY easier after deep work.\n\nWhy this works: Extreme joint velocities and hand interaction pressure from deep distance calibrate the system so game-range efficiency improves automatically.',
 ARRAY['Let it go. Do not try to make it. Feel the exit speed.', 'Your hands have to interact with the ball differently from here.', 'Line feels light after deep work.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-10', 'Deep Distance with Strobes', 'shooting', 20, '20 min', 3, 4, 4,
 ARRAY['Regulation ball', 'Strobes'],
 E'Same progressive distance method as SH-09 but wearing strobes.\n- Level 3 for all deep distance shots\n- At game range (Distance 4): run contrast blocks (strobes ON 6 shots, immediately OFF 6 shots, repeat 2-3x)',
 ARRAY['Notice how the rim looks slower and bigger after taking strobes off.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-11', 'Ball Flight Exploration Spectrum', 'shooting', 15, '15 min', 1, 1, 2,
 ARRAY['Regulation ball'],
 E'From game range, explore three distinct ball flights:\n- Flat arc (25-45 degrees): 7 shots. Cue: "Laser. Line drive."\n- Medium arc (45-52 degrees): 7 shots. Cue: "Regular rhythm."\n- High arc (55-70 degrees): 7 shots. Cue: "Get it up. Feel the release timing change."\n\nFinish with free exploration: player chooses arc based on spot and feel. No two shots the same.\n\nWhy: Most players are locked into one ball flight. This expands trajectory bandwidth.',
 ARRAY['Laser. Line drive.', 'Regular rhythm.', 'Get it up. Feel the release timing change.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-12', 'Peripheral Vision Shooting (One Arm / Two Arm)', 'shooting', 10, '10 min', 3, 3, 3,
 ARRAY['Regulation ball', 'Partner/coach'],
 E'Partner stands in player''s peripheral field (to the side).\n- Player central vision on rim. NEVER look at coach.\n- Coach shows 1 arm or 2 arms.\n- 1 arm = shoot 1 shot. 2 arms = shoot 2 shots.\n- 20 total attempts.\n\nProgression: Coach stationary > coach moving > add oversized ball > add back rim focus.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-13', 'Number System Visual Stress', 'shooting', 10, '10 min', 3, 3, 3,
 ARRAY['Regulation ball', 'Partner/coach'],
 E'Partner holds up 1-5 fingers in peripheral field.\n- Player calls number OUT LOUD while shooting.\n- Both must happen simultaneously.\n- 20 attempts.\n- Track: number correct + make/miss.\n\nProgression: Numbers shown before shot > during shot motion > add oversized ball > add strobes.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-14', 'Contract-Relax with Blocker', 'shooting', 10, '10 min', 3, 3, 4,
 ARRAY['Regulation ball', 'Blocker', 'Partner/coach'],
 E'Coach holds blocker, varies position. Player must tap blocker (contract) then immediately shoot (relax).\n- Progression: 0 dribbles > 1 dribble > 3-5 dribbles\n- Add strobes for advanced',
 ARRAY['React to the reach. Do not pre-plan.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-15', 'Elite Combined Stack', 'shooting', 15, '10-15 min', 4, 5, 6,
 ARRAY['Oversized ball', 'Strobes', 'Blocker', 'Partner/coach'],
 E'Everything combined:\n- Strobes Level 5\n- Oversized ball\n- Blocker with defender\n- Peripheral vision task (one arm up)\n- JUST COUNT MAKES\n\nBenchmark: 3-5 makes out of 20 = excellent. 6-8 = elite. 9+ = world class.',
 ARRAY['If games were this hard, you would be unstoppable.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-16', 'Energy Pattern Exploration', 'shooting', 10, '10 min', 2, 1, 2,
 ARRAY['Regulation ball'],
 E'Player explores different energy organizations into the shot:\n- Early release (quick, compact)\n- Jump forward (momentum into shot)\n- Aerial pause (hang time, delayed release)\n- Fade variations (drift backward, sideways)\n\nThis is NOT a drill. It is exploration. Player chooses. Coach observes what emerges.',
 ARRAY['Explore how momentum changes your shot. No right answer. No wrong answer.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-17', 'Catch and Shoot Movement Patterns', 'shooting', 20, '15-20 min', 2, 2, 2,
 ARRAY['Regulation ball', 'Passer'],
 E'Explore energy patterns that occur in live catch-and-shoot situations:\n- Hop in place (two-foot catch)\n- Left-right hop forward\n- Right-left hop forward\n- Left-right hop backward\n- Trail leg angled forward (45 degrees)\n- Trail leg sideways\n- Trail leg 45 degrees backward\n- Under trail leg (backward/sideways)\n- Double hop\n- Lateral bounds into catch\n\nProcess:\n1. Learn patterns without ball (groove the movement)\n2. Add variable passes from partner (different locations, speeds)\n3. Constrain to 2-3 patterns at a time\n4. Open up to player''s choice\n5. Vary distance at each pattern\n6. Add dip variations at each (large dip, compact dip, waist-height catch)',
 ARRAY['You do not need the actual game action to enhance the energy pattern.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-18', 'Stepback and Fade Series (Deep Distance)', 'shooting', 12, '10-12 min', 2, 2, 3,
 ARRAY['Regulation ball'],
 E'From 2-3 steps in front of half court (very deep):\n- Stepbacks going left: 10 reps\n- Stepbacks going right: 10 reps\n- Fades going left: 10 reps\n- Fades going right: 10 reps\n\nGoal: Back rim or make at each rep. Back rim contact = success.\n\nFinish: Move to 3-point line. Alternate stepbacks left and right. Hit 8 makes in as few attempts as possible. Track attempts.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('SH-19', 'Pre-Game Calibration Routine', 'shooting', 20, '15-20 min', 1, 2, 3,
 ARRAY['Oversized ball', 'Regulation ball'],
 E'Segment 1: Oversized ball from 5-7 spots (5 min). Flat. No counting.\nSegment 2: Deep distance dosage, 3-5 shots from well behind line (5 min).\nSegment 3: Movement pattern shots from deep: trail leg, bounding, gallop (5 min).\nSegment 4: Regular ball test out from game spots (5 min).',
 ARRAY['All pre-game prep should resemble what the game presents. Not standing in one spot making shots with all variables absent.']
);

-- =====================================================
-- MOVEMENT BLOCKS (MV-01 through MV-05)
-- =====================================================

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('MV-01', 'Dowel Movement Protocol (Foundation)', 'movement', 12, '10-12 min', 1, 1, 1,
 ARRAY['Dowel'],
 E'No ball. Pure movement exploration.\n\nTrail Leg Series (forward and backward):\n- Forward trail legs: baseline to half court with dowel, 3-4 trips\n- Reverse trail legs: half court back to baseline, 3-4 trips\n- Backward versions: both patterns moving backward, use arms freely, 2-3 trips each\n\nNarrow-to-Wide Pattern:\n- With dowel: baseline to half court, focus on hips and base expanding, 3 trips\n- Then with ball: same pattern dribbling, 3 trips\n\nDelayed Acceleration (Hip External Rotation):\n- With dowel: 3 small taps into external rotation (hip loaded), then accelerate out\n- Baseline to half with "3 taps + go" cadence at each direction change, 3-4 trips\n- Then with ball: same pattern dribbling, 3-4 trips',
 ARRAY['Smooth rhythm. No rushing.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('MV-02', 'Movement Pattern Library (with Ball)', 'movement', 30, '20-30 min', 2, 2, 2,
 ARRAY['Regulation ball'],
 E'Explore each pattern for 3-4 minutes:\n- Narrow-to-wide: start tight, progressively widen while dribbling\n- Gallop (short-short-long): distorts timing for defender\n- Delayed acceleration: pause before exploding\n- Walk steps: slow controlled steps to address cushion\n- Smooth stop-and-go: gait cycle at varying speeds\n- Abrupt stop-and-go: sharp tempo change\n- Trail leg patterns: trail leg to shot, trail leg step-back\n- BCD (back-cross-drive)',
 ARRAY['Feel the pattern. No defender yet. Just groove it.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('MV-03', 'Stop Exploration (Smooth vs Abrupt)', 'movement', 15, '15 min', 1, 1, 2,
 ARRAY['Regulation ball'],
 E'Smooth Stop and Go (7 min):\n- 5 reps going right, 5 reps going left\n- Rest 1 min, repeat 3 total sets\n- Focus: control center of mass, feel deceleration flow\n\nAbrupt Stop (8 min):\n- 5 reps going right, 5 reps going left\n- Rest 1 min, repeat 4 total sets\n- Focus: slam on the brakes. Sharp. No extra gather steps.',
 ARRAY['Feel the difference. Smooth = flowing into a stop. Abrupt = slamming on the brakes.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('MV-04', 'Movement Pattern Shooting', 'movement', 10, '10 min', 2, 2, 2,
 ARRAY['Regulation ball'],
 E'From 3 spots around the arc (wing, top, wing), execute:\n- Smooth stop into shot: 3-5 makes each spot\n- Abrupt stop into shot: 3-5 makes each spot\n- Abrupt LATERAL stop into shot: 3-5 makes each spot\n- Walk-step cadence into shot: 3-5 makes each spot\n\nLet failure occur. The goal is pattern access under shooting conditions, not make percentage.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('MV-05', 'Pivoting Complex Exploration', 'movement', 20, '15-20 min', 2, 1, 2,
 ARRAY['Regulation ball'],
 E'Front Pivot (5-7 min):\n- Out of catch: various angles and speeds\n- Out of dribble: pick up into front pivot\n- Add deception: eyes one way, pivot another. Shoulder fake. Ball fake.\n\nReverse Pivot (5-7 min):\n- Same progressions as front pivot\n- Add shot off reverse pivot\n\nCombination Pivots (5-7 min):\n- Front to reverse, reverse to front\n- Triple: fake, pivot, counter-pivot, attack',
 ARRAY['How many options can you create from one pivot?']
);

-- =====================================================
-- BALL MANIPULATION BLOCKS (BM-01 through BM-04)
-- =====================================================

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('BM-01', 'RT/RL/DT Exploration (Stationary)', 'ball_manipulation', 20, '15-20 min', 1, 1, 2,
 ARRAY['Regulation ball'],
 E'RT (Reception Time) Focus:\n- Same-side dribbles at 5 heights: above shoulder, chest, waist, low, pull-up\n- At 3 force levels: hard, moderate, soft\n- With 4 manipulation types: in-and-out, V-dribble, half-spin, wrap\n\nRL (Reception Location) Focus:\n- Width work: dribble further from body (straight arm, bent arm)\n- Angle work: front-to-back V, side-to-side\n- Closeness: walk toward wall maintaining optimal RL\n\nDT (Dribble Time) Focus:\n- Vary force, feel time ball is airborne\n- Soft dribbles to distort time and mask intentions\n- Hard dribbles to feel cadence',
 ARRAY['Feel the ball in your hand longer with height and width.', 'Ball back and away. How close can you get while keeping it?', 'Most players dribble one speed. You need five.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('BM-02', 'Ball Manipulation Primer (Quick)', 'ball_manipulation', 5, '5 min', 2, 1, 1,
 ARRAY['Regulation ball'],
 E'Quick activation before shooting or live work:\n- Float dribbles (high RT)\n- RL away from body\n- Walk-step + body fake cadence changes\n- Numbers callout if partner available',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('BM-03', 'Balloon Protocol', 'ball_manipulation', 20, '15-20 min', 2, 2, 2,
 ARRAY['Regulation ball', 'Balloon'],
 E'Stationary Balloon Control (1-2 min warm-up):\n- Dribble with one hand, keep balloon in air with other\n- Eyes on balloon, NOT on ball\n- Cadence changes, small body fakes\n\nWalking Balloon (6-8 min):\n- Baseline to half court and back\n- Keep balloon alive while dribbling\n- Add: abrupt stops, walk steps, body fakes\n- Change reception time and reception location of the ball\n\nChaos Layer (6-8 min):\n- Same path but mix: hesitations, in-and-outs, small shifts\n- Balloon tapped high (longer time) and short/low (faster reaction)\n- Add strobes Level 3 when ready\n\nOptional: Balloon + Blocker (5 min):\n- Partner holds blocker AND reaches for ball\n- Player must: control balloon, maintain RL, see blocker peripherally\n\nWhy balloon works: It is the same contract-relax mechanism as shooting. The variation in force (hard dribble, soft balloon tap) trains sensory information flow and self-organization.',
 ARRAY['Cadence variation and perception over perfect handle.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('BM-04', 'Balloon with Strobes', 'ball_manipulation', 10, '8-10 min', 3, 3, 4,
 ARRAY['Regulation ball', 'Balloon', 'Strobes'],
 E'Same balloon protocol but wearing strobes.\n- Start Level 3\n- Baseline to half court and back\n- Mix all movement patterns, stops, fakes',
 ARRAY['Let the nervous system solve the problem.']
);

-- =====================================================
-- LIVE PLAY BLOCKS (LP-01 through LP-07)
-- =====================================================

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-01', 'Movement Pattern to Shot (On Air, No Defender)', 'live_play', 8, '6-8 min', 2, 2, 2,
 ARRAY['Regulation ball'],
 E'From 3 spots around the arc:\n- Smooth stop and go into shot: 3-4 reps per spot\n- Abrupt stop into shot: 3-4 reps per spot\n- Abrupt lateral stop into shot: 3-4 reps per spot\n\nAim for 3-5 makes utilizing each pattern. Let failure occur.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-02', 'Live vs Blockers', 'live_play', 15, '12-15 min', 3, 3, 4,
 ARRAY['Regulation ball', 'Blocker', 'Defender'],
 E'Same 3 spots. Defender with blockers (pads/arms limiting space).\n\nRound 1: Smooth stops vs blockers (3-4 reps per spot)\nRound 2: Body fake / BCD actions (3-4 reps per spot). Must show convincing fake before shot. Defender sometimes bites so player feels timing.\nRound 3: Abrupt lateral stops (3-4 reps per spot)\nRound 4: Gallop start series (3-4 reps per spot). Every rep must start with gallop.\nRound 5: Gallop into BCD (3-4 reps per spot). Gallop, BCD, read defender, shot or counter. Defender coached to sometimes jump on BCD so player experiences successful deception.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-03', 'Live vs Blockers with Strobes', 'live_play', 15, '10-15 min', 4, 4, 5,
 ARRAY['Regulation ball', 'Blocker', 'Strobes'],
 E'Same structure as LP-02 but wearing strobes.\n- Run through all patterns with strobes ON first\n- Then repeat WITHOUT blockers (feel the contrast)',
 ARRAY['Survive and organize.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-04', 'Live 1v1 Progression (No Blocker to Full Stack)', 'live_play', 20, '20 min', 3, 3, 6,
 ARRAY['Regulation ball', 'Blocker', 'Strobes'],
 E'Phase 1 (5 min): No blockers. Get to movement pattern freely. Smooth stop x3, abrupt stop x3, walk-step shot x3.\n\nPhase 2 (5 min): Blockers on. Same patterns under space removal.\n\nPhase 3 (10 min): Blockers + Strobes. Level 1 (3 min), Level 2 (3 min), Level 3 (4 min). From variable locations.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-05', 'Contrast Finish', 'live_play', 5, '5 min', 3, 1, 1,
 ARRAY['Regulation ball'],
 E'Remove ALL constraints. Play live normal reps.\n- Feel the speed and ease.',
 ARRAY['This is what games feel like after what you just did.']
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-06', 'Live 1v1 with Strobes (Scoring Situations)', 'live_play', 8, '8 min', 3, 3, 4,
 ARRAY['Regulation ball', 'Strobes'],
 E'Strobes on. Defender plays live, smart (no fouling, real effort).\n- Scoring situations from 3 (wing/slot/top)\n- Create space and time vs pressure\n- No scripted combos. Solve the problem.\n- 4-5 possessions each side (left/right) with strobes\n- Film at least 1 block per week (side angle)',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('LP-07', 'Live Stop Constraint Game', 'live_play', 8, '8 min', 2, 2, 3,
 ARRAY['Regulation ball', 'Defender'],
 E'Start above 3-point line, go live vs defender.\n- Rep 1: Must get to an ABRUPT STOP before scoring\n- Rep 2: Must get to a SMOOTH/FLOWING STOP before scoring\n- Alternate: abrupt, smooth, abrupt, smooth\n- Play to 6 points (1 point per score, must obey stop rule)\n\nThis ties stop exploration directly into game chaos.',
 ARRAY[]::TEXT[]
);

-- =====================================================
-- EVALUATION BLOCKS (EV-01 through EV-03)
-- =====================================================

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('EV-01', '14-Spot Baseline Test', 'evaluation', 5, '5 min', 1, 1, 1,
 ARRAY['Regulation ball'],
 E'14 spots: Corner, Wing, Slot, Top, Slot, Wing, Corner + same mid-range.\n- 1 shot per spot = 14 total shots\n- Scoring: Make OR back-rim miss = check. Everything else = X.\n- Record score. This is the benchmark.\n\nRun at START and END of every system day to measure progress.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('EV-02', '7-Spot Quick Test', 'evaluation', 3, '3 min', 1, 1, 1,
 ARRAY['Regulation ball'],
 E'7 main arc spots. 1 shot each. Record makes. Quick progress check.',
 ARRAY[]::TEXT[]
);

INSERT INTO session_blocks (block_id, name, category, duration_minutes, duration_display, min_phase, constraint_level_min, constraint_level_max, equipment, description, external_cues) VALUES
('EV-03', 'Miss Profile Analysis', 'evaluation', 5, '5 min', 1, NULL, NULL,
 ARRAY['Tracking sheet'],
 E'Review all misses from the session:\n- Categorize: short / long / left / right / front rim / back rim\n- Identify tendencies\n- If miss profile goes directional (left/right): return to flat ball flights and back rim focus',
 ARRAY['Stop missing left and right. It means you are not focused enough on the target.']
);
