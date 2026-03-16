import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CalibrationBucket, Prediction, TrackerStats, SportBreakdown } from '@/types'

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Prediction tracker stats
export function computeStats(predictions: Prediction[]): TrackerStats {
  const resolved = predictions.filter(p => p.outcome !== 'pending')
  const wins = predictions.filter(p => p.outcome === 'win').length
  const losses = predictions.filter(p => p.outcome === 'loss').length
  const pushes = predictions.filter(p => p.outcome === 'push').length
  const pending = predictions.filter(p => p.outcome === 'pending').length
  const winRate = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : 0
  const avgConfidence =
    predictions.length > 0
      ? parseFloat((predictions.reduce((a, b) => a + b.confidence, 0) / predictions.length).toFixed(1))
      : 0

  return { wins, losses, pushes, pending, winRate, avgConfidence, total: predictions.length }
}

// Sport-level breakdown
export function computeSportBreakdown(predictions: Prediction[]): SportBreakdown[] {
  const map: Record<string, { wins: number; losses: number; pushes: number }> = {}
  predictions
    .filter(p => p.outcome !== 'pending')
    .forEach(p => {
      if (!map[p.sport]) map[p.sport] = { wins: 0, losses: 0, pushes: 0 }
      if (p.outcome === 'win') map[p.sport].wins++
      else if (p.outcome === 'loss') map[p.sport].losses++
      else if (p.outcome === 'push') map[p.sport].pushes++
    })

  return Object.entries(map).map(([sport, rec]) => ({
    sport,
    wins: rec.wins,
    losses: rec.losses,
    pushes: rec.pushes,
    winRate: (rec.wins + rec.losses) > 0
      ? Math.round((rec.wins / (rec.wins + rec.losses)) * 100)
      : 0,
  }))
}

// Confidence calibration buckets
export function computeCalibrationBuckets(predictions: Prediction[]): CalibrationBucket[] {
  const buckets: CalibrationBucket[] = [
    { label: '1–4', range: [1, 4], actual: null, expected: 30, count: 0 },
    { label: '5–6', range: [5, 6], actual: null, expected: 50, count: 0 },
    { label: '7–8', range: [7, 8], actual: null, expected: 65, count: 0 },
    { label: '9–10', range: [9, 10], actual: null, expected: 85, count: 0 },
  ]

  const resolved = predictions.filter(p => p.outcome !== 'pending')

  buckets.forEach(bucket => {
    const inRange = resolved.filter(
      p => p.confidence >= bucket.range[0] && p.confidence <= bucket.range[1]
    )
    bucket.count = inRange.length
    if (inRange.length > 0) {
      const wins = inRange.filter(p => p.outcome === 'win').length
      bucket.actual = Math.round((wins / inRange.length) * 100)
    }
  })

  return buckets
}

// Confidence color
export function confidenceColor(c: number): string {
  if (c >= 8) return '#2d6a4f'
  if (c >= 6) return '#3b5bdb'
  return '#a09d98'
}
