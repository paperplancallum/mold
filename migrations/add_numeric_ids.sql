-- Add auto-incrementing numeric ID columns to tests and batches tables

-- Add display_id column to tests table
ALTER TABLE tests ADD COLUMN display_id SERIAL UNIQUE;

-- Add display_id column to batches table  
ALTER TABLE batches ADD COLUMN display_id SERIAL UNIQUE;

-- Create indexes for faster lookups
CREATE INDEX idx_tests_display_id ON tests(display_id);
CREATE INDEX idx_batches_display_id ON batches(display_id);

-- Backfill existing records with sequential IDs
-- Tests will get IDs 1, 2, 3, etc. based on creation order
WITH numbered_tests AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM tests
)
UPDATE tests 
SET display_id = numbered_tests.row_num
FROM numbered_tests
WHERE tests.id = numbered_tests.id;

-- Batches will get IDs 1, 2, 3, etc. based on submission order
WITH numbered_batches AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY submitted_at) as row_num
  FROM batches
)
UPDATE batches
SET display_id = numbered_batches.row_num
FROM numbered_batches
WHERE batches.id = numbered_batches.id;

-- Reset the sequences to continue from the highest existing ID
SELECT setval('tests_display_id_seq', (SELECT COALESCE(MAX(display_id), 0) FROM tests) + 1, false);
SELECT setval('batches_display_id_seq', (SELECT COALESCE(MAX(display_id), 0) FROM batches) + 1, false);