-- =====================================================
-- ADD COACHING NOTES TO ELITE TRAINING SESSIONS
-- Separate from "notes" (Session Outline) — these are
-- coach observations with a visibility toggle
-- =====================================================
-- Run this in Supabase SQL Editor

ALTER TABLE elite_training_sessions
  ADD COLUMN IF NOT EXISTS coaching_notes TEXT,
  ADD COLUMN IF NOT EXISTS coaching_notes_visible BOOLEAN DEFAULT false;
