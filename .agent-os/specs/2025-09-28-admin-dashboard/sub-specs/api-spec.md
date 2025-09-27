# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-09-28-admin-dashboard/spec.md

> Created: 2025-09-28
> Version: 1.0.0

## Endpoints

### GET /api/admin/tests

**Purpose:** Fetch all test submissions across all users with filtering, sorting, and pagination

**Authentication:** Requires admin email verification via middleware

**Query Parameters:**
- `page` (number, optional): Page number for pagination, default 1
- `limit` (number, optional): Items per page, default 20, max 100
- `status` (string, optional): Filter by test status (pending|in_review|completed|failed)
- `severity` (string, optional): Filter by analysis severity (low|moderate|high)
- `email` (string, optional): Filter by customer email (partial match, case-insensitive)
- `startDate` (string, optional): Filter tests created after this date (ISO 8601 format)
- `endDate` (string, optional): Filter tests created before this date (ISO 8601 format)
- `sortBy` (string, optional): Column to sort by (created_at|status|display_id|email), default created_at
- `sortOrder` (string, optional): Sort direction (asc|desc), default desc

**Response Format:**
```json
{
  "tests": [
    {
      "id": "uuid",
      "display_id": 123,
      "user_id": "uuid",
      "user_email": "customer@example.com",
      "location": "Bathroom",
      "status": "completed",
      "severity": "moderate",
      "duration": "48h",
      "temperature": 72.5,
      "humidity": 65.0,
      "created_at": "2025-09-28T10:30:00Z",
      "has_analysis": true
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

**Errors:**
- 401: Unauthorized (not admin email)
- 400: Invalid query parameters
- 500: Internal server error

---

### GET /api/admin/export

**Purpose:** Export filtered test data as downloadable CSV file

**Authentication:** Requires admin email verification via middleware

**Query Parameters:** Same as `/api/admin/tests` (excluding pagination params)

**Response Format:** CSV file download with headers:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="moldscope-tests-YYYY-MM-DD.csv"
```

**CSV Columns:**
```
Display ID,Customer Email,Location,Status,Severity,Duration,Temperature (°F),Humidity (%),Created Date
```

**Errors:**
- 401: Unauthorized (not admin email)
- 400: Invalid query parameters
- 500: Internal server error

## Controllers

### Admin Authentication Middleware

**Purpose:** Verify user is authorized admin before allowing access to admin routes

**Implementation:**
```typescript
// middleware.ts or lib/admin-auth.ts
export async function requireAdmin(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.redirect('/dashboard?error=unauthorized')
  }
  
  return null // Authorized
}
```

**Applied to:**
- `/app/admin/*` pages
- `/api/admin/*` routes