import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

function isAdmin(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function POST(request: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Niciun fișier primit' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tip fișier invalid. Acceptăm: JPG, PNG, WebP' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fișierul este prea mare (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { error } = await supabase.storage
      .from('products')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json({ error: 'Eroare la upload' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename)
    return NextResponse.json({ path: urlData.publicUrl }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la upload' }, { status: 500 })
  }
}
