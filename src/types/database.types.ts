// ============================================================
// database.types.ts
// Auto-generated from supabase/schema.sql
// Place this file at: src/types/database.types.ts
// ============================================================

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
      studies: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'matchup' | 'stats' | 'analysis'
          sport: string
          body: string
          confidence: number
          spread: string | null
          total: string | null
          tags: string[]
          pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          type?: 'matchup' | 'stats' | 'analysis'
          sport?: string
          body?: string
          confidence?: number
          spread?: string | null
          total?: string | null
          tags?: string[]
          pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'matchup' | 'stats' | 'analysis'
          sport?: string
          body?: string
          confidence?: number
          spread?: string | null
          total?: string | null
          tags?: string[]
          pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          game: string
          sport: string
          date: string
          type: 'spread' | 'total' | 'ml'
          pick: string
          confidence: number
          outcome: 'win' | 'loss' | 'push' | 'pending'
          linked_study_id: string | null
          linked_study_title: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game: string
          sport: string
          date: string
          type: 'spread' | 'total' | 'ml'
          pick: string
          confidence: number
          outcome?: 'win' | 'loss' | 'push' | 'pending'
          linked_study_id?: string | null
          linked_study_title?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game?: string
          sport?: string
          date?: string
          type?: 'spread' | 'total' | 'ml'
          pick?: string
          confidence?: number
          outcome?: 'win' | 'loss' | 'push' | 'pending'
          linked_study_id?: string | null
          linked_study_title?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'predictions_linked_study_id_fkey'
            columns: ['linked_study_id']
            referencedRelation: 'studies'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ── Convenience row types ────────────────────────────────────
// Use these throughout the app instead of redefining interfaces

export type Study = Database['public']['Tables']['studies']['Row']
export type StudyInsert = Database['public']['Tables']['studies']['Insert']
export type StudyUpdate = Database['public']['Tables']['studies']['Update']

export type Prediction = Database['public']['Tables']['predictions']['Row']
export type PredictionInsert = Database['public']['Tables']['predictions']['Insert']
export type PredictionUpdate = Database['public']['Tables']['predictions']['Update']

// ── Enum aliases ─────────────────────────────────────────────
export type StudyType = 'matchup' | 'stats' | 'analysis'
export type PickType  = 'spread' | 'total' | 'ml'
export type Outcome   = 'win' | 'loss' | 'push' | 'pending'