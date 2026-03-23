'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Info, Trash2 } from 'lucide-react'
import { Prediction, Outcome } from '@/types'
import {
  computeStats,
  computeSportBreakdown,
  computeCalibrationBuckets,
  confidenceColor,
  formatDate,
  cn,
} from '@/lib/utils'
import CalibrationChart from '@/components/tracker/CalibrationChart'
import DonutChart from '@/components/tracker/DonutChart'
import LogPredictionModal from '@/components/tracker/LogPredictionModal'

const FILTERS: { label: string; value: Outcome | 'all' }[] = [
  { label: 'All',     value: 'all' },
  { label: 'Win',     value: 'win' },
  { label: 'Loss',    value: 'loss' },
  { label: 'Push',    value: 'push' },
  { label: 'Pending', value: 'pending' },
]

const OUTCOME_STYLES: Record<Outcome, string> = {
  win:     'outcome-win',
  loss:    'outcome-loss',
  push:    'outcome-push',
  pending: 'outcome-pending',
}

const OUTCOME_LABELS: Record<Outcome, string> = {
  win:     '✓ Win',
  loss:    '✗ Loss',
  push:    '~ Push',
  pending: '● Pending',
}

const PICK_TYPE_STYLES: Record<string, string> = {
  spread: 'bg-blue-light text-blue',
  total:  'bg-purple-light text-purple',
  ml:     'bg-accent2-light text-accent2',
}

// Outcome cycle order when clicking the badge
const OUTCOME_CYCLE: Outcome[] = ['pending', 'win', 'loss', 'push']

export default function TrackerPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState<Outcome | 'all'>('all')
  const [modalOpen, setModalOpen]     = useState(false)
  const [updating, setUpdating]       = useState<string | null>(null)
  const [deleting, setDeleting]       = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/predictions')
    const data = res.ok ? await res.json() : []
    setPredictions(data as Prediction[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Cycle outcome: pending → win → loss → push → pending
  async function cycleOutcome(prediction: Prediction) {
    const currentIndex = OUTCOME_CYCLE.indexOf(prediction.outcome)
    const nextOutcome  = OUTCOME_CYCLE[(currentIndex + 1) % OUTCOME_CYCLE.length]

    // Optimistic update
    setPredictions(prev =>
      prev.map(p => p.id === prediction.id ? { ...p, outcome: nextOutcome } : p)
    )
    setUpdating(prediction.id)

    try {
      const res = await fetch('/api/predictions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prediction.id, outcome: nextOutcome }),
      })
      if (!res.ok) throw new Error('Failed to update')
    } catch {
      // Revert on failure
      setPredictions(prev =>
        prev.map(p => p.id === prediction.id ? { ...p, outcome: prediction.outcome } : p)
      )
    } finally {
      setUpdating(null)
    }
  }

  async function deletePrediction(id: string) {
    if (!confirm('Delete this prediction? This cannot be undone.')) return

    // Optimistic remove
    setPredictions(prev => prev.filter(p => p.id !== id))
    setDeleting(id)

    try {
      const res = await fetch(`/api/predictions?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
    } catch {
      // Revert on failure — reload from server
      load()
    } finally {
      setDeleting(null)
    }
  }

  const stats     = computeStats(predictions)
  const breakdown = computeSportBreakdown(predictions)
  const buckets   = computeCalibrationBuckets(predictions)
  const filtered  = filter === 'all'
    ? predictions
    : predictions.filter(p => p.outcome === filter)

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-serif text-[28px] tracking-tight mb-1">Prediction Tracker</h1>
          <p className="text-text-secondary text-[13px]">
            Track the accuracy of your research and analysis over time.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-[12.5px] py-1.5">
          <Plus size={13} /> Log Prediction
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 items-start bg-surface-2 border border-border border-l-[3px] border-l-blue rounded-sm px-3.5 py-2.5 mb-6 text-[12px] text-text-secondary leading-relaxed">
        <Info size={14} className="text-blue shrink-0 mt-0.5" />
        <span>
          <strong className="text-text-primary">Research tool.</strong> Playbook is designed for sports
          analysis and study. This tracker measures your analytical accuracy and prediction discipline —
          not financial outcomes. Please gamble responsibly and within your means.
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Record',
            value: `${stats.wins}–${stats.losses}${stats.pushes > 0 ? `–${stats.pushes}` : ''}`,
            sub: `${stats.pending} pending`,
          },
          {
            label: 'Win Rate',
            value: `${stats.winRate}%`,
            sub: `of ${stats.wins + stats.losses} resolved`,
            color: stats.winRate >= 55 ? 'text-accent' : stats.winRate < 45 ? 'text-accent2' : '',
          },
          {
            label: 'Avg Confidence',
            value: `${stats.avgConfidence}/10`,
            sub: 'across all predictions',
            color: 'text-blue',
          },
          {
            label: 'Total Logged',
            value: `${stats.total}`,
            sub: `across ${breakdown.length} sport${breakdown.length !== 1 ? 's' : ''}`,
          },
        ].map(card => (
          <div key={card.label} className="card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
              {card.label}
            </div>
            <div className={cn('font-mono text-[26px] font-medium leading-none tracking-tight', card.color)}>
              {card.value}
            </div>
            <div className="text-[11.5px] text-text-secondary mt-1.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && predictions.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 mb-6 text-center gap-3">
          <div className="text-[32px]">📋</div>
          <div className="font-semibold text-[15px]">No predictions yet</div>
          <p className="text-[13px] text-text-secondary max-w-[300px] leading-relaxed">
            Log your first prediction to start tracking your analytical accuracy over time.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mt-1 text-[12.5px]">
            <Plus size={13} /> Log your first prediction
          </button>
        </div>
      )}

      {/* Charts — only shown once there is data */}
      {predictions.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-5">
              <div className="font-semibold text-[13px] mb-1">Confidence Calibration</div>
              <div className="text-[11.5px] text-text-secondary mb-4 leading-relaxed">
                Are your high-confidence picks actually winning more?
              </div>
              <CalibrationChart buckets={buckets} />
              <div className="flex gap-4 mt-3">
                {[
                  { color: 'bg-blue-light border border-blue', label: 'Expected' },
                  { color: 'bg-green-400', label: 'Actual win %' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
                    <div className={cn('w-2 h-2 rounded-full', l.color)} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5 flex flex-col items-center">
              <div className="font-semibold text-[13px] mb-1 self-start">Outcome Breakdown</div>
              <div className="text-[11.5px] text-text-secondary mb-4 self-start">
                Distribution of all resolved predictions
              </div>
              <DonutChart
                wins={stats.wins}
                losses={stats.losses}
                pushes={stats.pushes}
                winRate={stats.winRate}
              />
              <div className="flex gap-4 mt-3">
                {[
                  { color: '#4ADE80', label: 'Wins' },
                  { color: '#F87171', label: 'Losses' },
                  { color: '#94A3B8', label: 'Pushes' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
                    <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sport breakdown */}
          {breakdown.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {breakdown.map(b => (
                <div key={b.sport} className="card p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-semibold text-[13px]">{b.sport}</span>
                    <span className="font-mono text-[12px] text-text-secondary">
                      {b.wins}–{b.losses}{b.pushes > 0 ? `–${b.pushes}` : ''}
                    </span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${b.winRate}%` }}
                    />
                  </div>
                  <div className="text-[11.5px] text-text-tertiary">{b.winRate}% accuracy</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Prediction table */}
      {predictions.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-[14px]">All Predictions</div>
            <div className="flex gap-1.5">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-[12px] font-medium border transition-all',
                    filter === f.value
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-text-secondary border-border hover:border-text-tertiary'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-border">
                  {['Game', 'Sport', 'Pick', 'Type', 'Confidence', 'Outcome', 'Study', ''].map(h => (
                    <th
                      key={h}
                      className="text-left px-3.5 py-2.5 text-[10.5px] font-semibold tracking-wider uppercase text-text-tertiary"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-text-tertiary text-[13px]">
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-text-tertiary text-[13px]">
                      No {filter !== 'all' ? filter : ''} predictions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr
                      key={p.id}
                      className="border-b border-border/60 last:border-0 hover:bg-surface-2 transition-colors"
                    >
                      {/* Game */}
                      <td className="px-3.5 py-2.5">
                        <div className="font-medium text-[13px] leading-snug">{p.game}</div>
                        <div className="text-[11px] text-text-tertiary font-mono mt-0.5">
                          {formatDate(p.date)}
                        </div>
                      </td>

                      {/* Sport */}
                      <td className="px-3.5 py-2.5">
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-surface-2 text-text-secondary">
                          {p.sport}
                        </span>
                      </td>

                      {/* Pick */}
                      <td className="px-3.5 py-2.5 font-mono text-[12.5px] font-medium">{p.pick}</td>

                      {/* Type */}
                      <td className="px-3.5 py-2.5">
                        <span className={cn('badge', PICK_TYPE_STYLES[p.type])}>
                          {p.type === 'ml' ? 'ML' : p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="px-3.5 py-2.5">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[12.5px]">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ background: confidenceColor(p.confidence) }}
                          />
                          {p.confidence}/10
                        </span>
                      </td>

                      {/* Outcome — click to cycle */}
                      <td className="px-3.5 py-2.5">
                        <button
                          onClick={() => cycleOutcome(p)}
                          disabled={updating === p.id}
                          title="Click to update outcome"
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded text-[12px] font-semibold transition-opacity cursor-pointer',
                            OUTCOME_STYLES[p.outcome],
                            updating === p.id && 'opacity-50 cursor-wait'
                          )}
                        >
                          {OUTCOME_LABELS[p.outcome]}
                        </button>
                      </td>

                      {/* Linked study */}
                      <td className="px-3.5 py-2.5 text-[11.5px] text-blue">
                        {p.linked_study_title ? (
                          <a
                            href={`/dashboard/study/${p.linked_study_id}`}
                            className="underline underline-offset-2 hover:text-blue/80"
                          >
                            {p.linked_study_title.split('—')[0].trim()}
                          </a>
                        ) : (
                          <span className="text-text-tertiary">—</span>
                        )}
                      </td>

                      {/* Delete */}
                      <td className="px-3.5 py-2.5">
                        <button
                          onClick={() => deletePrediction(p.id)}
                          disabled={deleting === p.id}
                          className="w-6 h-6 flex items-center justify-center rounded text-text-tertiary hover:text-accent2 hover:bg-accent2-light transition-colors"
                          title="Delete prediction"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <LogPredictionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load() }}
      />
    </div>
  )
}