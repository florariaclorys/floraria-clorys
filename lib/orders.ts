import { supabase } from './supabase'
import { Order } from '@/types'

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(dbToOrder)
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return undefined
  return dbToOrder(data)
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .like('id', `ORD-${year}-%`)
  const paddedCount = String((count || 0) + 1).padStart(3, '0')
  const id = `ORD-${year}-${paddedCount}`

  const row = {
    id,
    customer: data.customer,
    items: data.items,
    subtotal: data.subtotal,
    discount_code: data.discountCode || null,
    discount_amount: data.discountAmount,
    delivery_fee: data.deliveryFee,
    total: data.total,
    delivery_date: data.deliveryDate,
    delivery_time_slot: data.deliveryTimeSlot,
    gift_message: data.giftMessage || null,
    payment_method: data.paymentMethod,
    status: 'pending',
  }

  const { data: inserted, error } = await supabase
    .from('orders')
    .insert([row])
    .select()
    .single()
  if (error) throw error
  return dbToOrder(inserted)
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
  return !error
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) return null
  return dbToOrder(data)
}

function dbToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    customer: row.customer as Order['customer'],
    items: row.items as Order['items'],
    subtotal: row.subtotal as number,
    discountCode: row.discount_code as string | undefined,
    discountAmount: row.discount_amount as number,
    deliveryFee: row.delivery_fee as number,
    total: row.total as number,
    deliveryDate: row.delivery_date as string,
    deliveryTimeSlot: row.delivery_time_slot as string,
    giftMessage: row.gift_message as string | undefined,
    paymentMethod: row.payment_method as Order['paymentMethod'],
    status: row.status as Order['status'],
    createdAt: row.created_at as string,
  }
}
