-- ============================================================================
-- Row Level Security (RLS) Policies for BB Platform
-- ============================================================================
--
-- CONTEXT:
--   - Admin (bbcodejc@gmail.com) authenticates via Supabase Auth. Admin API
--     routes use createRouteHandlerClient(request) which passes the anon key
--     + session cookies. RLS APPLIES to these requests.
--
--   - Elite players authenticate via a custom bb-elite-token cookie.
--     Their routes use createServiceRoleClient() which BYPASSES RLS entirely.
--
--   - Public routes (concept pages, intake, checkout, webhooks, cron) also
--     use createServiceRoleClient() which BYPASSES RLS.
--
--   Therefore, all RLS policies below grant access to the single authenticated
--   admin user. The service role key inherently bypasses RLS, so no policies
--   are needed for elite player or public access patterns.
--
-- SAFE TO RE-RUN: Uses DROP POLICY IF EXISTS before each CREATE POLICY.
-- ============================================================================


-- ============================================================================
-- HELPER: Admin check expression
-- ============================================================================
-- All policies below use this expression to identify the admin user:
--   auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
--
-- This checks the JWT claim from the authenticated Supabase session.
-- ============================================================================


-- ============================================================================
-- 1. PROSPECTS TABLE
-- ============================================================================
-- Used in: /api/admin/prospects, /api/admin/prospects/[id],
--          /api/admin/analytics, /api/admin/stats,
--          /api/admin/evaluations (joined), /api/admin/evaluations/[id]/send
-- Operations: SELECT, UPDATE

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to prospects" ON prospects;
CREATE POLICY "Admin full access to prospects"
ON prospects
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 2. PAYMENTS TABLE
-- ============================================================================
-- Used in: /api/admin/prospects/[id] (SELECT payments for a prospect)
-- Operations: SELECT

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to payments" ON payments;
CREATE POLICY "Admin full access to payments"
ON payments
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 3. EVALUATIONS TABLE
-- ============================================================================
-- Used in: /api/admin/prospects/[id] (SELECT evaluation for a prospect)
-- Operations: SELECT

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to evaluations" ON evaluations;
CREATE POLICY "Admin full access to evaluations"
ON evaluations
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 4. SHOOTING_EVALUATIONS TABLE
-- ============================================================================
-- Used in: /api/admin/evaluations, /api/admin/evaluations/[id],
--          /api/admin/evaluations/[id]/send, /api/admin/evaluations/[id]/patch,
--          /api/admin/players, /api/admin/stats, /api/admin/analytics
-- Operations: SELECT, UPDATE

ALTER TABLE shooting_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to shooting_evaluations" ON shooting_evaluations;
CREATE POLICY "Admin full access to shooting_evaluations"
ON shooting_evaluations
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 5. EMAIL_SEQUENCES TABLE
-- ============================================================================
-- Used in: /api/admin/email-sequences (SELECT all sequences)
-- Operations: SELECT

ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to email_sequences" ON email_sequences;
CREATE POLICY "Admin full access to email_sequences"
ON email_sequences
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 6. ELITE_PLAYERS TABLE
-- ============================================================================
-- Used in: /api/admin/players (SELECT elite players list)
-- Operations: SELECT
-- Note: Most elite_players operations go through service role (elite player
--       routes), but the admin players list route uses createRouteHandlerClient.

ALTER TABLE elite_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to elite_players" ON elite_players;
CREATE POLICY "Admin full access to elite_players"
ON elite_players
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 7. ACTIVITY_LOG TABLE
-- ============================================================================
-- Used in: /api/admin/stats (SELECT recent activity)
-- Operations: SELECT

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to activity_log" ON activity_log;
CREATE POLICY "Admin full access to activity_log"
ON activity_log
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 8. COACHING_CLIENTS TABLE
-- ============================================================================
-- Used in: /api/coaching/clients, /api/coaching/clients/[slug],
--          /api/coaching/assessment/[clientSlug]/*
-- Operations: SELECT, INSERT, UPDATE

ALTER TABLE coaching_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to coaching_clients" ON coaching_clients;
CREATE POLICY "Admin full access to coaching_clients"
ON coaching_clients
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 9. WEEK0_ASSESSMENTS TABLE
-- ============================================================================
-- Used in: /api/coaching/clients (INSERT on client creation),
--          /api/coaching/clients/[slug] (SELECT joined),
--          /api/coaching/assessment/[clientSlug] (SELECT),
--          /api/coaching/assessment/[clientSlug]/save (SELECT, INSERT, UPDATE),
--          /api/coaching/assessment/[clientSlug]/submit (UPDATE)
-- Operations: SELECT, INSERT, UPDATE

ALTER TABLE week0_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to week0_assessments" ON week0_assessments;
CREATE POLICY "Admin full access to week0_assessments"
ON week0_assessments
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 10. CONCEPTS TABLE
-- ============================================================================
-- Used in: /api/concepts (POST new concept),
--          /api/concepts/[slug] (PATCH, DELETE),
--          /api/concepts/categories GET also queries concepts for counts
--            (but that GET uses service role, so no RLS needed for reads there)
-- Operations: SELECT, INSERT, UPDATE, DELETE

ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to concepts" ON concepts;
CREATE POLICY "Admin full access to concepts"
ON concepts
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 11. CONCEPT_CATEGORIES TABLE
-- ============================================================================
-- Used in: /api/concepts/categories (POST new category)
-- Operations: INSERT (SELECT is via service role)

ALTER TABLE concept_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to concept_categories" ON concept_categories;
CREATE POLICY "Admin full access to concept_categories"
ON concept_categories
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 12. CONCEPT_VIDEOS TABLE
-- ============================================================================
-- Used in: /api/concepts/videos (POST new video),
--          /api/concepts/videos/[id] (PATCH, DELETE)
-- Operations: SELECT, INSERT, UPDATE, DELETE

ALTER TABLE concept_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to concept_videos" ON concept_videos;
CREATE POLICY "Admin full access to concept_videos"
ON concept_videos
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 13-15. TABLES DEFINED IN TYPES BUT ONLY ACCESSED VIA SERVICE ROLE
-- ============================================================================
-- These tables exist in the Database types (src/lib/supabase.ts) but are only
-- accessed through createServiceRoleClient() in webhook/intake/portal routes.
-- We still enable RLS on them as a defense-in-depth measure, and grant admin
-- access in case future routes use createRouteHandlerClient.

-- 13. TEST_RESULTS
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to test_results" ON test_results;
CREATE POLICY "Admin full access to test_results"
ON test_results
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');

-- 14. VIDEO_UPLOADS
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to video_uploads" ON video_uploads;
CREATE POLICY "Admin full access to video_uploads"
ON video_uploads
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');

-- 15. MENTORSHIPS
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to mentorships" ON mentorships;
CREATE POLICY "Admin full access to mentorships"
ON mentorships
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');


-- ============================================================================
-- 16-35. ELITE PLAYER & RELATED TABLES (SERVICE ROLE ONLY)
-- ============================================================================
-- All elite player routes use createServiceRoleClient() which bypasses RLS.
-- However, some admin routes (e.g., /api/admin/players) read elite_players
-- via createRouteHandlerClient. We enable RLS on all elite tables as a
-- defense-in-depth measure.

-- 16. ELITE_PREGAME_CUES
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_pregame_cues' AND table_schema = 'public') THEN
    ALTER TABLE elite_pregame_cues ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_pregame_cues" ON elite_pregame_cues;
    CREATE POLICY "Admin full access to elite_pregame_cues" ON elite_pregame_cues FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 17. ELITE_LIMITING_FACTORS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_limiting_factors' AND table_schema = 'public') THEN
    ALTER TABLE elite_limiting_factors ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_limiting_factors" ON elite_limiting_factors;
    CREATE POLICY "Admin full access to elite_limiting_factors" ON elite_limiting_factors FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 18. ELITE_GAME_PROTOCOLS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_game_protocols' AND table_schema = 'public') THEN
    ALTER TABLE elite_game_protocols ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_game_protocols" ON elite_game_protocols;
    CREATE POLICY "Admin full access to elite_game_protocols" ON elite_game_protocols FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 19. ELITE_WEEKLY_REVIEWS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_weekly_reviews' AND table_schema = 'public') THEN
    ALTER TABLE elite_weekly_reviews ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_weekly_reviews" ON elite_weekly_reviews;
    CREATE POLICY "Admin full access to elite_weekly_reviews" ON elite_weekly_reviews FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 20. ELITE_COACH_NOTES
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_coach_notes' AND table_schema = 'public') THEN
    ALTER TABLE elite_coach_notes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_coach_notes" ON elite_coach_notes;
    CREATE POLICY "Admin full access to elite_coach_notes" ON elite_coach_notes FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 21. ELITE_VOICE_NOTES
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_voice_notes' AND table_schema = 'public') THEN
    ALTER TABLE elite_voice_notes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_voice_notes" ON elite_voice_notes;
    CREATE POLICY "Admin full access to elite_voice_notes" ON elite_voice_notes FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 22. ELITE_VIDEO_CLIPS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_video_clips' AND table_schema = 'public') THEN
    ALTER TABLE elite_video_clips ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_video_clips" ON elite_video_clips;
    CREATE POLICY "Admin full access to elite_video_clips" ON elite_video_clips FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 23. ELITE_GAME_REPORTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_game_reports' AND table_schema = 'public') THEN
    ALTER TABLE elite_game_reports ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_game_reports" ON elite_game_reports;
    CREATE POLICY "Admin full access to elite_game_reports" ON elite_game_reports FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 24. ELITE_DAILY_FOCUS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_daily_focus' AND table_schema = 'public') THEN
    ALTER TABLE elite_daily_focus ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_daily_focus" ON elite_daily_focus;
    CREATE POLICY "Admin full access to elite_daily_focus" ON elite_daily_focus FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 25. ELITE_PLAYER_STATS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_player_stats' AND table_schema = 'public') THEN
    ALTER TABLE elite_player_stats ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_player_stats" ON elite_player_stats;
    CREATE POLICY "Admin full access to elite_player_stats" ON elite_player_stats FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 26. ELITE_DAILY_CUES
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_daily_cues' AND table_schema = 'public') THEN
    ALTER TABLE elite_daily_cues ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_daily_cues" ON elite_daily_cues;
    CREATE POLICY "Admin full access to elite_daily_cues" ON elite_daily_cues FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 27. ELITE_PLAYER_INPUTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_player_inputs' AND table_schema = 'public') THEN
    ALTER TABLE elite_player_inputs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_player_inputs" ON elite_player_inputs;
    CREATE POLICY "Admin full access to elite_player_inputs" ON elite_player_inputs FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 28. ELITE_TRAINING_SESSIONS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_training_sessions' AND table_schema = 'public') THEN
    ALTER TABLE elite_training_sessions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_training_sessions" ON elite_training_sessions;
    CREATE POLICY "Admin full access to elite_training_sessions" ON elite_training_sessions FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 29. ELITE_DAILY_NOTES
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_daily_notes' AND table_schema = 'public') THEN
    ALTER TABLE elite_daily_notes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_daily_notes" ON elite_daily_notes;
    CREATE POLICY "Admin full access to elite_daily_notes" ON elite_daily_notes FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 30. ELITE_POSTGAME_SHOTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_postgame_shots' AND table_schema = 'public') THEN
    ALTER TABLE elite_postgame_shots ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_postgame_shots" ON elite_postgame_shots;
    CREATE POLICY "Admin full access to elite_postgame_shots" ON elite_postgame_shots FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 31. ELITE_LOGIN_HISTORY
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_login_history' AND table_schema = 'public') THEN
    ALTER TABLE elite_login_history ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to elite_login_history" ON elite_login_history;
    CREATE POLICY "Admin full access to elite_login_history" ON elite_login_history FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;


-- ============================================================================
-- 32-37. PORTAL / DYNAMIC PLAYER TABLES (SERVICE ROLE ONLY)
-- ============================================================================
-- These are accessed via createServiceRoleClient() in bb-portal and player
-- routes. RLS enabled for defense-in-depth.

-- 32. PLAYER_DAILY_CONTEXT
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'player_daily_context' AND table_schema = 'public') THEN
    ALTER TABLE player_daily_context ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to player_daily_context" ON player_daily_context;
    CREATE POLICY "Admin full access to player_daily_context" ON player_daily_context FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 33. PLAYER_DAILY_LOGS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'player_daily_logs' AND table_schema = 'public') THEN
    ALTER TABLE player_daily_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to player_daily_logs" ON player_daily_logs;
    CREATE POLICY "Admin full access to player_daily_logs" ON player_daily_logs FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 34. PLAYER_DAILY_TASKS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'player_daily_tasks' AND table_schema = 'public') THEN
    ALTER TABLE player_daily_tasks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to player_daily_tasks" ON player_daily_tasks;
    CREATE POLICY "Admin full access to player_daily_tasks" ON player_daily_tasks FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 35. DYNAMIC_PLAYERS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dynamic_players' AND table_schema = 'public') THEN
    ALTER TABLE dynamic_players ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to dynamic_players" ON dynamic_players;
    CREATE POLICY "Admin full access to dynamic_players" ON dynamic_players FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 36. DYNAMIC_DAILY_CONTEXT
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dynamic_daily_context' AND table_schema = 'public') THEN
    ALTER TABLE dynamic_daily_context ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to dynamic_daily_context" ON dynamic_daily_context;
    CREATE POLICY "Admin full access to dynamic_daily_context" ON dynamic_daily_context FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 37. DYNAMIC_DAILY_FOCUS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dynamic_daily_focus' AND table_schema = 'public') THEN
    ALTER TABLE dynamic_daily_focus ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to dynamic_daily_focus" ON dynamic_daily_focus;
    CREATE POLICY "Admin full access to dynamic_daily_focus" ON dynamic_daily_focus FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 38. DYNAMIC_DAILY_TASKS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dynamic_daily_tasks' AND table_schema = 'public') THEN
    ALTER TABLE dynamic_daily_tasks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to dynamic_daily_tasks" ON dynamic_daily_tasks;
    CREATE POLICY "Admin full access to dynamic_daily_tasks" ON dynamic_daily_tasks FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 39. DYNAMIC_DAILY_LOGS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dynamic_daily_logs' AND table_schema = 'public') THEN
    ALTER TABLE dynamic_daily_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to dynamic_daily_logs" ON dynamic_daily_logs;
    CREATE POLICY "Admin full access to dynamic_daily_logs" ON dynamic_daily_logs FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;

-- 40. GEAR_ORDERS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gear_orders' AND table_schema = 'public') THEN
    ALTER TABLE gear_orders ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin full access to gear_orders" ON gear_orders;
    CREATE POLICY "Admin full access to gear_orders" ON gear_orders FOR ALL TO authenticated
      USING (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com') WITH CHECK (auth.jwt() ->> 'email' = 'bbcodejc@gmail.com');
  END IF;
END $$;


-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================
-- The upload routes (/api/upload/*) use createRouteHandlerClient(request),
-- meaning the admin's authenticated session (anon key) is used. Storage
-- RLS applies to these operations.
--
-- Existing bucket creation is handled by other SQL files
-- (elite-storage-bucket.sql, elite-voice-notes-bucket.sql).
-- Here we ensure the admin user has proper access policies.
-- ============================================================================

-- Ensure the assessment-videos bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assessment-videos',
  'assessment-videos',
  true,
  104857600, -- 100MB
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska', 'video/3gpp', 'video/mpeg']
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- STORAGE: player-photos bucket
-- ============================================================================
-- Used in: /api/upload/player-photo (admin uploads player headshots)
-- The existing policies in elite-storage-bucket.sql allow all roles to
-- SELECT/INSERT/UPDATE/DELETE. If those were dropped and replaced with
-- more restrictive policies, the admin needs explicit authenticated access.

DROP POLICY IF EXISTS "Admin upload player photos" ON storage.objects;
CREATE POLICY "Admin upload player photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'player-photos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Admin update player photos" ON storage.objects;
CREATE POLICY "Admin update player photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'player-photos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
)
WITH CHECK (
  bucket_id = 'player-photos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Admin delete player photos" ON storage.objects;
CREATE POLICY "Admin delete player photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'player-photos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Public read player photos" ON storage.objects;
CREATE POLICY "Public read player photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'player-photos');


-- ============================================================================
-- STORAGE: assessment-videos bucket
-- ============================================================================
-- Used in: /api/upload/assessment-video (admin uploads coaching assessment videos)

DROP POLICY IF EXISTS "Admin upload assessment videos" ON storage.objects;
CREATE POLICY "Admin upload assessment videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assessment-videos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Admin update assessment videos" ON storage.objects;
CREATE POLICY "Admin update assessment videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'assessment-videos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
)
WITH CHECK (
  bucket_id = 'assessment-videos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Admin delete assessment videos" ON storage.objects;
CREATE POLICY "Admin delete assessment videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'assessment-videos'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Public read assessment videos" ON storage.objects;
CREATE POLICY "Public read assessment videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assessment-videos');


-- ============================================================================
-- STORAGE: voice-notes bucket
-- ============================================================================
-- Used in: /api/upload/voice-note (admin uploads voice notes for elite players)

DROP POLICY IF EXISTS "Admin upload voice notes" ON storage.objects;
CREATE POLICY "Admin upload voice notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-notes'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Admin update voice notes" ON storage.objects;
CREATE POLICY "Admin update voice notes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'voice-notes'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
)
WITH CHECK (
  bucket_id = 'voice-notes'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Admin delete voice notes" ON storage.objects;
CREATE POLICY "Admin delete voice notes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voice-notes'
  AND auth.jwt() ->> 'email' = 'bbcodejc@gmail.com'
);

DROP POLICY IF EXISTS "Public read voice notes" ON storage.objects;
CREATE POLICY "Public read voice notes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-notes');


-- ============================================================================
-- VERIFICATION QUERY (optional - run to check all policies are in place)
-- ============================================================================
-- Uncomment and run to verify:
--
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE policyname LIKE 'Admin%'
-- ORDER BY tablename;
--
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies
-- WHERE schemaname = 'storage'
-- ORDER BY tablename, policyname;
