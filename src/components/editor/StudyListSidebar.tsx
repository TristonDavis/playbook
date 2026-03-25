'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import { Study, StudyType } from '@/types'
import { formatDate, cn } from '@/lib/utils'

const TYPE_COLORS: Record<StudyType, string> = {
  matchup: 'badge-matchup',
  analysis: 'badge-analysis',
  stats: 'badge-stats',
}

export default function StudyListSidebar({ activeId }: { activeId?: string }) {
  const [studies, setStudies] = useState<Study[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/studies')
      const data = res.ok ? await res.json() : []
      setStudies(data as Study[])
    }
    load()
  }, [])

  const filtered = studies.filter(s =>
    search === '' ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="w-[280px] border-r border-border flex flex-col bg-bg flex-shrink-0">
      <div className="px-4 pt-[18px] pb-3 border-b border-border/60 bg-surface">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[15px] font-semibold tracking-tight">Studies</h2>
          <Link href="/dashboard/study/new" className="w-6 h-6 flex items-center justify-center rounded-[5px] bg-accent text-white hover:bg-[#1d4ed8] transition-colors">
            <Plus size={13} />
          </Link>
        </div>
        <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-sm px-2.5 py-1.5">
          <Search size={13} className="text-text-tertiary shrink-0" />
          <input
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-text-primary placeholder:text-text-tertiary"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((study, i) => (
          <Link
            key={study.id}
            href={`/dashboard/study/${study.id}`}
            className={cn(
              'block p-3 rounded-[10px] mb-1 border transition-all animate-fade-in',
              activeId === study.id
                ? 'bg-surface border-accent shadow-card'
                : 'bg-surface border-transparent hover:border-border',
            )}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-[13px] font-medium leading-snug line-clamp-2">{study.title}</div>
              <span className={cn('badge shrink-0 mt-0.5', TYPE_COLORS[study.type])}>{study.type}</span>
            </div>
            <div className="text-[11px] text-text-tertiary mb-1.5">{study.sport} · {formatDate(study.updated_at)}</div>
            <div className="flex gap-1 flex-wrap">
              {study.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-surface-2 text-text-secondary">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
