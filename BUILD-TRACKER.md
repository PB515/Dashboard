# Build Tracker - Phase 1 (All Systems)

**Start Date**: 2026-07-24  
**Target**: Week 5 (Semester start, live)  
**Scope**: All 7 systems unified + Phase 1–5 merged

---

## Build Status

### Database & Migrations ✅
- [x] 0001_phase1.sql (all tables: users, subjects, timetable, attendance, work_items, research_projects, nptel_courses, rubrics)
- [x] RLS policies (all tables)
- [x] Indexes (performance)

### Backend (API Routes) 🔄
- [ ] `/api/auth/user.ts` (GET user info)
- [ ] `/api/dashboard.ts` (GET home screen data)
- [ ] `/api/timetable/route.ts` (GET timetable, POST import CSV)
- [ ] `/api/timetable/entry.ts` (POST create/update entry)
- [ ] `/api/timetable/sync-calendar.ts` (POST sync GCal)
- [ ] `/api/attendance/override.ts` (POST spend bunk)
- [ ] `/api/subjects/route.ts` (GET all subjects)
- [ ] `/api/subjects/[id].ts` (GET subject detail)
- [ ] `/api/work-items/route.ts` (GET/POST work items)
- [ ] `/api/research-projects/route.ts` (GET/POST research)
- [ ] `/api/webhooks/gcal.ts` (POST from Google Calendar)

### Frontend (React Components) 🔄
- [ ] `app/page.tsx` (Home dashboard)
- [ ] `app/timetable/page.tsx` (Timetable view)
- [ ] `app/subjects/page.tsx` (Subjects + token vault)
- [ ] `app/layout.tsx` (Root layout + navigation)
- [ ] `lib/components/dashboard-card.tsx` (Next class hero)
- [ ] `lib/components/token-vault.tsx` (Token display)
- [ ] `lib/components/pending-tasks.tsx` (Task list)
- [ ] `lib/components/timetable-entry.tsx` (Class card)
- [ ] `lib/components/modals/` (Spend bunk, edit class, etc.)

### Business Logic 🔄
- [ ] `lib/logic/cgpa.ts` (CGPA calculation)
- [ ] `lib/logic/tokens.ts` (Token management)
- [ ] `lib/logic/csv-parser.ts` (Timetable import)
- [ ] `lib/logic/attendance.ts` (Auto-log, override)

### Utilities 🔄
- [ ] `lib/supabase/client.ts` (Client-side auth + queries)
- [ ] `lib/supabase/server.ts` (Server-side queries)
- [ ] `lib/auth.ts` (OAuth setup)
- [ ] `lib/types.ts` (TypeScript types from schema)

### Testing 🔄
- [ ] Unit tests (CGPA, tokens, CSV parsing)
- [ ] Integration tests (API + DB)
- [ ] E2E tests (user flows)

### Mobile & Responsiveness 🔄
- [ ] Tailwind responsive (mobile/tablet/desktop)
- [ ] Dark theme (globals.css)
- [ ] Service Worker (app shell + offline cache)
- [ ] Real device testing (iPhone + Android)

### Deployment 🔄
- [ ] Git commits (with clear messages)
- [ ] GitHub push (ready for CI/CD)
- [ ] Environment variables (`.env.local` → Vercel secrets)
- [ ] Supabase cloud setup (ready to connect)
- [ ] Vercel deployment (ready to push)

---

## Detailed Tickets

### Batch 1: Database + Server Setup (Completed)
- [x] 0001_phase1.sql migration
- [x] RLS policies + indexes

### Batch 2: Core APIs (In Progress)
- [ ] 2.1: Auth API (`/api/auth/user.ts`)
  - GET user info from Supabase Auth
  - Return: id, email, name
  - Tests: authenticated vs unauthenticated
  
- [ ] 2.2: Dashboard API (`/api/dashboard.ts`)
  - GET: next class, token vault, pending tasks, CGPA metrics
  - Queries: timetable_entries (today), attendance_logs (summary), work_items (pending)
  - Tests: populated vs empty state
  
- [ ] 2.3: Timetable Import (`/api/timetable/route.ts` POST)
  - Parse CSV (week, day, subject, time, room, professor)
  - Validate: subject exists, format correct
  - Bulk insert timetable_entries
  - Tests: 330-row file, invalid rows, duplicates
  
- [ ] 2.4: Attendance Override (`/api/attendance/override.ts` POST)
  - Insert attendance_log (status=bunked, token_spent=true)
  - Decrement subject.bunks_used
  - Tests: successful bunk, no tokens left, undo
  
- [ ] 2.5: Subjects API (`/api/subjects/route.ts` GET)
  - Return all subjects with token counts
  - Joins: subjects + attendance_logs (count bunked)
  - Tests: correct token math

### Batch 3: Frontend Components (Queued)
- [ ] 3.1: Home Page (`app/page.tsx`)
  - Layout: Next Class Hero + Token Vault + Pending Tasks + Dashboard Metrics
  - Fetch from `/api/dashboard`
  - Tests: renders without errors
  
- [ ] 3.2: Timetable Page (`app/timetable/page.tsx`)
  - Layout: Week picker + day-grouped classes
  - Fetch from `/api/timetable?week=1`
  - Tests: week navigation, 330 classes load
  
- [ ] 3.3: Subjects Page (`app/subjects/page.tsx`)
  - Layout: 11 subject cards (color-coded tokens)
  - Fetch from `/api/subjects`
  - Tests: sorting by urgency (red first)

### Batch 4: Utilities (Queued)
- [ ] 4.1: CGPA Logic (`lib/logic/cgpa.ts`)
  - Input: array of {course, grade, credits}
  - Output: CGPA, projected range, gap
  - Tests: 9.6 target, gap calculation
  
- [ ] 4.2: Token Logic (`lib/logic/tokens.ts`)
  - Input: subject data, attendance logs
  - Output: tokens_remaining, status (green/yellow/red)
  - Tests: all 11 subjects, color states

### Batch 5: Mobile + Offline (Queued)
- [ ] 5.1: Service Worker (`public/sw.js`)
  - Cache app shell
  - Handle offline requests
  - Tests: offline, network restored
  
- [ ] 5.2: Responsive Design
  - Mobile (375×812): full-width cards, safe area
  - Tablet (768×1024): 2-column grid
  - Desktop (1280×800): 3-column + sidebar
  - Tests: Lighthouse >90

### Batch 6: Testing (Queued)
- [ ] 6.1: Unit Tests (`tests/`)
  - CGPA calculation (10 tests)
  - Token logic (5 tests)
  - CSV parsing (6 tests)
  
- [ ] 6.2: Integration Tests
  - Import timetable → verify DB
  - Spend bunk → verify token update
  - Tests: E2E with real DB
  
- [ ] 6.3: Manual Testing
  - Real device (iPhone + Android)
  - Network throttling (4G)
  - Offline mode

---

## Build Order (Parallel Where Possible)

```
Week 1:
  Day 1-2:   Database + Auth (0001_phase1.sql, /api/auth/user)
  Day 3-4:   Dashboard API (/api/dashboard)
  Day 5-6:   Timetable API (import, GET, POST)
  Day 7:     Attendance API (spend bunk)

Week 2:
  Day 1-2:   Home component (fetch dashboard, render)
  Day 3-4:   Timetable component (week view, edit)
  Day 5:     Subjects component (token vault)
  Day 6:     Business logic (CGPA, tokens)
  Day 7:     Mobile + responsive

Week 3:
  Day 1-2:   Testing (unit + integration)
  Day 3-4:   Debugging + performance
  Day 5-6:   Staging deployment (Supabase + Vercel)
  Day 7:     Go live verification
```

---

## Progress Log

**2026-07-24 (Today)**:
- ✅ Database migration created (0001_phase1.sql)
- ✅ Local dev setup guide (LOCAL-DEV-SETUP.md)
- ✅ Build tracker (this file)
- ✅ TypeScript types (lib/types.ts)
- ✅ Auth API (`/api/auth/user.ts`)
- ✅ Dashboard API (`/api/dashboard.ts`)
- 🔄 Batch 2 APIs: 2/11 complete

**IMMEDIATE NEXT (Do Now)**:
1. Start local Supabase: `npx supabase start`
2. Apply migration: `npm run migrate:up`
3. Start dev server: `npm run dev`
4. Test `/api/auth/user` (should return user or 401)
5. Test `/api/dashboard` (should return mock data)

**Then Build**:
- [ ] `/api/timetable/route.ts` (GET timetable, POST import CSV)
- [ ] `/api/attendance/override.ts` (POST spend bunk)
- [ ] `/api/subjects/route.ts` (GET all subjects)
- [ ] Home component (fetch dashboard, render)
- [ ] Timetable component (week view)
- [ ] Subjects component (token vault)

---

## Key Metrics to Track

**Code Quality**:
- TypeScript errors: 0 (strict mode)
- Test coverage: >80%
- Performance: Lighthouse >90 (mobile)

**Functionality**:
- All 11 APIs working locally
- All 3 screens rendering correctly
- CSV import: 330 rows in <3 seconds
- Spend bunk: confirmation → update in <500ms
- Dashboard loads in <2 seconds

**Readiness for Week 5**:
- [ ] Live at https://mba-os.vercel.app
- [ ] Can import timetable
- [ ] Can view schedule + tokens
- [ ] Can spend bunks
- [ ] Dashboard shows CGPA
- [ ] Offline fallback working
- [ ] Mobile responsive + tested

---

**Status**: Batch 1 Complete. Batch 2 Starting. Target: Week 5 Live.
