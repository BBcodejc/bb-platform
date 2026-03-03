-- =====================================================
-- TOBIAS HARRIS - FEBRUARY 2026 TRAINING SESSIONS
-- Sessions from 2/14, 2/15, 2/16
-- =====================================================

-- Session: February 14, 2026
INSERT INTO elite_training_sessions (player_id, date, session_type, title, description, duration_minutes, location, focus_areas, notes, created_by)
SELECT
  id,
  '2026-02-14',
  'training',
  'Deep Distance + Back Rim + Cognitive + Live',
  'Tentative — depending on timing per segment and live analysis',
  NULL,
  NULL,
  ARRAY['deep-distance', 'back-rim', 'cognitive', 'live-play', 'mid-range'],
  E'SEGMENT 1: DEEP DISTANCE (7-10 min)\nPrinciples to focus on:\n• Get off the ground\n• 10 rim hits from deep line\n• 10 one step in back rim miss or makes only\n• Another step in, 5 makes\n• Step in, 3 makes\n\nSEGMENT 2: 3 POINT LINE — 5 SECTION (7-10 min)\nPrinciples to focus on:\n• Back Rim\n• 3 in a Row Back Rim Miss or back rim make (catch and shoot + off the pivot w/ one dribble limit with oversized ball)\n• Progressed and layered and contrasted with regular ball/strobes\n\nSEGMENT 3: COGNITIVE LAYERING w/ regular ball (5-10 min)\nMake one next spot.\n• Number system\n• 1 arm up / 2 arm up reactive + passer randomly playing D\n\nSEGMENT 4: LIVE SEGMENT (10 min)\nPrinciples to focus on:\n• Smooth stops, counters and hunting mid range with airspace\n• Higher release point in mid range',
  'Coach Jake'
FROM elite_players
WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

-- Session: February 15, 2026 @ SDA
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

-- Session: February 16, 2026 @ USD
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
  E'SEGMENT 1: SENSORY RELEASE MASTERY - FLIGHT & VELOCITY\nRegular ball — Make 1 of each, then move to next\nBall Flight Arc:\n• 25°\n• 45°\n• 60°\n• 90°\nRelease Time:\n• 0.5 or less\n• 0.6-0.9\n• 1s\n\nSEGMENT 2: ENERGY ADAPTATION FLOW\nPass Type, Speed, Location + Ball Dip Variation\nMake 1 of each, then move to next\nFollow-Through:\n• Hold follow through\n• No hold follow through\nHigh Pass Variations:\n• High pass, no vertical dip\n• High pass, large vertical dip\n• High pass, compact vertical dip\nWaist Height Pass:\n• Drop in place, feet stay on ground\n• Drop in place, feet come off ground\n• L hand catch\n• R hand catch\n\nSEGMENT 3: MOVEMENT SENSORY INFO RELEASE\nMake 1 of each, then move to next\nFoot Alignment:\n• Square\n• Angled left\n• Angled right\n• 360 spin\nBase:\n• Full foot\n• Mid foot\n• Narrow stance\n• Wide stance\nSingle Hand Catches:\n• Bound left, single hand catch\n• Bound right, single hand catch\n• Bound backward left, single hand\n• Bound backward right, single hand\nTwo Hands:\n• Backward jog catch two hands\nTest outs can be applied based on analysis\n\nSEGMENT 5: COGNITIVE LAYERING\nSame structure as 2/15 session',
  'Coach Jake'
FROM elite_players
WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;
