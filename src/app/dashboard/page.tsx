'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { Study, StudyType } from '@/types'
import { formatDate, cn } from '@/lib/utils'

const TYPE_COLORS: Record<StudyType, string> = {
  matchup:  'badge-matchup',
  analysis: 'badge-analysis',
  stats:    'badge-stats',
}

const VALID_TYPES: StudyType[] = ['matchup', 'stats', 'analysis']

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const rawType = searchParams.get('type')
  const typeFilter: StudyType | null = VALID_TYPES.includes(rawType as StudyType)
    ? (rawType as StudyType)
    : null

  const [studies, setStudies] = useState<Study[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    async function load() {
      const url = typeFilter ? `/api/studies?type=${typeFilter}` : '/api/studies'
      const res = await fetch(url)
      const data = res.ok ? await res.json() : []
      setStudies(data as Study[])
      setLoading(false)
    }
    load()
  }, [typeFilter])

  const filtered = studies.filter(s =>
    search === '' ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Study list panel */}
      <div className="w-[280px] border-r border-border flex flex-col bg-bg flex-shrink-0">
        <div className="px-4 pt-[18px] pb-3 border-b border-border/60 bg-surface">
          <h1 className="text-[17px] font-semibold tracking-tight mb-2.5">
            {typeFilter
              ? `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)} Studies`
              : 'All Studies'}
          </h1>
          <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-sm px-2.5 py-1.5">
            <Search size={13} className="text-text-tertiary shrink-0" />
            <input
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-text-primary placeholder:text-text-tertiary"
              placeholder="Search studies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex flex-col gap-2 p-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[88px] bg-surface-2 rounded-[10px] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-4">
              <p className="text-text-tertiary text-[13px]">
                {search ? 'No studies match your search.' : 'No studies yet. Create your first one!'}
              </p>
              <Link href="/dashboard/study/new" className="btn-primary text-xs py-1.5 px-3">
                <Plus size={12} /> New Study
              </Link>
            </div>
          ) : (
            filtered.map((study, i) => (
              <Link
                key={study.id}
                href={`/dashboard/study/${study.id}`}
                className={cn(
                  'block p-3 rounded-[10px] mb-1 bg-surface border border-transparent',
                  'hover:border-border transition-all animate-fade-in',
                )}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-[13.5px] font-medium leading-snug line-clamp-2">{study.title}</div>
                  <span className={cn('badge shrink-0 mt-0.5', TYPE_COLORS[study.type])}>{study.type}</span>
                </div>
                <div className="text-[11.5px] text-text-tertiary mb-1.5">
                  {study.sport} · {formatDate(study.updated_at)}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {study.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-surface-2 text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Empty editor state */}
      <div className="flex-1 flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="20" height="20" className="text-text-tertiary">
              <path d="M7 1L9.5 5.5H12.5L10 8.5L11 13L7 10.5L3 13L4 8.5L1.5 5.5H4.5L7 1Z"/>
            </svg>
          </div>
          <div>
            <p className="text-text-primary font-medium mb-1">Select a study to open it</p>
            <p className="text-text-tertiary text-[13px]">Or create a new one to get started</p>
          </div>
          <Link href="/dashboard/study/new" className="btn-primary text-sm">
            <Plus size={14} /> New Study
          </Link>
        </div>
      </div>
    </div>
  )
}
