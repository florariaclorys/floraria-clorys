import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdminPassword, setAdminPassword } from '@/lib/settings'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json() as {
      currentPassword: string
      newPassword: string
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Parola nouă trebuie să aibă minim 6 caractere' }, { status: 400 })
    }

    const adminPassword = await getAdminPassword()
    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: 'Parola curentă este incorectă' }, { status: 401 })
    }

    await setAdminPassword(newPassword)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
