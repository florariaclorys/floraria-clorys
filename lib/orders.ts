import fs from 'fs'
import path from 'path'
import { Order } from '@/types'

const dataPath = path.join(process.cwd(), 'data', 'orders.json')

export function getOrders(): Order[] {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as Order[]
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find(o => o.id === id)
}

export function saveOrders(orders: Order[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2), 'utf-8')
}

export function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = getOrders()
  const year = new Date().getFullYear()
  const count = orders.filter(o => o.id.startsWith(`ORD-${year}`)).length + 1
  const paddedCount = String(count).padStart(3, '0')
  const newOrder: Order = {
    ...data,
    id: `ORD-${year}-${paddedCount}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  orders.push(newOrder)
  saveOrders(orders)
  return newOrder
}

export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return null
  orders[idx].status = status
  saveOrders(orders)
  return orders[idx]
}
