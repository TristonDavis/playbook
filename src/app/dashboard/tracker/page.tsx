'use client'

import { useEffect, useState } from 'react'
import { Plus, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Prediction, Outcome } from '@/types'
import { computeStats, computeSportBreakdown, computeCalibrationBuckets, confidenceColor, formatDate, cn } from '@/lib/utils'
import CalibrationChart from '@/components/tracker/CalibrationChart'
import DonutChart from '@/components/tracker/DonutChart'
import LogPredictionModal from '@/components/tracker/LogPredictionModal'

const FILTERS: { label: string; value: Outcome | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Win', value: 'win' },
  { label: 'Loss', value: 'loss' },
  { label: 'Push', value: 'push' },
  { label: 'Pending', value: 'pending' },
]

const OUTCOME_STYLES: Record<Outcome, string> = {
  win: 'outcome-win',
  loss: 'outcome-loss',
  push: 'outcome-push',
  pending: 'outcome-pending',
}

const OUTCOME_LABELS: Record<Outcome, string> = {
  win: '✓ Win',
  loss: '✗ Loss',
  push: '~ Push',
  pending: '● Pending',
}

const PICK_TYPE_STYLES: Record<string, string> = {
  spread: 'bg-blue-light text-blue',
  total: 'bg-purple-light text-purple',
  ml: 'bg-accent2-light text-accent2',
}

export default function TrackerPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Outcome | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
    setPredictions(data ?? [])
    setLoading(false)
  }

  const stats = computeStats(predictions)
  const breakdown = computeSportBreakdown(predictions)
  const buckets = computeCalibrationBuckets(predictions)
  const filtered = filter === 'all' ? predictions : predictions.filter(p => p.outcome === filter)

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-serif text-[28px] tracking-tight mb-1">Prediction Tracker</h1>
          <p className="text-text-secondary text-[13px]">Track the accuracy of your research and analysis over time.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-[12.5px] py-1.5">
          <Plus size={13} /> Log Prediction
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 items-start bg-surface-2 border border-border border-l-[3px] border-l-blue rounded-sm px-3.5 py-2.5 mb-6 text-[12px] text-text-secondary leading-relaxed">
        <Info size={14} className="text-blue shrink-0 mt-0.5" />
        <span>
          <strong className="text-text-primary">Research tool.</strong> Playbook is designed for sports analysis and study.
          This tracker measures your analytical accuracy and prediction discipline — not financial outcomes.
          Please gamble responsibly and within your means.
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Record', value: `${stats.wins}–${stats.losses}${stats.pushes > 0 ? `–${stats.pushes}` : ''}`, sub: `${stats.pending} pending` },
          { label: 'Win Rate', value: `${stats.winRate}%`, sub: `of ${stats.wins + stats.losses} resolved`, color: stats.winRate >= 55 ? 'text-accent' : stats.winRate < 45 ? 'text-accent2' : '' },
          { label: 'Avg Confidence', value: `${stats.avgConfidence}/10`, sub: 'across all predictions', color: 'text-blue' },
          { label: 'Total Logged', value: `${stats.total}`, sub: `across ${breakdown.length} sport${breakdown.length !== 1 ? 's' : ''}` },
        ].map(card => (
          <div key={card.label} className="card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">{card.label}</div>
            <div className={cn('font-mono text-[26px] font-medium leading-none tracking-tight', card.color)}>{card.value}</div>
            <div className="text-[11.5px] text-text-secondary mt-1.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <div className="font-semibold text-[13px] mb-1">Confidence Calibration</div>
          <div className="text-[11.5px] text-text-secondary mb-4 leading-relaxed">
            Are your high-confidence picks actually winning more? Actual vs. expected win rate by confidence tier.
          </div>
          <CalibrationChart buckets={buckets} />
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-accent-light border border-accent" />
              Expected
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-accent" />
              Actual win %
            </div>
          </div>
        </div>

        <div className="card p-5 flex flex-col items-center">
          <div className="font-semibold text-[13px] mb-1 self-start">Outcome Breakdown</div>
          <div className="text-[11.5px] text-text-secondary mb-4 self-start">Distribution of all resolved predictions</div>
          <DonutChart wins={stats.wins} losses={stats.losses} pushes={stats.pushes} winRate={stats.winRate} />
          <div className="flex gap-4 mt-3">
            {[['#2d6a4f', 'Wins'], ['#e76f51', 'Losses'], ['#a09d98', 'Pushes']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                {label}
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
                <span className="font-mono text-[12px] text-text-secondary">{b.wins}–{b.losses}{b.pushes > 0 ? `–${b.pushes}` : ''}</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden mb-1.5">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${b.winRate}%` }} />
              </div>
              <div className="text-[11.5px] text-text-tertiary">{b.winRate}% accuracy</div>
            </div>
          ))}
        </div>
      )}

      {/* Prediction table */}
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
                  ? 'bg-text-primary text-white border-text-primary'
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
              {['Game', 'Sport', 'Pick', 'Type', 'Confidence', 'Outcome', 'Linked Study'].map(h => (
                <th key={h} className="text-left px-3.5 py-2.5 text-[10.5px] font-semibold tracking-wider uppercase text-text-tertiary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-text-tertiary text-[13px]">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-text-tertiary text-[13px]">No predictions yet. Log your first one!</td></tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-[#fafaf8] transition-colors">
                  <td className="px-3.5 py-2.5">
                    <div className="font-medium text-[13px] leading-snug">{p.game}</div>
                    <div className="text-[11px] text-text-tertiary font-mono mt-0.5">{formatDate(p.date)}</div>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-surface-2 text-text-secondary">{p.sport}</span>
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[12.5px] font-medium">{p.pick}</td>
                  <td className="px-3.5 py-2.5">
                    <span className={cn('badge', PICK_TYPE_STYLES[p.type])}>
                      {p.type === 'ml' ? 'ML' : p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[12.5px]">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: confidenceColor(p.confidence) }} />
                      {p.confidence}/10
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded text-[12px] font-semibold', OUTCOME_STYLES[p.outcome])}>
                      {OUTCOME_LABELS[p.outcome]}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-[11.5px] text-blue">
                    {p.linked_study_title
                      ? <a href={`/dashboard/study/${p.linked_study_id}`} className="underline underline-offset-2 hover:text-blue/80">{p.linked_study_title.split('—')[0].trim()}</a>
                      : <span className="text-text-tertiary">—</span>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <LogPredictionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); load() }}
      />
    </div>
  )
}
