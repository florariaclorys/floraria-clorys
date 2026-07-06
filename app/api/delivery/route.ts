import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDeliverySettings, setDeliverySettings } from '@/lib/settings'

function isAdmin(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

// Public — folosit de coș pentru a calcula taxa de livrare
export async function GET() {
  const settings = await getDeliverySettings()
  return NextResponse.json(settings)
}

// Admin only — salvează setările de livrare
export async function PUT(req: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  const body = await req.json()
  await setDeliverySettings({
    homeDeliveryFee: Math.max(0, Number(body.homeDeliveryFee) || 0),
    freeOverAmount: Math.max(0, Number(body.freeOverAmount) || 0),
  })
  return NextResponse.json({ ok: true })
}
