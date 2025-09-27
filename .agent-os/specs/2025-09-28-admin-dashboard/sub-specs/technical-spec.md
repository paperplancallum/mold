# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-28-admin-dashboard/spec.md

> Created: 2025-09-28
> Version: 1.0.0

## Technical Requirements

### Authentication
- Create middleware function to verify user email matches `ADMIN_EMAIL` environment variable
- Redirect unauthorized users to `/dashboard` with error message
- Apply middleware to `/admin` route and all admin API routes
- Store admin email in `.env.local` and Vercel environment variables

### Admin Dashboard Page (`/app/admin/page.tsx`)
- Server-side authentication check before rendering
- Client component with React state for filters and sorting
- Tailwind CSS data table with responsive design (mobile-friendly stacked cards on small screens)
- Columns: Display ID, Customer Email, Location, Status, Severity, Created Date
- Sortable columns via click on column headers (toggle asc/desc)
- Real-time search input with debouncing (300ms)
- Filter dropdowns for status and severity
- Date range picker for created_at filtering
- Pagination controls (20 items per page default)
- "Export CSV" button that triggers download
- Loading states and error handling

### Admin API Routes
- **GET `/api/admin/tests`**: Fetch all tests with query parameters for filtering/sorting/pagination
  - Query params: `page`, `limit`, `status`, `severity`, `email`, `startDate`, `endDate`, `sortBy`, `sortOrder`
  - Returns: `{ tests: [], total: number, page: number, totalPages: number }`
  - Joins: Include user email, analysis severity in response
- **GET `/api/admin/export`**: Generate CSV file of filtered tests
  - Same query params as `/api/admin/tests`
  - Returns: CSV file download with Content-Disposition header
  - CSV columns: Display ID, Email, Location, Status, Severity, Duration, Temperature, Humidity, Created Date

### Data Handling
- Use Supabase query builder with filters applied server-side
- Implement pagination to handle large datasets efficiently
- Join `tests`, `users`, and `analysis_results` tables
- Order by created_at DESC by default
- Use TypeScript interfaces for type safety

### UI Components
- Reuse existing Tailwind styling patterns from dashboard
- Table with hover states and clickable rows
- Filter inputs with clear/reset functionality
- Export button with loading spinner during generation
- Empty state message when no tests match filters
- Mobile-responsive design with card layout on small screens

## Approach

The admin dashboard will be implemented as a protected Next.js page with server-side authentication checks. The UI will consist of a data table with client-side filtering and sorting capabilities, backed by API routes that handle the actual data fetching and CSV generation. The design will follow existing patterns from the customer dashboard for consistency.

## External Dependencies

No new external dependencies required. All functionality can be implemented using existing stack:
- Next.js for routing and API
- Supabase for database queries
- Tailwind CSS for styling
- TypeScript for type safety