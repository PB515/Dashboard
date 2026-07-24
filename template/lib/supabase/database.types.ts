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
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          code: string
          name: string
          credits: number
          professor: string | null
          total_sessions: number
          max_bunks_allowed: number
          bunks_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          name: string
          credits: number
          professor?: string | null
          total_sessions: number
          max_bunks_allowed: number
          bunks_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          name?: string
          credits?: number
          professor?: string | null
          total_sessions?: number
          max_bunks_allowed?: number
          bunks_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      timetable_entries: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          week: number
          day_of_week: string
          session: number
          time_slot: string
          room: string | null
          professor: string | null
          status: string
          calendar_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          week: number
          day_of_week: string
          session: number
          time_slot: string
          room?: string | null
          professor?: string | null
          status?: string
          calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          week?: number
          day_of_week?: string
          session?: number
          time_slot?: string
          room?: string | null
          professor?: string | null
          status?: string
          calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance_logs: {
        Row: {
          id: string
          user_id: string
          timetable_entry_id: string
          status: string
          bunk_token_spent: boolean
          marked_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          timetable_entry_id: string
          status?: string
          bunk_token_spent?: boolean
          marked_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          timetable_entry_id?: string
          status?: string
          bunk_token_spent?: boolean
          marked_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      work_items: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          type: string
          title: string
          description: string | null
          deadline: string | null
          status: string
          quality_score: number | null
          comprehension_level: number | null
          credit_weight: number | null
          assessment_weight: string | null
          evidence_link: string | null
          feedback: string | null
          revision_number: number
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          type: string
          title: string
          description?: string | null
          deadline?: string | null
          status?: string
          quality_score?: number | null
          comprehension_level?: number | null
          credit_weight?: number | null
          assessment_weight?: string | null
          evidence_link?: string | null
          feedback?: string | null
          revision_number?: number
          source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          type?: string
          title?: string
          description?: string | null
          deadline?: string | null
          status?: string
          quality_score?: number | null
          comprehension_level?: number | null
          credit_weight?: number | null
          assessment_weight?: string | null
          evidence_link?: string | null
          feedback?: string | null
          revision_number?: number
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
      research_projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          progress_percent: number
          status: string
          start_date: string | null
          target_completion_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          progress_percent?: number
          status?: string
          start_date?: string | null
          target_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          progress_percent?: number
          status?: string
          start_date?: string | null
          target_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nptel_courses: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          course_name: string
          course_code: string | null
          lectures_completed: number
          total_lectures: number | null
          assignments_submitted: number
          certificate_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          course_name: string
          course_code?: string | null
          lectures_completed?: number
          total_lectures?: number | null
          assignments_submitted?: number
          certificate_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          course_name?: string
          course_code?: string | null
          lectures_completed?: number
          total_lectures?: number | null
          assignments_submitted?: number
          certificate_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      rubrics: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          work_item_type: string | null
          criteria: string | null
          max_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          work_item_type?: string | null
          criteria?: string | null
          max_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          work_item_type?: string | null
          criteria?: string | null
          max_score?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
