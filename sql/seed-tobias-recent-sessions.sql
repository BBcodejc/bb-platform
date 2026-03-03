-- =====================================================
-- TOBIAS HARRIS - RECENT TRAINING SESSIONS
-- February 15-16, 2026
-- =====================================================

-- Session 1: February 15, 2026 @ SDA
INSERT INTO elite_training_sessions (player_id, date, session_type, title, description, duration_minutes, location, focus_areas, notes, created_by)
SELECT
  id,
  '2026-02-15',
  'training',
  'Back Rim Mastery + Cognitive Layering',
  'Focus: Back rim mastery, deep distance impulse, cognitive stress, live application',
  NULL,
  'SDA',
  ARRAY['back-rim', 'deep-distance', 'cognitive-stress', 'live-application', 'impulse'],
  E'SEGMENT 1: TEST OUT\nRegular ball\n• Back rim miss AND/OR make must be 10+ consecutive\n• Continue until 10+ back rim contacts/makes achieved\n\nSEGMENT 2: DEEP DISTANCE (Oversized Ball)\nLadder Progression:\n• Start from deep line\n• Step in progressively\n• Make 1 from Deepest → Step in, Make → Step In, Make → Step in, Make\nOR Fixed Distance:\n• 10-10-5 rim hit + make progression\n• Focus on getting off the ground and generating impulse\n\nSEGMENT 3: 5 SECTION BACK-RIM (Regular ball + strobes)\n• 3 in a row back rim miss OR make to advance\n• Catch and shoot\n• Off the pivot with one dribble (slide dribbles, break line step back)\n\nSEGMENT 4: COGNITIVE LAYERING\nStrategic variability:\n• Number system\n• 1 arm up / 2 arms up reactive cues\n• Passer randomly playing defense\n• Unknown shot timing/location\n\nSEGMENT 5: CONTRACT/RELAX + LIVE PLAY\nPart A: Contract/Relax Tap Series out of various postures\n• Post-up positioning (creating space off ball)\nPart B: Live Play Integration\n• Post possessions (hunting mid-range with airspace)\n• Closeout possessions on perimeter\n• Possessions off the handle',
  'Coach Jake'
FROM elite_players
WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

-- Session 2: February 16, 2026 @ USD
INSERT INTO elite_training_sessions (player_id, date, session_type, title, description, duration_minutes, location, focus_areas, notes, created_by)
SELECT
  id,
  '2026-02-16',
  'training',
  'Sensory Release Mastery + Energy Adaptation',
  'Sensory release mastery, flight & velocity, energy adaptation flow, movement sensory info, cognitive layering',
  NULL,
  'USD',
  ARRAY['sensory-release', 'flight-velocity', 'energy-adaptation', 'ball-dip', 'follow-through', 'alignment', 'cognitive'],
  E'SEGMENT 1: SENSORY RELEASE MASTERY - FLIGHT & VELOCITY\nRegular ball — Make 1 of each, then move to next\nBall Flight Arc: 25° / 45° / 60° / 90°\nRelease Time: 0.5 or less / 0.6-0.9 / 1s\n\nSEGMENT 2: ENERGY ADAPTATION FLOW\nPass Type, Speed, Location + Ball Dip Variation\nMake 1 of each, then move to next\nFollow-Through: Hold / No hold\nHigh Pass Variations:\n• No vertical dip\n• Large vertical dip\n• Compact vertical dip\nWaist Height Pass:\n• Drop in place, feet stay on ground\n• Drop in place, feet come off ground\n• L hand catch\n• R hand catch\n\nSEGMENT 3: MOVEMENT SENSORY INFO RELEASE\nMake 1 of each, then move to next\nFoot Alignment: Square / Angled left / Angled right / 360 spin\nBase: Full foot / Mid foot / Narrow stance / Wide stance\nSingle Hand Catches:\n• Bound left, single hand catch\n• Bound right, single hand catch\n• Bound backward left, single hand\n• Bound backward right, single hand\nTwo Hands:\n• Backward jog catch two hands\nTest outs can be applied based on analysis\n\nSEGMENT 5: COGNITIVE LAYERING\nSame structure as 2/15 session',
  'Coach Jake'
FROM elite_players
WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;
