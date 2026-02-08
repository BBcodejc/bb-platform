-- Elite Players Dashboard Schema
-- For NBA, Pro, and Elite College Players

-- Main player table
CREATE TABLE IF NOT EXISTS elite_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  position VARCHAR(50),
  team VARCHAR(100),
  team_logo TEXT,
  headshot_url TEXT,
  bb_level INTEGER DEFAULT 1 CHECK (bb_level >= 1 AND bb_level <= 4),
  season_status VARCHAR(20) DEFAULT 'in-season' CHECK (season_status IN ('in-season', 'off-season', 'playoffs', 'pre-season')),
  access_token VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily focus cues
CREATE TABLE IF NOT EXISTS elite_daily_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  focus_cue TEXT NOT NULL,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, date)
);

-- Limiting factors
CREATE TABLE IF NOT EXISTS elite_limiting_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  short_description TEXT,
  awareness_cue TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game scouting reports
CREATE TABLE IF NOT EXISTS elite_game_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  opponent VARCHAR(100) NOT NULL,
  opponent_logo TEXT,
  game_date DATE NOT NULL,
  is_home BOOLEAN DEFAULT true,
  minutes_played INTEGER,
  three_point_attempts INTEGER DEFAULT 0,
  three_point_makes INTEGER DEFAULT 0,
  three_point_percentage DECIMAL(5,2),
  points INTEGER,
  field_goal_attempts INTEGER,
  field_goal_makes INTEGER,
  bb_notes TEXT,
  hunting_next_game TEXT,
  video_clips JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player stats (rolling averages)
CREATE TABLE IF NOT EXISTS elite_player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE UNIQUE,
  rolling_3_game_3pt DECIMAL(5,2),
  rolling_5_game_3pt DECIMAL(5,2),
  avg_shot_volume DECIMAL(5,2),
  current_streak VARCHAR(20) DEFAULT 'neutral' CHECK (current_streak IN ('hot', 'cold', 'neutral')),
  streak_games INTEGER DEFAULT 0,
  back_rim_percentage DECIMAL(5,2),
  directional_miss_percentage DECIMAL(5,2),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Video clips library
CREATE TABLE IF NOT EXISTS elite_video_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  game_id UUID REFERENCES elite_game_reports(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  tags TEXT[] DEFAULT '{}',
  bb_cue TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily cues (the list player sees before games)
CREATE TABLE IF NOT EXISTS elite_daily_cues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  cue_text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'shooting' CHECK (category IN ('shooting', 'decision', 'mindset', 'movement')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player inputs (optional feedback from player)
CREATE TABLE IF NOT EXISTS elite_player_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES elite_players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shot_feeling TEXT,
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_elite_daily_focus_player_date ON elite_daily_focus(player_id, date);
CREATE INDEX IF NOT EXISTS idx_elite_game_reports_player_date ON elite_game_reports(player_id, game_date DESC);
CREATE INDEX IF NOT EXISTS idx_elite_video_clips_player ON elite_video_clips(player_id);
CREATE INDEX IF NOT EXISTS idx_elite_daily_cues_player ON elite_daily_cues(player_id, display_order);
CREATE INDEX IF NOT EXISTS idx_elite_player_inputs_player_date ON elite_player_inputs(player_id, date DESC);

-- Row Level Security (optional - enable if needed)
-- ALTER TABLE elite_players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE elite_daily_focus ENABLE ROW LEVEL SECURITY;
-- etc.

-- ============================================
-- INSERT TOBIAS HARRIS AS FIRST PLAYER
-- ============================================

INSERT INTO elite_players (
  slug,
  first_name,
  last_name,
  position,
  team,
  bb_level,
  season_status,
  access_token,
  is_active
) VALUES (
  'tobias-harris',
  'Tobias',
  'Harris',
  'Forward',
  'Detroit Pistons',
  2,
  'in-season',
  'th-bb-2024',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Add initial limiting factors for Tobias
INSERT INTO elite_limiting_factors (player_id, name, short_description, awareness_cue, priority)
SELECT
  id,
  'Off-the-handle calibration',
  'Shot timing varies when creating off the dribble vs catch-and-shoot situations.',
  'When pulling up, let the ball settle before releasing. Don''t rush the gather.',
  'high'
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_limiting_factors (player_id, name, short_description, awareness_cue, priority)
SELECT
  id,
  'Energy transfer consistency',
  'Power generation from legs to release can vary based on defensive pressure.',
  'Feel your feet. Strong base = clean release.',
  'medium'
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_limiting_factors (player_id, name, short_description, awareness_cue, priority)
SELECT
  id,
  'Deep-distance impulse control',
  'Tendency to short-arm from NBA 3PT range under fatigue.',
  'From deep, trust the legs. Full extension, back rim target.',
  'high'
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_limiting_factors (player_id, name, short_description, awareness_cue, priority)
SELECT
  id,
  'Decision-making under early doubles',
  'Quick doubles can rush shot selection before the play develops.',
  'See the help early. If they commit, find the open man. If they hesitate, attack.',
  'medium'
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

-- Add initial daily cues for Tobias
INSERT INTO elite_daily_cues (player_id, cue_text, category, display_order)
SELECT id, 'Control ball to back rim', 'shooting', 0
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_daily_cues (player_id, cue_text, category, display_order)
SELECT id, 'Don''t rush early misses', 'mindset', 1
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_daily_cues (player_id, cue_text, category, display_order)
SELECT id, 'Drift when airspace collapses', 'movement', 2
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_daily_cues (player_id, cue_text, category, display_order)
SELECT id, 'Use ball fakes vs early help', 'decision', 3
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

INSERT INTO elite_daily_cues (player_id, cue_text, category, display_order)
SELECT id, 'Read feet, not hands', 'decision', 4
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

-- Add today's focus
INSERT INTO elite_daily_focus (player_id, date, focus_cue, created_by)
SELECT id, CURRENT_DATE, 'Back-rim control + drift pull-ups when space collapses', 'Coach Jake'
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;
