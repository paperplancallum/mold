# Mold Analysis MVP - Quick Reference

**Goal:** Implement core mold analysis functionality (test creation, image upload, AI analysis, results display)

## Key Features

1. **Test Creation** - Form to capture test metadata
2. **Image Upload** - Mobile camera + desktop file upload  
3. **AI Analysis** - OpenAI GPT-4 Vision mold identification
4. **Results Display** - Show analysis with recommendations
5. **Test History** - List all past tests

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, react-dropzone
- **Backend:** Next.js API routes
- **Storage:** Supabase Storage (`petri-dish-images` bucket)
- **AI:** OpenAI GPT-4 Vision API
- **Database:** Existing tables (tests, test_images, analysis_results)

## User Flow

```
Dashboard 
  → New Test Form (location, duration, temp, humidity, notes)
    → Upload Image (camera or file picker)
      → Analysis Loading (30-60 seconds)
        → Results Page (mold types, severity, recommendations)
          ← Back to Test History
```

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | /api/tests | Create test |
| GET | /api/tests | List tests |
| GET | /api/tests/[id] | Get test details |
| POST | /api/tests/[id]/upload | Upload image |
| POST | /api/tests/[id]/analyze | Trigger analysis |

## Key Components

- `ImageUpload.tsx` - Drag & drop + camera
- `TestCard.tsx` - Test list item
- `SeverityBadge.tsx` - Color-coded severity indicator
- `AnalysisLoader.tsx` - Loading animation
- `TestResults.tsx` - Results display

## Storage Structure

```
petri-dish-images/
  └── {user_id}/
      └── {test_id}/
          └── {filename}.jpg
```

## OpenAI Integration

- Model: GPT-4 Vision
- Cost: ~$0.01-0.03 per analysis
- Response: JSON with mold types, severity, health implications, recommendations

## Success Criteria

- ✅ Test creation rate: 80% of users create test within 7 days
- ✅ Analysis success rate: 95% of images analyze without errors
- ✅ Analysis speed: 90% complete in < 60 seconds

## Total Tasks: 16 major tasks (~70 subtasks)

See `tasks.md` for complete breakdown.