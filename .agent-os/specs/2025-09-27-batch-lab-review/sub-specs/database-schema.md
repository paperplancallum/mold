# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-09-27-batch-lab-review/spec.md

## New Tables

### batches

Stores batch submission information and groups multiple tests together.

```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_completion_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_review' CHECK (status IN ('in_review', 'completed', 'failed')),
  technician_name TEXT NOT NULL,
  
  CONSTRAINT valid_completion_time CHECK (estimated_completion_time > submitted_at)
);

CREATE INDEX idx_batches_user_id ON batches(user_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_completion_time ON batches(estimated_completion_time) WHERE status = 'in_review';
```

**Rationale:**
- `id`: Unique identifier for each batch
- `user_id`: Links batch to user who submitted it
- `submitted_at`: Exact timestamp when user clicked "Submit Batch"
- `estimated_completion_time`: When results will be ready (submitted_at + 48 hours)
- `status`: Tracks batch progress through review process
- `technician_name`: Randomly assigned lab technician for personalization
- Index on `estimated_completion_time` for efficient cron job queries

## Modified Tables

### tests

Add columns to support batch grouping and lab technician attribution.

```sql
ALTER TABLE tests 
ADD COLUMN batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN estimated_completion_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN reviewed_by_technician TEXT;

CREATE INDEX idx_tests_batch_id ON tests(batch_id);
CREATE INDEX idx_tests_status_batch ON tests(status) WHERE batch_id IS NOT NULL;
```

**New Columns:**
- `batch_id`: Foreign key linking test to its batch (nullable for backward compatibility)
- `submitted_at`: Denormalized for easy access without joining batches table
- `estimated_completion_time`: Denormalized for countdown display
- `reviewed_by_technician`: Denormalized technician name for results page

**Rationale:**
- Denormalization improves query performance for individual test pages
- Nullable `batch_id` allows tests to exist without batches (transition period)
- Index on `batch_id` enables fast batch detail queries

## Status Enum Update

Update the tests table status constraint to include new statuses.

```sql
ALTER TABLE tests DROP CONSTRAINT IF EXISTS tests_status_check;

ALTER TABLE tests ADD CONSTRAINT tests_status_check 
CHECK (status IN ('pending', 'ready_for_review', 'in_review', 'analyzing', 'completed', 'failed'));
```

**New Statuses:**
- `ready_for_review`: Image uploaded, waiting for batch submission
- `in_review`: Batch submitted, waiting for 48-hour delay
- Keep `analyzing` for backward compatibility during transition

**Status Flow:**
1. Test created → `pending`
2. Image uploaded → `ready_for_review`
3. Batch submitted → `in_review`
4. 48 hours elapsed, AI starts → `analyzing` (brief transition state)
5. AI completes → `completed` or `failed`

## Migration Script

Complete migration script to apply all schema changes:

```sql
-- Create batches table
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_completion_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_review' CHECK (status IN ('in_review', 'completed', 'failed')),
  technician_name TEXT NOT NULL,
  
  CONSTRAINT valid_completion_time CHECK (estimated_completion_time > submitted_at)
);

CREATE INDEX idx_batches_user_id ON batches(user_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_completion_time ON batches(estimated_completion_time) WHERE status = 'in_review';

-- Add batch-related columns to tests
ALTER TABLE tests 
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by_technician TEXT;

CREATE INDEX IF NOT EXISTS idx_tests_batch_id ON tests(batch_id);
CREATE INDEX IF NOT EXISTS idx_tests_status_batch ON tests(status) WHERE batch_id IS NOT NULL;

-- Update status constraint to include new statuses
ALTER TABLE tests DROP CONSTRAINT IF EXISTS tests_status_check;
ALTER TABLE tests ADD CONSTRAINT tests_status_check 
CHECK (status IN ('pending', 'ready_for_review', 'in_review', 'analyzing', 'completed', 'failed'));

-- Migrate existing tests: change 'analyzing' to 'ready_for_review' if no results yet
UPDATE tests 
SET status = 'ready_for_review' 
WHERE status = 'analyzing' 
  AND id NOT IN (SELECT test_id FROM analysis_results);
```

## Data Integrity Rules

### Batch-Test Relationship
- Tests in same batch must have same `user_id` as batch
- Tests in same batch must have same `submitted_at` and `estimated_completion_time`
- Batch cannot be deleted while tests reference it (handled by ON DELETE SET NULL)

### Status Consistency
- If batch status is `completed`, all tests in batch should be `completed` or `failed`
- Tests with `batch_id` cannot have status `pending` (must be at least `ready_for_review`)
- Tests with status `in_review` must have `batch_id`, `submitted_at`, and `estimated_completion_time`

### Application-Level Enforcement
These rules will be enforced in application code rather than database constraints for flexibility:

```typescript
// When creating batch
batch.status = 'in_review'
batch.submitted_at = new Date()
batch.estimated_completion_time = new Date(Date.now() + 48 * 60 * 60 * 1000)

// When updating tests
tests.forEach(test => {
  test.batch_id = batch.id
  test.status = 'in_review'
  test.submitted_at = batch.submitted_at
  test.estimated_completion_time = batch.estimated_completion_time
  test.reviewed_by_technician = batch.technician_name
})
```

## Performance Considerations

### Cron Job Query Optimization
The cron job needs to efficiently find batches ready for processing:

```sql
-- Optimized query for cron job
SELECT b.id, b.user_id, array_agg(t.id) as test_ids
FROM batches b
JOIN tests t ON t.batch_id = b.id
WHERE b.status = 'in_review'
  AND b.estimated_completion_time <= NOW()
GROUP BY b.id
LIMIT 100;
```

This query uses:
- Index on `batches.status` for filtering
- Index on `batches.estimated_completion_time` for time comparison
- Index on `tests.batch_id` for join performance

### Dashboard Query Optimization
Dashboard needs to count tests ready for review:

```sql
-- Count tests ready for batch submission
SELECT COUNT(*) 
FROM tests 
WHERE user_id = $1 
  AND status = 'ready_for_review';
```

Uses existing index on `tests.user_id` and new index on `tests.status`.

## Rollback Plan

If needed, rollback migration:

```sql
-- Remove new columns from tests
ALTER TABLE tests 
DROP COLUMN IF EXISTS batch_id,
DROP COLUMN IF EXISTS submitted_at,
DROP COLUMN IF EXISTS estimated_completion_time,
DROP COLUMN IF EXISTS reviewed_by_technician;

-- Drop batches table
DROP TABLE IF EXISTS batches CASCADE;

-- Restore original status constraint
ALTER TABLE tests DROP CONSTRAINT IF EXISTS tests_status_check;
ALTER TABLE tests ADD CONSTRAINT tests_status_check 
CHECK (status IN ('pending', 'analyzing', 'completed', 'failed'));
```