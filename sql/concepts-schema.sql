-- ============================================
-- DEFINITIONS & CONCEPTS LIBRARY TABLES
-- ============================================

-- Concept Categories
CREATE TABLE IF NOT EXISTS concept_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES concept_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual Concepts
CREATE TABLE IF NOT EXISTS concepts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES concept_categories(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  definition TEXT NOT NULL,
  short_description TEXT,

  -- Coaching content
  execution_cues TEXT[] DEFAULT '{}',
  progression_notes TEXT,
  common_mistakes TEXT[] DEFAULT '{}',

  -- Metadata
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',

  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos attached to concepts
CREATE TABLE IF NOT EXISTS concept_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_type TEXT NOT NULL DEFAULT 'demo'
    CHECK (video_type IN ('demo', 'nba_reference', 'coach_breakdown', 'player_example', 'drill')),
  duration_seconds INTEGER,
  description TEXT,
  display_order INTEGER DEFAULT 0,

  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_concept_categories_slug ON concept_categories(slug);
CREATE INDEX IF NOT EXISTS idx_concept_categories_parent ON concept_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_concepts_category ON concepts(category_id);
CREATE INDEX IF NOT EXISTS idx_concepts_slug ON concepts(slug);
CREATE INDEX IF NOT EXISTS idx_concepts_published ON concepts(is_published);
CREATE INDEX IF NOT EXISTS idx_concepts_tags ON concepts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_concept_videos_concept ON concept_videos(concept_id);

-- RLS Policies
ALTER TABLE concept_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_videos ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access on concept_categories"
  ON concept_categories FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on concepts"
  ON concepts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on concept_videos"
  ON concept_videos FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Public read access for published concepts
CREATE POLICY "Public read published concepts"
  ON concepts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read concept categories"
  ON concept_categories FOR SELECT
  USING (true);

CREATE POLICY "Public read concept videos"
  ON concept_videos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM concepts WHERE concepts.id = concept_videos.concept_id AND concepts.is_published = true
  ));

-- Storage bucket for concept demo videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('concept-videos', 'concept-videos', true)
ON CONFLICT (id) DO NOTHING;
