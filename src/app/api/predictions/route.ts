import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database, PredictionInsert } from '@/types'

type TypedClient = SupabaseClient<Database>

// GET /api/predictions
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/predictions
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const body = await req.json()

  if (!body.game?.trim()) return NextResponse.json({ error: 'game is required' }, { status: 400 })
  if (!body.sport)         return NextResponse.json({ error: 'sport is required' }, { status: 400 })
  if (!body.date)          return NextResponse.json({ error: 'date is required' }, { status: 400 })
  if (!body.type)          return NextResponse.json({ error: 'type is required' }, { status: 400 })

  const prediction: PredictionInsert = {
    user_id: userId,
    game: body.game.trim(),
    sport: body.sport,
    date: body.date,
    type: body.type,
    pick: body.pick?.trim() || '—',
    confidence: Number(body.confidence) || 5,
    outcome: body.outcome || 'pending',
    linked_study_id: body.linked_study_id || null,
    linked_study_title: body.linked_study_title || null,
    notes: body.notes?.trim() || null,
  }

  const { data, error } = await supabase
    .from('predictions')
    .insert(prediction)
    .select()
    .single()

  if (error) {
    console.error('[POST /api/predictions] Supabase error:', error)
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/predictions — update outcome
export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const body = await req.json()
  const { id, outcome } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const validOutcomes = ['win', 'loss', 'push', 'pending']
  if (!validOutcomes.includes(outcome)) {
    return NextResponse.json({ error: 'invalid outcome' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('predictions')
    .update({ outcome })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/predictions
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient() as TypedClient
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabase
    .from('predictions')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}