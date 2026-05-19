import { NextRequest, NextResponse } from 'next/server'
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '@/lib/discounts'
import { cookies } from 'next/headers'
import { Discount } from '@/types'

function isAdmin(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  return NextResponse.json(await getDiscounts())
}

export async function POST(request: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  try {
    const data = await request.json() as Omit<Discount, 'id' | 'usedCount'>
    const discount = await createDiscount(data)
    return NextResponse.json(discount, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  try {
    const { id, ...data } = await request.json()
    const updated = await updateDiscount(id, data)
    if (!updated) {
      return NextResponse.json({ error: 'Codul nu a fost găsit' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID lipsă' }, { status: 400 })
  }
  const success = await deleteDiscount(id)
  if (!success) {
    return NextResponse.json({ error: 'Codul nu a fost găsit' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
