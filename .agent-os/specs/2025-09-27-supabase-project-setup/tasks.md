# Spec Tasks

## Tasks

- [x] 1. Create and configure Supabase project
  - [x] 1.1 Create new Supabase project via dashboard with name "moldscope"
  - [x] 1.2 Enable Email Authentication provider in project settings
  - [x] 1.3 Configure authentication redirect URLs for localhost:3000
  - [x] 1.4 Create storage bucket named "petri-dish-images" with public access policies
  - [x] 1.5 Configure bucket to accept JPEG/PNG files with 10MB max size

- [x] 2. Design and deploy database schema
  - [x] 2.1 Create `public.users` table with SQL from database-schema.md
  - [x] 2.2 Create `public.tests` table with all constraints and indexes
  - [x] 2.3 Create `public.test_images` table with foreign key relationships
  - [x] 2.4 Create `public.analysis_results` table with JSONB fields
  - [x] 2.5 Verify all foreign key relationships and CASCADE behavior
  - [x] 2.6 Test database constraints with sample INSERT queries

- [x] 3. Set up local development environment
  - [x] 3.1 Install @supabase/supabase-js package via npm
  - [x] 3.2 Create `.env.local` file with NEXT_PUBLIC_SUPABASE_URL and keys
  - [x] 3.3 Add `.env.local` to .gitignore if not already present
  - [x] 3.4 Create Supabase client utility files (client-side and server-side)
  - [x] 3.5 Verify connection with simple database query test
  - [x] 3.6 Verify storage bucket access from Next.js application

- [x] 4. Document Vercel deployment configuration
  - [x] 4.1 Document required environment variables for Vercel
  - [x] 4.2 Create deployment checklist in project documentation
  - [x] 4.3 Verify local setup is complete and functional