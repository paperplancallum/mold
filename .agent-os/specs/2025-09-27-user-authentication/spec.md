# Spec Requirements Document

> Spec: User Authentication
> Created: 2025-09-27

## Overview

Implement email/password authentication with immediate access after signup, persistent sessions, password reset functionality, user account management, and onboarding flow for first-time users.

## User Stories

### Account Creation and Access

As a new user, I want to sign up with my email and password, so that I can immediately start using MoldScope to analyze mold samples.

The user visits the sign-up page, enters their email and password (with confirmation), and submits the form. Upon successful account creation, they are automatically logged in and directed to an onboarding screen that introduces them to the app's features. The session persists until they explicitly log out.

### Returning User Login

As a returning user, I want to log in with my email and password, so that I can access my previous test results and submit new tests.

The user visits the login page, enters their credentials, and is authenticated through Supabase Auth. Upon successful login, they are directed to the dashboard. Their session remains active across browser sessions until they choose to log out.

### Password Recovery

As a user who forgot my password, I want to reset it via email, so that I can regain access to my account.

The user clicks "Forgot password" on the login page, enters their email address, and receives a password reset link. Clicking the link takes them to a secure page where they can set a new password and regain access to their account.

### Account Management

As a logged-in user, I want to update my email address or change my password, so that I can keep my account secure and up-to-date.

The user navigates to an account settings page where they can view their current email, update it if needed, or change their password. Changes require current password confirmation for security.

## Spec Scope

1. **Sign Up Page** - Email/password registration form with validation and immediate login after successful account creation
2. **Login Page** - Email/password authentication with "Forgot password" link and error handling
3. **Password Reset Flow** - Request reset link via email, secure token-based password change page
4. **Onboarding Screen** - Welcome flow for first-time users explaining app features (shown once after signup)
5. **Account Settings Page** - View and update email, change password functionality with current password verification
6. **Protected Routes** - Middleware to require authentication for dashboard and test submission pages
7. **Logout Functionality** - Clear session and redirect to login page
8. **Persistent Sessions** - Keep users logged in across browser sessions until explicit logout

## Out of Scope

- Social login (Google, Apple) - deferred to future iteration
- Email verification/confirmation - immediate access granted after signup
- Two-factor authentication (2FA)
- Account deletion
- Profile photo or extended user profile fields
- "Remember me" checkbox - all sessions are persistent by default

## Expected Deliverable

1. Users can sign up, log in, and log out successfully
2. Password reset flow works end-to-end via email
3. Protected routes redirect unauthenticated users to login page
4. Onboarding screen appears once for new users after signup
5. Account settings page allows email and password updates