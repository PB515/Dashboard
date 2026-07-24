-- Phase 2 Migration: Learning Mastery + Lecture Notes
-- Created: 2026-07-24
-- Adds: lecture_notes, comprehension tracking, quality rubrics

-- migrate:up

-- 1. LECTURE_NOTES TABLE (auto-generated from timetable)
CREATE TABLE lecture_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timetable_entry_id UUID NOT NULL REFERENCES timetable_entries(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  session_number INTEGER NOT NULL,
  topic TEXT,
  comprehension_level INTEGER CHECK (comprehension_level >= 0 AND comprehension_level <= 5),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  notes_text TEXT,
  evidence_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'reviewed')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, timetable_entry_id)
);

-- 2. QUALITY_RUBRICS TABLE (per subject, per work item type)
CREATE TABLE quality_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  work_type TEXT NOT NULL CHECK (work_type IN ('lecture_note', 'assignment', 'project', 'research')),
  criteria_1 TEXT,
  criteria_2 TEXT,
  criteria_3 TEXT,
  criteria_4 TEXT,
  criteria_5 TEXT,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, subject_id, work_type)
);

-- 3. COMPREHENSION_TRACKING TABLE (trends + gaps)
CREATE TABLE comprehension_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  avg_comprehension NUMERIC(3,2) CHECK (avg_comprehension >= 0 AND avg_comprehension <= 5),
  num_lectures INTEGER,
  gap_topics TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, subject_id, week)
);

-- 4. ROW LEVEL SECURITY
ALTER TABLE lecture_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprehension_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "lecture_notes_select" ON lecture_notes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "lecture_notes_insert" ON lecture_notes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "lecture_notes_update" ON lecture_notes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "lecture_notes_delete" ON lecture_notes FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "quality_rubrics_select" ON quality_rubrics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "quality_rubrics_insert" ON quality_rubrics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "quality_rubrics_update" ON quality_rubrics FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "quality_rubrics_delete" ON quality_rubrics FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "comprehension_tracking_select" ON comprehension_tracking FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "comprehension_tracking_insert" ON comprehension_tracking FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "comprehension_tracking_update" ON comprehension_tracking FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "comprehension_tracking_delete" ON comprehension_tracking FOR DELETE USING (user_id = auth.uid());

-- 5. INDEXES
CREATE INDEX idx_lecture_notes_user_subject ON lecture_notes(user_id, subject_id);
CREATE INDEX idx_lecture_notes_week ON lecture_notes(week);
CREATE INDEX idx_lecture_notes_comprehension ON lecture_notes(comprehension_level);
CREATE INDEX idx_comprehension_tracking_user_subject ON comprehension_tracking(user_id, subject_id);
CREATE INDEX idx_quality_rubrics_user_subject ON quality_rubrics(user_id, subject_id);

-- migrate:down

DROP TABLE IF EXISTS comprehension_tracking;
DROP TABLE IF EXISTS quality_rubrics;
DROP TABLE IF EXISTS lecture_notes;
