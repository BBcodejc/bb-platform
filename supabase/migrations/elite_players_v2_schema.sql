-- Elite Players Dashboard Schema V2
-- Adds: Game Day Protocol, Weekly Review, Coach Notes, Voice Notes

-- ============================================
-- NEW COLUMNS FOR elite_players
-- ============================================
ALTER TABLE elite_players ADD COLUMN IF NOT EXISTS bb_level_name VARCHAR(100);

-- ============================================
-- GAME DAY PROTOCOL TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS elite_game_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  name VARCHAR(200) DEFAULT 'Pre-Game Protocol',
  duration VARCHAR(50) DEFAULT '15-20 minutes',

  -- Scoring Settings (JSON)
  scoring_settings JSONB DEFAULT '{
    "backRim": 0,
    "frontRimComesBack": -1,
    "directionalMiss": -1,
    "skidForward": 0,
    "make": 1,
    "targetScore": 5
  }'::jsonb,

  -- 5-Spot Structure (JSON array)
  spots JSONB DEFAULT '[
    {"id": "corner-left", "name": "Corner Left", "position": "corner-left", "shotTypes": [], "reps": 5},
    {"id": "corner-right", "name": "Corner Right", "position": "corner-right", "shotTypes": [], "reps": 5},
    {"id": "wing-left", "name": "Wing Left", "position": "wing-left", "shotTypes": [], "reps": 5},
    {"id": "wing-right", "name": "Wing Right", "position": "wing-right", "shotTypes": [], "reps": 5},
    {"id": "top", "name": "Top of Key", "position": "top", "shotTypes": [], "reps": 5}
  ]'::jsonb,

  -- Shot Type Variety (JSON array)
  shot_type_variety JSONB DEFAULT '[
    {"id": "catch-shoot", "name": "Catch & Shoot", "category": "catch-shoot", "isActive": true},
    {"id": "pass-fake-shoot", "name": "Pass Fake + Shoot", "category": "catch-shoot", "isActive": true},
    {"id": "pump-fake-shoot", "name": "Pump Fake + Shoot", "category": "catch-shoot", "isActive": true},
    {"id": "pump-stepback", "name": "Pump Fake Break Line Stepback + Shoot", "category": "off-dribble", "isActive": true},
    {"id": "slide-dribble-3", "name": "Slide Dribble to 3 (L/R)", "category": "off-dribble", "isActive": true},
    {"id": "elongated-pump-pullup", "name": "Elongated Pump Fake + 1 Dribble Pull-up", "category": "pull-up", "isActive": true},
    {"id": "long-pump-stop-pullup", "name": "Long Pump Fake → Smooth Stop → 1st Dribble Pull-up", "category": "pull-up", "isActive": true},
    {"id": "2nd-dribble-stepback", "name": "2nd Dribble Pull-up + Stepback", "category": "pull-up", "isActive": true}
  ]'::jsonb,

  -- Post Section
  post_section JSONB DEFAULT '{
    "enabled": true,
    "moves": [
      "Fade left shoulder (aggressive)",
      "Fade right shoulder (aggressive)",
      "Stepback from left block",
      "Stepback from right block"
    ]
  }'::jsonb,

  -- Principles (JSON arrays)
  off_ball_principles JSONB DEFAULT '[
    "Late lift / late drift",
    "Move when dribbler is about to pick up",
    "Be a release valve",
    "Catch everything to shoot"
  ]'::jsonb,

  defense_principles JSONB DEFAULT '[
    "Step toward then hip turn bias",
    "Reach & recover",
    "Deflections",
    "Play passing angles"
  ]'::jsonb,

  rebounding_principles JSONB DEFAULT '[
    "Locate ball early",
    "Predict trajectory / camera angle",
    "Crash elbows / short corners on long threes"
  ]'::jsonb,

  handle_principles JSONB DEFAULT '[
    "Vary reaction time",
    "Dribble hard / high",
    "Delayed accelerations",
    "Gallop / blow-by"
  ]'::jsonb,

  finishing_principles JSONB DEFAULT '[
    "Max airspace",
    "Hunt pull-up",
    "Avoid crowded rim unless pump fake creates angle"
  ]'::jsonb,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(player_id)
);

-- ============================================
-- WEEKLY REVIEW TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS elite_weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT,
  what_changed JSONB DEFAULT '[]'::jsonb,
  priorities JSONB DEFAULT '[]'::jsonb,
  shooting_trend VARCHAR(20) CHECK (shooting_trend IN ('improving', 'declining', 'stable')),
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COACH NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS elite_coach_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  text TEXT NOT NULL,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOICE NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS elite_voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  duration INTEGER,
  transcript TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADD category column to elite_daily_cues if not exists
-- ============================================
ALTER TABLE elite_daily_cues
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'shooting';

-- Update constraint if needed
ALTER TABLE elite_daily_cues
DROP CONSTRAINT IF EXISTS elite_daily_cues_category_check;

ALTER TABLE elite_daily_cues
ADD CONSTRAINT elite_daily_cues_category_check
CHECK (category IN ('shooting', 'decision', 'mindset', 'movement', 'defense', 'rebounding', 'handle', 'finishing'));

-- ============================================
-- ADD notes column to elite_limiting_factors if not exists
-- ============================================
ALTER TABLE elite_limiting_factors
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE elite_limiting_factors
ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'medium';

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_elite_weekly_reviews_player ON elite_weekly_reviews(player_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_elite_coach_notes_player ON elite_coach_notes(player_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_elite_voice_notes_player ON elite_voice_notes(player_id, created_at DESC);

-- ============================================
-- SEED DATA FOR TOBIAS HARRIS (UPDATE)
-- ============================================

-- Update BB Level Name
UPDATE elite_players
SET bb_level_name = 'BB 2 - Calibrated'
WHERE slug = 'tobias-harris';

-- Insert Game Day Protocol for Tobias
INSERT INTO elite_game_protocols (player_id)
SELECT id FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT (player_id) DO NOTHING;

-- Insert a Weekly Review
INSERT INTO elite_weekly_reviews (player_id, week_start, week_end, summary, what_changed, priorities, shooting_trend, created_by)
SELECT
  id,
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE,
  'Solid week of shooting. 3PT% up to 38% over last 5 games. Deep-distance consistency improved with back-rim focus. Need to maintain energy transfer on contested shots.',
  '["3PT% improved from 34% to 38%", "Better back-rim control on catch-and-shoot", "Reduced directional misses by focusing on alignment"]'::jsonb,
  '["Continue back-rim emphasis", "Work on off-dribble pull-ups from wing", "Stay patient on early doubles"]'::jsonb,
  'improving',
  'Coach Jake'
FROM elite_players WHERE slug = 'tobias-harris';

-- Insert Coach Notes
INSERT INTO elite_coach_notes (player_id, date, text, created_by)
SELECT id, CURRENT_DATE, 'Great focus in shootaround today. Energy was high, shot looked clean. Reminded him about late drift when help comes early.', 'Coach Jake'
FROM elite_players WHERE slug = 'tobias-harris';

INSERT INTO elite_coach_notes (player_id, date, text, created_by)
SELECT id, CURRENT_DATE - INTERVAL '2 days', 'Film session: broke down his last 3 games. Main takeaway - he''s rushing the gather on off-dribble 3s. Needs to let the ball settle.', 'Coach Jake'
FROM elite_players WHERE slug = 'tobias-harris';

-- Insert sample videos
INSERT INTO elite_video_clips (player_id, title, url, tags, bb_cue)
SELECT id, 'Catch-and-Shoot Breakdown', 'https://youtube.com/watch?v=example1', ARRAY['catch-and-shoot', 'training'], 'Notice the feet set before catch - ready position'
FROM elite_players WHERE slug = 'tobias-harris';

INSERT INTO elite_video_clips (player_id, title, url, tags, bb_cue)
SELECT id, 'Off-Dribble Pull-up Analysis', 'https://youtube.com/watch?v=example2', ARRAY['off-dribble', 'game-clip'], 'Gather timing is key - let ball settle'
FROM elite_players WHERE slug = 'tobias-harris';

INSERT INTO elite_video_clips (player_id, title, url, tags, bb_cue)
SELECT id, 'Deep Distance Reps', 'https://youtube.com/watch?v=example3', ARRAY['deep-distance', 'training'], 'Full extension, trust the legs'
FROM elite_players WHERE slug = 'tobias-harris';

-- Insert sample game reports
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, bb_notes, hunting_next_game)
SELECT id, 'Cleveland Cavaliers', CURRENT_DATE - INTERVAL '2 days', true, 32, 6, 3, 50.0, 18, 'Clean looks from the corner. Rushed 2 wing attempts when help came. Good patience in the 4th.', 'Stay patient on wing 3s, use pump fake more'
FROM elite_players WHERE slug = 'tobias-harris';

INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, bb_notes, hunting_next_game)
SELECT id, 'Chicago Bulls', CURRENT_DATE - INTERVAL '5 days', false, 35, 8, 2, 25.0, 14, 'Tough shooting night. Shot felt flat - likely fatigue from back-to-back. Need to trust legs more.', 'Extra emphasis on legs, back-rim target'
FROM elite_players WHERE slug = 'tobias-harris';

INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, bb_notes, hunting_next_game)
SELECT id, 'Miami Heat', CURRENT_DATE - INTERVAL '7 days', true, 30, 5, 2, 40.0, 16, 'Good shot selection. Only took shots in rhythm. Ball moved well.', 'Keep hunting corner looks off ball movement'
FROM elite_players WHERE slug = 'tobias-harris';

-- Insert player stats
INSERT INTO elite_player_stats (player_id, rolling_3_game_3pt, rolling_5_game_3pt, avg_shot_volume, current_streak, streak_games)
SELECT id, 38.5, 36.2, 6.2, 'hot', 2
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT (player_id) DO UPDATE SET
  rolling_3_game_3pt = 38.5,
  rolling_5_game_3pt = 36.2,
  avg_shot_volume = 6.2,
  current_streak = 'hot',
  streak_games = 2;
