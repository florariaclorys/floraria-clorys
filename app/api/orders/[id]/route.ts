import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/orders'
import { cookies } from 'next/headers'
import { Order } from '@/types'

function isAdmin(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await getOrderById(params.id)
  if (!order) {
    return NextResponse.json({ error: 'Comanda nu a fost găsită' }, { status: 404 })
  }
  return NextResponse.json(order)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  try {
    const { status } = await request.json() as { status: Order['status'] }
    const updated = await updateOrderStatus(params.id, status)
    if (!updated) {
      return NextResponse.json({ error: 'Comanda nu a fost găsită' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}
