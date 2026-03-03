-- Pre-Game Session for Tobias Harris - 2/21/2026 vs. Bulls
-- Run this in Supabase SQL Editor

INSERT INTO elite_training_sessions (
  player_id,
  date,
  session_type,
  title,
  description,
  duration_minutes,
  location,
  opponent,
  focus_areas,
  notes,
  link,
  created_by
)
SELECT
  id,
  '2026-02-21',
  'pre-game',
  'Pre-Game vs. Bulls',
  'Pre-game shooting calibration session focused on deep distance ladder, +3 five section, velocity makes, post fades, and max airspace exploration.',
  45,
  'Little Caesars Arena',
  'Chicago Bulls',
  ARRAY['Shooting Calibration', 'Deep Distance', 'Post Fades', 'Velocity', 'Airspace'],
  E'DEEP DISTANCE LADDER PROGRESSION (Wing → Center → Wing, both sides):\n• Start deep: rim contacts only, stay flat\n• Large step in: back rim hits (5 before moving)\n• Large step in: back rim hits + makes (5)\n• Large step in to 3pt line: (3-5 Makes)\n• Don''t sail the ball high. Flat ball flight. Control the energy.\n\n+3 FIVE SECTION:\n• left/right miss = 0\n• back-rim miss = neutral\n• make = +1\n• Shot Types: Catch and Shoot, Jab, One Dribble Step Back, Pump Fake Slide Dribble, Pump Fake Fly-By\n• Keep ball in front. Turn left on catch — already aligned.\n\nCOMING BACK AROUND - VELOCITY 1 MAKE - ALL 5 SECTION:\n• Fast\n• Moderate\n• Slower\n• Tell passer to change height and location on the pass (Dip, no dip, large dip, single arm catch)\n\nPOST FADES FROM ABOVE THE BLOCK - USE MAX AIRSPACE:\n• Right Shoulder\n• Left Shoulder\n• Post fade, step back to fade, pump fake to post fade\n• Sway in air. Control for drift.',
  NULL,
  'Coach Tommy'
FROM elite_players
WHERE slug = 'tobias-harris';

-- Now set the link to point to the session detail page
UPDATE elite_training_sessions
SET link = '/elite/tobias-harris/session/' || id::text
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-21'
  AND session_type = 'pre-game'
  AND title = 'Pre-Game vs. Bulls';
