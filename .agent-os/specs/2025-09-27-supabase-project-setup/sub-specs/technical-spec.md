# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-27-supabase-project-setup/spec.md

## Technical Requirements

### Supabase Project Configuration

- Create new Supabase project via dashboard (project name: "moldscope" or similar)
- Enable Email Authentication provider in Authentication settings
- Configure email templates for signup confirmation and password reset (optional customization)
- Set authentication redirect URLs for localhost:3000 and future Vercel domain

### Database Schema

- Design and implement PostgreSQL schema with four core tables:
  - `users` (managed by Supabase Auth, extended with custom fields if needed)
  - `tests` (test metadata: user_id, duration, temperature, humidity, location, notes, timestamps)
  - `test_images` (image references: test_id, storage_path, uploaded_at)
  - `analysis_results` (AI output: test_id, mold_types, confidence, severity, recommendations, analyzed_at)
- Establish foreign key relationships with ON DELETE CASCADE for data integrity
- Create indexes on frequently queried columns (user_id, test_id, created_at)

### Storage Configuration

- Create storage bucket named "petri-dish-images"
- Configure bucket to accept JPEG and PNG files with max size 10MB
- Set up storage policies (public read for authenticated users, write for owner only - initial permissive policies, to be refined with RLS)

### Environment Variables

Required variables for `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

### Next.js Integration

- Install `@supabase/supabase-js` package via npm
- Create Supabase client utilities:
  - Client-side client (uses anon key)
  - Server-side client (uses service role key for admin operations)
- Verify connection with simple database query test

### Performance Criteria

- Database queries should return results in < 200ms for typical operations
- Image upload to storage should support files up to 10MB
- Connection pooling handled automatically by Supabase

## External Dependencies

- **@supabase/supabase-js** (latest stable)
  - **Justification:** Official Supabase JavaScript client library required for all database, auth, and storage operations in Next.js application