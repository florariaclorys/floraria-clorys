import { NextRequest, NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/lib/orders'
import { useDiscount } from '@/lib/discounts'
import { sendOrderConfirmationToCustomer, sendOrderNotificationToFlorist } from '@/lib/email'
import { cookies } from 'next/headers'
import { Order } from '@/types'
import { getOrderBlock, getDeliverySettings, computeDeliveryFee } from '@/lib/settings'

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
    // Verifică blocarea comenzilor din Supabase
    const block = await getOrderBlock()
    if (block.active && block.blockedDates.length > 0) {
      const now = new Date()
      const roDate = new Date(now.getTime() + 3 * 60 * 60 * 1000)
      const today = roDate.toISOString().slice(0, 10)
      if (block.blockedDates.includes(today)) {
        return NextResponse.json(
          { error: 'Ne pare rău, florăria nu preia comenzi online astăzi. Te rugăm să revii în curând sau să ne contactezi direct.' },
          { status: 503 }
        )
      }
    }

    const body = await request.json()

    const {
      customer,
      items,
      discountCode,
      discountAmount,
      deliveryDate,
      deliveryTimeSlot,
      giftMessage,
      paymentMethod,
      fulfillmentMethod,
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

    // Recalcul autoritar pe server (nu ne bazăm pe totalul trimis de client)
    const method: 'livrare' | 'ridicare' = fulfillmentMethod === 'ridicare' ? 'ridicare' : 'livrare'
    const computedSubtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const safeDiscount = Math.max(0, discountAmount || 0)
    const afterDiscount = Math.max(0, computedSubtotal - safeDiscount)
    const deliverySettings = await getDeliverySettings()
    const computedFee = computeDeliveryFee(deliverySettings, method, afterDiscount)
    const computedTotal = afterDiscount + computedFee

    const order = await createOrder({
      customer,
      items,
      subtotal: computedSubtotal,
      discountCode,
      discountAmount: safeDiscount,
      deliveryFee: computedFee,
      total: computedTotal,
      deliveryDate,
      deliveryTimeSlot,
      giftMessage,
      paymentMethod,
      fulfillmentMethod: method,
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
