# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-09-27-supabase-project-setup/spec.md

## Schema Overview

The MoldScope database consists of four core tables that support user authentication, test submissions, image storage references, and AI analysis results. Supabase Auth automatically manages the `auth.users` table; we extend it with a custom `public.users` table for additional profile data.

## Table Definitions

### 1. users (public schema)

Extends Supabase Auth with custom user profile data.

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON public.users(email);
```

**Rationale:** Links to Supabase Auth user ID. Stores email for convenience and allows future profile extensions (name, preferences, etc.).

### 2. tests

Stores metadata about each mold test submission.

```sql
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  duration TEXT NOT NULL CHECK (duration IN ('24h', '48h', '72h', '96h', '1-week')),
  temperature NUMERIC(4,1),
  humidity NUMERIC(4,1) CHECK (humidity >= 0 AND humidity <= 100),
  location TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tests_user_id ON public.tests(user_id);
CREATE INDEX idx_tests_created_at ON public.tests(created_at DESC);
CREATE INDEX idx_tests_status ON public.tests(status);
```

**Rationale:** 
- `duration` uses CHECK constraint to enforce valid preset options
- `temperature` stored as numeric for flexibility (can convert Fahrenheit/Celsius)
- `humidity` has range validation (0-100%)
- `status` tracks analysis workflow state
- Indexes optimize user history queries and status filtering

### 3. test_images

Stores references to uploaded petri dish images in Supabase Storage.

```sql
CREATE TABLE public.test_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_test_images_test_id ON public.test_images(test_id);
```

**Rationale:**
- `storage_path` contains full Supabase Storage path (e.g., "petri-dish-images/user-id/test-id/image.jpg")
- Supports multiple images per test for future enhancement
- Stores metadata for debugging and display purposes
- CASCADE delete ensures orphaned images are removed when test is deleted

### 4. analysis_results

Stores AI-generated mold analysis output.

```sql
CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL UNIQUE REFERENCES public.tests(id) ON DELETE CASCADE,
  mold_types JSONB NOT NULL,
  confidence NUMERIC(5,2) CHECK (confidence >= 0 AND confidence <= 100),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high')),
  colony_count_estimate TEXT,
  growth_density TEXT CHECK (growth_density IN ('low', 'moderate', 'high')),
  health_implications TEXT,
  recommendations TEXT NOT NULL,
  raw_response JSONB,
  analyzed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_analysis_results_test_id ON public.analysis_results(test_id);
CREATE INDEX idx_analysis_results_severity ON public.analysis_results(severity);
```

**Rationale:**
- `test_id` has UNIQUE constraint (one analysis per test)
- `mold_types` stored as JSONB for flexible array of {type, confidence} objects
- `confidence` is overall confidence percentage (0-100)
- `severity` uses CHECK constraint for valid levels
- `raw_response` stores complete OpenAI API response for debugging
- Indexes optimize test detail views and severity filtering

## Relationships

```
auth.users (Supabase managed)
  ↓ (1:1)
public.users
  ↓ (1:many)
public.tests
  ↓ (1:many)
public.test_images

public.tests
  ↓ (1:1)
public.analysis_results
```

All foreign keys use `ON DELETE CASCADE` to maintain referential integrity.

## Data Integrity Rules

1. **User deletion**: Deleting a user cascades to all tests, images, and analysis results
2. **Test deletion**: Deleting a test cascades to associated images and analysis
3. **Constraint validation**: Duration, humidity, severity, and status are validated at database level
4. **Timestamps**: All tables use `TIMESTAMPTZ` for timezone-aware timestamps

## Initial Migration

These tables should be created via Supabase SQL Editor or migration file in sequential order:
1. `public.users`
2. `public.tests`
3. `public.test_images`
4. `public.analysis_results`

## Performance Considerations

- Primary keys use UUID v4 for distributed ID generation
- Indexes on foreign keys optimize JOIN operations
- Indexes on `created_at` support chronological sorting
- JSONB fields enable flexible data structure without schema changes