-- Add onboarding flag to users table
ALTER TABLE public.users 
ADD COLUMN has_completed_onboarding BOOLEAN DEFAULT FALSE NOT NULL;

CREATE INDEX idx_users_onboarding ON public.users(has_completed_onboarding);