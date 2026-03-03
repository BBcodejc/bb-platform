-- Training Session for Tobias Harris - 2/22/2026 at Seaholm (Actual Recap)
-- Run this in Supabase SQL Editor
-- * General layout can change upon analysis

-- Delete any previously inserted planned version of this session
DELETE FROM elite_training_sessions
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-22'
  AND session_type = 'training'
  AND title = 'Calibration Session — Seaholm';

INSERT INTO elite_training_sessions (
  player_id,
  date,
  session_type,
  title,
  description,
  duration_minutes,
  location,
  focus_areas,
  notes,
  link,
  created_by
)
SELECT
  id,
  '2026-02-22',
  'training',
  'Calibration Session — Seaholm',
  'Oversized ball calibration session with test out (10/14), 7-spot flow, cognitive layering with regular ball, contrast test out (10/14), and energy pattern exploration.',
  60,
  'Seaholm',
  ARRAY['Shooting Calibration', 'Oversized Ball', 'Cognitive Layering', 'Flat Ball Flight', 'Energy Patterns', 'Back Rim'],
  E'SEGMENT 1: TEST OUT\n• Oversized ball\n• Scored 10/14 + 2 back rim misses to start\n\nSEGMENT 2: 7 SPOT CALIBRATION FLOW\n• Oversized ball + very flat\n• Back rim miss or make → next spot\n• Move through all 7 spots\n\nSEGMENT 3: 7 SPOT COGNITIVE LAYERING + REGULAR BALL (TWO SETS)\n• Oversized ball\n\nSEGMENT 4: CONTRAST TEST OUT\n• Regular ball\n• Scored 10/14\n\nSEGMENT 5: ENERGY PATTERN EXPLORATION\n• Regular ball\n• Early release\n• Jump forward exploration\n• Aerial pause / fade variation\n\n---\n\nRECAP:\n• Cognitive Layering Test Out: 10/14\n• Oversized Test Out: 10/14 + 2 back rim misses\n• Contrast (Regular Ball) Test Out: 10/14\n\nFOCUS GOING FORWARD:\n• Getting off the ground rapid and rhythmic\n• Getting off quick using momentum and elastic energy\n• Stabilizing and quick on step back\n\nKEY NOTE:\n• Shooting at the target flat — that''s when he''s at his best',
  NULL,
  'Coach Tommy'
FROM elite_players
WHERE slug = 'tobias-harris';

-- Set the link to point to the session detail page
UPDATE elite_training_sessions
SET link = '/elite/tobias-harris/session/' || id::text
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-22'
  AND session_type = 'training'
  AND title = 'Calibration Session — Seaholm';
