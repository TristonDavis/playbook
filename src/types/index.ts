// ============================================================
// src/types/index.ts
// Single entry point for all app types.
// ============================================================

export type {
  Database,
  Json,
  Study,
  StudyInsert,
  StudyUpdate,
  Prediction,
  PredictionInsert,
  PredictionUpdate,
  StudyType,
  PickType,
  Outcome,
} from './database.types'

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

export interface AIAnalysisRequest {
  studyId: string
  prompt: string
}

export interface AIAnalysisResponse {
  result: string
  studyId: string
}
