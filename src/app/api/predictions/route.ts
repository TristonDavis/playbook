import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/predictions
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/predictions
export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = await createClient()

const { data, error } = await supabase
  .from('predictions')
  .insert({
    user_id: userId,
    game: body.game,
    sport: body.sport,
    date: body.date,
    type: body.type,
    pick: body.pick,
    confidence: body.confidence,
    outcome: body.outcome || 'pending',
    linked_study_id: body.linked_study_id || null,
    linked_study_title: body.linked_study_title || null,
    notes: body.notes || null,
  } as any)
  .select()
  .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
