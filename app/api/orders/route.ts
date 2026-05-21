import { NextRequest, NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/lib/orders'
import { useDiscount } from '@/lib/discounts'
import { sendOrderConfirmationToCustomer, sendOrderNotificationToFlorist } from '@/lib/email'
import { cookies } from 'next/headers'
import { Order } from '@/types'

function isAdmin(): boolean {
  const cookieStore = cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }
  const orders = await getOrders()
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      customer,
      items,
      subtotal,
      discountCode,
      discountAmount,
      deliveryFee,
      total,
      deliveryDate,
      deliveryTimeSlot,
      giftMessage,
      paymentMethod,
    } = body as Omit<Order, 'id' | 'createdAt' | 'status'>

    if (!customer?.name || !customer?.phone || !customer?.email) {
      return NextResponse.json({ error: 'Date client incomplete' }, { status: 400 })
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Comanda nu conține produse' }, { status: 400 })
    }
    if (!deliveryDate || !deliveryTimeSlot) {
      return NextResponse.json({ error: 'Data și ora livrării sunt obligatorii' }, { status: 400 })
    }

    const order = await createOrder({
      customer,
      items,
      subtotal,
      discountCode,
      discountAmount: discountAmount || 0,
      deliveryFee: 0,
      total,
      deliveryDate,
      deliveryTimeSlot,
      giftMessage,
      paymentMethod,
    })

    // Use discount if present
    if (discountCode) {
      try {
        await useDiscount(discountCode)
      } catch {
        // non-fatal
      }
    }

    // Send emails (non-blocking, fire-and-forget)
    Promise.all([
      sendOrderConfirmationToCustomer(order),
      sendOrderNotificationToFlorist(order),
    ]).catch(err => {
      console.error('Email sending failed:', err)
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la plasarea comenzii' }, { status: 500 })
  }
}
