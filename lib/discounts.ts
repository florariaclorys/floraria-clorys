import fs from 'fs'
import path from 'path'
import { Discount } from '@/types'

const dataPath = path.join(process.cwd(), 'data', 'discounts.json')

export function getDiscounts(): Discount[] {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as Discount[]
}

export function saveDiscounts(discounts: Discount[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(discounts, null, 2), 'utf-8')
}

export function validateDiscount(
  code: string,
  orderValue: number
): { valid: boolean; discount: Discount | null; discountAmount: number; message: string } {
  const discounts = getDiscounts()
  const discount = discounts.find(d => d.code.toUpperCase() === code.toUpperCase())

  if (!discount) {
    return { valid: false, discount: null, discountAmount: 0, message: 'Codul de discount nu există.' }
  }
  if (!discount.isActive) {
    return { valid: false, discount: null, discountAmount: 0, message: 'Codul de discount nu mai este activ.' }
  }
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { valid: false, discount: null, discountAmount: 0, message: 'Codul de discount a expirat.' }
  }
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return { valid: false, discount: null, discountAmount: 0, message: 'Codul de discount a atins numărul maxim de utilizări.' }
  }
  if (orderValue < discount.minOrderValue) {
    return {
      valid: false,
      discount: null,
      discountAmount: 0,
      message: `Valoarea minimă a comenzii pentru acest cod este ${discount.minOrderValue} RON.`,
    }
  }

  const discountAmount =
    discount.type === 'percentage'
      ? Math.round((orderValue * discount.value) / 100)
      : discount.value

  return {
    valid: true,
    discount,
    discountAmount,
    message: `Discount aplicat: ${discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} RON`}`,
  }
}

export function useDiscount(code: string): void {
  const discounts = getDiscounts()
  const idx = discounts.findIndex(d => d.code.toUpperCase() === code.toUpperCase())
  if (idx !== -1) {
    discounts[idx].usedCount += 1
    saveDiscounts(discounts)
  }
}

export function createDiscount(data: Omit<Discount, 'id' | 'usedCount'>): Discount {
  const discounts = getDiscounts()
  const newDiscount: Discount = {
    ...data,
    id: String(Date.now()),
    usedCount: 0,
  }
  discounts.push(newDiscount)
  saveDiscounts(discounts)
  return newDiscount
}

export function updateDiscount(id: string, data: Partial<Discount>): Discount | null {
  const discounts = getDiscounts()
  const idx = discounts.findIndex(d => d.id === id)
  if (idx === -1) return null
  discounts[idx] = { ...discounts[idx], ...data }
  saveDiscounts(discounts)
  return discounts[idx]
}

export function deleteDiscount(id: string): boolean {
  const discounts = getDiscounts()
  const idx = discounts.findIndex(d => d.id === id)
  if (idx === -1) return false
  discounts.splice(idx, 1)
  saveDiscounts(discounts)
  return true
}
