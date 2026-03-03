-- ============================================
-- SEED DATA: CONCEPT CATEGORIES & INITIAL CONCEPTS
-- ============================================

-- Categories
INSERT INTO concept_categories (name, slug, description, display_order, icon, color) VALUES
('Ball Manipulation', 'ball-manipulation', 'The three variables that make a deceptive ball handler: ball height, ball width, and cadence change.', 1, 'hand', '#d4af37'),
('Deception', 'deception', 'Postural changes, visual deception, and using the ball as a deceptive tool.', 2, 'eye', '#8b5cf6'),
('Movement Patterns', 'movement-patterns', 'Core movement vocabulary: stops, accelerations, fakes, and counters.', 3, 'footprints', '#3b82f6'),
('Movement Progressions', 'movement-progressions', 'How to layer complexity: base pattern → with ball → up the hill → overhead → on shoulder.', 4, 'trending-up', '#10b981'),
('Hip Mobility', 'hip-mobility', 'Cable block hip protocol and progressions to unlock athletic movement.', 5, 'activity', '#f59e0b'),
('Strength & Explosiveness', 'strength-explosiveness', 'Machine-based strength (pull/push/row), court explosiveness, low-rim dunking.', 6, 'zap', '#ef4444'),
('Shooting Calibration', 'shooting-calibration', 'Deep distance calibration, 14-spot testing, back-rim standards, ball flight spectrum.', 7, 'target', '#d4af37'),
('Live Play Formats', 'live-play-formats', 'Solo, partner, defender proximity, limited dribbles, pivot scoring, movement grading.', 8, 'users', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- BALL MANIPULATION CONCEPTS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Ball Height', 'ball-height',
  'The vertical plane at which you carry the ball during dribble moves. Varying ball height creates unpredictability — low dribbles protect the ball, high dribbles set up crossovers and hesitations. The defender reads your ball height to anticipate your next move.',
  'Vary the vertical plane of your dribble to create unpredictability.',
  ARRAY['Keep the ball below your knee on protection dribbles', 'Bring the ball to hip height before attacking', 'Use high-to-low changes to freeze defenders'],
  'Start with stationary ball height changes. Progress to walking, then jogging, then full speed. Add a defender once comfortable.',
  'beginner', true, 1, ARRAY['ball-handling', 'deception', 'fundamentals']
FROM concept_categories c WHERE c.slug = 'ball-manipulation'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Ball Width', 'ball-width',
  'The horizontal plane of your dribble — how far left or right the ball travels relative to your body. Wide dribbles create space and angles, narrow dribbles protect and set up counters. The width of your dribble dictates what passing lanes and driving lanes open up.',
  'Control the horizontal plane of your dribble for space creation.',
  ARRAY['Push the ball wide to create an angle', 'Keep it tight when a defender is reaching', 'Use narrow-to-wide transitions to shift the defense'],
  'Practice narrow and wide dribbles stationary. Add cone obstacles. Progress to live 1v1 with width emphasis.',
  'beginner', true, 2, ARRAY['ball-handling', 'deception', 'fundamentals']
FROM concept_categories c WHERE c.slug = 'ball-manipulation'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Cadence Change', 'cadence-change',
  'The rhythm and speed at which you dribble. Changing your dribble cadence — fast to slow, slow to fast — disrupts the defender''s timing. This is the most underrated ball-handling variable. The best ball handlers in the world play with tempo, not just speed.',
  'Disrupt defensive timing by changing your dribble rhythm.',
  ARRAY['Start slow, then explode', 'Use a pause before your move', 'Mix fast-fast-slow patterns to keep defenders guessing'],
  'Start with metronome drills: 4 slow dribbles then 4 fast. Progress to random cadence changes. Add a live defender.',
  'intermediate', true, 3, ARRAY['ball-handling', 'deception', 'rhythm']
FROM concept_categories c WHERE c.slug = 'ball-manipulation'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- DECEPTION CONCEPTS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Head Height Change', 'head-height-change',
  'Lowering or raising your head and shoulders to sell a change of direction or speed. When you drop your head height, the defender reads ''drive.'' When you rise up, they read ''shot.'' Manipulating this creates space without needing elite speed.',
  'Use head/shoulder level changes to sell drives and shots.',
  ARRAY['Drop your head level before attacking downhill', 'Rise up quickly to sell the pull-up', 'Keep eyes on the rim during the rise — it sells the shot'],
  'Start with stationary head fakes. Progress to dribble head fakes, then chain into drives or shots off the fake.',
  'intermediate', true, 1, ARRAY['deception', 'scoring', 'body-control']
FROM concept_categories c WHERE c.slug = 'deception'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Postural Changes', 'postural-changes',
  'Shifting your body posture — leaning, tilting, squaring up — to communicate false intent to the defender. Your posture tells the defense where you''re going before you go there. By changing posture independently of your actual move, you create misdirection.',
  'Shift body posture to communicate false intent.',
  ARRAY['Lean one way before going the other', 'Square your shoulders to the basket before driving', 'Tilt your torso to sell the direction change'],
  'Practice in front of a mirror first. Progress to 1v1 with a focus on posture before the move, not during.',
  'intermediate', true, 2, ARRAY['deception', 'body-control']
FROM concept_categories c WHERE c.slug = 'deception'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Visual Deception', 'visual-deception',
  'Using your eyes, head turn, and gaze direction to manipulate where the defender looks. Defenders follow your eyes. Looking one way while passing or driving the other is the foundation of court vision and scoring deception.',
  'Manipulate defender attention with your eyes and gaze.',
  ARRAY['Look at the basket before a pass', 'Eye the weak side before attacking strong side', 'Use a head snap to sell a change of direction'],
  'Start with 2v1 drills focusing on eye manipulation. Progress to 3v3 half court with visual deception emphasis.',
  'advanced', true, 3, ARRAY['deception', 'vision', 'passing']
FROM concept_categories c WHERE c.slug = 'deception'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Ball as Deceptive Tool', 'ball-as-deceptive-tool',
  'Using the basketball itself as a weapon of misdirection — ball fakes, extended ball placement, showing the ball high or low to draw a reach or freeze a defender. The ball is the #1 thing defenders track. Moving it independent of your body creates openings.',
  'Use ball position and fakes to freeze or draw defenders.',
  ARRAY['Show the ball high to freeze shot blockers', 'Extend the ball to draw a reach, then counter', 'Use ball fakes from the triple threat to read the defense'],
  'Practice triple threat ball fakes stationary. Progress to live pivots with ball fakes, then off the dribble.',
  'intermediate', true, 4, ARRAY['deception', 'ball-handling', 'scoring']
FROM concept_categories c WHERE c.slug = 'deception'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- MOVEMENT PATTERNS CONCEPTS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Delayed Acceleration', 'delayed-acceleration',
  'Intentionally starting slow before exploding into full speed. The delay forces the defender to relax their stance, then the burst catches them flat-footed. This is how elite scorers create separation without needing a crossover.',
  'Start slow, then explode — the pause creates separation.',
  ARRAY['Walk into your move before bursting', 'Let the defender settle, then attack', 'The delay is the move — trust the timing'],
  'Practice walking into a full sprint. Add a ball. Add a live defender. Progress to using delayed acceleration out of specific actions (catch, pivot, screen).',
  'intermediate', true, 1, ARRAY['movement', 'scoring', 'speed']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Abrupt Stops', 'abrupt-stops',
  'Coming to a sudden, complete stop from full speed. The defender''s momentum carries them past you, creating an open shot or driving lane. Abrupt stops require strong deceleration mechanics — trail leg loading, low center of gravity.',
  'Stop on a dime to leave the defender sliding past.',
  ARRAY['Plant your trail leg hard to absorb momentum', 'Stay low through the stop', 'Eyes up immediately — read what the stop created'],
  'Start with sprint-to-stop drills without a ball. Add a dribble. Add a pull-up shot. Progress to live 1v1 where abrupt stops are the focus every possession.',
  'intermediate', true, 2, ARRAY['movement', 'stops', 'deceleration']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Smooth Stop-and-Goes', 'smooth-stop-and-goes',
  'A fluid deceleration and re-acceleration that maintains rhythm. Unlike abrupt stops, smooth stop-and-goes keep the ball handler in flow while changing pace enough to shift the defender. Think of it as a gear change, not a brake.',
  'Fluid pace changes that keep you in rhythm while shifting the defense.',
  ARRAY['Decelerate into a glide, then re-accelerate', 'Keep your dribble alive through the transition', 'The smoothness sells the deception — no jerky movements'],
  'Practice jog-walk-jog transitions. Add a ball. Chain into scoring moves. Progress to live play.',
  'intermediate', true, 3, ARRAY['movement', 'pace', 'rhythm']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Walk Steps', 'walk-steps',
  'Taking deliberate, slow walking steps while in a live dribble or offensive position. Walking lulls the defender into a passive stance. The walk step is the setup for every explosive move — delayed acceleration, abrupt stop, or change of direction.',
  'Walk before you run — the slow setup makes the fast move deadly.',
  ARRAY['Take 2-3 walking steps before any explosive action', 'Keep your dribble low and relaxed during the walk', 'Read the defender''s feet during your walk steps'],
  'Practice walking into pull-up jumpers. Walk into drives. Walk into passes. The walk is the universal setup.',
  'beginner', true, 4, ARRAY['movement', 'pace', 'setup']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Body Fake Variations', 'body-fake-variations',
  'Using your entire body — shoulders, hips, head, feet — to sell a direction before going the opposite way. Body fakes are the most effective deception tool because defenders read the whole body, not just the ball. A committed body fake freezes even elite defenders.',
  'Sell a direction with your whole body before countering.',
  ARRAY['Commit your shoulders and hips to the fake direction', 'Take a jab step with conviction', 'The fake should look exactly like the real move'],
  'Start with stationary jab series. Add live closeouts. Progress to off-the-dribble body fakes. Chain fakes into scoring.',
  'intermediate', true, 5, ARRAY['movement', 'deception', 'fakes']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Delayed Body Fake Variations', 'delayed-body-fake-variations',
  'Adding a pause or timing delay between the body fake and the counter move. The delay gives the defender time to commit to the fake, making the counter even more effective. This is the advanced version of body fakes — the timing is the weapon.',
  'Pause after the fake to let the defender commit, then counter.',
  ARRAY['Fake, pause, then attack — the pause is the move', 'Read the defender during the delay', 'If they don''t bite, fake again or reset'],
  'Master standard body fakes first. Then add a 1-count pause. Progress to reading the defender''s reaction during the pause.',
  'advanced', true, 6, ARRAY['movement', 'deception', 'timing']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Counters (Abrupt)', 'counters-abrupt',
  'Counter moves executed immediately after an abrupt stop. When you stop hard and the defender recovers, you need a quick counter — a stepback, a crossover, a spin, or a drive in the opposite direction. Abrupt counters are fast and decisive.',
  'Quick counter moves after an abrupt stop when the defender recovers.',
  ARRAY['Stop hard, read the defense, counter immediately', 'Have 2-3 counter options ready before you stop', 'The counter should be as explosive as the initial stop'],
  'Practice stop → stepback. Stop → crossover drive. Stop → spin. Chain 2 counters together. Add live defense.',
  'advanced', true, 7, ARRAY['movement', 'counters', 'scoring']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Counters (Smooth Stop-and-Go)', 'counters-smooth',
  'Counter moves that flow out of a smooth pace change. Unlike abrupt counters, these are fluid — you glide into a change and use the defender''s adjusted pace against them. Think James Harden''s euro-step pace changes.',
  'Flowing counter moves off smooth pace changes.',
  ARRAY['Glide into the counter — no wasted motion', 'Use the defender''s adjusted pace against them', 'The counter should feel like one continuous move'],
  'Practice smooth decel → re-acceleration in the opposite direction. Add scoring finishes. Progress to live play.',
  'advanced', true, 8, ARRAY['movement', 'counters', 'flow']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Narrow Stance', 'narrow-stance',
  'An offensive stance with feet closer together than shoulder width. Narrow stances allow for quicker first steps and faster direction changes. They signal to the defense that you''re in ''scoring mode'' and can attack in any direction.',
  'Tight foot spacing for quick first steps and multidirectional threat.',
  ARRAY['Bring feet inside shoulder width', 'Stay on the balls of your feet', 'Use narrow stance as a scoring trigger — when you go narrow, attack'],
  'Practice triple threat from narrow stance. Add jab steps. Progress to narrow-stance drives and pull-ups.',
  'beginner', true, 9, ARRAY['movement', 'stance', 'fundamentals']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Wide Stance', 'wide-stance',
  'An offensive stance wider than shoulder width. Wide stances create a strong base for absorbing contact, powering through traffic, and creating leverage on post moves. Used when strength and stability matter more than quickness.',
  'Wide foot spacing for power, stability, and contact absorption.',
  ARRAY['Feet outside shoulder width, knees bent', 'Use wide stance in traffic and post-ups', 'Transition from wide to narrow to change attack mode'],
  'Practice wide-stance finishes through contact. Add wide-stance pivots. Progress to wide-to-narrow transitions.',
  'beginner', true, 10, ARRAY['movement', 'stance', 'power']
FROM concept_categories c WHERE c.slug = 'movement-patterns'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- MOVEMENT PROGRESSIONS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Base Pattern (No Ball)', 'base-pattern-no-ball',
  'Learning the movement pattern without a basketball. This is the foundation — get the footwork, timing, and body mechanics right before adding complexity. Every movement pattern starts here.',
  'Master the footwork and mechanics before adding a ball.',
  ARRAY['Focus on foot placement and timing', 'Use a mirror or film yourself', 'Repeat until the pattern feels automatic'],
  'Spend 2-3 sessions on the base pattern before adding any ball. If the feet aren''t right, nothing else matters.',
  'beginner', true, 1, ARRAY['progression', 'fundamentals']
FROM concept_categories c WHERE c.slug = 'movement-progressions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'With Ball (Flat Ground)', 'with-ball-flat',
  'Adding a live dribble to the base movement pattern on flat ground. The ball adds a coordination challenge — can you maintain the movement quality while handling the ball? Most players rush this step.',
  'Add a live dribble to the base pattern on flat ground.',
  ARRAY['Maintain the same foot timing as without the ball', 'Don''t let the dribble dictate your movement', 'If the pattern breaks down, go back to no-ball'],
  'Only progress once you can do 10 clean reps in a row with the ball without losing the movement pattern.',
  'beginner', true, 2, ARRAY['progression', 'ball-handling']
FROM concept_categories c WHERE c.slug = 'movement-progressions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Up the Hill', 'up-the-hill',
  'Performing the movement pattern on an incline. The hill adds resistance and forces you to recruit more muscles, building explosive strength within the specific movement pattern. This is sport-specific conditioning.',
  'Add incline resistance to build explosive strength within the pattern.',
  ARRAY['Find a gradual incline — not too steep', 'Maintain the same mechanics, just add effort', 'The hill exposes weaknesses in your pattern'],
  'Start with the base pattern (no ball) on the hill. Once clean, add the ball. Progress to explosive reps.',
  'intermediate', true, 3, ARRAY['progression', 'strength', 'conditioning']
FROM concept_categories c WHERE c.slug = 'movement-progressions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Up the Hill — Ball Overhead', 'up-the-hill-overhead',
  'Performing the movement pattern on a hill while holding the ball overhead. This loads the upper body and core while challenging the lower body movement. It builds full-body coordination and strength in the pattern.',
  'Hill work with ball overhead for full-body coordination and load.',
  ARRAY['Lock the ball overhead — arms extended', 'Core tight, don''t let the ball drift forward', 'Maintain the same lower body pattern'],
  'Start with walking the hill with ball overhead. Progress to the full movement pattern. This is a strength-building progression.',
  'advanced', true, 4, ARRAY['progression', 'strength', 'overhead']
FROM concept_categories c WHERE c.slug = 'movement-progressions'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Up the Hill — On the Shoulder', 'up-the-hill-shoulder',
  'Performing the movement pattern on a hill while carrying the ball on one shoulder. This creates an asymmetric load, challenging rotational stability and core strength. It mimics the single-side loading demands of basketball.',
  'Hill work with ball on the shoulder for rotational stability.',
  ARRAY['Press the ball into your shoulder — don''t let it float', 'Resist rotation through your core', 'Alternate sides each set'],
  'This is the most advanced progression. Only attempt after mastering the overhead version. Focus on anti-rotation.',
  'elite', true, 5, ARRAY['progression', 'strength', 'stability']
FROM concept_categories c WHERE c.slug = 'movement-progressions'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- HIP MOBILITY CONCEPTS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Cable Block Hip Protocol', 'cable-block-hip-protocol',
  'A structured hip mobility routine using cable machines to unlock hip range of motion. Tight hips limit deceleration, lateral movement, and explosion. This protocol targets internal/external rotation, flexion, and extension through loaded stretching.',
  'Cable-based hip mobility routine for athletic movement.',
  ARRAY['Start light — the stretch, not the weight, does the work', 'Hold each position for 20-30 seconds under tension', 'Breathe through the stretch — don''t fight it'],
  'Perform 3x/week as part of warmup or off-day routine. Progress by adding small increments of cable weight over weeks.',
  'beginner', true, 1, ARRAY['mobility', 'hips', 'warmup']
FROM concept_categories c WHERE c.slug = 'hip-mobility'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Hip Progressions', 'hip-progressions',
  'A series of increasingly challenging hip mobility and activation exercises that build on the cable block protocol. Includes 90/90 switches, hip CARs (Controlled Articular Rotations), and loaded hip openers that translate directly to court movement.',
  'Progressive hip exercises that translate to court movement.',
  ARRAY['Start every session with basic hip CARs', 'Progress from unloaded to loaded positions', 'Test your hip mobility on court after each session'],
  'Phase 1: CARs and 90/90 (Weeks 1-2). Phase 2: Loaded openers (Weeks 3-4). Phase 3: Dynamic hip work (Weeks 5+).',
  'intermediate', true, 2, ARRAY['mobility', 'hips', 'progression']
FROM concept_categories c WHERE c.slug = 'hip-mobility'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- STRENGTH & EXPLOSIVENESS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Pull-Push-Row Template', 'pull-push-row-template',
  'A simple, effective strength template: one horizontal pull, one horizontal push, one row, and one additional exercise. Take each to failure. That''s it. You don''t need a complicated program — you need consistency and effort on the basics. 3x/week.',
  'Simple strength: 1 pull, 1 push, 1 row + 1 extra, each to failure. 3x/week.',
  ARRAY['Pick machines — they''re safer to take to true failure', 'Rest 2-3 minutes between sets', 'Track your weights — progressive overload is the goal'],
  'Start with machines. Once you can complete 3x/week consistently for 4 weeks, consider adding a 5th exercise.',
  'beginner', true, 1, ARRAY['strength', 'weight-room', 'programming']
FROM concept_categories c WHERE c.slug = 'strength-explosiveness'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Low-Rim Dunking', 'low-rim-dunking',
  'Practicing dunking on lowered rims (8-9 feet) to develop explosiveness, timing, and finishing confidence. This isn''t about showing off — it''s about training your body to explode vertically with a ball in your hand while reading the rim.',
  'Dunk on lower rims to build explosion and finishing confidence.',
  ARRAY['Start at a height where you can dunk easily', 'Focus on approach angles and gather steps', 'Progress by raising the rim 3-6 inches at a time'],
  'Start at 8 feet. Once you can dunk 10 in a row easily, raise 6 inches. Repeat until you''re at regulation or your max height.',
  'beginner', true, 2, ARRAY['explosiveness', 'finishing', 'vertical']
FROM concept_categories c WHERE c.slug = 'strength-explosiveness'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- SHOOTING CALIBRATION
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Deep Distance Calibration', 'deep-distance-calibration',
  'Finding and training from your deep distance line — the furthest spot where you can consistently reach the back rim. This calibrates your energy transfer system. When you train from deep, everything closer feels easy. 3-4x per week.',
  'Train from your deepest consistent range to calibrate everything closer.',
  ARRAY['Find where you can barely reach back rim — that''s your line', 'Hit 10 reps from deep, then step in 2 steps and hit 10 more', 'Back rim from deep = success. Short from deep = adjust'],
  'Week 1: Find your line. Weeks 2-3: Build consistency. Week 4+: Start adding off-dribble from deep.',
  'beginner', true, 1, ARRAY['shooting', 'calibration', 'range']
FROM concept_categories c WHERE c.slug = 'shooting-calibration'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, '14-Spot Test', 'fourteen-spot-test',
  'The BB standard shooting test: 14 spots around the arc, 1 shot per spot, 3 rounds. This measures your consistency and reveals your miss profile (where you miss and how you miss). It''s not about making every shot — it''s about gathering data.',
  '14 spots, 3 rounds — reveals your consistency and miss patterns.',
  ARRAY['Same routine every time — consistency matters', 'Note your miss direction at each spot', 'Don''t change anything between rounds — just shoot'],
  'Test weekly. Track scores over time. Use the miss profile data to guide your calibration work.',
  'beginner', true, 2, ARRAY['shooting', 'testing', 'data']
FROM concept_categories c WHERE c.slug = 'shooting-calibration'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Back-Rim Standards', 'back-rim-standards',
  'Back rim is a GOOD miss in the BB system. It means you have enough energy to reach the rim. The back-rim challenge tests your ability to intentionally hit back rim and then convert the next shot. This trains target control and energy management.',
  'Back rim = good miss. Train intentional back-rim control.',
  ARRAY['Intentional back-rim hits train your energy system', 'After a back-rim hit, the next make should feel easy', 'Track your back-rim streak — how many in a row?'],
  'Level 1: 1 back rim + 1 make. Level 2: 2 back rims + 1 make. Level 3: 3 back rims + 1 make. Track time and attempts.',
  'intermediate', true, 3, ARRAY['shooting', 'back-rim', 'control']
FROM concept_categories c WHERE c.slug = 'shooting-calibration'
ON CONFLICT (slug) DO NOTHING;

-- ============================
-- LIVE PLAY FORMATS
-- ============================

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Defender All Up (Pressure)', 'defender-all-up',
  'Live 1v1 where the defender plays tight, aggressive, up-the-line defense. This forces the offensive player to use deception, changes of pace, and body control to create space against heavy pressure. The hardest format.',
  '1v1 against tight pressure — forces deception and pace changes.',
  ARRAY['Stay calm under pressure — don''t rush your reads', 'Use the defender''s aggression against them', 'Delayed acceleration is your best friend here'],
  'Start with 3-possession sets. Film from the side. Review what worked and what didn''t.',
  'intermediate', true, 1, ARRAY['live-play', 'pressure', '1v1']
FROM concept_categories c WHERE c.slug = 'live-play-formats'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Defender with Blockers', 'defender-with-blockers',
  'Live 1v1 where the defender uses shot blockers or padding to increase difficulty. This simulates playing against length and contests. It forces the offensive player to create more separation and use fades, step-backs, and deception.',
  '1v1 against length/blockers — forces extra separation and creativity.',
  ARRAY['Create more space than usual before shooting', 'Use fades and step-backs to clear the blocker', 'Ball fakes become essential to move the blocker'],
  'Start with stationary blockers. Progress to active hand contests. Then full live play with equipment.',
  'advanced', true, 2, ARRAY['live-play', 'difficulty', '1v1']
FROM concept_categories c WHERE c.slug = 'live-play-formats'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Limited Dribbles', 'limited-dribbles',
  'Live play where the offensive player only gets 2-3 dribbles to score. This forces efficiency, decisiveness, and reading the defense quickly. No wasted dribbles. Every dribble must create an advantage.',
  'Score in 2-3 dribbles — forces decisive, efficient play.',
  ARRAY['Read the defense BEFORE you catch the ball', 'Every dribble must gain an advantage', 'If you can score in 1 dribble, do it'],
  'Start with 3 dribbles. Progress to 2. Then 1. Film and review decision-making quality.',
  'intermediate', true, 3, ARRAY['live-play', 'efficiency', 'decision-making']
FROM concept_categories c WHERE c.slug = 'live-play-formats'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Pivot Scoring', 'pivot-scoring',
  'Live play focused on scoring from the pivot position — no dribble used. Catch the ball, pivot, read the defense, and score using fakes, footwork, and shot creation from a stationary base. This is a lost art that elite scorers master.',
  'Score from the pivot using fakes, footwork, and reads.',
  ARRAY['Catch in a strong triple threat position', 'Use ball fakes to move the defender', 'Read their feet — if they bite, attack the opening'],
  'Start with catch-and-score drills (no live defense). Add a closeout defender. Progress to full live pivot play.',
  'intermediate', true, 4, ARRAY['live-play', 'pivot', 'footwork']
FROM concept_categories c WHERE c.slug = 'live-play-formats'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Ball Fake from Pivot', 'ball-fake-from-pivot',
  'Using ball fakes from the triple threat/pivot position to create scoring opportunities. The ball fake is the primary tool for manipulating the defense from a pivot. Show shot to draw a jump, show drive to draw a lean, then counter.',
  'Use ball fakes from triple threat to manipulate and score.',
  ARRAY['Show the ball high — does the defender jump?', 'Sweep the ball low — does the defender reach?', 'Read the reaction, then attack the opening'],
  'Film yourself doing 10 ball fakes and review. Are they convincing? Progress to live closeout situations.',
  'intermediate', true, 5, ARRAY['live-play', 'pivot', 'deception']
FROM concept_categories c WHERE c.slug = 'live-play-formats'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO concepts (category_id, name, slug, definition, short_description, execution_cues, progression_notes, difficulty_level, is_published, display_order, tags)
SELECT c.id, 'Movement Pattern Grading', 'movement-pattern-grading',
  'A live play format where specific movement patterns (delayed acceleration, abrupt stops, etc.) are the focus of each possession. Players are graded on execution quality, not just scoring. This is how we progress and measure movement mastery.',
  'Live play focused on grading specific movement pattern execution.',
  ARRAY['Pick ONE movement pattern per set of possessions', 'Grade each possession: Did you execute the pattern?', 'Scoring is secondary — execution quality is the metric'],
  'Start with 5-possession sets focused on one pattern. Film all possessions. Review and grade 1-5 on execution.',
  'advanced', true, 6, ARRAY['live-play', 'grading', 'assessment']
FROM concept_categories c WHERE c.slug = 'live-play-formats'
ON CONFLICT (slug) DO NOTHING;
