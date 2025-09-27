# Technical Specification - Mold Analysis MVP

## Architecture Overview

```
User Flow:
Dashboard → New Test Form → Image Upload → Analysis → Results

API Routes:
POST /api/tests - Create test
POST /api/tests/[id]/upload - Upload image
POST /api/tests/[id]/analyze - Trigger analysis
GET /api/tests - List user tests
GET /api/tests/[id] - Get test details
```

## Environment Variables

Add to `.env.local`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=<your-openai-api-key>

# Supabase Storage Bucket
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=petri-dish-images
```

**Note:** Use the OpenAI API key provided separately (starts with `sk-proj-`).

## Dependencies

```json
{
  "openai": "^4.70.0",
  "react-dropzone": "^14.2.3"
}
```

## Database Schema (Already Created)

Tables exist from Phase 1 setup:
- `tests` - Test metadata
- `test_images` - Image storage references  
- `analysis_results` - AI analysis output

## Component Structure

```
app/
├── dashboard/
│   └── page.tsx (Updated: Add "New Test" button, show recent tests)
├── tests/
│   ├── page.tsx (Test history list view)
│   ├── new/
│   │   └── page.tsx (Test creation form)
│   ├── [id]/
│   │   ├── upload/
│   │   │   └── page.tsx (Image upload/capture)
│   │   ├── analyzing/
│   │   │   └── page.tsx (Analysis loading state)
│   │   └── page.tsx (Results display)
├── api/
│   └── tests/
│       ├── route.ts (POST create, GET list)
│       ├── [id]/
│       │   ├── route.ts (GET single test)
│       │   ├── upload/
│       │   │   └── route.ts (POST upload image)
│       │   └── analyze/
│       │       └── route.ts (POST trigger analysis)

components/
├── TestCard.tsx (Test history card)
├── ImageUpload.tsx (Upload/camera component)
├── AnalysisLoader.tsx (Loading animation)
├── TestResults.tsx (Results display)
└── SeverityBadge.tsx (Severity indicator)

lib/
├── openai.ts (OpenAI client setup)
└── storage.ts (Supabase storage helpers)
```

## API Route Specifications

### POST /api/tests

Create new test with metadata.

**Request:**
```typescript
{
  location: string;        // required, max 200 chars
  duration: '24h' | '48h' | '72h' | '96h' | '1-week';
  temperature?: number;    // optional, numeric
  humidity?: number;       // optional, 0-100
  notes?: string;          // optional, max 1000 chars
}
```

**Response:**
```typescript
{
  id: string;
  user_id: string;
  location: string;
  duration: string;
  temperature: number | null;
  humidity: number | null;
  notes: string | null;
  status: 'pending';
  created_at: string;
}
```

**Logic:**
1. Get authenticated user from session
2. Validate input (location required, humidity 0-100)
3. Insert into `tests` table with status='pending'
4. Return created test object

### POST /api/tests/[id]/upload

Upload petri dish image to Supabase Storage.

**Request:**
- Content-Type: multipart/form-data
- Body: FormData with 'image' field

**Response:**
```typescript
{
  image_id: string;
  storage_path: string;
  public_url: string;
}
```

**Logic:**
1. Verify test belongs to authenticated user
2. Validate image (< 10MB, JPG/PNG/HEIC/WEBP)
3. Compress/optimize image if needed
4. Upload to Storage: `test-images/{user_id}/{test_id}/{filename}`
5. Insert into `test_images` table
6. Return image metadata

### POST /api/tests/[id]/analyze

Trigger OpenAI GPT-4 Vision analysis.

**Request:** (No body)

**Response:**
```typescript
{
  analysis_id: string;
  status: 'analyzing' | 'completed' | 'failed';
}
```

**Logic:**
1. Verify test belongs to authenticated user
2. Get image public URL from `test_images`
3. Update test status to 'analyzing'
4. Call OpenAI GPT-4 Vision API with custom prompt
5. Parse response and extract:
   - mold_types (JSONB array)
   - confidence (0-100)
   - severity (low/moderate/high)
   - colony_count_estimate
   - growth_density
   - health_implications
   - recommendations
6. Insert into `analysis_results` table
7. Update test status to 'completed'
8. Return analysis result

**Error Handling:**
- If OpenAI API fails, update test status to 'failed'
- Log error for debugging
- Return error message to client

### GET /api/tests

List all tests for authenticated user.

**Query Params:**
- `status` (optional): filter by status
- `limit` (optional): pagination limit (default 20)
- `offset` (optional): pagination offset

**Response:**
```typescript
{
  tests: Array<{
    id: string;
    location: string;
    duration: string;
    status: string;
    severity?: string;  // if completed
    created_at: string;
    image_url?: string; // thumbnail
  }>;
  total: number;
}
```

**Logic:**
1. Get authenticated user
2. Query `tests` table with user_id filter
3. LEFT JOIN `analysis_results` for severity
4. LEFT JOIN `test_images` for thumbnail
5. Order by created_at DESC
6. Apply pagination
7. Return tests array with total count

### GET /api/tests/[id]

Get single test with full details.

**Response:**
```typescript
{
  test: {
    id: string;
    location: string;
    duration: string;
    temperature: number | null;
    humidity: number | null;
    notes: string | null;
    status: string;
    created_at: string;
    image: {
      id: string;
      storage_path: string;
      public_url: string;
      uploaded_at: string;
    } | null;
    analysis: {
      mold_types: Array<{type: string, confidence: number}>;
      confidence: number;
      severity: string;
      colony_count_estimate: string;
      growth_density: string;
      health_implications: string;
      recommendations: string;
      analyzed_at: string;
    } | null;
  };
}
```

**Logic:**
1. Verify test belongs to authenticated user
2. Query `tests` table
3. LEFT JOIN `test_images`
4. LEFT JOIN `analysis_results`
5. Return complete test object

## OpenAI GPT-4 Vision Prompt

```typescript
const prompt = `You are an expert mycologist analyzing a petri dish sample for mold growth. 

Analyze this petri dish image and provide a detailed assessment in the following JSON format:

{
  "mold_types": [
    {
      "type": "Scientific or common name of mold species",
      "confidence": 85 // confidence percentage (0-100)
    }
  ],
  "overall_confidence": 90, // Overall confidence in analysis (0-100)
  "severity": "moderate", // low, moderate, or high
  "colony_count": "moderate", // low, moderate, high, or extensive
  "growth_density": "moderate", // sparse, moderate, or dense
  "health_implications": "Detailed description of health risks...",
  "recommendations": "Specific actionable steps for remediation..."
}

Guidelines:
- Identify all visible mold species with confidence levels
- Assess severity based on colony size, density, and mold types present
- Consider health implications, especially for toxic molds like Stachybotrys (black mold)
- Provide clear, actionable recommendations
- If the image is unclear or doesn't show a petri dish, indicate this in the response
- Be conservative with severity assessments to avoid unnecessary alarm

Analyze the image now:`
```

## Image Upload Component

Use `react-dropzone` for unified upload/camera experience:

```tsx
// components/ImageUpload.tsx
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function ImageUpload({ onUpload }: { onUpload: (file: File) => Promise<void> }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
          await onUpload(file);
        } finally {
          setUploading(false);
        }
      }
    }
  });

  return (
    <div>
      {!preview ? (
        <div {...getRootProps()} className="border-2 border-dashed p-8 text-center">
          <input {...getInputProps()} capture="environment" />
          {isDragActive ? (
            <p>Drop image here...</p>
          ) : (
            <>
              <p>Drag & drop petri dish image</p>
              <p>or tap to {isMobile ? 'take photo' : 'choose file'}</p>
            </>
          )}
        </div>
      ) : (
        <div>
          <img src={preview} alt="Preview" />
          {uploading && <p>Uploading...</p>}
        </div>
      )}
    </div>
  );
}
```

## Storage Setup

Supabase Storage bucket configuration:

```sql
-- Create storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('petri-dish-images', 'petri-dish-images', true);

-- Storage policy: Users can upload to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'petri-dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policy: Users can read their own images
CREATE POLICY "Users can read own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'petri-dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Error Handling

**Test Creation Errors:**
- 400: Invalid input (missing location, invalid humidity)
- 401: Unauthenticated
- 500: Database error

**Image Upload Errors:**
- 400: File too large (> 10MB), unsupported format
- 401: Unauthenticated
- 404: Test not found or doesn't belong to user
- 500: Storage upload failure

**Analysis Errors:**
- 400: No image uploaded for test
- 401: Unauthenticated
- 404: Test not found
- 429: Rate limit exceeded (OpenAI API)
- 500: OpenAI API error, database error

All errors should return JSON:
```typescript
{
  error: string; // user-friendly message
  code: string;  // error code for debugging
}
```

## Performance Optimizations

1. **Image Compression:** Use browser-side compression before upload
2. **Lazy Loading:** Test history loads incrementally with pagination
3. **Optimistic UI:** Show upload progress immediately
4. **Caching:** Cache analysis results in client state
5. **Retries:** Implement exponential backoff for OpenAI API failures

## Security Considerations

1. **Authentication:** All API routes verify user session
2. **Authorization:** Users can only access their own tests
3. **Input Validation:** Server-side validation for all inputs
4. **Rate Limiting:** Limit analysis requests per user (future)
5. **API Key Security:** OpenAI key stored server-side only
6. **Storage Isolation:** Users can only access images in their folder