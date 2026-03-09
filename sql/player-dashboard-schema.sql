-- =====================================================
-- PLAYER DASHBOARD SCHEMA
-- 4 new tables for the NBA 2K-style player dashboard
-- =====================================================

-- =====================================================
-- 1. ELITE SEASON STATS
-- Aggregated season averages (PPG, 3P%, FG%, etc.)
-- One row per player per season
-- =====================================================

DROP TABLE IF EXISTS elite_season_stats CASCADE;

CREATE TABLE elite_season_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  season TEXT NOT NULL DEFAULT '2025-26',
  league TEXT DEFAULT 'NBA' CHECK (league IN ('NBA', 'NCAA', 'G-League', 'International', 'HS', 'Other')),

  -- Per-game averages
  games_played INTEGER DEFAULT 0,
  ppg DECIMAL(5,1) DEFAULT 0,
  rpg DECIMAL(5,1) DEFAULT 0,
  apg DECIMAL(5,1) DEFAULT 0,
  spg DECIMAL(5,1) DEFAULT 0,
  bpg DECIMAL(5,1) DEFAULT 0,
  topg DECIMAL(5,1) DEFAULT 0,
  mpg DECIMAL(5,1) DEFAULT 0,

  -- Shooting percentages
  fg_pct DECIMAL(5,1) DEFAULT 0,
  three_pt_pct DECIMAL(5,1) DEFAULT 0,
  ft_pct DECIMAL(5,1) DEFAULT 0,

  -- Totals (for computing splits)
  fg_made INTEGER DEFAULT 0,
  fg_attempted INTEGER DEFAULT 0,
  three_pt_made INTEGER DEFAULT 0,
  three_pt_attempted INTEGER DEFAULT 0,
  ft_made INTEGER DEFAULT 0,
  ft_attempted INTEGER DEFAULT 0,

  -- Shooting splits (optional, manually entered or computed)
  mid_range_pct DECIMAL(5,1),
  paint_pct DECIMAL(5,1),

  -- Source tracking
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'balldontlie', 'nba_api')),
  nba_player_id INTEGER,
  last_synced_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(player_id, season)
);

CREATE INDEX IF NOT EXISTS idx_elite_season_stats_player ON elite_season_stats(player_id);

ALTER TABLE elite_season_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to elite_season_stats" ON elite_season_stats;
CREATE POLICY "Service role full access to elite_season_stats" ON elite_season_stats
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 2. ELITE BB METRICS
-- BB-specific training metrics for radar/bar chart
-- One entry per player per date
-- =====================================================

DROP TABLE IF EXISTS elite_bb_metrics CASCADE;

CREATE TABLE elite_bb_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Scored 0-100 for bar chart rendering
  back_rim_rate DECIMAL(5,1),
  movement_bandwidth DECIMAL(5,1),
  strobe_level DECIMAL(5,1),
  deep_distance_accuracy DECIMAL(5,1),
  catch_shoot_speed DECIMAL(5,1),
  off_dribble_calibration DECIMAL(5,1),
  energy_transfer_score DECIMAL(5,1),

  -- Raw scores
  fourteen_spot_score INTEGER,
  fourteen_spot_total INTEGER DEFAULT 14,

  notes TEXT,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(player_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_elite_bb_metrics_player ON elite_bb_metrics(player_id);
CREATE INDEX IF NOT EXISTS idx_elite_bb_metrics_date ON elite_bb_metrics(player_id, metric_date DESC);

ALTER TABLE elite_bb_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to elite_bb_metrics" ON elite_bb_metrics;
CREATE POLICY "Service role full access to elite_bb_metrics" ON elite_bb_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 3. ELITE HIGHLIGHTS
-- Notable moments / timeline entries
-- =====================================================

DROP TABLE IF EXISTS elite_highlights CASCADE;

CREATE TABLE elite_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  highlight_date DATE NOT NULL,
  category TEXT DEFAULT 'game' CHECK (category IN ('game', 'training', 'milestone', 'coaching', 'personal-best')),
  stat_line TEXT,
  opponent TEXT,
  video_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_elite_highlights_player ON elite_highlights(player_id);
CREATE INDEX IF NOT EXISTS idx_elite_highlights_date ON elite_highlights(player_id, highlight_date DESC);

ALTER TABLE elite_highlights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to elite_highlights" ON elite_highlights;
CREATE POLICY "Service role full access to elite_highlights" ON elite_highlights
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 4. ELITE DASHBOARD CLIPS
-- Curated film clips pinned to dashboard
-- =====================================================

DROP TABLE IF EXISTS elite_dashboard_clips CASCADE;

CREATE TABLE elite_dashboard_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES elite_players(id) ON DELETE CASCADE,
  video_clip_id UUID REFERENCES elite_video_clips(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  url TEXT NOT NULL,
  duration INTEGER,
  category TEXT DEFAULT 'game-clip' CHECK (category IN ('game-clip', 'training', 'breakdown', 'highlight')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_elite_dashboard_clips_player ON elite_dashboard_clips(player_id);

ALTER TABLE elite_dashboard_clips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access to elite_dashboard_clips" ON elite_dashboard_clips;
CREATE POLICY "Service role full access to elite_dashboard_clips" ON elite_dashboard_clips
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 5. ADD nba_player_id TO elite_players
-- For NBA API stat syncing
-- =====================================================

ALTER TABLE elite_players
  ADD COLUMN IF NOT EXISTS nba_player_id INTEGER;
