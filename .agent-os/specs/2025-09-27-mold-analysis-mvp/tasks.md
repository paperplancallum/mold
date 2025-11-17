# Spec Tasks - Mold Analysis MVP

## Tasks

- [ ] 1. Environment and dependencies setup
  - [ ] 1.1 Add OpenAI API key to `.env.local`
  - [ ] 1.2 Install dependencies: `openai`, `react-dropzone`
  - [ ] 1.3 Create Supabase Storage bucket `petri-dish-images`
  - [ ] 1.4 Set up storage policies for user access
  - [ ] 1.5 Create OpenAI client helper in `lib/openai.ts`
  - [ ] 1.6 Create storage helper functions in `lib/storage.ts`

- [ ] 2. API Route: Create Test (POST /api/tests)
  - [ ] 2.1 Create `/app/api/tests/route.ts` with POST handler
  - [ ] 2.2 Implement authentication check
  - [ ] 2.3 Validate input (location required, humidity 0-100)
  - [ ] 2.4 Insert test into database with status='pending'
  - [ ] 2.5 Return created test object
  - [ ] 2.6 Add error handling for validation and database errors

- [ ] 3. API Route: List Tests (GET /api/tests)
  - [ ] 3.1 Add GET handler to `/app/api/tests/route.ts`
  - [ ] 3.2 Query tests for authenticated user
  - [ ] 3.3 JOIN with analysis_results for severity
  - [ ] 3.4 JOIN with test_images for thumbnails
  - [ ] 3.5 Implement pagination (limit/offset)
  - [ ] 3.6 Return tests array sorted by created_at DESC

- [ ] 4. API Route: Get Single Test (GET /api/tests/[id])
  - [ ] 4.1 Create `/app/api/tests/[id]/route.ts` with GET handler
  - [ ] 4.2 Verify test belongs to authenticated user
  - [ ] 4.3 Query test with JOIN on images and analysis
  - [ ] 4.4 Return complete test object
  - [ ] 4.5 Handle 404 if test not found

- [ ] 5. API Route: Upload Image (POST /api/tests/[id]/upload)
  - [ ] 5.1 Create `/app/api/tests/[id]/upload/route.ts`
  - [ ] 5.2 Parse multipart/form-data file upload
  - [ ] 5.3 Validate image file (< 10MB, JPG/PNG/HEIC/WEBP)
  - [ ] 5.4 Upload to Supabase Storage with path `test-images/{user_id}/{test_id}/{filename}`
  - [ ] 5.5 Insert record into test_images table
  - [ ] 5.6 Return image metadata with public URL

- [ ] 6. API Route: Analyze Image (POST /api/tests/[id]/analyze)
  - [ ] 6.1 Create `/app/api/tests/[id]/analyze/route.ts`
  - [ ] 6.2 Verify test has uploaded image
  - [ ] 6.3 Update test status to 'analyzing'
  - [ ] 6.4 Call OpenAI GPT-4 Vision API with mold analysis prompt
  - [ ] 6.5 Parse OpenAI response JSON
  - [ ] 6.6 Insert analysis results into database
  - [ ] 6.7 Update test status to 'completed'
  - [ ] 6.8 Handle API errors (set status to 'failed', log error)
  - [ ] 6.9 Return analysis result

- [ ] 7. Create Test Form Page
  - [ ] 7.1 Create `/app/tests/new/page.tsx`
  - [ ] 7.2 Build form with fields: location, duration, temperature, humidity, notes
  - [ ] 7.3 Implement client-side validation
  - [ ] 7.4 Call POST /api/tests on submit
  - [ ] 7.5 Handle loading and error states
  - [ ] 7.6 Redirect to upload page on success

- [ ] 8. Image Upload Component
  - [ ] 8.1 Create `/components/ImageUpload.tsx` with react-dropzone
  - [ ] 8.2 Support drag & drop, file picker, and camera (mobile)
  - [ ] 8.3 Show image preview after selection
  - [ ] 8.4 Implement upload progress indicator
  - [ ] 8.5 Handle upload errors with user-friendly messages
  - [ ] 8.6 Add "Retake" button to replace image

- [ ] 9. Image Upload Page
  - [ ] 9.1 Create `/app/tests/[id]/upload/page.tsx`
  - [ ] 9.2 Fetch test details to show context
  - [ ] 9.3 Integrate ImageUpload component
  - [ ] 9.4 Call POST /api/tests/[id]/upload on file selection
  - [ ] 9.5 After successful upload, call POST /api/tests/[id]/analyze
  - [ ] 9.6 Redirect to analyzing page

- [ ] 10. Analysis Loading Page
  - [ ] 10.1 Create `/app/tests/[id]/analyzing/page.tsx`
  - [ ] 10.2 Show loading animation with "Analyzing..." message
  - [ ] 10.3 Poll test status every 3 seconds
  - [ ] 10.4 Redirect to results page when status='completed'
  - [ ] 10.5 Show error message if status='failed'
  - [ ] 10.6 Add estimated time remaining indicator

- [ ] 11. Results Display Page
  - [ ] 11.1 Create `/app/tests/[id]/page.tsx`
  - [ ] 11.2 Fetch test details from GET /api/tests/[id]
  - [ ] 11.3 Display test metadata (location, date, duration, temp, humidity)
  - [ ] 11.4 Show petri dish image (full size, zoomable)
  - [ ] 11.5 Display severity badge (color-coded)
  - [ ] 11.6 Show identified mold types with confidence percentages
  - [ ] 11.7 Display health implications section
  - [ ] 11.8 Display recommendations section
  - [ ] 11.9 Add "Back to Tests" button
  - [ ] 11.10 Handle loading and error states

- [ ] 12. Test History Page
  - [ ] 12.1 Create `/app/tests/page.tsx`
  - [ ] 12.2 Fetch tests from GET /api/tests
  - [ ] 12.3 Display tests as cards with thumbnail, location, date, status, severity
  - [ ] 12.4 Implement loading skeleton
  - [ ] 12.5 Show empty state if no tests
  - [ ] 12.6 Add click handler to navigate to test details
  - [ ] 12.7 Implement infinite scroll or pagination (optional)

- [ ] 13. Update Dashboard
  - [ ] 13.1 Update `/app/dashboard/page.tsx`
  - [ ] 13.2 Add prominent "New Test" button linking to /tests/new
  - [ ] 13.3 Show recent tests section (last 3-5 tests)
  - [ ] 13.4 Add "View All Tests" link to /tests

- [ ] 14. Reusable Components
  - [ ] 14.1 Create `/components/TestCard.tsx` for test list items
  - [ ] 14.2 Create `/components/SeverityBadge.tsx` with color-coded styling
  - [ ] 14.3 Create `/components/AnalysisLoader.tsx` with animation
  - [ ] 14.4 Create `/components/TestResults.tsx` for results display
  - [ ] 14.5 Ensure all components are mobile-responsive

- [ ] 15. Error Handling & Polish
  - [ ] 15.1 Add global error boundaries for pages
  - [ ] 15.2 Implement user-friendly error messages throughout
  - [ ] 15.3 Add loading states to all data fetching
  - [ ] 15.4 Test image upload with various file formats
  - [ ] 15.5 Test OpenAI API integration end-to-end
  - [ ] 15.6 Verify storage policies work correctly
  - [ ] 15.7 Test mobile camera capture on real device
  - [ ] 15.8 Ensure responsive design on all screen sizes

- [ ] 16. Testing & Validation
  - [ ] 16.1 Test complete flow: create test → upload → analyze → view results
  - [ ] 16.2 Test with different mold types and image qualities
  - [ ] 16.3 Test error scenarios (invalid images, API failures)
  - [ ] 16.4 Verify test history pagination works
  - [ ] 16.5 Test on mobile and desktop browsers
  - [ ] 16.6 Run build to check for TypeScript errors
  - [ ] 16.7 Verify OpenAI API costs are within expected range