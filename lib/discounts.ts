import { supabase } from './supabase'
import { Discount } from '@/types'

export async function getDiscounts(): Promise<Discount[]> {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(dbToDiscount)
}

export async function validateDiscount(
  code: string,
  orderValue: number
): Promise<{ valid: boolean; discount: Discount | null; discountAmount: number; message: string }> {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .ilike('code', code)
    .single()

  if (error || !data) {
    return { valid: false, discount: null, discountAmount: 0, message: 'Codul de discount nu există.' }
  }

  const discount = dbToDiscount(data)

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

export async function useDiscount(code: string): Promise<void> {
  const { data } = await supabase
    .from('discounts')
    .select('used_count')
    .ilike('code', code)
    .single()
  if (data) {
    await supabase
      .from('discounts')
      .update({ used_count: (data.used_count as number) + 1 })
      .ilike('code', code)
  }
}

export async function createDiscount(data: Omit<Discount, 'id' | 'usedCount'>): Promise<Discount> {
  const { data: row, error } = await supabase
    .from('discounts')
    .insert([{
      code: data.code,
      type: data.type,
      value: data.value,
      min_order_value: data.minOrderValue,
      max_uses: data.maxUses,
      used_count: 0,
      expires_at: data.expiresAt,
      is_active: data.isActive,
    }])
    .select()
    .single()
  if (error) throw error
  return dbToDiscount(row)
}

export async function updateDiscount(id: string, data: Partial<Discount>): Promise<Discount | null> {
  const update: Record<string, unknown> = {}
  if (data.code !== undefined) update.code = data.code
  if (data.type !== undefined) update.type = data.type
  if (data.value !== undefined) update.value = data.value
  if (data.minOrderValue !== undefined) update.min_order_value = data.minOrderValue
  if (data.maxUses !== undefined) update.max_uses = data.maxUses
  if (data.expiresAt !== undefined) update.expires_at = data.expiresAt
  if (data.isActive !== undefined) update.is_active = data.isActive

  const { data: row, error } = await supabase
    .from('discounts')
    .update(update)
    .eq('id', id)
    .select()
    .single()
  if (error) return null
  return dbToDiscount(row)
}

export async function deleteDiscount(id: string): Promise<boolean> {
  const { error } = await supabase.from('discounts').delete().eq('id', id)
  return !error
}

function dbToDiscount(row: Record<string, unknown>): Discount {
  return {
    id: row.id as string,
    code: row.code as string,
    type: row.type as Discount['type'],
    value: row.value as number,
    minOrderValue: row.min_order_value as number,
    maxUses: row.max_uses as number | null,
    usedCount: row.used_count as number,
    expiresAt: row.expires_at as string | null,
    isActive: row.is_active as boolean,
  }
}
