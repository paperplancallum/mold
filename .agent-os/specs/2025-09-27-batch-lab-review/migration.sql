-- Migration: Batch Lab Review System
-- Date: 2025-09-27
-- Description: Add batch processing tables and columns for 48-hour lab review system

-- =====================================================
-- STEP 1: Create batches table
-- =====================================================

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_completion_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_review' CHECK (status IN ('in_review', 'completed', 'failed')),
  technician_name TEXT NOT NULL,
  
  CONSTRAINT valid_completion_time CHECK (estimated_completion_time > submitted_at)
);

-- Create indexes for batches table
CREATE INDEX IF NOT EXISTS idx_batches_user_id ON batches(user_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_completion_time ON batches(estimated_completion_time) WHERE status = 'in_review';

-- Enable Row Level Security (RLS) on batches table
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own batches
CREATE POLICY "Users can view their own batches" ON batches
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can only create their own batches
CREATE POLICY "Users can create their own batches" ON batches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only update their own batches
CREATE POLICY "Users can update their own batches" ON batches
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- STEP 2: Add batch-related columns to tests table
-- =====================================================

ALTER TABLE tests 
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by_technician TEXT;

-- Create indexes for new test columns
CREATE INDEX IF NOT EXISTS idx_tests_batch_id ON tests(batch_id);
CREATE INDEX IF NOT EXISTS idx_tests_status_batch ON tests(status) WHERE batch_id IS NOT NULL;

-- =====================================================
-- STEP 3: Update status constraint to include new statuses
-- =====================================================

-- Drop existing constraint
ALTER TABLE tests DROP CONSTRAINT IF EXISTS tests_status_check;

-- Add updated constraint with new statuses
ALTER TABLE tests ADD CONSTRAINT tests_status_check 
CHECK (status IN ('pending', 'ready_for_review', 'in_review', 'analyzing', 'completed', 'failed'));

-- =====================================================
-- STEP 4: Migrate existing data
-- =====================================================

-- Update any tests currently in 'analyzing' status without results to 'ready_for_review'
-- This handles tests that were mid-analysis when migration runs
UPDATE tests 
SET status = 'ready_for_review' 
WHERE status = 'analyzing' 
  AND id NOT IN (SELECT test_id FROM analysis_results);

-- =====================================================
-- STEP 5: Add helpful comments to schema
-- =====================================================

COMMENT ON TABLE batches IS 'Groups multiple test submissions together for batch processing with 48-hour lab review simulation';
COMMENT ON COLUMN batches.submitted_at IS 'Timestamp when user clicked Submit Batch button';
COMMENT ON COLUMN batches.estimated_completion_time IS 'When results will be ready (submitted_at + 48 hours)';
COMMENT ON COLUMN batches.technician_name IS 'Randomly assigned lab technician name for personalization';

COMMENT ON COLUMN tests.batch_id IS 'Links test to batch for grouped submission (nullable for backward compatibility)';
COMMENT ON COLUMN tests.submitted_at IS 'Denormalized from batch for easy access';
COMMENT ON COLUMN tests.estimated_completion_time IS 'Denormalized from batch for countdown display';
COMMENT ON COLUMN tests.reviewed_by_technician IS 'Denormalized lab technician name for results page';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these queries to verify migration success:

-- 1. Verify batches table exists with correct columns
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'batches' 
-- ORDER BY ordinal_position;

-- 2. Verify tests table has new columns
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'tests' 
--   AND column_name IN ('batch_id', 'submitted_at', 'estimated_completion_time', 'reviewed_by_technician');

-- 3. Verify indexes were created
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename IN ('batches', 'tests') 
--   AND indexname LIKE '%batch%'
-- ORDER BY indexname;

-- 4. Verify RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'batches';

-- 5. Check status constraint on tests
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conname = 'tests_status_check';