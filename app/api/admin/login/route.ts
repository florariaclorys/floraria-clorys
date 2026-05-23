import { NextRequest, NextResponse } from 'next/server'
import { getAdminPassword } from '@/lib/settings'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json() as { password: string }
    const adminPassword = await getAdminPassword()

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Parolă incorectă' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
