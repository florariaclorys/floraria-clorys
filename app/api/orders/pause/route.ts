import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrderBlock, setOrderBlock } from '@/lib/settings'

function isAdmin(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

// Public — folosit de popup pentru a afișa mesajul
export async function GET() {
  const block = await getOrderBlock()
  // Verifică dacă blocarea e activă azi
  if (block.active && block.blockedDates.length > 0) {
    const now = new Date()
    const roDate = new Date(now.getTime() + 3 * 60 * 60 * 1000)
    const today = roDate.toISOString().slice(0, 10)
    const isBlocked = block.blockedDates.includes(today)
    return NextResponse.json({ ...block, isBlockedToday: isBlocked })
  }
  return NextResponse.json({ ...block, isBlockedToday: false })
}

// Admin only — salvează setările
export async function POST(request: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  const body = await request.json()
  await setOrderBlock({
    active: !!body.active,
    blockedDates: Array.isArray(body.blockedDates) ? body.blockedDates : [],
    returnDate: body.returnDate || '',
  })
  return NextResponse.json({ ok: true })
}
