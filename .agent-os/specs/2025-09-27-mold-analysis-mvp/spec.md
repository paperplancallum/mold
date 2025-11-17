# Mold Analysis MVP - Core Features

**Created:** 2025-09-27  
**Status:** Draft  
**Dependencies:** Phase 1 (User Authentication) complete

## Overview

Implement the core mold analysis functionality that allows users to create tests, upload petri dish images, receive AI-powered mold identification, and view detailed results. This spec covers the complete user journey from test creation through analysis results display.

## User Stories

### Test Creation

**As a homeowner**, I want to create a new mold test with details about where and when I conducted it, so that I can track multiple tests across different rooms and time periods.

**Acceptance Criteria:**
- User can access "New Test" button from dashboard
- Form collects: location (required), duration (dropdown: 24h/48h/72h/96h/1-week), temperature (optional, numeric), humidity (optional, 0-100%), notes (optional, textarea)
- Form validates all inputs client-side before submission
- Test is created with "pending" status and unique ID
- User is redirected to image upload step after successful creation

### Image Capture (Mobile)

**As a mobile user**, I want to capture a photo of my petri dish using my phone's camera, so that I can quickly submit my test without extra steps.

**Acceptance Criteria:**
- Mobile devices show "Take Photo" button that opens native camera
- Visual guide overlay (circular outline) helps user position petri dish correctly
- User can retake photo if unsatisfied
- Image is validated (file size < 10MB, formats: JPG/PNG/HEIC)
- Loading indicator shows during upload
- Image is stored in Supabase Storage with path: `test-images/{user_id}/{test_id}/{filename}`

### Image Upload (Desktop)

**As a desktop user**, I want to upload a photo from my computer, so that I can submit tests captured with a digital camera or previously taken on my phone.

**Acceptance Criteria:**
- Desktop shows "Upload Photo" file picker
- Accepted formats: JPG, PNG, HEIC, WEBP
- File size limit: 10MB max
- Image preview shows before submission
- Can replace image before final submit
- Same storage path structure as mobile

### AI Analysis

**As a user**, I want my petri dish image analyzed by AI to identify mold types, so that I receive expert-level insights without waiting for a lab.

**Acceptance Criteria:**
- Analysis starts immediately after image upload
- Test status updates to "analyzing"
- Loading screen shows progress indicator (estimated 30-60 seconds)
- OpenAI GPT-4 Vision API analyzes image and returns:
  - Mold types identified (array with confidence percentages)
  - Overall confidence score
  - Severity level (low/moderate/high)
  - Colony count estimate (low/moderate/high/extensive)
  - Growth density (sparse/moderate/dense)
  - Health implications description
  - Remediation recommendations
- Results are stored in `analysis_results` table
- Test status updates to "completed"
- User is redirected to results page

### Results Display

**As a user**, I want to see clear, actionable analysis results, so that I understand what mold was found and what I should do about it.

**Acceptance Criteria:**
- Results page shows:
  - Test metadata (location, date, duration, temp, humidity)
  - Petri dish image (full size, zoomable)
  - Severity badge (color-coded: green/yellow/red)
  - Overall confidence percentage
  - List of identified mold types with individual confidence scores
  - Health implications section
  - Recommendations section with actionable steps
- Page is mobile-responsive
- User can share results via button (future: email/download)
- User can navigate back to test history

### Test History

**As a user**, I want to view all my previous tests in chronological order, so that I can track mold issues across different locations and time periods.

**Acceptance Criteria:**
- Dashboard shows "Test History" section or dedicated `/tests` page
- Tests displayed as cards with:
  - Location name
  - Date tested
  - Status badge (pending/analyzing/completed/failed)
  - Severity level (if completed)
  - Thumbnail of petri dish image
- Tests sorted by created_at descending (newest first)
- Clicking a test card navigates to results detail page
- Empty state shown when no tests exist
- Loading skeleton shown while fetching

## Success Metrics

- **Test Creation Rate**: 80% of authenticated users create at least 1 test within 7 days
- **Analysis Success Rate**: 95% of uploaded images successfully analyze without errors
- **Analysis Speed**: 90% of analyses complete in under 60 seconds
- **User Satisfaction**: Results page has clear, actionable information (measured by user feedback)

## Out of Scope

- Test comparison view (side-by-side)
- Editing test metadata after creation
- Multiple images per test
- Results export/sharing (email, PDF, download)
- Remediation service marketplace
- Social features (sharing to community)

## Technical Considerations

- OpenAI GPT-4 Vision API costs ~$0.01-0.03 per image analysis
- Supabase Storage costs for image hosting
- Image compression before upload to reduce storage/bandwidth
- Retry logic for failed OpenAI API calls
- Rate limiting to prevent API abuse
- Error handling for unsupported image types or corrupt files