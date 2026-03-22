import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { StudyInsert } from '@/types'

// GET /api/studies — list all studies for current user
export async function GET(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const supabase = await createClient()
  let query = supabase
    .from('studies')
    .select('*')
    .order('updated_at', { ascending: false })

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

// POST /api/studies — create a new study
export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = await createClient()

  const study: StudyInsert = {
    user_id: userId,
    title: body.title || 'Untitled Study',
    type: body.type || 'analysis',
    sport: body.sport || 'NFL',
    body: body.body || '',
    confidence: body.confidence || 50,
    spread: body.spread || null,
    total: body.total || null,
    tags: body.tags || [],
    pinned: false,
  }

  const { data, error } = await supabase
    .from('studies')
    .insert(study)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
