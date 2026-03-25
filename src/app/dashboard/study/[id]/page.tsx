'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Study } from '@/types'
import StudyEditor from '@/components/editor/StudyEditor'
import RightPanel from '@/components/editor/RightPanel'
import EditorToolbar from '@/components/editor/EditorToolbar'
import StudyListSidebar from '@/components/editor/StudyListSidebar'

export default function StudyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [study, setStudy] = useState<Study | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rpTab, setRpTab] = useState<'info' | 'ai'>('info')

  useEffect(() => {
    if (id === 'new') {
      setStudy(null)
      setLoading(false)
      return
    }
    async function load() {
      const res = await fetch(`/api/studies?id=${id}`)
      const data = res.ok ? await res.json() : null
      setStudy(data as Study ?? null)
      setLoading(false)
    }
    load()
  }, [id])

  const handleSave = useCallback(async (updates: Partial<Study>) => {
    setSaving(true)

    if (id === 'new') {
      const res = await fetch('/api/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const data = await res.json() as Study
        router.replace(`/dashboard/study/${data.id}`)
      }
    } else {
      await fetch('/api/studies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
    }

    setSaving(false)
  }, [id, router])

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="w-[280px] border-r border-border bg-bg animate-pulse" />
        <div className="flex-1 bg-surface animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">
      <StudyListSidebar activeId={id === 'new' ? undefined : id} />

      <div className="flex-1 flex flex-col overflow-hidden bg-surface">
        <EditorToolbar saving={saving} study={study} rpTab={rpTab} onRpTabChange={setRpTab} />
        <div className="flex flex-1 overflow-hidden">
          <StudyEditor study={study} onSave={handleSave} isNew={id === 'new'} />
          <RightPanel study={study} tab={rpTab} onTabChange={setRpTab} />
        </div>
      </div>
    </div>
  )
}
