# API Specification — Phase 1

**Version**: 1.0  
**Date**: 2026-07-24  
**Scope**: Phase 1 endpoints (timetable, attendance, dashboard)  
**Status**: Ready for implementation

---

## Overview

All endpoints are **Next.js API routes** (`app/api/*`). Authentication via **Google OAuth** (Supabase `auth.uid()`). All responses are JSON. All POST/PUT requests require `Content-Type: application/json`.

### Base URL
```
Development:  http://localhost:3000/api
Production:   https://mba-os.vercel.app/api
```

### Authentication
Every request includes `Authorization: Bearer {access_token}` (handled by Supabase client). RLS ensures users can only access their own data.

### Error Responses
```json
{
  "error": "Unauthorized",
  "message": "User not authenticated",
  "status": 401
}
```

---

## Endpoints

### 1. GET /api/auth/user

**Purpose**: Get current authenticated user info  
**Auth**: Required  
**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "student@adani.edu",
  "name": "Purven Bhavsar",
  "aud": "authenticated"
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated

---

### 2. GET /api/dashboard

**Purpose**: Fetch home screen data (next class, tokens, pending tasks, CGPA)  
**Auth**: Required  
**Query Params**: None  
**Response**:
```json
{
  "next_class": {
    "id": "class-1",
    "subject": {
      "code": "FRA",
      "name": "Financial Reporting & Accounting",
      "credits": 3
    },
    "time_slot": "9:10-10:00",
    "day_of_week": "Monday",
    "room": "Room 101",
    "professor": "Prof. Sharma",
    "week": 1,
    "calendar_event_id": "goog-event-123",
    "status": "scheduled"
  },
  
  "token_vault": [
    {
      "subject_id": "fra-id",
      "code": "FRA",
      "name": "Financial Reporting & Accounting",
      "credits": 3,
      "tokens_remaining": 2,
      "tokens_max": 11,
      "status": "danger",  // "abundant" | "caution" | "danger"
      "attended_count": 15,
      "total_sessions": 45
    },
    {
      "subject_id": "dt-id",
      "code": "DT",
      "name": "Design Thinking",
      "credits": 2,
      "tokens_remaining": 5,
      "tokens_max": 7,
      "status": "abundant",
      "attended_count": 12,
      "total_sessions": 30
    }
    // ... 9 more subjects
  ],
  
  "pending_tasks": {
    "urgent": [
      {
        "id": "task-1",
        "type": "lecture_note",  // lecture_note | journal | assignment | etc.
        "title": "FRA Lecture #5 Notes",
        "course": "FRA",
        "deadline": "2026-07-24",
        "status": "pending",
        "quality_score": 7,
        "due_in": "today"
      },
      {
        "id": "task-2",
        "type": "journal",
        "title": "DT Journal #8",
        "course": "DT",
        "deadline": "2026-07-24",
        "status": "pending",
        "quality_score": null,
        "due_in": "today"
      }
    ],
    "momentum": [
      {
        "id": "research-1",
        "type": "research_section",
        "title": "Nuclear Paper: Section 3 Research",
        "course": "Research",
        "deadline": "2026-08-15",
        "status": "in_progress",
        "completion_percent": 60,
        "quality_score": null,
        "due_in": "22 days"
      }
    ]
  },
  
  "gold_medal_status": {
    "earned_cgpa": 9.1,
    "projected_cgpa": {
      "low": 9.3,
      "high": 9.5
    },
    "target_cgpa": 9.6,
    "gap": {
      "low": 0.1,
      "high": 0.5,
      "status": "on_track"  // "on_track" | "at_risk" | "critical"
    },
    "mastery_percent": 82,
    "execution_risk": "medium",  // "low" | "medium" | "high"
    "data_status": "current",  // "current" | "stale" | "outdated"
    "last_updated": "2026-07-24T10:30:00Z"
  }
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated
- 500: Database error

---

### 3. GET /api/timetable

**Purpose**: Fetch timetable for a given week (or all weeks)  
**Auth**: Required  
**Query Params**:
- `week` (optional, int 1–18): If not provided, returns all weeks
- `subject_id` (optional, UUID): Filter by subject

**Response**:
```json
{
  "week": 1,
  "date_range": {
    "start": "2026-07-22",
    "end": "2026-07-28"
  },
  "entries": [
    {
      "id": "entry-1",
      "subject_id": "fra-id",
      "subject_code": "FRA",
      "subject_name": "Financial Reporting & Accounting",
      "week": 1,
      "day_of_week": "Monday",
      "time_slot": "9:10-10:00",
      "room": "Room 101",
      "professor": "Prof. Sharma",
      "status": "scheduled",  // "scheduled" | "cancelled" | "moved"
      "calendar_event_id": "goog-event-123",
      "attendance": {
        "status": "attended",  // "attended" | "bunked" | "cancelled"
        "auto_logged": true,
        "token_spent": false,
        "date": "2026-07-22"
      }
    },
    {
      "id": "entry-2",
      "subject_id": "dt-id",
      "subject_code": "DT",
      "subject_name": "Design Thinking",
      "week": 1,
      "day_of_week": "Wednesday",
      "time_slot": "10:10-11:00",
      "room": "Room 203",
      "professor": "Prof. Patel",
      "status": "scheduled",
      "calendar_event_id": "goog-event-124",
      "attendance": {
        "status": "attended",
        "auto_logged": true,
        "token_spent": false,
        "date": "2026-07-24"
      }
    }
  ]
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated
- 400: Invalid week (< 1 or > 18)

---

### 4. POST /api/timetable/import

**Purpose**: Import timetable from CSV  
**Auth**: Required  
**Request Body**:
```json
{
  "csv_data": "week,day_of_week,subject_code,time_slot,room,professor\n1,Monday,FRA,9:10-10:00,Room 101,Prof. Sharma\n1,Wednesday,DT,10:10-11:00,Room 203,Prof. Patel",
  "replace_existing": false
}
```

**CSV Format**:
```
week,day_of_week,subject_code,time_slot,room,professor
1,Monday,FRA,9:10-10:00,Room 101,Prof. Sharma
1,Wednesday,DT,10:10-11:00,Room 203,Prof. Patel
...
```

**Response**:
```json
{
  "success": true,
  "imported_count": 8,
  "errors": [
    {
      "row": 5,
      "error": "Unknown subject code: INVALID"
    }
  ],
  "preview": [
    {
      "week": 1,
      "day": "Monday",
      "subject": "FRA",
      "time": "9:10-10:00",
      "status": "valid"
    }
  ]
}
```

**Status Codes**:
- 200: Success (partial or full)
- 400: CSV format error
- 401: Not authenticated
- 413: File too large

---

### 5. POST /api/timetable/entry

**Purpose**: Create or update a single timetable entry  
**Auth**: Required  
**Request Body** (Create):
```json
{
  "subject_id": "fra-id",
  "week": 1,
  "day_of_week": "Monday",
  "time_slot": "9:10-10:00",
  "room": "Room 101",
  "professor": "Prof. Sharma",
  "status": "scheduled"
}
```

**Request Body** (Update):
```json
{
  "id": "entry-1",
  "time_slot": "9:10-10:00",  // changed from 9:00-10:00
  "room": "Room 102",          // changed from Room 101
  "status": "moved"
}
```

**Response**:
```json
{
  "id": "entry-1",
  "subject_id": "fra-id",
  "week": 1,
  "day_of_week": "Monday",
  "time_slot": "9:10-10:00",
  "room": "Room 101",
  "professor": "Prof. Sharma",
  "status": "scheduled",
  "calendar_event_id": "goog-event-123",
  "created_at": "2026-07-24T10:30:00Z"
}
```

**Status Codes**:
- 200: Update success
- 201: Create success
- 400: Invalid subject_id or missing fields
- 401: Not authenticated
- 404: Entry not found (update)

---

### 6. DELETE /api/timetable/entry/:id

**Purpose**: Cancel (soft-delete) a timetable entry  
**Auth**: Required  
**Path Params**:
- `id` (UUID): Entry ID

**Response**:
```json
{
  "success": true,
  "id": "entry-1",
  "status": "cancelled",
  "message": "Class cancelled and removed from schedule"
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated
- 404: Entry not found

---

### 7. POST /api/attendance/override

**Purpose**: Mark attendance as "bunked" (spend a bunk token)  
**Auth**: Required  
**Request Body**:
```json
{
  "timetable_entry_id": "entry-1",
  "date": "2026-07-22",
  "action": "bunk"  // "bunk" | "undo"
}
```

**Response** (Bunk):
```json
{
  "success": true,
  "attendance": {
    "id": "attend-log-1",
    "timetable_entry_id": "entry-1",
    "date": "2026-07-22",
    "status": "bunked",
    "token_spent": true,
    "auto_logged": false
  },
  "subject_tokens_updated": {
    "subject_code": "FRA",
    "tokens_remaining": 1,  // was 2
    "tokens_max": 11
  }
}
```

**Response** (Undo):
```json
{
  "success": true,
  "attendance": {
    "id": "attend-log-1",
    "timetable_entry_id": "entry-1",
    "date": "2026-07-22",
    "status": "attended",
    "token_spent": false,
    "auto_logged": true
  },
  "subject_tokens_updated": {
    "subject_code": "FRA",
    "tokens_remaining": 2,  // was 1
    "tokens_max": 11
  }
}
```

**Status Codes**:
- 200: Success
- 400: No tokens left (for bunk action)
- 401: Not authenticated
- 404: Timetable entry not found
- 409: Entry already bunked or cancelled

---

### 8. GET /api/subjects

**Purpose**: Fetch all subjects with token info  
**Auth**: Required  
**Query Params**: None  
**Response**:
```json
{
  "subjects": [
    {
      "id": "fra-id",
      "code": "FRA",
      "name": "Financial Reporting & Accounting",
      "credits": 3,
      "total_sessions": 45,
      "tokens_remaining": 2,
      "tokens_max": 11,
      "status": "danger",
      "attended_count": 15,
      "avg_quality": 8.2,
      "recent_attendance": [
        {
          "date": "2026-07-24",
          "status": "attended",
          "auto_logged": true
        },
        {
          "date": "2026-07-22",
          "status": "bunked",
          "auto_logged": false
        }
      ]
    },
    {
      "id": "dt-id",
      "code": "DT",
      "name": "Design Thinking",
      "credits": 2,
      "total_sessions": 30,
      "tokens_remaining": 5,
      "tokens_max": 7,
      "status": "abundant",
      "attended_count": 12,
      "avg_quality": 9.1,
      "recent_attendance": []
    }
    // ... 9 more
  ]
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated

---

### 9. GET /api/subjects/:id

**Purpose**: Get detailed info for a single subject  
**Auth**: Required  
**Path Params**:
- `id` (UUID): Subject ID

**Query Params**:
- `include_attendance` (optional, boolean): Include all attendance logs if true

**Response**:
```json
{
  "id": "fra-id",
  "code": "FRA",
  "name": "Financial Reporting & Accounting",
  "credits": 3,
  "total_sessions": 45,
  "max_bunks_allowed": 11,
  "bunks_used": 9,
  "tokens_remaining": 2,
  "tokens_max": 11,
  "status": "danger",
  "attended_count": 15,
  "bunked_count": 9,
  "cancelled_count": 21,
  "avg_quality": 8.2,
  "attendance_log": [
    {
      "date": "2026-07-24",
      "day": "Wednesday",
      "status": "attended",
      "auto_logged": true
    },
    {
      "date": "2026-07-22",
      "day": "Monday",
      "status": "bunked",
      "auto_logged": false
    }
    // ... more
  ]
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated
- 404: Subject not found

---

### 10. POST /api/timetable/sync-calendar

**Purpose**: Trigger manual sync with Google Calendar (one-time or scheduled)  
**Auth**: Required  
**Request Body**:
```json
{
  "action": "sync_now"  // "sync_now" | "setup_webhook"
}
```

**Response** (Sync Now):
```json
{
  "success": true,
  "synced_events": 8,
  "errors": [],
  "new_entries": 2,
  "updated_entries": 3,
  "last_sync": "2026-07-24T10:45:00Z"
}
```

**Response** (Setup Webhook):
```json
{
  "success": true,
  "webhook_url": "https://mba-os.vercel.app/api/webhooks/gcal",
  "instructions": "Add this URL to Google Calendar settings for real-time sync",
  "expires_in": "86400s"  // 24 hours
}
```

**Status Codes**:
- 200: Success
- 401: Not authenticated or OAuth token missing
- 503: Google Calendar API error

---

### 11. POST /api/webhooks/gcal

**Purpose**: Receive calendar event updates from Google Calendar (webhook)  
**Auth**: None (but Google signature verified)  
**Request Body** (from Google):
```json
{
  "id": "google-webhook-id",
  "resourceId": "resource-id",
  "resourceUri": "https://www.googleapis.com/calendar/v3/calendars/...",
  "changeType": "sync",
  "expiration": 1627180800000
}
```

**Processing** (Internal):
1. Verify Google signature
2. Query GCal for events changed since last sync
3. For each event:
   - If moved: update `day_of_week`, `time_slot`
   - If deleted: mark as `cancelled`
   - If new: create `timetable_entry`
4. No response body needed (202 Accepted)

**Status Codes**:
- 202: Accepted (processing in background)
- 401: Signature verification failed
- 500: Processing error

---

## Cron Jobs (Not Exposed via HTTP)

### Nightly Auto-Log (11:59 PM)

```
Trigger: Every day at 11:59 PM
Process:
  1. Fetch all timetable_entries for today (date = NOW())
  2. For each entry:
     a. Check if attendance_log exists for (user_id, entry_id, date)
     b. If NO: insert with status='attended', auto_logged=true
     c. If YES: skip (user already overridden)
  3. Update subject.bunks_remaining based on new logs
  4. Log job completion (Upstash/AWS EventBridge)
```

---

## Error Handling

### Common Error Response Format

```json
{
  "error": "ValidationError",
  "message": "Subject code must be between 2-10 characters",
  "status": 400,
  "details": {
    "field": "subject_code",
    "value": "INVALID_LONG_CODE"
  }
}
```

### Specific Error Codes

| Code | Error | Cause |
|------|-------|-------|
| 400 | BadRequest | Malformed request, invalid params |
| 401 | Unauthorized | Missing/invalid auth token |
| 403 | Forbidden | User doesn't own resource |
| 404 | NotFound | Resource doesn't exist |
| 409 | Conflict | State conflict (e.g., already bunked) |
| 413 | PayloadTooLarge | CSV file > 5MB |
| 500 | InternalError | Database/server error |
| 503 | ServiceUnavailable | External API (GCal) down |

---

## Rate Limiting

```
Per user, per endpoint:
- GET: 100 requests/minute
- POST/PUT/DELETE: 30 requests/minute

Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1627180800

When limit exceeded:
429 Too Many Requests
Retry-After: 60
```

---

## Pagination (Phase 2+)

Not implemented in Phase 1. All responses are full.

**Future** (Phase 2, for large datasets):
```
GET /api/attendance/logs?limit=50&offset=0

Response:
{
  "data": [...],
  "total": 330,
  "limit": 50,
  "offset": 0,
  "has_more": true
}
```

---

## Versioning

No versioning in Phase 1. All endpoints live at `/api/*`.

**Future** (if breaking changes needed):
```
GET /api/v2/dashboard
GET /api/v1/dashboard  (deprecated, supported for 6 months)
```

---

## Testing the API

### cURL Examples

**Get Dashboard**:
```bash
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  https://localhost:3000/api/dashboard
```

**Import Timetable**:
```bash
curl -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "csv_data": "week,day_of_week,subject_code,time_slot,room,professor\n1,Monday,FRA,9:10-10:00,Room 101,Prof. Sharma"
  }' \
  https://localhost:3000/api/timetable/import
```

**Spend Bunk**:
```bash
curl -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timetable_entry_id": "entry-1",
    "date": "2026-07-22",
    "action": "bunk"
  }' \
  https://localhost:3000/api/attendance/override
```

---

**Status**: Ready for implementation. All Phase 1 endpoints specified.
