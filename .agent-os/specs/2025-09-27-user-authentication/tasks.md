# Spec Tasks

## Tasks

- [ ] 1. Update database schema with onboarding flag
  - [ ] 1.1 Run SQL to add `has_completed_onboarding` column to users table
  - [ ] 1.2 Verify column added and index created successfully

- [ ] 2. Create authentication middleware
  - [ ] 2.1 Create middleware.ts to check auth status on protected routes
  - [ ] 2.2 Implement redirect logic for unauthenticated users to /login
  - [ ] 2.3 Implement redirect logic for authenticated users from /login and /signup to /dashboard
  - [ ] 2.4 Check onboarding status and redirect to /onboarding if incomplete
  - [ ] 2.5 Configure matcher to apply middleware to correct routes

- [ ] 3. Build sign up page
  - [ ] 3.1 Create /signup route with form UI (email, password, confirm password)
  - [ ] 3.2 Implement form validation (email format, password strength, matching passwords)
  - [ ] 3.3 Integrate Supabase signUp method
  - [ ] 3.4 Create user record in public.users table after signup
  - [ ] 3.5 Handle errors and display user-friendly messages
  - [ ] 3.6 Auto-login after successful signup
  - [ ] 3.7 Redirect to onboarding page after signup

- [ ] 4. Build login page
  - [ ] 4.1 Create /login route with form UI (email, password)
  - [ ] 4.2 Implement form validation
  - [ ] 4.3 Integrate Supabase signIn method
  - [ ] 4.4 Handle errors and display user-friendly messages
  - [ ] 4.5 Add "Forgot password?" link
  - [ ] 4.6 Redirect to dashboard after successful login (or onboarding if incomplete)

- [ ] 5. Build password reset flow
  - [ ] 5.1 Create /reset-password page for requesting reset link
  - [ ] 5.2 Integrate Supabase resetPasswordForEmail method
  - [ ] 5.3 Create /update-password page for setting new password
  - [ ] 5.4 Integrate Supabase updateUser method for password change
  - [ ] 5.5 Display success messages and redirect to login

- [ ] 6. Build onboarding flow
  - [ ] 6.1 Create /onboarding route with multi-step wizard UI (3-4 screens)
  - [ ] 6.2 Add content explaining app features on each screen
  - [ ] 6.3 Implement "Skip" and "Next" navigation
  - [ ] 6.4 Update has_completed_onboarding flag on completion
  - [ ] 6.5 Redirect to dashboard after completion

- [ ] 7. Build account settings page
  - [ ] 7.1 Create /account route with current email display
  - [ ] 7.2 Implement email update form with current password verification
  - [ ] 7.3 Implement password change form with current password verification
  - [ ] 7.4 Integrate Supabase updateUser method for both operations
  - [ ] 7.5 Display success/error toast notifications

- [ ] 8. Implement logout functionality
  - [ ] 8.1 Create logout action/API route
  - [ ] 8.2 Integrate Supabase signOut method
  - [ ] 8.3 Clear session cookies
  - [ ] 8.4 Add logout button to navigation/header
  - [ ] 8.5 Redirect to login page after logout

- [ ] 9. Create protected dashboard page
  - [ ] 9.1 Create /dashboard route as protected page
  - [ ] 9.2 Display basic dashboard UI with user info
  - [ ] 9.3 Add navigation links to account and logout
  - [ ] 9.4 Verify middleware properly protects route

- [ ] 10. Testing and polish
  - [ ] 10.1 Test complete sign up flow end-to-end
  - [ ] 10.2 Test login and logout flows
  - [ ] 10.3 Test password reset flow end-to-end
  - [ ] 10.4 Test account settings updates
  - [ ] 10.5 Test onboarding flow and skip functionality
  - [ ] 10.6 Test middleware redirects for all scenarios
  - [ ] 10.7 Verify session persistence across browser restarts
  - [ ] 10.8 Check mobile responsiveness of all auth pages