import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database, StudyInsert, StudyType } from '@/types'

type TypedClient = SupabaseClient<Database>

const VALID_STUDY_TYPES: StudyType[] = ['matchup', 'stats', 'analysis']

// GET /api/studies
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient

  const { searchParams } = new URL(req.url)
  const typeParam = searchParams.get('type')
  const type = VALID_STUDY_TYPES.includes(typeParam as StudyType)
    ? (typeParam as StudyType)
    : null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('studies')
    .select('*')
    .order('updated_at', { ascending: false })

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/studies
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const body = await req.json()

  const typeValue: StudyType = VALID_STUDY_TYPES.includes(body.type)
    ? body.type
    : 'analysis'

  const study: StudyInsert = {
    user_id: userId,
    title: body.title || 'Untitled Study',
    type: typeValue,
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