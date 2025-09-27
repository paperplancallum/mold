# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-09-27-user-authentication/spec.md

## Schema Changes

Only one additional column is needed to support the onboarding feature.

### Modification to existing `public.users` table

Add a column to track onboarding completion status.

```sql
ALTER TABLE public.users 
ADD COLUMN has_completed_onboarding BOOLEAN DEFAULT FALSE NOT NULL;

CREATE INDEX idx_users_onboarding ON public.users(has_completed_onboarding);
```

**Rationale:**
- `has_completed_onboarding` boolean tracks whether user has seen the onboarding flow
- Defaults to `FALSE` for new users
- Updated to `TRUE` after completing onboarding wizard
- Index optimizes middleware checks for onboarding redirect logic

## No New Tables Required

All other authentication data is managed by Supabase Auth in the `auth.users` table:
- Email address
- Encrypted password
- Session tokens
- Password reset tokens

The existing `public.users` table (created in Supabase project setup spec) already links to `auth.users` and stores the user's email for convenience.

## Data Flow

1. **Sign Up**: 
   - Supabase creates record in `auth.users`
   - Trigger/client creates matching record in `public.users` with `has_completed_onboarding = false`

2. **Onboarding Complete**:
   - Update `public.users` SET `has_completed_onboarding = true` WHERE `id = user_id`

3. **Route Protection**:
   - Middleware checks `has_completed_onboarding` flag
   - Redirects to `/onboarding` if false and user is authenticated