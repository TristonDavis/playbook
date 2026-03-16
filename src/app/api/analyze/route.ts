import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  // Auth check
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { studyId, prompt } = body

  if (!studyId || !prompt) {
    return NextResponse.json({ error: 'studyId and prompt are required' }, { status: 400 })
  }

  // Fetch study from DB (enforces RLS — user can only access their own)
  const supabase = createClient()
  const { data: study, error } = await supabase
    .from('studies')
    .select('*')
    .eq('id', studyId)
    .single()

  if (error || !study) {
    return NextResponse.json({ error: 'Study not found' }, { status: 404 })
  }

  // Build context from study
  const studyContext = `
Study Title: ${study.title}
Sport: ${study.sport}
Type: ${study.type}
Date: ${study.updated_at}
Confidence Score: ${study.confidence}%
Spread: ${study.spread ?? '—'} | Total: ${study.total ?? '—'}
Tags: ${study.tags.join(', ')}

Study Notes:
${study.body.replace(/<[^>]*>/g, '').replace(/\n+/g, '\n').trim()}
  `.trim()

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are an expert sports analyst assistant embedded in Playbook, a sports analysis workspace. 
Your role is to provide sharp, insightful analysis of sports studies. 

Guidelines:
- Be concise and direct — 150–250 words per response
- Use bullet points where helpful for clarity
- Focus on analytical depth and actionable insight
- You are NOT a gambling advisor — frame everything as analytical and research quality feedback
- Identify patterns, risks, data gaps, and historical relevance
- Be honest about uncertainty and missing information`,
      messages: [
        {
          role: 'user',
          content: `Here is a sports study from the user:\n\n${studyContext}\n\nUser request: ${prompt}`,
        },
      ],
    })

    const result = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('')

    return NextResponse.json({ result, studyId })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return NextResponse.json({ error: 'AI analysis failed. Please try again.' }, { status: 500 })
  }
}
