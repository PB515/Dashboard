# Data Model — MBA Execution OS

**Version**: 1.0  
**Date**: 2026-07-24  
**Scope**: Foundation schema for all 7 systems, unified Work Item model  
**Status**: Ready for implementation

---

## Overview

All academic work (lectures, assignments, research, journals, projects) is stored as **Work Items** — a unified data structure with different views. This schema supports:
- ✓ Timetable + attendance tracking (opt-out model)
- ✓ Lecture notes per subject
- ✓ Research projects with user-defined sections
- ✓ Design thinking journals (auto-triggered per class)
- ✓ Group project milestones
- ✓ NPTEL courses + assignments
- ✓ Quality scoring (0–100, rubric-based)
- ✓ Comprehension tracking (0–5, evidence-based)

---

## Core Tables

### 1. Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**Purpose**: OAuth identity (Google)  
**Notes**: Single user per app instance (personal MBA OS)

---

### 2. Subjects (Master Data)
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- 'FRA', 'DT', 'HAW', etc.
  name TEXT NOT NULL, -- 'Financial Reporting & Accounting'
  credits INT NOT NULL, -- 1, 2, or 3
  total_sessions INT NOT NULL, -- 15, 30, 45 depending on credits
  max_bunks_allowed INT NOT NULL, -- Calculated from attendance rules (typically 25% of total_sessions)
  bunks_remaining INT DEFAULT 0, -- Updated as attendance_logs inserted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, code)
);
```
**Purpose**: Subject metadata (credits, bunk tokens, session count)  
**Example data**:
```
id | code | name | credits | total_sessions | max_bunks_allowed
1  | FRA  | Financial Reporting & Accounting | 3 | 45 | 11
2  | DT   | Design Thinking | 2 | 30 | 7
3  | HAW  | Health & Wellness | 1 | 15 | 3
```

---

### 3. Timetable Entries (Flexible Schedule)
```sql
CREATE TABLE timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  week INT NOT NULL, -- 1–18
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  time_slot TEXT NOT NULL, -- '9:10-10:00'
  room TEXT, -- 'Room 101'
  professor TEXT, -- professor name (optional)
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'cancelled', 'moved'
  calendar_event_id TEXT, -- Google Calendar event ID (for sync/webhook)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, week, day_of_week, time_slot)
);
```
**Purpose**: Source of truth for class schedule (18 weeks, 11 subjects, ~330 total classes)  
**Workflow**:
1. User imports timetable CSV → rows inserted
2. Sync with Google Calendar → `calendar_event_id` populated
3. Professor moves class → user updates in-app → record updated
4. Cron job fetches from this table nightly

---

### 4. Attendance Logs
```sql
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timetable_entry_id UUID NOT NULL REFERENCES timetable_entries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attended', 'bunked', 'cancelled')),
  auto_logged BOOLEAN DEFAULT FALSE, -- TRUE if cron inserted this
  token_spent BOOLEAN DEFAULT FALSE, -- TRUE if user spent a bunk token
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, timetable_entry_id, date)
);
```
**Purpose**: Record of attendance for each class  
**Workflow**:
- Default: Cron auto-inserts `status='attended'`, `auto_logged=true`
- Override: User clicks "Spend Bunk" → inserts `status='bunked'`, `token_spent=true`, `auto_logged=false`
- Cancelled class: Marked `status='cancelled'` (does not count as bunk)

**Key constraint**: `UNIQUE(user_id, timetable_entry_id, date)` prevents duplicate logs.

---

### 5. Work Items (Unified Model)
```sql
CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Identification
  type TEXT NOT NULL CHECK (type IN (
    'lecture_note', 'assignment', 'journal', 'research_section', 
    'project_milestone', 'quiz', 'presentation', 'group_project'
  )),
  course_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  
  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  
  -- Scheduling
  deadline DATE,
  week INT, -- Which week of semester (1–18)
  
  -- Assessment & Weight
  assessment_type TEXT, -- 'internal' (40%), 'mid' (20%), 'external' (40%)
  assessment_weight_percent INT, -- 0–100, how much of final grade
  credit_weight INT NOT NULL, -- 1, 2, or 3 (from subject.credits)
  
  -- Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'submitted', 'graded'
  )),
  
  -- Quality Scoring
  quality_score INT CHECK (quality_score >= 0 AND quality_score <= 100), -- 0–100 rubric
  rubric_used TEXT, -- Which rubric applied (subject-specific)
  
  -- Learning Mastery (Comprehension 0–5)
  comprehension_level INT CHECK (comprehension_level >= 0 AND comprehension_level <= 5),
  -- 0: Not reviewed
  -- 1: Recognize the concept
  -- 2: Recall with prompts
  -- 3: Explain without notes
  -- 4: Apply to new problem
  -- 5: Perform accurately under timed conditions
  
  -- Evidence & Feedback
  evidence_link TEXT, -- Google Drive / screenshot / submission link
  faculty_feedback TEXT, -- Feedback from professor
  revision_number INT DEFAULT 1, -- v1, v2, v3, etc.
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ, -- When user last reviewed this
  
  -- Trigger Info (for auto-created items)
  triggered_by_timetable_entry_id UUID REFERENCES timetable_entries(id) ON DELETE SET NULL
);
```
**Purpose**: Unified storage for all academic work, supports 7 system views  
**View Examples**:
```
-- Research View (filter by type='research_section')
SELECT * FROM work_items 
WHERE type='research_section' AND user_id=$1
ORDER BY deadline ASC;

-- Notes View (filter by type='lecture_note')
SELECT * FROM work_items 
WHERE type='lecture_note' AND course_id=$course_id AND user_id=$1
ORDER BY week ASC;

-- Journal View (filter by type='journal')
SELECT * FROM work_items 
WHERE type='journal' AND course_id=(SELECT id FROM subjects WHERE code='DT')
ORDER BY week ASC;

-- Dashboard View (all work items with quality < 8)
SELECT * FROM work_items 
WHERE user_id=$1 AND (quality_score < 80 OR status='pending')
ORDER BY credit_weight DESC, deadline ASC;
```

---

### 6. Research Projects (Container)
```sql
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- 'Nuclear Energy Paper', 'MSME Grid White Paper'
  description TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**Purpose**: Container for research work  
**Example**:
```
id | user_id | title | due_date
1  | user1   | Nuclear Energy Paper | 2026-11-15
2  | user1   | MSME Grid Research | 2026-10-30
3  | user1   | Policy White Paper | 2026-12-01
```

**Note**: Actual sections are stored as `work_items` with `type='research_section'` + `research_project_id` foreign key (see below).

---

### 7. Research Sections (Work Items with Project Reference)
```sql
-- NOT a separate table; research_sections are work_items with:
-- type='research_section'
-- A new field in work_items (see below)

ALTER TABLE work_items ADD COLUMN (
  research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
  section_order INT -- Order within project (1, 2, 3, ...)
);
```
**Purpose**: Track user-defined sections within research projects  
**Example work_items rows**:
```
id | type | title | research_project_id | status | quality_score
1  | research_section | History | project_1 | completed | 9
2  | research_section | SMR Tech | project_1 | completed | 8
3  | research_section | Demand Catalyst | project_1 | in_progress | 6
4  | research_section | Policy | project_1 | pending | NULL
5  | research_section | Synthesis | project_1 | pending | NULL
```

---

### 8. NPTEL Courses
```sql
CREATE TABLE nptel_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- 'Nuclear Energy Option', etc.
  course_url TEXT,
  lectures_total INT, -- 12, 20, etc.
  lectures_watched INT DEFAULT 0,
  assignments_total INT DEFAULT 0,
  assignments_done INT DEFAULT 0,
  certificate_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
**Purpose**: Track NPTEL course progress (manual, no API)  
**Note**: NPTEL assignments are also stored as `work_items` with `type='assignment'` and `nptel_course_id` (new field).

---

### 9. Rubrics (Reference Data)
```sql
CREATE TABLE rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  work_item_type TEXT, -- 'lecture_note', 'assignment', 'research_section', etc.
  name TEXT NOT NULL, -- 'FRA Assignment Rubric', 'Nuclear Paper Rubric'
  
  -- JSON structure: array of criteria
  criteria JSONB NOT NULL, 
  -- Example:
  -- [
  --   { "name": "Requirement coverage", "weight": 20, "max_points": 20 },
  --   { "name": "Conceptual correctness", "weight": 25, "max_points": 25 },
  --   { "name": "Analysis & originality", "weight": 25, "max_points": 25 },
  --   { "name": "Evidence & sources", "weight": 15, "max_points": 15 },
  --   { "name": "Structure & clarity", "weight": 10, "max_points": 10 },
  --   { "name": "Formatting", "weight": 5, "max_points": 5 }
  -- ]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, work_item_type)
);
```
**Purpose**: Store subject-specific rubrics for objective scoring  
**Will be populated**: During detailed subject planning (next month)

---

## Calculated Fields (Views or App Logic)

### Tokens Remaining (Per Subject)
```sql
-- For display: "FRA: 9/11 tokens remaining"
SELECT 
  s.id,
  s.code,
  s.max_bunks_allowed,
  COUNT(CASE WHEN al.status='bunked' THEN 1 END) as bunks_used,
  s.max_bunks_allowed - COUNT(CASE WHEN al.status='bunked' THEN 1 END) as bunks_remaining
FROM subjects s
LEFT JOIN timetable_entries te ON s.id = te.subject_id
LEFT JOIN attendance_logs al ON te.id = al.timetable_entry_id
WHERE s.user_id = $user_id
GROUP BY s.id;
```

### CGPA Projection (After Grades Posted)
```sql
-- Once final_grade is available on work_items, calculate:
SELECT 
  AVG(wi.final_grade * s.credits) / SUM(s.credits) as projected_cgpa
FROM work_items wi
JOIN subjects s ON wi.course_id = s.id
WHERE wi.user_id = $user_id AND wi.status='graded';
```

### Mastery Summary (Per Subject)
```sql
SELECT 
  s.code,
  COUNT(*) as total_items,
  COUNT(CASE WHEN wi.comprehension_level >= 4 THEN 1 END) as mastered,
  AVG(CAST(wi.comprehension_level AS FLOAT)) as avg_comprehension
FROM subjects s
LEFT JOIN work_items wi ON s.id = wi.course_id
WHERE s.user_id = $user_id
GROUP BY s.id;
```

---

## Indexes (Performance)

```sql
-- Fast lookups by user + status
CREATE INDEX idx_work_items_user_status ON work_items(user_id, status);

-- Fast lookups by subject
CREATE INDEX idx_work_items_course ON work_items(user_id, course_id);

-- Fast lookups by deadline
CREATE INDEX idx_work_items_deadline ON work_items(user_id, deadline);

-- Fast attendance lookups
CREATE INDEX idx_attendance_logs_date ON attendance_logs(user_id, date);

-- Fast timetable lookups
CREATE INDEX idx_timetable_week ON timetable_entries(user_id, week);
```

---

## Row Level Security (RLS) Policies

All tables have `user_id` column + RLS enabled:

```sql
-- Example for work_items:
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own work items"
  ON work_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work items"
  ON work_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work items"
  ON work_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Same pattern for all other tables
```

---

## Phase 1 Scope (What's Used)

Phase 1 implementation uses:
- ✅ `users` (via Google OAuth)
- ✅ `subjects` (master data, bunks tracked)
- ✅ `timetable_entries` (import, edit, schedule)
- ✅ `attendance_logs` (auto-log + override)

**Not yet used** (Phases 2–5):
- ⏳ `work_items` (foundation ready, used in Phase 2+)
- ⏳ `research_projects` (Phase 3)
- ⏳ `nptel_courses` (Phase 4)
- ⏳ `rubrics` (Phase 2, after subject detail planning)

---

## Migration Strategy

**Phase 1 migration** (`0001_phase1.sql`):
```sql
-- Create: users, subjects, timetable_entries, attendance_logs, RLS policies
-- No: work_items, research_projects, rubrics (Phase 2+)
```

**Phase 2 migration** (`0002_phase2.sql`):
```sql
-- Create: work_items, rubrics
-- Add: research_project_id to work_items
```

**Phase 3 migration** (`0003_phase3.sql`):
```sql
-- Create: research_projects
-- Add: nptel_course_id to work_items
```

**Phase 4 migration** (`0004_phase4.sql`):
```sql
-- Create: nptel_courses
-- Final schema locks
```

---

## Example Data (Test Seed)

```sql
INSERT INTO subjects (user_id, code, name, credits, total_sessions, max_bunks_allowed)
VALUES 
  (user_id, 'FRA', 'Financial Reporting & Accounting', 3, 45, 11),
  (user_id, 'DT', 'Design Thinking', 2, 30, 7),
  (user_id, 'HAW', 'Health & Wellness', 1, 15, 3),
  (user_id, 'ME', 'Managerial Economics', 2, 30, 7),
  (user_id, 'SM', 'Strategic Management', 2, 30, 7),
  (user_id, 'MC-I', 'Managerial Communication-I', 2, 30, 7),
  (user_id, 'MM', 'Marketing Management', 2, 30, 7),
  (user_id, 'OB', 'Organizational Behavior', 2, 30, 7),
  (user_id, 'IBE', 'International Business & Economics', 2, 30, 7),
  (user_id, 'IKS', 'Indian Knowledge Systems', 2, 30, 7),
  (user_id, 'ILR', 'Industrial & Labor Relations', 2, 30, 7),
  (user_id, 'OM', 'Operations Management', 2, 30, 7);

INSERT INTO timetable_entries (user_id, subject_id, week, day_of_week, time_slot, room, professor)
VALUES 
  (user_id, $fra_id, 1, 'Monday', '9:10-10:00', 'Room 101', 'Prof. Sharma'),
  (user_id, $fra_id, 1, 'Wednesday', '10:10-11:00', 'Room 101', 'Prof. Sharma'),
  -- ... repeat for all 330 classes across 18 weeks
;
```

---

## Notes

- **Unified vs. Silos**: All academic work flows through `work_items` but with different `type` filters. No separate tables for notes/journals/projects (simpler to query, maintain, and evolve).
- **Credits → CGPA**: `work_items.credit_weight` (1/2/3) directly ties to CGPA calculation. FRA work has 3× impact.
- **Auto-creation**: Timetable entries can trigger work_items creation (Phase 2) via cron or API hook.
- **Extensibility**: `work_items.triggered_by_timetable_entry_id` allows linking artifacts to specific classes (journal #5 → DT class #5).

---

**Status**: Ready for Phase 1 implementation. Migration SQL to follow in Phase 1 PRD.
