-- Phase 3 Migration: Research + Artifacts + Journals + Group Projects
-- Created: 2026-07-24
-- Adds: research projects, journal entries, group projects, artifacts

-- migrate:up

-- 1. RESEARCH_PROJECTS TABLE (2 papers + white paper)
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL CHECK (project_type IN ('research_paper', 'white_paper', 'case_study')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'research', 'drafting', 'review', 'submitted', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  start_date DATE,
  target_completion_date DATE,
  submitted_date DATE,
  evidence_link TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. JOURNAL_ENTRIES TABLE (auto-triggered from DT classes)
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  lecture_note_id UUID REFERENCES lecture_notes(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('design_thinking', 'reflection', 'project_milestone', 'manual')),
  title TEXT NOT NULL,
  reflection_content TEXT,
  insights TEXT,
  action_items TEXT,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. GROUP_PROJECTS TABLE (with milestones)
CREATE TABLE group_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  group_members INTEGER,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'submitted')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  target_completion_date DATE,
  submitted_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. PROJECT_MILESTONES TABLE (track progress on group projects)
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_project_id UUID NOT NULL REFERENCES group_projects(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 5. ARTIFACTS TABLE (research papers, case studies, presentations)
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN ('paper', 'presentation', 'case_study', 'analysis', 'prototype', 'dataset')),
  title TEXT NOT NULL,
  description TEXT,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  evidence_link TEXT,
  submission_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected')),
  feedback TEXT,
  revision_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 6. ROW LEVEL SECURITY
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "research_projects_select" ON research_projects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "research_projects_insert" ON research_projects FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "research_projects_update" ON research_projects FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "research_projects_delete" ON research_projects FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "journal_entries_select" ON journal_entries FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "journal_entries_insert" ON journal_entries FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "journal_entries_update" ON journal_entries FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "journal_entries_delete" ON journal_entries FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "group_projects_select" ON group_projects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "group_projects_insert" ON group_projects FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "group_projects_update" ON group_projects FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "group_projects_delete" ON group_projects FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "project_milestones_select" ON project_milestones FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "project_milestones_insert" ON project_milestones FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "project_milestones_update" ON project_milestones FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "project_milestones_delete" ON project_milestones FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "artifacts_select" ON artifacts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "artifacts_insert" ON artifacts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "artifacts_update" ON artifacts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "artifacts_delete" ON artifacts FOR DELETE USING (user_id = auth.uid());

-- 7. INDEXES
CREATE INDEX idx_research_projects_user_subject ON research_projects(user_id, subject_id);
CREATE INDEX idx_research_projects_status ON research_projects(status);
CREATE INDEX idx_journal_entries_user_subject ON journal_entries(user_id, subject_id);
CREATE INDEX idx_journal_entries_trigger ON journal_entries(trigger_type);
CREATE INDEX idx_group_projects_user_subject ON group_projects(user_id, subject_id);
CREATE INDEX idx_project_milestones_project ON project_milestones(group_project_id);
CREATE INDEX idx_artifacts_user_subject ON artifacts(user_id, subject_id);
CREATE INDEX idx_artifacts_type ON artifacts(artifact_type);

-- migrate:down

DROP TABLE IF EXISTS artifacts;
DROP TABLE IF EXISTS project_milestones;
DROP TABLE IF EXISTS group_projects;
DROP TABLE IF EXISTS journal_entries;
DROP TABLE IF EXISTS research_projects;
