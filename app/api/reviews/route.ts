import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabase
    .from('reviews')
    .select('id, name, rating, text, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(20)
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, rating, text } = body

  if (!name?.trim() || !text?.trim() || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 })
  }

  const { error } = await supabase
    .from('reviews')
    .insert({ name: name.trim(), rating: Number(rating), text: text.trim(), approved: true })

  if (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
