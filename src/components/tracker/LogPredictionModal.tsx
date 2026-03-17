'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Study, PickType, Outcome } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export default function LogPredictionModal({ open, onClose, onSaved }: Props) {
  const [studies, setStudies] = useState<Study[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    game: '',
    sport: 'NFL',
    date: new Date().toISOString().split('T')[0],
    type: 'spread' as PickType,
    pick: '',
    confidence: 7,
    outcome: 'pending' as Outcome,
    linked_study_id: '',
    notes: '',
  })

  useEffect(() => {
    if (!open) return
    createClient().from('studies').select('id,title').order('updated_at', { ascending: false }).then(({ data }) => {
      setStudies((data as Study[]) ?? [])
    })
  }, [open])

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.game.trim()) return
    setSaving(true)

    const linkedStudy = studies.find(s => s.id === form.linked_study_id)
    const supabase = createClient()

    await supabase.from('predictions').insert({
      game: form.game,
      sport: form.sport,
      date: form.date,
      type: form.type,
      pick: form.pick || '—',
      confidence: form.confidence,
      outcome: form.outcome,
      linked_study_id: form.linked_study_id || null,
      linked_study_title: linkedStudy?.title || null,
      notes: form.notes || null,
    } as any)

    setSaving(false)
    setForm(f => ({ ...f, game: '', pick: '', notes: '', linked_study_id: '' }))
    onSaved()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-[14px] shadow-lg w-[480px] max-w-[95vw] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="font-semibold text-[16px]">Log a Prediction</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-surface-2 hover:bg-border transition-colors">
            <X size={15} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Game / Matchup</label>
            <input className="input" placeholder="e.g. Chiefs vs Eagles" value={form.game} onChange={e => set('game', e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Sport</label>
              <select className="input" value={form.sport} onChange={e => set('sport', e.target.value)}>
                {['NFL', 'NBA', 'MLB', 'NHL', 'CFB', 'CBB', 'Soccer', 'Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Pick Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="spread">Spread</option>
                <option value="total">Total (O/U)</option>
                <option value="ml">Moneyline</option>
              </select>
            </div>
            <div>
              <label className="label">Your Pick</label>
              <input className="input" placeholder="e.g. PHI -2.5" value={form.pick} onChange={e => set('pick', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Confidence (1–10)</label>
              <input className="input" type="number" min={1} max={10} value={form.confidence} onChange={e => set('confidence', Number(e.target.value))} />
              <p className="text-[11.5px] text-text-tertiary mt-1">Based on your analysis depth</p>
            </div>
            <div>
              <label className="label">Outcome</label>
              <select className="input" value={form.outcome} onChange={e => set('outcome', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="win">Win ✓</option>
                <option value="loss">Loss ✗</option>
                <option value="push">Push ~</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Linked Study <span className="font-normal text-text-tertiary">(optional)</span></label>
            <select className="input" value={form.linked_study_id} onChange={e => set('linked_study_id', e.target.value)}>
              <option value="">None</option>
              {studies.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <p className="text-[11.5px] text-text-tertiary mt-1">Link to a study for research context</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className={cn('btn-primary', saving && 'opacity-70 cursor-not-allowed')}>
              {saving ? 'Saving…' : 'Log Prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
