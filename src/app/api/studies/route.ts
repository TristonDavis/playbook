import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database, StudyInsert, StudyType } from '@/types'

type TypedClient = SupabaseClient<Database>

const VALID_STUDY_TYPES: StudyType[] = ['matchup', 'stats', 'analysis']

// GET /api/studies          — list (optionally filtered by ?type=)
// GET /api/studies?id=...   — single study
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const { searchParams } = new URL(req.url)

  const id = searchParams.get('id')
  if (id) {
    const { data, error } = await supabase
      .from('studies')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  }

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
    spread: body.spread ?? null,
    total: body.total ?? null,
    tags: body.tags || [],
    pinned: body.pinned ?? false,
  }

  const { data, error } = await supabase
    .from('studies')
    .insert(study)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/studies — partial update, id required in body
export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('studies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/studies?id=...
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabase
    .from('studies')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
