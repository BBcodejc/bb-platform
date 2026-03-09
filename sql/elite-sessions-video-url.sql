-- ADD VIDEO + BEST TEST COLUMNS TO ELITE TRAINING SESSIONS
-- video_url = coach-uploaded exercise/drill videos
-- video_url_client = player-uploaded training footage
-- best_test_of_day = coach highlights the best test/drill result of the session
-- Run this in Supabase SQL Editor

ALTER TABLE elite_training_sessions
  ADD COLUMN IF NOT EXISTS video_url TEXT;

ALTER TABLE elite_training_sessions
  ADD COLUMN IF NOT EXISTS video_url_client TEXT;

ALTER TABLE elite_training_sessions
  ADD COLUMN IF NOT EXISTS best_test_of_day TEXT;
