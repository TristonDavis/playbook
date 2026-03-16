'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Study, StudyType } from '@/types'
import { cn } from '@/lib/utils'

const SPORTS = ['NFL', 'NBA', 'MLB', 'NHL', 'CFB', 'CBB', 'Soccer', 'Other']
const TYPES: { value: StudyType; label: string }[] = [
  { value: 'matchup', label: 'Matchup' },
  { value: 'stats', label: 'Stats & Trends' },
  { value: 'analysis', label: 'Game Notes' },
]

interface Props {
  study: Study | null
  isNew: boolean
  onSave: (updates: Partial<Study>) => Promise<void>
}

export default function StudyEditor({ study, isNew, onSave }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>()

  const [title, setTitle] = useState(study?.title ?? '')
  const [sport, setSport] = useState(study?.sport ?? 'NFL')
  const [type, setType] = useState<StudyType>(study?.type ?? 'analysis')
  const [confidence, setConfidence] = useState(study?.confidence ?? 50)
  const [spread, setSpread] = useState(study?.spread ?? '')
  const [total, setTotal] = useState(study?.total ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(study?.tags ?? [])

  // Sync when study changes (navigating between studies)
  useEffect(() => {
    setTitle(study?.title ?? '')
    setSport(study?.sport ?? 'NFL')
    setType(study?.type ?? 'analysis')
    setConfidence(study?.confidence ?? 50)
    setSpread(study?.spread ?? '')
    setTotal(study?.total ?? '')
    setTags(study?.tags ?? [])
    if (bodyRef.current) {
      bodyRef.current.innerHTML = study?.body ?? ''
    }
  }, [study?.id])

  // Autosave debounce
  const scheduleSave = useCallback(() => {
    if (isNew) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      onSave({
        title,
        sport,
        type,
        confidence,
        spread: spread || null,
        total: total || null,
        tags,
        body: bodyRef.current?.innerHTML ?? '',
      })
    }, 1200)
  }, [title, sport, type, confidence, spread, total, tags, isNew, onSave])

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTags = [...tags, tagInput.trim()]
      setTags(newTags)
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
    scheduleSave()
  }

  function insertBlock(html: string) {
    if (!bodyRef.current) return
    bodyRef.current.focus()
    document.execCommand('insertHTML', false, html + '<p><br></p>')
  }

  return (
    <div className="flex-1 overflow-y-auto px-[60px] py-9">
      {/* Sport + type pills */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={sport}
          onChange={e => { setSport(e.target.value); scheduleSave() }}
          className="text-[11.5px] font-semibold tracking-wider uppercase text-accent bg-accent-light border-none outline-none rounded-full px-3 py-1 cursor-pointer"
        >
          {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={type}
          onChange={e => { setType(e.target.value as StudyType); scheduleSave() }}
          className="text-[11.5px] font-semibold tracking-wider uppercase bg-surface-2 border-none outline-none rounded-full px-3 py-1 cursor-pointer text-text-secondary"
        >
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Title */}
      <input
        className="w-full font-serif text-[34px] leading-[1.2] tracking-tight text-text-primary bg-transparent border-none outline-none placeholder:text-text-tertiary mb-2"
        placeholder="Study title…"
        value={title}
        onChange={e => { setTitle(e.target.value); scheduleSave() }}
      />

      {/* Meta row */}
      <div className="flex items-center gap-5 py-2.5 border-y border-border/60 mb-5 text-[12.5px] text-text-secondary">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><circle cx="8" cy="8" r="6"/><path d="M8 5v4l2.5 1.5"/></svg>
          Confidence:
          <input
            type="number" min={0} max={100}
            value={confidence}
            onChange={e => { setConfidence(Number(e.target.value)); scheduleSave() }}
            className="w-12 bg-transparent border-none outline-none font-medium text-text-primary font-mono text-center"
          />%
        </div>
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M2 12l4-5 3 3 2-4 3 4"/></svg>
          Spread:
          <input
            className="bg-transparent border-none outline-none font-medium text-text-primary w-20 font-mono"
            placeholder="e.g. PHI -2.5"
            value={spread}
            onChange={e => { setSpread(e.target.value); scheduleSave() }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          O/U:
          <input
            className="bg-transparent border-none outline-none font-medium text-text-primary w-16 font-mono"
            placeholder="48.5"
            value={total}
            onChange={e => { setTotal(e.target.value); scheduleSave() }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap items-center mb-5">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => removeTag(tag)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-light text-accent text-[12px] font-medium hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            # {tag} <span className="opacity-50">×</span>
          </button>
        ))}
        <input
          className="bg-transparent border border-dashed border-border rounded-full px-2.5 py-1 text-[12px] text-text-tertiary outline-none w-28 focus:border-accent focus:text-accent"
          placeholder="+ Add tag"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={addTag}
        />
      </div>

      {/* Editor body */}
      <div
        ref={bodyRef}
        contentEditable
        suppressContentEditableWarning
        onInput={scheduleSave}
        className={cn(
          'min-h-[300px] text-[15px] leading-[1.75] text-text-primary outline-none',
          'prose prose-sm max-w-none',
          '[&_strong]:font-semibold',
          '[&_p]:mb-3',
          '[&_.matchup-card]:bg-surface-2 [&_.matchup-card]:border [&_.matchup-card]:border-border [&_.matchup-card]:rounded-[10px] [&_.matchup-card]:p-5 [&_.matchup-card]:my-5',
          '[&_.stats-table]:w-full [&_.stats-table]:border-collapse [&_.stats-table]:my-4',
          '[&_.stats-table_th]:text-left [&_.stats-table_th]:text-[11px] [&_.stats-table_th]:font-semibold [&_.stats-table_th]:uppercase [&_.stats-table_th]:tracking-wider [&_.stats-table_th]:text-text-tertiary [&_.stats-table_th]:pb-2',
          '[&_.stats-table_td]:py-1.5 [&_.stats-table_td]:border-b [&_.stats-table_td]:border-border/60 [&_.stats-table_td]:text-[13px]',
        )}
        data-placeholder="Start writing your analysis..."
      />

      {/* Save prompt for new studies */}
      {isNew && (
        <div className="mt-6 flex justify-start">
          <button
            onClick={() => onSave({ title, sport, type, confidence, spread: spread || null, total: total || null, tags, body: bodyRef.current?.innerHTML ?? '' })}
            className="btn-primary"
          >
            Create Study
          </button>
        </div>
      )}
    </div>
  )
}
