-- Phase 1 Migration: Real Timetable + Subjects + Buffer Economy
-- Created: 2026-07-24
-- Database: Supabase PostgreSQL

-- migrate:up

-- 1. CREATE USERS TABLE (single-user system)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. CREATE SUBJECTS TABLE (11 MBA courses)
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK (credits IN (1, 2, 3)),
  professor TEXT,
  total_sessions INTEGER NOT NULL,
  max_bunks_allowed INTEGER NOT NULL,
  bunks_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, code)
);

-- 3. CREATE TIMETABLE_ENTRIES TABLE (330 sessions across 18 weeks)
CREATE TABLE timetable_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 18),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
  session INTEGER NOT NULL CHECK (session >= 1 AND session <= 8),
  time_slot TEXT NOT NULL,
  room TEXT,
  professor TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'moved')),
  calendar_event_id TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, week, day_of_week, session)
);

-- 4. CREATE ATTENDANCE_LOGS TABLE
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timetable_entry_id UUID NOT NULL REFERENCES timetable_entries(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attended' CHECK (status IN ('attended', 'bunked', 'cancelled', 'moved')),
  bunk_token_spent BOOLEAN DEFAULT false,
  marked_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, timetable_entry_id)
);

-- 5. CREATE WORK_ITEMS TABLE (unified model for all 7 systems)
CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'lecture_note', 'assignment', 'journal', 'research_section',
    'project_milestone', 'quiz', 'presentation', 'group_project'
  )),
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'submitted', 'graded')),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  comprehension_level INTEGER CHECK (comprehension_level >= 0 AND comprehension_level <= 5),
  credit_weight INTEGER CHECK (credit_weight IN (1, 2, 3)),
  assessment_weight TEXT,
  evidence_link TEXT,
  feedback TEXT,
  revision_number INTEGER DEFAULT 1,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 6. CREATE RESEARCH_PROJECTS TABLE
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed')),
  start_date DATE,
  target_completion_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 7. CREATE NPTEL_COURSES TABLE
CREATE TABLE nptel_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_code TEXT,
  lectures_completed INTEGER DEFAULT 0,
  total_lectures INTEGER,
  assignments_submitted INTEGER DEFAULT 0,
  certificate_status TEXT DEFAULT 'not_started',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 8. CREATE RUBRICS TABLE
CREATE TABLE rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  work_item_type TEXT,
  criteria TEXT,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 9. ROW LEVEL SECURITY (Single-user isolation)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nptel_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see/edit their own data
CREATE POLICY "users_select" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_update" ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "subjects_select" ON subjects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "subjects_insert" ON subjects FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "subjects_update" ON subjects FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "subjects_delete" ON subjects FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "timetable_entries_select" ON timetable_entries FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "timetable_entries_insert" ON timetable_entries FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "timetable_entries_update" ON timetable_entries FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "timetable_entries_delete" ON timetable_entries FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "attendance_logs_select" ON attendance_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "attendance_logs_insert" ON attendance_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "attendance_logs_update" ON attendance_logs FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "attendance_logs_delete" ON attendance_logs FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "work_items_select" ON work_items FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "work_items_insert" ON work_items FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "work_items_update" ON work_items FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "work_items_delete" ON work_items FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "research_projects_select" ON research_projects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "research_projects_insert" ON research_projects FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "research_projects_update" ON research_projects FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "research_projects_delete" ON research_projects FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "nptel_courses_select" ON nptel_courses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "nptel_courses_insert" ON nptel_courses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "nptel_courses_update" ON nptel_courses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "nptel_courses_delete" ON nptel_courses FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "rubrics_select" ON rubrics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "rubrics_insert" ON rubrics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "rubrics_update" ON rubrics FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "rubrics_delete" ON rubrics FOR DELETE USING (user_id = auth.uid());

-- 10. INDEXES (Performance)
CREATE INDEX idx_subjects_user_id ON subjects(user_id);
CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_timetable_user_week ON timetable_entries(user_id, week);
CREATE INDEX idx_timetable_subject ON timetable_entries(subject_id);
CREATE INDEX idx_timetable_day_session ON timetable_entries(day_of_week, session);
CREATE INDEX idx_attendance_user_id ON attendance_logs(user_id);
CREATE INDEX idx_attendance_timetable ON attendance_logs(timetable_entry_id);
CREATE INDEX idx_work_items_user_subject ON work_items(user_id, subject_id);
CREATE INDEX idx_work_items_type ON work_items(type);
CREATE INDEX idx_work_items_deadline ON work_items(deadline);
CREATE INDEX idx_research_user ON research_projects(user_id);
CREATE INDEX idx_nptel_user_subject ON nptel_courses(user_id, subject_id);
CREATE INDEX idx_rubrics_subject ON rubrics(subject_id);

-- migrate:down

DROP TABLE IF EXISTS rubrics;
DROP TABLE IF EXISTS nptel_courses;
DROP TABLE IF EXISTS research_projects;
DROP TABLE IF EXISTS work_items;
DROP TABLE IF EXISTS attendance_logs;
DROP TABLE IF EXISTS timetable_entries;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;
