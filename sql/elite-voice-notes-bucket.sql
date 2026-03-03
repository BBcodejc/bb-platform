-- Create storage bucket for voice note audio files
-- Run this in Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voice-notes',
  'voice-notes',
  true,
  26214400, -- 25MB
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access (so player dashboard can play audio)
CREATE POLICY "Public read access for voice notes"
ON storage.objects FOR SELECT
USING (bucket_id = 'voice-notes');

-- Allow service role to upload
CREATE POLICY "Service role upload for voice notes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'voice-notes');

-- Allow service role to update (upsert)
CREATE POLICY "Service role update for voice notes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'voice-notes');

-- Allow service role to delete
CREATE POLICY "Service role delete for voice notes"
ON storage.objects FOR DELETE
USING (bucket_id = 'voice-notes');
