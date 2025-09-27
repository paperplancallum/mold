-- MoldScope Database Schema Migration
-- Run this in Supabase SQL Editor

-- 1. Create public.users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON public.users(email);

-- 2. Create public.tests table
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

-- 3. Create public.test_images table
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

-- 4. Create public.analysis_results table
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