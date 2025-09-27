# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-27-user-authentication/spec.md

## Technical Requirements

### Supabase Auth Integration

- Use Supabase Auth for all authentication operations (signUp, signIn, signOut, resetPassword)
- Configure auth settings to disable email confirmation (immediate access)
- Use server-side Supabase client for protected routes middleware
- Store session in HTTP-only cookies via Supabase SSR package

### Route Structure

- `/signup` - Sign up page (public)
- `/login` - Login page (public)
- `/reset-password` - Password reset request page (public)
- `/update-password` - Password update page (authenticated, accessed via email link)
- `/onboarding` - Onboarding flow (authenticated, shown once)
- `/dashboard` - Main dashboard (protected)
- `/account` - Account settings page (protected)

### Middleware Implementation

- Create Next.js middleware to check authentication status
- Redirect unauthenticated users from protected routes to `/login`
- Redirect authenticated users from `/login` and `/signup` to `/dashboard`
- Check for `has_completed_onboarding` flag and redirect to `/onboarding` if false

### Form Validation

- Email: valid email format, required
- Password: minimum 8 characters, at least one uppercase, one lowercase, one number
- Password confirmation: must match password field
- Display inline validation errors below each field
- Disable submit button while form is invalid or submitting

### Session Management

- Persistent sessions using Supabase Auth tokens stored in HTTP-only cookies
- No "remember me" option - all sessions persist by default
- Session expires only on explicit logout or token expiration (default 1 week, configurable in Supabase)
- Refresh tokens automatically handled by Supabase client

### Onboarding Flow

- Simple multi-step wizard (3-4 screens) introducing app features
- Store `has_completed_onboarding` boolean in `public.users` table
- Update flag to `true` when user completes onboarding
- Skip button available on each screen
- Final screen redirects to dashboard

### Account Settings

- Display current email (read-only until "Edit" clicked)
- Email update: requires current password, sends confirmation to new email (no verification required per requirements)
- Password change: requires current password and new password (with confirmation)
- Success/error toast notifications for all operations

### Error Handling

- Display user-friendly error messages for auth failures
- Common errors:
  - Invalid credentials: "Email or password is incorrect"
  - Email already exists: "An account with this email already exists"
  - Weak password: "Password must be at least 8 characters with uppercase, lowercase, and numbers"
  - Network errors: "Unable to connect. Please try again."
- Log detailed errors to console for debugging

### Performance Criteria

- Page transitions should feel instant (<100ms)
- Form submissions complete in <2 seconds
- Session check middleware adds <50ms to route loading
- Optimize bundle size by code-splitting auth pages

## External Dependencies

No new external dependencies required. Using existing:
- **@supabase/supabase-js** - Already installed for auth operations
- **@supabase/ssr** - Already installed for server-side session management