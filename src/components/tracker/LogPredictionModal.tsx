'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Study, PickType, Outcome } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

const SPORTS = ['NFL', 'NBA', 'MLB', 'NHL', 'CFB', 'CBB', 'Soccer', 'Other']

const DEFAULT_FORM = {
  game: '',
  sport: 'NFL',
  date: new Date().toISOString().split('T')[0],
  type: 'spread' as PickType,
  pick: '',
  confidence: 7,
  outcome: 'pending' as Outcome,
  linked_study_id: '',
  notes: '',
}

export default function LogPredictionModal({ open, onClose, onSaved }: Props) {
  const [studies, setStudies] = useState<Study[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(DEFAULT_FORM)

  // Load studies for the link dropdown whenever modal opens
  useEffect(() => {
    if (!open) return
    setError(null)
    createClient()
      .from('studies')
      .select('id, title, sport')
      .order('updated_at', { ascending: false })
      .then(({ data }) => setStudies((data as Study[]) ?? []))
  }, [open])

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function reset() {
    setForm(DEFAULT_FORM)
    setError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.game.trim()) {
      setError('Game / matchup is required.')
      return
    }

    setSaving(true)
    setError(null)

    const linkedStudy = studies.find(s => s.id === form.linked_study_id)

    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: form.game.trim(),
          sport: form.sport,
          date: form.date,
          type: form.type,
          pick: form.pick.trim() || '—',
          confidence: form.confidence,
          outcome: form.outcome,
          linked_study_id: form.linked_study_id || null,
          linked_study_title: linkedStudy?.title || null,
          notes: form.notes.trim() || null,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save prediction.')
      }

      reset()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-surface rounded-[14px] shadow-lg w-[480px] max-w-[95vw] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="font-semibold text-[16px]">Log a Prediction</div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-surface-2 hover:bg-border transition-colors"
          >
            <X size={15} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-3.5 py-2.5 text-[12.5px]">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="label">Game / Matchup</label>
            <input
              className="input"
              placeholder="e.g. Chiefs vs Eagles"
              value={form.game}
              onChange={e => set('game', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Sport</label>
              <select className="input" value={form.sport} onChange={e => set('sport', e.target.value)}>
                {SPORTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Pick Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value as PickType)}>
                <option value="spread">Spread</option>
                <option value="total">Total (O/U)</option>
                <option value="ml">Moneyline</option>
              </select>
            </div>
            <div>
              <label className="label">Your Pick</label>
              <input
                className="input"
                placeholder="e.g. PHI -2.5"
                value={form.pick}
                onChange={e => set('pick', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Confidence (1–10)</label>
              <input
                className="input"
                type="number"
                min={1}
                max={10}
                value={form.confidence}
                onChange={e => set('confidence', Number(e.target.value))}
              />
              <p className="text-[11.5px] text-text-tertiary mt-1">Based on your analysis depth</p>
            </div>
            <div>
              <label className="label">Outcome</label>
              <select className="input" value={form.outcome} onChange={e => set('outcome', e.target.value as Outcome)}>
                <option value="pending">Pending</option>
                <option value="win">Win ✓</option>
                <option value="loss">Loss ✗</option>
                <option value="push">Push ~</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">
              Linked Study <span className="font-normal text-text-tertiary">(optional)</span>
            </label>
            <select
              className="input"
              value={form.linked_study_id}
              onChange={e => set('linked_study_id', e.target.value)}
            >
              <option value="">None</option>
              {studies.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            <p className="text-[11.5px] text-text-tertiary mt-1">Link to a study for research context</p>
          </div>

          <div>
            <label className="label">
              Notes <span className="font-normal text-text-tertiary">(optional)</span>
            </label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Key factors that shaped this pick…"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn('btn-primary', saving && 'opacity-70 cursor-not-allowed')}
            >
              {saving ? 'Saving…' : 'Log Prediction'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}