# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-09-27-batch-lab-review/spec.md

## New API Endpoints

### POST /api/batches/submit

Submit current user's ready_for_review tests as a batch for lab review.

**Purpose:** Creates a new batch, assigns a lab technician, sets 48-hour completion time, and updates all ready_for_review tests to in_review status.

**Authentication:** Required (Supabase Auth)

**Request Body:** None (automatically includes all ready_for_review tests for authenticated user)

**Response:**
```typescript
{
  batch_id: string // UUID of created batch
  test_count: number // Number of tests in batch
  submitted_at: string // ISO timestamp
  estimated_completion_time: string // ISO timestamp (submitted_at + 48 hours)
  technician_name: string // Assigned lab technician name
}
```

**Status Codes:**
- `200 OK` - Batch created successfully
- `400 Bad Request` - No tests ready for review
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Database or server error

**Example:**
```bash
curl -X POST https://app.com/api/batches/submit \
  -H "Authorization: Bearer <token>"
```

**Business Logic:**
1. Get authenticated user
2. Query all tests where `user_id = current_user` AND `status = 'ready_for_review'`
3. If no tests found, return 400 error
4. Generate random lab technician name from pool
5. Create batch record with:
   - `submitted_at = NOW()`
   - `estimated_completion_time = NOW() + 48 hours`
   - `status = 'in_review'`
   - `technician_name = random_technician`
6. Update all ready_for_review tests:
   - `batch_id = new_batch.id`
   - `status = 'in_review'`
   - `submitted_at = new_batch.submitted_at`
   - `estimated_completion_time = new_batch.estimated_completion_time`
   - `reviewed_by_technician = new_batch.technician_name`
7. Return batch details

---

### GET /api/batches/current

Get current user's active batch information (in_review status).

**Purpose:** Retrieve batch details for display on dashboard and batch status page.

**Authentication:** Required

**Query Parameters:** None

**Response:**
```typescript
{
  batch: {
    id: string
    submitted_at: string
    estimated_completion_time: string
    status: 'in_review' | 'completed'
    technician_name: string
    test_count: number
    tests: Array<{
      id: string
      location: string
      status: string
      image_url: string | null
    }>
  } | null
}
```

**Status Codes:**
- `200 OK` - Success (batch may be null if no active batch)
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Database error

**Example:**
```bash
curl https://app.com/api/batches/current \
  -H "Authorization: Bearer <token>"
```

**Business Logic:**
1. Get authenticated user
2. Query batch where `user_id = current_user` AND `status = 'in_review'` ORDER BY `submitted_at` DESC LIMIT 1
3. If batch found, join with tests to get test details
4. Return batch with nested test array
5. If no batch found, return `{ batch: null }`

---

### GET /api/batches/[id]

Get detailed information about a specific batch.

**Purpose:** Display batch details on dedicated batch status page.

**Authentication:** Required (must own batch)

**Path Parameters:**
- `id` - Batch UUID

**Response:**
```typescript
{
  batch: {
    id: string
    submitted_at: string
    estimated_completion_time: string
    status: 'in_review' | 'completed' | 'failed'
    technician_name: string
    tests: Array<{
      id: string
      location: string
      status: string
      duration: string | null
      temperature: number | null
      humidity: number | null
      image: {
        public_url: string
      } | null
    }>
  }
}
```

**Status Codes:**
- `200 OK` - Batch found and returned
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Batch belongs to different user
- `404 Not Found` - Batch doesn't exist
- `500 Internal Server Error` - Database error

**Business Logic:**
1. Get authenticated user
2. Query batch by id with user_id check
3. If not found or wrong user, return appropriate error
4. Join with tests and test_images tables
5. Return full batch details

---

### GET /api/batches

Get user's batch history.

**Purpose:** Display list of past batches on test history page.

**Authentication:** Required

**Query Parameters:**
- `limit` (optional) - Max results (default: 10)
- `offset` (optional) - Pagination offset (default: 0)

**Response:**
```typescript
{
  batches: Array<{
    id: string
    submitted_at: string
    estimated_completion_time: string
    status: 'in_review' | 'completed' | 'failed'
    technician_name: string
    test_count: number
  }>
  total: number
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Database error

**Business Logic:**
1. Get authenticated user
2. Query batches where `user_id = current_user` ORDER BY `submitted_at` DESC
3. Count total batches for pagination
4. Return array of batches with test counts

---

## Modified API Endpoints

### POST /api/tests/[id]/upload

**Changes:** After successful image upload, set test status to `ready_for_review` instead of immediately triggering analysis.

**Old Behavior:**
```typescript
// After image upload
await supabase.from('tests').update({ status: 'analyzing' }).eq('id', testId)
// Immediately call analyze endpoint
```

**New Behavior:**
```typescript
// After image upload
await supabase.from('tests').update({ status: 'ready_for_review' }).eq('id', testId)
// Don't trigger analysis - wait for batch submission
```

**Response Changes:** None (still returns image details)

---

### POST /api/tests/[id]/analyze

**Changes:** This endpoint should only be called by the batch processing cron job, not directly by users after upload.

**New Authentication:** Add internal API key check or service role authentication

**Request Headers:**
```typescript
{
  'X-Internal-API-Key': process.env.INTERNAL_API_KEY
}
```

**Business Logic Changes:**
1. Verify internal API key (prevent direct user calls)
2. Check test is in `in_review` status with valid batch_id
3. Run existing AI analysis logic
4. Update test status to `completed` or `failed`
5. Check if all tests in batch are complete
6. If yes, update batch status to `completed`

---

## Background Processing

### Cron Job: Process Due Batches

**Endpoint:** Internal function (not HTTP endpoint)

**Schedule:** Every 5 minutes

**Implementation Location:** Supabase Edge Function or Next.js API route with cron trigger

**Logic:**
```typescript
async function processDueBatches() {
  // 1. Find batches ready for processing
  const batches = await supabase
    .from('batches')
    .select('id, test_ids:tests(id)')
    .eq('status', 'in_review')
    .lte('estimated_completion_time', new Date().toISOString())
    .limit(100)

  // 2. Process each batch
  for (const batch of batches) {
    // 3. Trigger analysis for all tests in batch
    const analysisPromises = batch.test_ids.map(test => 
      fetch(`/api/tests/${test.id}/analyze`, {
        method: 'POST',
        headers: { 'X-Internal-API-Key': process.env.INTERNAL_API_KEY }
      })
    )

    // 4. Wait for all analyses to complete
    await Promise.allSettled(analysisPromises)

    // 5. Check batch completion
    const { data: tests } = await supabase
      .from('tests')
      .select('status')
      .eq('batch_id', batch.id)

    const allComplete = tests.every(t => 
      t.status === 'completed' || t.status === 'failed'
    )

    // 6. Update batch status
    if (allComplete) {
      await supabase
        .from('batches')
        .update({ status: 'completed' })
        .eq('id', batch.id)
    }
  }
}
```

**Deployment:**
- Supabase: Use `pg_cron` extension or Edge Function with cron trigger
- Vercel: Use Vercel Cron Jobs (vercel.json config)

---

## Lab Technician Pool

Create utility module for technician name generation.

**File:** `lib/lab-technicians.ts`

```typescript
export const LAB_TECHNICIANS = [
  'Dr. Sarah Chen',
  'Dr. Michael Rodriguez',
  'Dr. Jennifer Park',
  'Dr. David Kim',
  'Emily Thompson, MS',
  'James Wilson, PhD',
  'Dr. Lisa Martinez',
  'Robert Anderson, MS',
  'Dr. Amanda Lewis',
  'Christopher Lee, PhD',
  'Dr. Maria Garcia',
  'Daniel Brown, MS'
]

export function getRandomTechnician(): string {
  return LAB_TECHNICIANS[Math.floor(Math.random() * LAB_TECHNICIANS.length)]
}
```

**Usage:**
```typescript
import { getRandomTechnician } from '@/lib/lab-technicians'

const technician = getRandomTechnician()
```

---

## Error Codes

Standardized error codes for batch operations:

| Code | Message | HTTP Status |
|------|---------|-------------|
| `NO_TESTS_READY` | No tests ready for review | 400 |
| `BATCH_NOT_FOUND` | Batch not found | 404 |
| `UNAUTHORIZED_BATCH` | You don't have access to this batch | 403 |
| `BATCH_ALREADY_SUBMITTED` | Tests already in a batch | 400 |
| `INTERNAL_ERROR` | Internal server error | 500 |

**Example Error Response:**
```json
{
  "error": "No tests ready for review",
  "code": "NO_TESTS_READY"
}
```

---

## Performance Requirements

- Batch submission: < 500ms
- Current batch query: < 200ms
- Batch detail query: < 300ms
- Cron job processing: Complete 100 batches within 5 minutes
- AI analysis per test: < 10 seconds
- Total batch processing: < 5 minutes for up to 20 tests per batch