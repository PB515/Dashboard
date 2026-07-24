// Generated from database schema + hand-written extensions

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  code: string; // 'FRA', 'DT', 'HAW', etc.
  name: string;
  credits: 1 | 2 | 3;
  total_sessions: number;
  max_bunks_allowed: number;
  bunks_used: number;
  created_at: string;
  updated_at: string;
}

export interface SubjectWithTokens extends Subject {
  tokens_remaining: number;
  attended_count: number;
  status: 'abundant' | 'caution' | 'danger';
}

export interface TimetableEntry {
  id: string;
  user_id: string;
  subject_id: string;
  week: number; // 1–18
  day_of_week: string; // 'Monday', 'Tuesday', etc.
  time_slot: string; // '9:10-10:00'
  room?: string;
  professor?: string;
  status: 'scheduled' | 'cancelled' | 'moved';
  calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TimetableEntryWithSubject extends TimetableEntry {
  subject: {
    code: string;
    name: string;
    credits: 1 | 2 | 3;
  };
  attendance?: AttendanceLog;
}

export interface AttendanceLog {
  id: string;
  user_id: string;
  timetable_entry_id: string;
  date: string;
  status: 'attended' | 'bunked' | 'cancelled';
  auto_logged: boolean;
  token_spent: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkItem {
  id: string;
  user_id: string;
  type:
    | 'lecture_note'
    | 'assignment'
    | 'journal'
    | 'research_section'
    | 'project_milestone'
    | 'quiz'
    | 'presentation'
    | 'group_project';
  course_id: string;
  title: string;
  description?: string;
  deadline?: string;
  week?: number;
  assessment_type?: 'internal' | 'mid' | 'external';
  assessment_weight_percent?: number;
  credit_weight: 1 | 2 | 3;
  status: 'pending' | 'in_progress' | 'completed' | 'submitted' | 'graded';
  quality_score?: number; // 0–100
  rubric_used?: string;
  comprehension_level?: number; // 0–5
  evidence_link?: string;
  faculty_feedback?: string;
  revision_number: number;
  created_at: string;
  updated_at: string;
  last_reviewed_at?: string;
  triggered_by_timetable_entry_id?: string;
  research_project_id?: string;
  section_order?: number;
  nptel_course_id?: string;
}

export interface ResearchProject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface NPTELCourse {
  id: string;
  user_id: string;
  title: string;
  course_url?: string;
  lectures_total?: number;
  lectures_watched: number;
  assignments_total: number;
  assignments_done: number;
  certificate_earned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rubric {
  id: string;
  user_id: string;
  subject_id?: string;
  work_item_type: string;
  name: string;
  criteria: Array<{
    name: string;
    weight: number;
    max_points: number;
  }>;
  created_at: string;
  updated_at: string;
}

// API Response Types

export interface DashboardResponse {
  next_class: TimetableEntryWithSubject | null;
  token_vault: SubjectWithTokens[];
  pending_tasks: {
    urgent: WorkItem[];
    momentum: WorkItem[];
  };
  gold_medal_status: {
    earned_cgpa: number;
    projected_cgpa: {
      low: number;
      high: number;
    };
    target_cgpa: number;
    gap: {
      low: number;
      high: number;
      status: 'on_track' | 'at_risk' | 'critical';
    };
    mastery_percent: number;
    execution_risk: 'low' | 'medium' | 'high';
    data_status: 'current' | 'stale' | 'outdated';
    last_updated: string;
  };
}

export interface TimetableResponse {
  week: number;
  date_range: {
    start: string;
    end: string;
  };
  entries: TimetableEntryWithSubject[];
}

export interface AttendanceOverrideRequest {
  timetable_entry_id: string;
  date: string;
  action: 'bunk' | 'undo';
}

export interface AttendanceOverrideResponse {
  success: boolean;
  attendance: AttendanceLog;
  subject_tokens_updated: {
    subject_code: string;
    tokens_remaining: number;
    tokens_max: number;
  };
}

export interface SubjectsResponse {
  subjects: SubjectWithTokens[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}
