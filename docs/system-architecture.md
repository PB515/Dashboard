# System Architecture Document (SAD): MBA Execution OS

**Status**: Confirmed Architecture  
**Author**: Purven Bhavsar  
**Date**: 2026-07-24

---

## 1. High-Level System Topology

The application follows a decoupled, mobile-first Progressive Web App (PWA) architecture with an offline-capable client, a serverless/API backend, and a relational database.

```
graph TD
    subgraph Client_Layer ["Client Layer (Mobile PWA)"]
        UI["Dual-Horizon UI Component"]
        LocalCache[("IndexedDB / Local Storage\n(Offline Cache)")]
        SW["Service Worker\n(Background Sync & Caching)"]
    end

    subgraph API_Layer ["API / Backend Layer"]
        AuthRouter["Auth & Identity API"]
        GCalWebhooks["GCal Webhook Listener"]
        SyncEngine["Field Data Sync Engine"]
        CronManager["Chronological Task Manager"]
    end

    subgraph Data_Layer ["Data & Persistence Layer"]
        DB[("Relational Database\n(Subjects, Logs, Milestones)")]
    end
    
    subgraph External_Services ["External Services"]
        GCalAPI["Google Calendar API"]
    end

    UI <-->|State/Render| LocalCache
    UI <-->|Fetch/Mutate| API_Layer
    SW <-->|Intercept/Queue| API_Layer
    LocalCache <-->|Background Sync| SW

    API_Layer <-->|Read/Write| DB
    GCalWebhooks <-->|Event Payloads| GCalAPI
    CronManager -->|Trigger Updates| DB
```

---

## 2. Frontend Architecture (The PWA Client)

### 2.1 State Management Strategy

**Volatile State**: UI toggles, modal open/close states (handled locally within components)

**Server State**: The "Buffer Economy" (token counts), NPTEL checklists, lecture notes tracking
- Fetched on load, heavily cached
- Invalidated only on explicit mutations (e.g., "Spend Bunk", mark notes done)

**Offline State**: The lecture-based tasks (pending notes, journals, research artifacts)
- Stored exclusively in local browser storage (IndexedDB) until network sync confirmed
- Future: MSME field logs cached locally, synced on reconnect

### 2.2 Offline-First Mechanism (Service Worker)

1. **App Shell Caching**: The HTML, CSS, and core JS cached on initial load
   - App opens instantly even on airplane mode
   - Dynamic data endpoints bypass cache (always fetch fresh)

2. **Request Queuing**: If offline and user marks artifact done (e.g., "notes written for FRA #5")
   - Service Worker intercepts the POST request
   - Payload written to IndexedDB with status='pending'

3. **Background Sync**: When network detected
   - Service Worker fires `sync` event
   - Drains IndexedDB queue to backend
   - Backend upserts records (prevent duplicates via client_id)
   - LocalStorage updated to status='synced'

---

## 3. Backend & API Architecture

### 3.1 Core API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard` | GET | Aggregates daily tactical view (next class, tokens, pending tasks) |
| `/api/attendance/override` | POST | Spend token, mark class as "bunked" |
| `/api/lectures` | GET | List lectures for subject + week |
| `/api/lecture-notes/{lectureId}` | POST | Mark notes as done for a lecture |
| `/api/research-projects` | GET/POST | List/create research projects |
| `/api/research-sections/{projectId}` | GET/POST | List/create research sections |
| `/api/artifacts/{subjectId}` | POST | Create/update journal, group project, assignment |
| `/api/nptel-courses` | GET/POST | List/update NPTEL tracking |
| `/api/webhooks/gcal` | POST | Listen for calendar changes (lecture moved, cancelled) |
| `/api/sync/pending-artifacts` | GET | Fetch pending artifacts for display |

### 3.2 Automated "Opt-Out" Cron Logic

The defining feature: **eliminating manual attendance entry**.

```
sequenceDiagram
    participant User
    participant GCal as Google Calendar
    participant Cron as Backend Cron Job
    participant DB as Database

    Note over Cron, DB: Nightly Execution (e.g., 11:59 PM)
    Cron->>GCal: Fetch today's events tagged [Class]
    GCal-->>Cron: Return Event List
    loop For Each Class Event
        Cron->>DB: Check if user explicitly logged "Bunked"
        alt Record Exists (User overridden)
            Cron->>DB: Do nothing (Token already spent)
        else No Record Exists
            Cron->>DB: Auto-Insert log as "Attended" (No tokens spent)
        end
    end
    Note over User, DB: User only acts to explicitly override
```

**Implementation**:
- Cron triggers nightly after 11:59 PM (after classes end)
- Fetches user's GCal events for the past day
- For each [Class] tag:
  - Checks `attendance_logs` for user + date + subject
  - If no record exists → inserts "attended" log with auto_logged=true
  - If override exists → skips (token already accounted for)

---

## 4. Lecture-Triggered Artifact Tracking

When a lecture is delivered (from timetable), it auto-triggers optional artifacts:

### 4.1 Lecture Notes
- Lecture #N delivered → notes expected
- User marks "notes written" when done
- Display: "FRA: 7/10 notes written"

### 4.2 Design Thinking Journals
- DT class #N delivered → journal expected
- User marks "journal done" when done
- Smart inference: if class delivered but journal not marked → show as "pending"

### 4.3 Research Section Work
- Research section active → auto-track books read, rough notes, synthesis progress
- User manually updates: "Read book 3/5", "Rough notes 2/5", "Section done"

### 4.4 Group Projects
- Group project milestone due → auto-reminder
- User updates: "research phase done", "draft 60% done"

### 4.5 NPTEL Courses
- No auto-trigger (no API)
- User manually tracks per course: lectures watched, assignments done
- Display: "Nuclear Energy Option: 8/12 lectures, 1/2 assignments"

---

## 5. Data Model

### Subjects (Master)
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  total_sessions INT NOT NULL,
  max_bunks_allowed INT NOT NULL,
  tokens_remaining INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Timetable (Flexible)
```sql
CREATE TABLE timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  week INT NOT NULL,
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  time_slot TEXT NOT NULL, -- '9:10-10:00'
  room TEXT,
  professor TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'cancelled', 'moved'
  calendar_event_id TEXT, -- Google Calendar event ID for sync
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Attendance Logs
```sql
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  timetable_entry_id UUID NOT NULL REFERENCES timetable_entries(id),
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attended', 'bunked', 'cancelled')),
  auto_logged BOOLEAN DEFAULT FALSE, -- TRUE if cron inserted it
  token_spent BOOLEAN DEFAULT FALSE, -- TRUE if bunked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, timetable_entry_id, date)
);
```

### Lecture Notes Tracking
```sql
CREATE TABLE lecture_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  lecture_number INT NOT NULL,
  notes_exist BOOLEAN DEFAULT FALSE,
  notes_url TEXT, -- optional Google Drive link
  date_written DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, lecture_number)
);
```

### Research Projects & Sections
```sql
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE research_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES research_projects(id),
  user_id UUID NOT NULL,
  section_name TEXT NOT NULL, -- 'History', 'SMR Tech', 'Demand Catalyst', etc.
  description TEXT,
  completion_percent INT DEFAULT 0,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'done'
  order_num INT NOT NULL, -- for ordering within project
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### NPTEL Courses
```sql
CREATE TABLE nptel_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  lectures_total INT,
  lectures_watched INT DEFAULT 0,
  assignments_total INT DEFAULT 0,
  assignments_done INT DEFAULT 0,
  certificate_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Artifacts (Journals, Group Projects, Assignments)
```sql
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('journal', 'group_project', 'assignment', 'nptel_assignment')),
  subject_id UUID REFERENCES subjects(id),
  name TEXT NOT NULL,
  description TEXT,
  completion_percent INT DEFAULT 0,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'done'
  linked_lecture_id UUID, -- for journal: which class triggered this
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Security & Identity

### Authentication
- **Single Sign-On (SSO)** via Google OAuth
- Mandatory to grant permissions to read Google Calendar natively
- No separate API key management

### Data Isolation
- **Row Level Security (RLS)** enabled on all tables
- All rows mapped to authenticated `user_id`
- Single-user app: no tenant isolation needed, but RLS ensures safety

### Policy Example
```sql
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own attendance"
  ON attendance_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance"
  ON attendance_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 7. Edge Cases & Error Handling

### 7.1 Calendar Event Rescheduling
**Scenario**: Professor moves FRA class from Monday 9:10 to Wednesday 11:10

**Flow**:
1. User updates calendar event (or professor does via shared calendar)
2. GCal webhook receives update payload
3. Backend updates `timetable_entries` record (day_of_week + time_slot)
4. If attendance already logged for old time → move to new date
5. Cron next run uses updated timetable

**Implementation**:
```sql
-- Webhook receives: event_id, old_date, new_date
UPDATE timetable_entries
SET day_of_week = 'Wednesday', time_slot = '11:10-12:00', updated_at = NOW()
WHERE calendar_event_id = $1;

-- Move attendance log if it exists
UPDATE attendance_logs
SET date = $new_date
WHERE timetable_entry_id = (SELECT id FROM timetable_entries WHERE calendar_event_id = $1)
AND date = $old_date;
```

### 7.2 Lecture Cancellation
**Scenario**: FRA class cancelled, professor notifies via calendar

**Flow**:
1. User removes event from calendar (or calendar shows cancelled status)
2. Webhook sends delete/update event
3. Backend marks `timetable_entries.status = 'cancelled'`
4. Cron skips this entry (no auto-log for cancelled)
5. Any existing attendance log remains (historical record)

### 7.3 Sync Conflict (Offline Artifacts)
**Scenario**: User marks notes done offline, network drops, retries on reconnect

**Flow**:
1. User marks "FRA lecture #5 notes written" while offline
2. Service Worker saves to IndexedDB with `client_id = UUID()`
3. Network restored → background sync fires
4. Service Worker POSTs artifact to `/api/artifacts/sync`
5. Backend uses `ON CONFLICT (user_id, artifact_type, linked_lecture_id) DO UPDATE`
6. Prevents duplicate entries, idempotent

### 7.4 Cron Timing Edge Cases
**Issue**: User marks "bunked" for today's class at 11:59 PM, cron runs at midnight

**Solution**:
- Cron checks attendance logs **after** fetching calendar events
- Reads current token balance from `subjects` table
- Only auto-logs if NO override exists
- Safe window: user must override before ~11:50 PM (10 min buffer)

---

## 8. Future Extensibility (Phase 5+)

### Field Logging (MSME Research)
- `field_logs` table: location, timestamp, reset_latency_mins, scrap_cost_inr, synced
- Offline queuing: write to IndexedDB, sync on network restore
- Background sync handles retry + conflict resolution (client_id based)

### Integration Points (Not Phase 1)
- **Notion/Evernote sync**: Export notes to external platforms
- **Google Drive API**: Auto-backup research docs
- **NPTEL certificate**: Webhook to verify certificates (future API)
- **Timetable auto-update**: Sync with university LMS (if API available)

---

## 9. Deployment Architecture

### Frontend
- **Vercel**: Deploy Next.js PWA
- **CDN**: Tailwind + assets cached globally
- **Service Worker**: Cached on first load, updated via Next.js build

### Backend
- **Vercel Serverless Functions**: Next.js API routes
- **Supabase Postgres**: Database + RLS + webhook runners

### External
- **Google OAuth**: Credential provider
- **Google Calendar**: Event source + webhook listener
- **Sentry/LogRocket**: Error tracking (optional)

---

## 10. Performance & Monitoring

### Metrics
- **Lighthouse**: Mobile PWA score >90 (lazy loading, caching, no CLS)
- **LCP**: <2s (live class card + tokens visible)
- **Sync latency**: <5s (offline artifact upload on network return)
- **Cron reliability**: 99.9% (nightly auto-log completion rate)

### Observability
- **Error tracking**: Sentry or Vercel built-in logging
- **Cron health**: Upstash/AWS EventBridge monitoring
- **Database**: Supabase Query Performance dashboard

---

## 11. Security Checklist

- ✓ OAuth scope minimal (Calendar read-only + basic profile)
- ✓ RLS enforced on all data tables
- ✓ No hardcoded secrets in client code (env vars only)
- ✓ HTTPS enforced (Vercel default)
- ✓ CSRF protection (Next.js built-in)
- ✓ XSS prevention (React auto-escapes, no dangerouslySetInnerHTML)
- ✓ SQL injection prevention (Supabase parameterized queries)
- ✓ Rate limiting on API endpoints (Vercel or custom middleware)

---

## Document History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-07-24 | 1.0 | Purven | Initial SAD from discovery |
| — | — | — | — |

---

**Questions?** Reference this document during Phase 1-5 builds. Update as architecture evolves.
