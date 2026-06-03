import { supabase } from './supabase'

export interface BusinessHours {
  weekdays: string
  saturday: string
  sunday: string
}

const DEFAULT_HOURS: BusinessHours = {
  weekdays: '09:00–19:00',
  saturday: '10:00–17:00',
  sunday: 'Închís',
}

export async function getBusinessHours(): Promise<BusinessHours> {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hours')
      .single()

    if (data?.value) return data.value as BusinessHours
  } catch {
    // table may not exist yet
  }
  return DEFAULT_HOURS
}

export async function updateBusinessHours(hours: BusinessHours): Promise<void> {
  await supabase.from('settings').upsert({
    key: 'hours',
    value: hours,
    updated_at: new Date().toISOString(),
  })
}

export interface OrderBlock {
  active: boolean
  blockedDates: string[]   // ex: ['2026-06-03', '2026-06-04']
  returnDate: string       // ex: 'vineri, 5 iunie'
}

const DEFAULT_BLOCK: OrderBlock = { active: false, blockedDates: [], returnDate: '' }

export async function getOrderBlock(): Promise<OrderBlock> {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'order_block')
      .single()
    if (data?.value) return data.value as OrderBlock
  } catch {}
  return DEFAULT_BLOCK
}

export async function setOrderBlock(block: OrderBlock): Promise<void> {
  await supabase.from('settings').upsert({
    key: 'order_block',
    value: block,
    updated_at: new Date().toISOString(),
  })
}

export async function getAdminPassword(): Promise<string> {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single()
    if (data?.value?.password) return data.value.password as string
  } catch {}
  return process.env.ADMIN_PASSWORD || 'clorys2024'
}

export async function setAdminPassword(password: string): Promise<void> {
  await supabase.from('settings').upsert({
    key: 'admin_password',
    value: { password },
    updated_at: new Date().toISOString(),
  })
}
