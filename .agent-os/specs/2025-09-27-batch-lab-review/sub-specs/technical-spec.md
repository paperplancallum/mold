# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-27-batch-lab-review/spec.md

> Created: 2025-09-27
> Version: 1.0.0

## Technical Requirements

### Status Flow Changes
- **Current flow:** `pending` → `analyzing` → `completed`/`failed`
- **New flow:** `pending` → `ready_for_review` → `in_review` → `completed`/`failed`
- **Status definitions:**
  - `pending`: Test created, no image uploaded yet
  - `ready_for_review`: Image uploaded, waiting for user to submit batch
  - `in_review`: Batch submitted, waiting for 48-hour delay
  - `completed`: AI analysis finished, results available

### Batch Submission Logic
- User can have multiple tests in `ready_for_review` status simultaneously
- "Submit Batch" button appears on dashboard when 1+ tests are `ready_for_review`
- Clicking submit creates new batch record and updates all `ready_for_review` tests to `in_review`
- Sets `submitted_at` timestamp and calculates `estimated_completion_time` as submitted_at + 48 hours
- Assigns random lab technician name from predefined pool

### Lab Technician Assignment
- Create pool of 8-12 realistic lab technician names with credentials (Dr., PhD, MS)
- Examples: "Dr. Sarah Chen", "Michael Rodriguez, MS", "Dr. Jennifer Park", "David Kim, PhD"
- Randomly assign one technician to entire batch
- Store technician name in both batch record and individual test records for easy access

### Batch Processing Trigger
- Background cron job runs every 5 minutes checking for batches where `estimated_completion_time` <= current time
- For each ready batch:
  1. Trigger AI analysis for all tests in batch (existing OpenAI GPT-4 Vision logic)
  2. Wait for all analyses to complete
  3. Update batch status to `completed`
  4. Update all test statuses to `completed`

### UI/UX Requirements

**Dashboard Changes:**
- Show card: "X samples ready for lab review" when tests in `ready_for_review` status exist
- Button: "Submit Batch for Review" (or "Submit for Review" if single test)
- After submission, show: "Lab Review In Progress - View Status"

**Batch Status Page (`/batches/[id]`):**
- Header: "Your Batch is Being Reviewed"
- Technician info: Avatar (initials), name with credentials
- List all tests in batch with locations
- Countdown timer: "Results expected in X hours Y minutes"
- Progress indicator showing review stage

**Test Upload Page:**
- After image upload, show: "Sample ready for review"
- Don't immediately navigate away
- Show button: "Add another sample" or "Submit for review"

**Results Page Changes:**
- Add section: "Reviewed by: [Technician Name]"
- Include credential badge/icon next to technician name
- Professional lab report styling

### Copy Changes Throughout App
Replace all instances:
- "AI analysis" → "Lab review" or "Expert analysis"  
- "Our AI is examining" → "Our lab technician is reviewing"
- "Analysis complete" → "Review complete"
- "Analyzing" → "In review"
- Remove any mentions of GPT-4, OpenAI, or artificial intelligence

### Performance Considerations
- Batch processing should handle up to 20 tests per batch without timeout
- AI analysis for batch should complete within 5 minutes total
- If individual test fails, mark as failed but don't block other tests in batch
- Cron job should process multiple batches in parallel if needed

### Error Handling
- If AI analysis fails for test in batch after 3 retries, mark test as `failed`
- Allow user to resubmit failed tests in new batch
- If entire batch fails, notify user and allow resubmission
- Graceful degradation if technician pool is unavailable (fallback to "Lab Technician")

## External Dependencies

No new external dependencies required. Feature uses existing:
- Supabase for database and cron jobs (built-in)
- OpenAI API (already integrated)
- Next.js App Router and React (already in use)