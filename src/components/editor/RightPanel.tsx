'use client'

import { useState } from 'react'
import { Study } from '@/types'
import { Loader2, ArrowRight } from 'lucide-react'

const AI_PROMPTS = [
  'Summarize the key factors in this matchup',
  'What are the main risks to this analysis?',
  'Identify any data gaps or blind spots',
  'What historical trends are most relevant?',
]

interface Props {
  study: Study | null
  tab: 'info' | 'ai'
  onTabChange: (tab: 'info' | 'ai') => void
}

export default function RightPanel({ study, tab, onTabChange }: Props) {
  return (
    <div className="w-[260px] border-l border-border bg-bg flex flex-col flex-shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border bg-surface">
        {(['info', 'ai'] as const).map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`flex-1 py-2.5 text-[12px] font-medium transition-all border-b-2 ${
              tab === t
                ? t === 'ai' ? 'text-purple border-purple' : 'text-accent border-accent'
                : 'text-text-tertiary border-transparent hover:text-text-secondary'
            }`}
          >
            {t === 'ai' ? '✦ AI Analysis' : 'Study Info'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3.5">
        {tab === 'info' ? <InfoTab study={study} /> : <AITab study={study} />}
      </div>
    </div>
  )
}

function InfoTab({ study }: { study: Study | null }) {
  if (!study) return (
    <div className="text-[12.5px] text-text-tertiary text-center mt-8">Open a study to see its details.</div>
  )

  return (
    <>
      <Section title="Confidence">
        <div className="bg-surface border border-border rounded-sm p-3 space-y-3">
          {[
            { label: 'Overall', value: study.confidence, color: '#2d6a4f' },
            { label: 'Data Quality', value: 84, color: '#3b5bdb' },
            { label: 'Recency', value: 91, color: '#e76f51' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between mb-1 text-[11.5px]">
                <span className="text-text-secondary">{label}</span>
                <span className="font-mono font-semibold">{value}%</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Key Numbers">
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          {[
            { label: 'Spread', value: study.spread || '—' },
            { label: 'Total', value: study.total || '—' },
            { label: 'Sport', value: study.sport },
            { label: 'Type', value: study.type },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-baseline px-3 py-2 border-b border-border/60 last:border-0 text-[12.5px]">
              <span className="text-text-secondary">{label}</span>
              <span className="font-mono font-semibold text-[12px]">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tags">
        <div className="flex flex-wrap gap-1.5">
          {study.tags.length > 0
            ? study.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-accent-light text-accent text-[11px] font-medium">#{tag}</span>
              ))
            : <span className="text-[12px] text-text-tertiary">No tags added</span>
          }
        </div>
      </Section>
    </>
  )
}

function AITab({ study }: { study: Study | null }) {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [activePrompt, setActivePrompt] = useState('')

  async function runAnalysis(prompt: string) {
    if (!study) return
    setLoading(true)
    setError(null)
    setResult(null)
    setActivePrompt(prompt)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyId: study.id, prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!study) return (
    <div className="text-[12.5px] text-text-tertiary text-center mt-8">Open a study to use AI analysis.</div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-wider uppercase text-purple bg-purple-light rounded-full px-2.5 py-1 mb-2 self-start">
        <span>✦</span> Powered by Claude
      </div>
      <p className="text-[12px] text-text-secondary leading-relaxed mb-3">
        Ask Claude to analyze, critique, or expand on your current study.
      </p>

      {/* Quick prompts */}
      <div className="flex flex-col gap-1.5 mb-3">
        {AI_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => runAnalysis(p)}
            disabled={loading}
            className="text-left px-3 py-2 rounded-[6px] border border-border bg-surface text-[12px] text-text-secondary hover:border-purple hover:text-purple hover:bg-purple-light transition-all leading-snug disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-1.5 mb-3">
        <input
          className="flex-1 input text-[12.5px] py-1.5"
          placeholder="Ask anything…"
          value={customPrompt}
          onChange={e => setCustomPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && customPrompt.trim()) { runAnalysis(customPrompt); setCustomPrompt('') } }}
          disabled={loading}
        />
        <button
          onClick={() => { if (customPrompt.trim()) { runAnalysis(customPrompt); setCustomPrompt('') } }}
          disabled={loading || !customPrompt.trim()}
          className="px-2.5 py-1.5 bg-purple text-white rounded-[6px] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Result */}
      {loading && (
        <div className="flex items-center gap-2 text-[12px] text-text-tertiary py-4">
          <Loader2 size={13} className="animate-spin text-purple" />
          Claude is analyzing…
        </div>
      )}

      {error && (
        <div className="text-[12px] text-accent2 bg-accent2-light rounded-[6px] px-3 py-2.5 leading-relaxed">
          ⚠ {error}
        </div>
      )}

      {result && !loading && (
        <div className="bg-surface border border-border rounded-[10px] overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-purple-light border-b border-purple/20 text-[11.5px] font-semibold text-purple">
            <span>✦</span> Claude's Analysis
            <span className="ml-auto font-normal text-[10.5px] text-text-tertiary truncate max-w-[120px]">{activePrompt}</span>
          </div>
          <div
            className="px-3 py-3 text-[12.5px] leading-relaxed text-text-secondary"
            dangerouslySetInnerHTML={{
              __html: result
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^• /gm, '&#8226; '),
            }}
          />
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[10.5px] font-semibold tracking-widest uppercase text-text-tertiary mb-2">{title}</div>
      {children}
    </div>
  )
}
