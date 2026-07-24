-- Phase 4 Migration: NPTEL Automation
-- Created: 2026-07-24
-- Adds: NPTEL courses, assignments, certificates

-- migrate:up

-- 1. NPTEL_COURSES TABLE
CREATE TABLE nptel_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_code TEXT,
  instructor TEXT,
  duration_weeks INTEGER,
  total_lectures INTEGER,
  lectures_completed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  enrollment_date DATE,
  target_completion_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 2. NPTEL_ASSIGNMENTS TABLE
CREATE TABLE nptel_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nptel_course_id UUID NOT NULL REFERENCES nptel_courses(id) ON DELETE CASCADE,
  assignment_number INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  max_score INTEGER DEFAULT 100,
  score_obtained INTEGER,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
  submission_date DATE,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, nptel_course_id, assignment_number)
);

-- 3. NPTEL_CERTIFICATES TABLE
CREATE TABLE nptel_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nptel_course_id UUID NOT NULL REFERENCES nptel_courses(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('elite', 'gold', 'silver', 'bronze')),
  issue_date DATE,
  certificate_url TEXT,
  score_percentage NUMERIC(5,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'eligible', 'issued')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, nptel_course_id)
);

-- 4. ROW LEVEL SECURITY
ALTER TABLE nptel_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE nptel_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nptel_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nptel_courses_select" ON nptel_courses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "nptel_courses_insert" ON nptel_courses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "nptel_courses_update" ON nptel_courses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "nptel_courses_delete" ON nptel_courses FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "nptel_assignments_select" ON nptel_assignments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "nptel_assignments_insert" ON nptel_assignments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "nptel_assignments_update" ON nptel_assignments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "nptel_assignments_delete" ON nptel_assignments FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "nptel_certificates_select" ON nptel_certificates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "nptel_certificates_insert" ON nptel_certificates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "nptel_certificates_update" ON nptel_certificates FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "nptel_certificates_delete" ON nptel_certificates FOR DELETE USING (user_id = auth.uid());

-- 5. INDEXES
CREATE INDEX idx_nptel_courses_user_subject ON nptel_courses(user_id, subject_id);
CREATE INDEX idx_nptel_courses_status ON nptel_courses(status);
CREATE INDEX idx_nptel_assignments_user_course ON nptel_assignments(user_id, nptel_course_id);
CREATE INDEX idx_nptel_assignments_due_date ON nptel_assignments(due_date);
CREATE INDEX idx_nptel_certificates_user ON nptel_certificates(user_id);

-- migrate:down

DROP TABLE IF EXISTS nptel_certificates;
DROP TABLE IF EXISTS nptel_assignments;
DROP TABLE IF EXISTS nptel_courses;
