// ── Study ──────────────────────────────────────────────
export type StudyType = 'matchup' | 'stats' | 'analysis'

export interface Study {
  id: string
  user_id: string
  title: string
  type: StudyType
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

export interface StudyInsert {
  title: string
  type: StudyType
  sport: string
  body?: string
  confidence?: number
  spread?: string
  total?: string
  tags?: string[]
}

export interface StudyUpdate extends Partial<StudyInsert> {
  pinned?: boolean
}

// ── Prediction ─────────────────────────────────────────
export type PickType = 'spread' | 'total' | 'ml'
export type Outcome = 'win' | 'loss' | 'push' | 'pending'

export interface Prediction {
  id: string
  user_id: string
  game: string
  sport: string
  date: string
  type: PickType
  pick: string
  confidence: number
  outcome: Outcome
  linked_study_id: string | null
  linked_study_title: string | null
  notes: string | null
  created_at: string
}

export interface PredictionInsert {
  game: string
  sport: string
  date: string
  type: PickType
  pick: string
  confidence: number
  outcome?: Outcome
  linked_study_id?: string | null
  notes?: string | null
}

// ── Analytics ──────────────────────────────────────────
export interface TrackerStats {
  wins: number
  losses: number
  pushes: number
  pending: number
  winRate: number
  avgConfidence: number
  total: number
}

export interface SportBreakdown {
  sport: string
  wins: number
  losses: number
  pushes: number
  winRate: number
}

export interface CalibrationBucket {
  label: string
  range: [number, number]
  actual: number | null
  expected: number
  count: number
}

// ── AI ─────────────────────────────────────────────────
export interface AIAnalysisRequest {
  studyId: string
  prompt: string
}

export interface AIAnalysisResponse {
  result: string
  studyId: string
}

// ── Supabase DB types ──────────────────────────────────
export type Database = {
  public: {
    Tables: {
      studies: {
        Row: Study
        Insert: Omit<Study, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Study, 'id' | 'user_id' | 'created_at'>>
      }
      predictions: {
        Row: Prediction
        Insert: Omit<Prediction, 'id' | 'created_at'>
        Update: Partial<Omit<Prediction, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
