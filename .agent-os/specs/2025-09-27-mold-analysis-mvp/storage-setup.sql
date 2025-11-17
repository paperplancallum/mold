-- Create Supabase Storage bucket for petri dish images
-- Run this in Supabase SQL Editor

-- Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('petri-dish-images', 'petri-dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow users to upload to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'petri-dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own images
CREATE POLICY "Users can read own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'petri-dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own images  
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'petri-dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);