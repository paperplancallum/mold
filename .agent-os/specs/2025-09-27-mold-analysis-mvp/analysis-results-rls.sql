-- RLS Policies for analysis_results table
-- This fixes the issue where analysis results couldn't be read by authenticated users

-- Enable RLS on analysis_results
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Allow users to read analysis results for tests they own
CREATE POLICY "Users can view analysis results for their own tests"
ON public.analysis_results
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tests
    WHERE tests.id = analysis_results.test_id
    AND tests.user_id = auth.uid()
  )
);

-- Allow users to insert analysis results for their own tests
CREATE POLICY "Users can create analysis results for their own tests"
ON public.analysis_results
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tests
    WHERE tests.id = analysis_results.test_id
    AND tests.user_id = auth.uid()
  )
);