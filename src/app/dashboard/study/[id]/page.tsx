'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
      const supabase = createClient()
      const { data } = await supabase.from('studies').select('*').eq('id', id).single()
      setStudy(data)
      setLoading(false)
    }
    load()
  }, [id])

  const handleSave = useCallback(async (updates: Partial<Study>) => {
    setSaving(true)
    const supabase = createClient()

if (id === 'new') {
  const { data, error } = (await supabase
    .from('studies')
    .insert({ ...updates, title: updates.title || 'Untitled Study', type: updates.type || 'analysis', sport: updates.sport || 'NFL', tags: updates.tags || [] } as any)
    .select()
    .single()) as { data: Study | null; error: any }

  if (data) router.replace(`/dashboard/study/${data.id}`)
} else {
await (supabase as any)
  .from('studies')
  .update({ ...updates, updated_at: new Date().toISOString() })
  .eq('id', id)
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
