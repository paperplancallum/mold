# Spec Requirements Document

> Spec: Admin Dashboard
> Created: 2025-09-28
> Status: Planning

## Overview

Create an admin dashboard that allows the site administrator to monitor and review all customer mold test submissions across all users, providing a centralized interface for oversight, filtering, and data export capabilities.

## User Stories

### Admin Monitoring

As a site administrator, I want to view all customer test submissions in a centralized dashboard, so that I can monitor system usage, review test statuses, and ensure quality of service.

The admin navigates to `/admin` and is authenticated via their registered admin email (callum@paperplan.co). They see a comprehensive table showing all tests from all users with key information: test ID, customer email, location, status, severity (if analyzed), and submission date. The admin can sort by any column, filter by status or severity, search by customer email, and apply date range filters to focus on specific time periods.

### Detailed Test Review

As a site administrator, I want to click on any test entry to view its full details and analysis results, so that I can review the quality of AI analysis and understand customer concerns.

When the admin clicks on a test row, they are taken to the existing test results page for that specific test, allowing them to see all details including the uploaded image, environmental conditions, AI analysis, and health recommendations.

### Data Export

As a site administrator, I want to export filtered test data to CSV format, so that I can perform offline analysis, generate reports, and maintain records for business intelligence purposes.

The admin applies filters (date range, status, severity) and clicks an "Export CSV" button. The system generates a downloadable CSV file containing all filtered test records with relevant fields for analysis.

## Spec Scope

1. **Admin Authentication** - Verify admin access via environment variable containing authorized admin email
2. **Dashboard UI** - Create a data table showing all tests with sortable columns and responsive design
3. **Filtering System** - Implement filters for status, severity, date range, and customer email search
4. **Test Details Navigation** - Enable click-through from dashboard to existing test result pages
5. **CSV Export** - Generate downloadable CSV files with filtered test data

## Out of Scope

- Customer contact/messaging features
- Test editing or deletion from admin panel
- Manual re-analysis triggering
- User management or admin role assignment UI
- Real-time notifications or alerts
- Advanced analytics or visualization charts

## Expected Deliverable

1. A functional admin dashboard accessible at `/admin` that displays all customer tests in a sortable, filterable table
2. Working authentication that restricts access to the specified admin email only
3. CSV export functionality that downloads filtered test data in a standard format

## Spec Documentation

- Tasks: @.agent-os/specs/2025-09-28-admin-dashboard/tasks.md
- Technical Specification: @.agent-os/specs/2025-09-28-admin-dashboard/sub-specs/technical-spec.md
- API Specification: @.agent-os/specs/2025-09-28-admin-dashboard/sub-specs/api-spec.md
- Database Schema: @.agent-os/specs/2025-09-28-admin-dashboard/sub-specs/database-schema.md