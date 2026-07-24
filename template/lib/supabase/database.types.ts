export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          code: string
          name: string
          credits: number
          professor: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          name: string
          credits: number
          professor: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          name?: string
          credits?: number
          professor?: string
          created_at?: string
        }
      }
      timetable_entries: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          day_of_week: string
          start_time: string
          end_time: string
          room: string
          week_number: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          day_of_week: string
          start_time: string
          end_time: string
          room: string
          week_number: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          day_of_week?: string
          start_time?: string
          end_time?: string
          room?: string
          week_number?: number
          created_at?: string
        }
      }
      attendance_logs: {
        Row: {
          id: string
          user_id: string
          timetable_entry_id: string
          status: string
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          timetable_entry_id: string
          status: string
          logged_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          timetable_entry_id?: string
          status?: string
          logged_at?: string
          created_at?: string
        }
      }
      work_items: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title: string
          type: string
          status: string
          priority: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title: string
          type: string
          status: string
          priority: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title?: string
          type?: string
          status?: string
          priority?: number
          created_at?: string
        }
      }
      research_projects: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title: string
          project_type: string
          status: string
          progress_percent: number
          target_completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title: string
          project_type: string
          status: string
          progress_percent: number
          target_completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title?: string
          project_type?: string
          status?: string
          progress_percent?: number
          target_completion_date?: string | null
          created_at?: string
        }
      }
      nptel_courses: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          course_id: string
          course_name: string
          course_code: string | null
          instructor: string | null
          duration_weeks: number | null
          total_lectures: number | null
          lectures_completed: number
          status: string
          enrollment_date: string | null
          target_completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          course_id: string
          course_name: string
          course_code?: string | null
          instructor?: string | null
          duration_weeks?: number | null
          total_lectures?: number | null
          lectures_completed?: number
          status?: string
          enrollment_date?: string | null
          target_completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          course_id?: string
          course_name?: string
          course_code?: string | null
          instructor?: string | null
          duration_weeks?: number | null
          total_lectures?: number | null
          lectures_completed?: number
          status?: string
          enrollment_date?: string | null
          target_completion_date?: string | null
          created_at?: string
        }
      }
      nptel_assignments: {
        Row: {
          id: string
          user_id: string
          nptel_course_id: string
          assignment_number: number | null
          title: string
          description: string | null
          due_date: string | null
          max_score: number
          score_obtained: number | null
          status: string
          submission_date: string | null
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nptel_course_id: string
          assignment_number?: number | null
          title: string
          description?: string | null
          due_date?: string | null
          max_score?: number
          score_obtained?: number | null
          status?: string
          submission_date?: string | null
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nptel_course_id?: string
          assignment_number?: number | null
          title?: string
          description?: string | null
          due_date?: string | null
          max_score?: number
          score_obtained?: number | null
          status?: string
          submission_date?: string | null
          feedback?: string | null
          created_at?: string
        }
      }
      nptel_certificates: {
        Row: {
          id: string
          user_id: string
          nptel_course_id: string
          certificate_type: string
          issue_date: string | null
          certificate_url: string | null
          score_percentage: number | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nptel_course_id: string
          certificate_type: string
          issue_date?: string | null
          certificate_url?: string | null
          score_percentage?: number | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nptel_course_id?: string
          certificate_type?: string
          issue_date?: string | null
          certificate_url?: string | null
          score_percentage?: number | null
          status?: string
          created_at?: string
        }
      }
      lecture_notes: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title: string
          content: string | null
          comprehension_level: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title: string
          content?: string | null
          comprehension_level?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title?: string
          content?: string | null
          comprehension_level?: number
          created_at?: string
        }
      }
      group_projects: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          project_name: string
          group_members: number
          status: string
          progress_percent: number
          target_completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          project_name: string
          group_members: number
          status: string
          progress_percent: number
          target_completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          project_name?: string
          group_members?: number
          status?: string
          progress_percent?: number
          target_completion_date?: string | null
          created_at?: string
        }
      }
      artifacts: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title: string
          artifact_type: string
          status: string
          quality_score: number | null
          revision_number: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title: string
          artifact_type: string
          status: string
          quality_score?: number | null
          revision_number?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title?: string
          artifact_type?: string
          status?: string
          quality_score?: number | null
          revision_number?: number
          created_at?: string
        }
      }
      db_meta: {
        Row: {
          version: number | null
          name: string
          filename: string
          sha256: string
          applied_at: string
        }
        Insert: {
          version?: number | null
          name: string
          filename: string
          sha256: string
          applied_at?: string
        }
        Update: {
          version?: number | null
          name?: string
          filename?: string
          sha256?: string
          applied_at?: string
        }
      }
      example_widget: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
    }
    Views: {}
    Functions: {
      keepalive: {
        Args: {}
        Returns: string
      }
    }
    Enums: {}
  }
}
