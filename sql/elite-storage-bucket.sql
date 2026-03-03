-- Create storage bucket for player photos
-- Run this in Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'player-photos',
  'player-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for player photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'player-photos');

-- Allow service role to upload
CREATE POLICY "Service role upload for player photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'player-photos');

-- Allow service role to update (upsert)
CREATE POLICY "Service role update for player photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'player-photos');

-- Allow service role to delete
CREATE POLICY "Service role delete for player photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'player-photos');
