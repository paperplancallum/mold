# Spec Tasks

## Tasks

- [ ] 1. Database Schema Migration
  - [ ] 1.1 Create migration SQL file for batches table and tests table modifications
  - [ ] 1.2 Run migration in Supabase SQL Editor
  - [ ] 1.3 Verify schema changes with test queries
  - [ ] 1.4 Create database types file (TypeScript types from Supabase schema)

- [ ] 2. Lab Technician Utility Module
  - [ ] 2.1 Create `lib/lab-technicians.ts` with technician name pool
  - [ ] 2.2 Implement `getRandomTechnician()` function
  - [ ] 2.3 Write unit tests for random selection logic
  - [ ] 2.4 Verify tests pass

- [ ] 3. Batch Submission API Endpoint
  - [ ] 3.1 Write tests for POST /api/batches/submit endpoint
  - [ ] 3.2 Create `app/api/batches/submit/route.ts`
  - [ ] 3.3 Implement authentication check
  - [ ] 3.4 Query ready_for_review tests for current user
  - [ ] 3.5 Create batch record with random technician
  - [ ] 3.6 Update all tests to in_review status with batch_id
  - [ ] 3.7 Return batch details JSON response
  - [ ] 3.8 Add error handling for edge cases
  - [ ] 3.9 Verify all tests pass

- [ ] 4. Batch Query API Endpoints
  - [ ] 4.1 Write tests for GET /api/batches/current
  - [ ] 4.2 Create `app/api/batches/current/route.ts`
  - [ ] 4.3 Implement query for active in_review batch
  - [ ] 4.4 Write tests for GET /api/batches/[id]
  - [ ] 4.5 Create `app/api/batches/[id]/route.ts`
  - [ ] 4.6 Implement batch detail query with authorization check
  - [ ] 4.7 Write tests for GET /api/batches (history)
  - [ ] 4.8 Create `app/api/batches/route.ts` for batch list
  - [ ] 4.9 Verify all tests pass

- [ ] 5. Modify Upload Endpoint
  - [ ] 5.1 Write tests for updated upload behavior
  - [ ] 5.2 Update `app/api/tests/[id]/upload/route.ts`
  - [ ] 5.3 Change status update from 'analyzing' to 'ready_for_review'
  - [ ] 5.4 Remove automatic analysis trigger
  - [ ] 5.5 Verify tests pass

- [ ] 6. Secure Analysis Endpoint
  - [ ] 6.1 Write tests for internal API key authentication
  - [ ] 6.2 Update `app/api/tests/[id]/analyze/route.ts`
  - [ ] 6.3 Add internal API key check middleware
  - [ ] 6.4 Add batch completion check logic
  - [ ] 6.5 Update batch status when all tests complete
  - [ ] 6.6 Verify tests pass

- [ ] 7. Batch Processing Cron Job
  - [ ] 7.1 Write tests for batch processing logic
  - [ ] 7.2 Create `app/api/cron/process-batches/route.ts`
  - [ ] 7.3 Implement query for due batches (estimated_completion_time <= now)
  - [ ] 7.4 Loop through batches and trigger analysis for each test
  - [ ] 7.5 Handle Promise.allSettled for parallel processing
  - [ ] 7.6 Update batch status to completed after all tests finish
  - [ ] 7.7 Add error handling and logging
  - [ ] 7.8 Configure Vercel Cron in vercel.json
  - [ ] 7.9 Verify cron job works in production

- [ ] 8. Dashboard Batch Submission UI
  - [ ] 8.1 Write tests for dashboard batch card component
  - [ ] 8.2 Update `app/dashboard/page.tsx`
  - [ ] 8.3 Add query for count of ready_for_review tests
  - [ ] 8.4 Create batch submission card component
  - [ ] 8.5 Show "X samples ready for review" message
  - [ ] 8.6 Add "Submit Batch for Review" button
  - [ ] 8.7 Handle button click to call POST /api/batches/submit
  - [ ] 8.8 Show success message and navigate to batch status page
  - [ ] 8.9 Verify tests pass

- [ ] 9. Batch Status Page
  - [ ] 9.1 Write tests for batch status page component
  - [ ] 9.2 Create `app/batches/[id]/page.tsx`
  - [ ] 9.3 Fetch batch details from GET /api/batches/[id]
  - [ ] 9.4 Display technician name with avatar (initials)
  - [ ] 9.5 Show countdown timer to estimated_completion_time
  - [ ] 9.6 List all tests in batch with locations and thumbnails
  - [ ] 9.7 Add progress indicator showing review stages
  - [ ] 9.8 Poll for status updates every 30 seconds
  - [ ] 9.9 Redirect to results when batch completes
  - [ ] 9.10 Verify tests pass

- [ ] 10. Update Upload Flow UI
  - [ ] 10.1 Write tests for updated upload page behavior
  - [ ] 10.2 Update `app/tests/[id]/upload/page.tsx`
  - [ ] 10.3 After upload success, show "Sample ready for review" message
  - [ ] 10.4 Add buttons: "Add Another Sample" and "Submit for Review"
  - [ ] 10.5 "Add Another Sample" navigates to /tests/new
  - [ ] 10.6 "Submit for Review" navigates to dashboard
  - [ ] 10.7 Update copy from AI language to lab language
  - [ ] 10.8 Verify tests pass

- [ ] 11. Update Results Page with Technician Signature
  - [ ] 11.1 Write tests for technician signature component
  - [ ] 11.2 Update `app/tests/[id]/page.tsx`
  - [ ] 11.3 Add "Reviewed by" section with technician name
  - [ ] 11.4 Display credential badge next to technician name
  - [ ] 11.5 Style as professional lab report format
  - [ ] 11.6 Update all copy from AI to lab language
  - [ ] 11.7 Verify tests pass

- [ ] 12. Copy Transformation Throughout App
  - [ ] 12.1 Audit all pages for AI language
  - [ ] 12.2 Update dashboard page copy
  - [ ] 12.3 Update test history page copy
  - [ ] 12.4 Update analyzing page copy (or remove if using batch status page)
  - [ ] 12.5 Update onboarding tutorial copy
  - [ ] 12.6 Update all button labels and CTAs
  - [ ] 12.7 Update error messages
  - [ ] 12.8 Search codebase for "AI", "GPT", "OpenAI" and replace

- [ ] 13. Navigation and Routing Updates
  - [ ] 13.1 Update dashboard to link to batch status page instead of analyzing page
  - [ ] 13.2 Add /batches/[id] route handling
  - [ ] 13.3 Update test history to show batch groupings
  - [ ] 13.4 Add breadcrumb navigation for batch pages
  - [ ] 13.5 Update redirect logic after upload

- [ ] 14. Environment Variables and Configuration
  - [ ] 14.1 Add INTERNAL_API_KEY to .env.local
  - [ ] 14.2 Add INTERNAL_API_KEY to Vercel environment variables
  - [ ] 14.3 Configure Vercel Cron schedule in vercel.json
  - [ ] 14.4 Document environment setup in README

- [ ] 15. End-to-End Testing and Verification
  - [ ] 15.1 Test complete flow: create test → upload → submit batch → wait → view results
  - [ ] 15.2 Test single test batch submission
  - [ ] 15.3 Test multi-test batch submission
  - [ ] 15.4 Test countdown timer accuracy
  - [ ] 15.5 Test cron job execution in staging
  - [ ] 15.6 Test error handling for failed analyses
  - [ ] 15.7 Verify all copy changes are consistent
  - [ ] 15.8 Test mobile responsiveness for all new pages