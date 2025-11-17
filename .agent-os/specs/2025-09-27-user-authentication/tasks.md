# Spec Tasks

## Tasks

- [x] 1. Update database schema with onboarding flag
  - [x] 1.1 Run SQL to add `has_completed_onboarding` column to users table
  - [x] 1.2 Verify column added and index created successfully

- [x] 2. Create authentication middleware
  - [x] 2.1 Create middleware.ts to check auth status on protected routes
  - [x] 2.2 Implement redirect logic for unauthenticated users to /login
  - [x] 2.3 Implement redirect logic for authenticated users from /login and /signup to /dashboard
  - [x] 2.4 Check onboarding status and redirect to /onboarding if incomplete
  - [x] 2.5 Configure matcher to apply middleware to correct routes
  - [x] 2.6 Add /auth/callback to auth page checks for email confirmation

- [x] 3. Build sign up page
  - [x] 3.1 Create /signup route with form UI (email, password, confirm password)
  - [x] 3.2 Implement form validation (email format, password strength, matching passwords)
  - [x] 3.3 Integrate Supabase signUp method
  - [x] 3.4 Create user record in public.users table after signup
  - [x] 3.5 Handle errors and display user-friendly messages
  - [x] 3.6 Auto-login after successful signup
  - [x] 3.7 Redirect to onboarding page after signup
  - [x] 3.8 Update emailRedirectTo to use /auth/callback

- [x] 4. Build login page
  - [x] 4.1 Create /login route with form UI (email, password)
  - [x] 4.2 Implement form validation
  - [x] 4.3 Integrate Supabase signIn method
  - [x] 4.4 Handle errors and display user-friendly messages
  - [x] 4.5 Add "Forgot password?" link
  - [x] 4.6 Redirect to dashboard after successful login (or onboarding if incomplete)

- [x] 5. Build password reset flow
  - [x] 5.1 Create /reset-password page for requesting reset link
  - [x] 5.2 Integrate Supabase resetPasswordForEmail method
  - [x] 5.3 Create /update-password page for setting new password
  - [x] 5.4 Integrate Supabase updateUser method for password change
  - [x] 5.5 Display success messages and redirect to login

- [x] 6. Build onboarding flow
  - [x] 6.1 Create /onboarding route with multi-step wizard UI (4 screens)
  - [x] 6.2 Add content explaining app features on each screen
  - [x] 6.3 Implement "Skip" and "Next" navigation
  - [x] 6.4 Update has_completed_onboarding flag on completion
  - [x] 6.5 Redirect to dashboard after completion

- [x] 7. Build account settings page
  - [x] 7.1 Create /account route with current email display
  - [x] 7.2 Implement password change form (no email update for now)
  - [x] 7.3 Integrate Supabase updateUser method for password changes
  - [x] 7.4 Display success/error messages
  - [x] 7.5 Add account deletion functionality with confirmation
  - [x] 7.6 Add back button to navigate to dashboard

- [x] 8. Implement logout functionality
  - [x] 8.1 Integrate Supabase signOut method in account page
  - [x] 8.2 Clear session and redirect to login page
  - [x] 8.3 Add logout button in account settings

- [x] 9. Create protected dashboard page
  - [x] 9.1 Create /dashboard route as protected page
  - [x] 9.2 Display basic dashboard UI with user info
  - [x] 9.3 Add navigation links to account
  - [x] 9.4 Verify middleware properly protects route

- [x] 10. Create email confirmation callback handler
  - [x] 10.1 Create /auth/callback route to handle email confirmation
  - [x] 10.2 Exchange auth code for session
  - [x] 10.3 Redirect to onboarding after confirmation

- [x] 11. Testing and polish
  - [x] 11.1 Fix TypeScript error in layout.tsx (React.Node → React.ReactNode)
  - [x] 11.2 Run build to verify no errors
  - [x] 11.3 Test sign up and email confirmation flow
  - [x] 11.4 Fix account deletion UX (hide behind button)
  - [x] 11.5 Add navigation back button to account page
  - [x] 11.6 Clear .next cache to fix dev server errors
