# Discovery Brief — MBA Execution OS

**Status**: LOCKED (ready for doc-gen-master)  
**Date**: 2026-07-24  
**User**: Purven Bhavsar (MBA Semester I, Adani University)

---

## Executive Summary

A **personal execution OS** — a mobile-first PWA that externalizes the brain, making tasks visible so procrastination stops. The core philosophy: **default to auto-tracking, act only to override or add**. Combines college attendance (11 subjects via timetable) + personal research projects + NPTEL skill-up + design journals + group project tracking into **one unified daily view**.

---

## The Problem (Why This Exists)

- **Cognitive overload**: Too much info (classes, deadlines, research phases, notes due, journal entries) → brain shutdown → procrastination
- **Manual entry friction**: Telling the app "I attended class X today" every single day = 99% chance I stop using it by week 3
- **Scattered tracking**: Timetable → Google Keep → physical notebook → email reminders = chaos, nothing synced, half of it forgotten
- **Goal**: See the day's work in one place → click → do it → move on. No thinking, no procrastination.

---

## What We're Building

### Audience
- **Single user**: You (MBA Semester I)
- **Device**: Mobile-first responsive PWA (use on phone/tablet, works offline)
- **Network**: Campus WiFi mostly; offline critical when visiting MSME sites
- **Device classes**: Assume modern smartphone (iPhone/Android 2020+)

### The Dual-Horizon Layout

#### **HORIZON 1: TACTICAL (The "Now")**
What you do today.

**1.1 Live Next Class Card**
- Fetches from your Google Calendar (via webhook auto-sync)
- Shows: Subject, time, room, professor
- Two actions:
  - "Auto-logged" (default — I attended, no token spent)
  - "Spend Bunk" (I'm skipping, -1 token for this subject)
- **Special case**: If class cancelled/moved, you tell the app and it's gone

**1.2 Buffer Vault (Token Display)**
- All 11 subjects, colored by token health:
  - **Green**: >5 tokens remaining (plenty of room)
  - **Yellow**: 3-4 tokens (watch it)
  - **Red pulsing**: <2 tokens (danger, use sparingly)
- Shows: Current tokens / max allowed (e.g., "9/9 FRA")

**1.3 Pending Tasks for Today**
- Auto-populated from:
  - Lectures delivered today → notes still pending
  - DT classes → journals still pending
  - Group projects → checkpoint due today
  - NPTEL → assignments due
  - Research sections → work due
- Goal: "Open app, see 5 things, do them, close app"

#### **HORIZON 2: STRATEGIC (The "Horizon")**
Longer-term work (research projects, weekly progress).

**2.1 Research Projects** (e.g., Nuclear Paper)
- **Sections** (not phases):
  - History: ✓ Done
  - Small Reactor Tech: ✓ Done
  - Demand Catalyst: In progress (2/5 books read, rough notes pending)
  - Policy Framework: Waiting
  - Final Synthesis: Waiting
- Each section shows:
  - % complete (visual progress bar)
  - Current block (what you're working on now)
  - Due date (if any)
- Manually marked "done" by you when section completes

**2.2 Per-Subject Progress**
- **FRA**: 10 lectures total, attended 8, notes written for 7 (lecture #5 notes pending, #9 notes pending)
- **DT**: 6 classes, 6 journals done, 4 more classes pending
- **MM Group Project**: 60% complete (research phase done, drafting in progress)
- Shows which artifacts are missing (red = pending, green = done)

**2.3 NPTEL Tracking**
- 4 courses linked (you manually check off when done, no API)
- Per course: lectures watched (8/12), assignments done (1/2), certificate (earned/pending)

---

## Core Sections & Phases

### **SECTION 1: Timetable + Attendance (Default Logging)**

**What it does:**
- Imports timetable (18 weeks, 11 subjects, CR-1/CR-3 sections)
- **Default**: Every class is marked "attended" unless you override
- You only act when:
  - Class is **cancelled** → you remove it
  - Class is **added/moved** → you add/update it
  - You're **actually skipping** → "Spend Bunk" button

**Why this works:**
- Zero daily friction (no "did I attend?" entries)
- You control cancellations = timetable always correct
- Token system incentivizes smart skipping (skip low-value, attend high-impact)

**Phase 1.1**: Import timetable + sync with Google Calendar  
**Phase 1.2**: Attendance override UI (cancel/add/move classes, spend bunk button)  
**Phase 1.3**: Live dashboard (next class card + buffer vault)

---

### **SECTION 2: Lecture Notes Tracking**

**What it does:**
- Per lecture: tracks if notes exist (yes/no)
- You keep physical notes; app just tracks the fact
- Shows: "FRA has 10 lectures, you've written notes for 7"
- **Future**: Optional AI digitization (you upload photos of notes, app extracts text)

**Why this works:**
- Lightweight (no forced digital note-taking)
- Visible reminder (red pending notes = motivation to catch up)
- Exam time: quick review of what notes exist

**Phase 2.1**: Per-lecture notes checklist (yes/no per lecture)  
**Phase 2.2**: Per-subject notes summary (X/10 notes written)  
**Phase 2.3**: Optional: link to Google Drive folder per subject (centralize notes)

---

### **SECTION 3: Research Projects**

**What it does:**
- Track research work in **sections** (not phases)
  - Nuclear paper: History → SMR Tech → Demand Catalyst → Policy → Synthesis
  - Each section has milestones, due dates, completion status
- You manually create sections + mark "done" when finished
- Shows progress bar + current focus

**Why this works:**
- Mirrors how you actually work (sections evolve, not fixed phases)
- Visible progress = motivation to keep going
- Reduces context-switching ("where was I in the nuclear paper?")

**Phase 3.1**: Create/edit research projects + sections  
**Phase 3.2**: Track progress per section (text + due date + status)  
**Phase 3.3**: Research project dashboard (overview of all projects)

---

### **SECTION 4: Artifacts & Assignments**

**Subsection 4A: NPTEL Tracking**
- 4 courses manually tracked (no API available)
- Per course: lectures watched, assignments, certificate status
- Due dates for assignments

**Subsection 4B: Design Thinking Journals**
- DT requires journal per class
- Track: "Class 1 ✓ | Class 2 ✓ | Class 3 ✓ | Class 4 ✗ | Class 5 ✗"
- System shows: if DT class #N delivered but journal #N not marked done → flag as pending

**Subsection 4C: Group Projects**
- Per subject: track group project progress
- Track: who's assigned, sections (research/draft/final), completion %
- Due dates per milestone

**Phase 4.1**: NPTEL course checklist + assignment tracking  
**Phase 4.2**: Design journal per class (auto-triggered by DT lecture)  
**Phase 4.3**: Group project tracking (milestone + team view)

---

## Craft Tier: **SIGNATURE**

This is a **Signature-tier** build. Why?
- **Not Essential** (Essential is clean + minimal; this needs to feel *motivating*, memorable UI)
- **Not Flagship** (no 3D, no cinematic scroll; focus is clarity, not spectacle)
- **Signature**: The dark theme + smooth micro-interactions (slide-in modals, progress animations, color-coded token urgency) + the "visible tasks = unstoppable drive" UX is the entire sell. The polish + motion is what makes you *want* to open the app.

**Required degradation**: No-JS static fallback (text-only, no animations), but fully functional.

**Craft elements** (from IDP elements/):
- `reveal` (tasks fade in as you scroll)
- `smooth-scroll` (timetable/research list scrolls smoothly)
- `microinteractions` (token button press → visual feedback)
- Optional: `horizontal-scroll` (NPTEL course carousel)

---

## Data Model (from System Architecture Document)

### Subjects (Master)
```sql
CREATE TABLE subjects (
  id UUID,
  code TEXT (e.g., 'FRA'),
  name TEXT,
  total_sessions INT (e.g., 45 for FRA),
  max_bunks_allowed INT (e.g., 9),
  tokens_remaining INT
);
```

### Timetable (Flexible)
```sql
CREATE TABLE timetable_entries (
  id UUID,
  subject_id UUID,
  week INT,
  day_of_week TEXT,
  time_slot TEXT (e.g., '9:10-10:00'),
  room TEXT,
  professor_id UUID,
  status TEXT ('scheduled', 'cancelled', 'moved'),
  calendar_event_id TEXT (Google Calendar sync)
);
```

### Attendance Logs
```sql
CREATE TABLE attendance_logs (
  id UUID,
  subject_id UUID,
  timetable_entry_id UUID,
  date DATE,
  status TEXT ('attended', 'bunked', 'cancelled'),
  auto_logged BOOLEAN (TRUE if cron did it),
  token_spent BOOLEAN
);
```

### Lecture Notes
```sql
CREATE TABLE lecture_notes (
  id UUID,
  subject_id UUID,
  lecture_number INT,
  notes_exist BOOLEAN,
  notes_url TEXT (optional Google Drive link),
  date_written DATE
);
```

### Research Projects & Sections
```sql
CREATE TABLE research_projects (
  id UUID,
  title TEXT,
  description TEXT,
  due_date DATE
);

CREATE TABLE research_sections (
  id UUID,
  project_id UUID,
  section_name TEXT (e.g., 'History'),
  description TEXT,
  completion_percent INT,
  due_date DATE,
  status TEXT ('pending', 'in_progress', 'done'),
  order_num INT
);
```

### NPTEL Courses
```sql
CREATE TABLE nptel_courses (
  id UUID,
  title TEXT,
  url TEXT,
  lectures_total INT,
  lectures_watched INT,
  assignments_total INT,
  assignments_done INT,
  certificate_earned BOOLEAN
);
```

### Artifacts (Journals, Group Projects)
```sql
CREATE TABLE artifacts (
  id UUID,
  type TEXT ('journal', 'group_project', 'assignment'),
  subject_id UUID,
  name TEXT,
  description TEXT,
  completion_percent INT,
  due_date DATE,
  status TEXT ('pending', 'in_progress', 'done')
);
```

---

## Backend Architecture (from SAD)

### Frontend (PWA)
- **Tech**: Next.js App Router + React 19 + Tailwind v4
- **State**: Volatile (UI toggles) + Server (attendance, tokens) + Offline (field logs in IndexedDB)
- **Service Worker**: Offline shell caching + background sync for field logs
- **Icons**: Lucide React

### Backend
- **Tech**: Next.js API routes + Supabase (PostgreSQL)
- **Authentication**: Google OAuth SSO (to read Calendar)
- **Core routes**:
  - `GET /api/dashboard` → next class + tokens + pending tasks
  - `POST /api/attendance/override` → spend bunk
  - `POST /api/field-logs/sync` → sync MSME logs from offline queue
  - `POST /api/webhooks/gcal` → receive calendar changes

### Automation
- **Cron job** (nightly): Fetch today's calendar events, auto-log as "attended" unless user overridden
- **Webhook listener**: Listen for calendar reschedules (if prof moves class, update timetable)

### Database
- **Postgres** (via Supabase)
- **RLS**: All rows mapped to authenticated user (single-user app)

---

## Implementation Phases

### Phase 0 (DONE)
- ✓ Site initialized from IDP
- ✓ PRD + mockup + SAD in place
- ✓ CLAUDE.md filled

### Phase 1: Core Attendance (Weeks 1-2)
- Timetable import (CSV → DB)
- Google Calendar sync (OAuth + webhook)
- Attendance logging (default + override)
- Buffer vault UI (token display)
- Auto-log cron (nightly, off-by-one on cancelled classes)
- **Deliverable**: Home screen shows live class + tokens + can skip classes

### Phase 2: Lecture Notes Tracking (Week 3)
- Per-lecture notes checklist
- Per-subject notes summary
- Link to Google Drive per subject
- **Deliverable**: "Notes pending" visible on dashboard

### Phase 3: Research Projects (Week 4)
- Create/edit research projects + sections
- Progress tracking per section
- Research dashboard
- **Deliverable**: Nuclear paper (sections) visible, can mark "done"

### Phase 4: Artifacts & Assignments (Week 5)
- NPTEL tracking (manual checklist)
- DT journal auto-trigger (per class)
- Group project tracking
- Smart pending (if class delivered → artifact pending shown)
- **Deliverable**: All pending tasks visible on home dashboard

### Phase 5: Polish & Deploy (Week 6)
- Dark theme tokens (already in mockup)
- Micro-interactions (button press → feedback)
- No-JS fallback (static text)
- Mobile responsiveness (tested on real phone)
- Background sync for field logs (if future MSME logging added)
- **Deliverable**: Production PWA live

---

## Open Questions (Resolved)

| Q | Answer |
|---|--------|
| Lecture changes? | You manually edit in-app (cancel/add/move). Timetable stays flexible. |
| Notes tracking? | Per lecture (yes/no). Word count optional for future. You decide if/when to digitize. |
| Research phases? | Sections (you define), manually marked done. No auto-unlock. |
| What to ship first? | All sections together (timetable + notes + research + artifacts) = complete value. |
| NPTEL integration? | No direct API. Manual checklist per course. |
| MSME field logging? | Future (Phase 5+). Not in Semester I scope. |

---

## Tightened Brief for doc-gen-master

**Title**: MBA Execution OS — Personal Productivity Dashboard

**One-liner**: A mobile-first PWA that turns college timetable + personal research + NPTEL courses into a single daily task list, auto-logging attendance so you only act to override.

**Core features**:
1. **Default-to-attending** timetable (you override to skip classes, spending tokens strategically)
2. **Live next class** card (from Google Calendar, real-time updates)
3. **Buffer token vault** (per subject, color-coded urgency)
4. **Pending tasks** (lecture notes due, research sections, NPTEL assignments, DT journals, group projects)
5. **Research projects** (track sections + progress)
6. **NPTEL tracking** (manual course checklist)

**Design**: Dark theme, Signature craft tier, smooth micro-interactions, mobile-first

**Tech stack**: Next.js + React + Tailwind v4 + Supabase + Google OAuth + Service Worker (offline-ready)

**Audience**: Single user (MBA student), mobile-first, campus WiFi + offline capable

**Timeline**: 6 weeks (Phases 1-5)

---

## Files in This Repo

- `docs/prd.md` — Original PRD (for reference)
- `docs/ui-reference.html` — Mockup (Tailwind dark theme, Dual Horizon layout)
- `docs/system-architecture.md` — SAD (backend topology, data flow, auth, offline sync)
- `docs/discovery-brief.md` — THIS FILE (locked brief, ready for doc-gen-master)
- `CLAUDE.md` — Session context anchor (update after each phase)

---

## Ready to Proceed?

**Next step**: Run `doc-gen-master` skill to generate:
- `01-business-brief.md`
- `02-prd.md` (detailed, structured)
- `03-data-model.md`
- `04-design-system.md`
- `05-content-map.md`
- ... (docs 06-11)

These feed directly into Phase 1 build.

**Confirm?** (Y/N)
