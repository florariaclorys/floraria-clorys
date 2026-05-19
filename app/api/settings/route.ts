import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getBusinessHours, updateBusinessHours } from '@/lib/settings'

export async function GET() {
  const hours = await getBusinessHours()
  return NextResponse.json(hours)
}

export async function PUT(req: NextRequest) {
  const cookieStore = cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  await updateBusinessHours(body)
  return NextResponse.json({ ok: true })
}
