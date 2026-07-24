-- Phase 1: Timetable + Attendance + Subjects Foundation
-- migrate:up

-- Users (via Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects (Master Data)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- 'FRA', 'DT', 'HAW', etc.
  name TEXT NOT NULL,
  credits INT NOT NULL, -- 1, 2, or 3
  total_sessions INT NOT NULL, -- 15, 30, 45
  max_bunks_allowed INT NOT NULL,
  bunks_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, code)
);

-- Timetable Entries (Flexible Schedule)
CREATE TABLE IF NOT EXISTS timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  week INT NOT NULL, -- 1–18
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  time_slot TEXT NOT NULL, -- '9:10-10:00'
  room TEXT,
  professor TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'moved')),
  calendar_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, week, day_of_week, time_slot)
);

-- Attendance Logs
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timetable_entry_id UUID NOT NULL REFERENCES timetable_entries(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attended', 'bunked', 'cancelled')),
  auto_logged BOOLEAN DEFAULT FALSE,
  token_spent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, timetable_entry_id, date)
);

-- Work Items (Unified Model - Foundation for all 7 systems)
CREATE TABLE IF NOT EXISTS work_items (
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
  week INT, -- 1–18

  -- Assessment & Weight
  assessment_type TEXT, -- 'internal', 'mid', 'external'
  assessment_weight_percent INT, -- 0–100
  credit_weight INT NOT NULL, -- 1, 2, or 3

  -- Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'submitted', 'graded'
  )),

  -- Quality Scoring (0–100, rubric-based)
  quality_score INT CHECK (quality_score >= 0 AND quality_score <= 100),
  rubric_used TEXT,

  -- Learning Mastery (Comprehension 0–5)
  comprehension_level INT CHECK (comprehension_level >= 0 AND comprehension_level <= 5),

  -- Evidence & Feedback
  evidence_link TEXT,
  faculty_feedback TEXT,
  revision_number INT DEFAULT 1,

  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,

  -- Trigger Info
  triggered_by_timetable_entry_id UUID REFERENCES timetable_entries(id) ON DELETE SET NULL
);

-- Research Projects (Container)
CREATE TABLE IF NOT EXISTS research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- 'Nuclear Energy Paper', 'MSME Grid White Paper'
  description TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add research_project_id to work_items (for research sections)
ALTER TABLE work_items ADD COLUMN IF NOT EXISTS research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE;
ALTER TABLE work_items ADD COLUMN IF NOT EXISTS section_order INT;

-- NPTEL Courses
CREATE TABLE IF NOT EXISTS nptel_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  course_url TEXT,
  lectures_total INT,
  lectures_watched INT DEFAULT 0,
  assignments_total INT DEFAULT 0,
  assignments_done INT DEFAULT 0,
  certificate_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add nptel_course_id to work_items (for assignments)
ALTER TABLE work_items ADD COLUMN IF NOT EXISTS nptel_course_id UUID REFERENCES nptel_courses(id) ON DELETE CASCADE;

-- Rubrics (Reference Data)
CREATE TABLE IF NOT EXISTS rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  work_item_type TEXT,
  name TEXT NOT NULL,
  criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject_id, work_item_type)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nptel_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Example: subjects)
CREATE POLICY "Users can see own subjects"
  ON subjects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subjects"
  ON subjects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects"
  ON subjects FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies (attendance_logs)
CREATE POLICY "Users can see own attendance"
  ON attendance_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance"
  ON attendance_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance"
  ON attendance_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies (timetable_entries)
CREATE POLICY "Users can see own timetable"
  ON timetable_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timetable"
  ON timetable_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own timetable"
  ON timetable_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies (work_items)
CREATE POLICY "Users can see own work items"
  ON work_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work items"
  ON work_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work items"
  ON work_items FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies (research_projects)
CREATE POLICY "Users can see own research projects"
  ON research_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own research projects"
  ON research_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own research projects"
  ON research_projects FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies (nptel_courses)
CREATE POLICY "Users can see own nptel courses"
  ON nptel_courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nptel courses"
  ON nptel_courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nptel courses"
  ON nptel_courses FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes (Performance)
CREATE INDEX IF NOT EXISTS idx_work_items_user_status ON work_items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_work_items_course ON work_items(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_work_items_deadline ON work_items(user_id, deadline);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_date ON attendance_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_timetable_week ON timetable_entries(user_id, week);
CREATE INDEX IF NOT EXISTS idx_timetable_entry_date ON timetable_entries(week, day_of_week);

-- migrate:down

DROP TABLE IF EXISTS rubrics CASCADE;
DROP TABLE IF EXISTS nptel_courses CASCADE;
DROP TABLE IF EXISTS research_projects CASCADE;
DROP TABLE IF EXISTS work_items CASCADE;
DROP TABLE IF EXISTS attendance_logs CASCADE;
DROP TABLE IF EXISTS timetable_entries CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
