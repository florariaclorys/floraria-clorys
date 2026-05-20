import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export interface BouquetFlower {
  id: string
  name: string
  price: number
  colors: string[]
  active: boolean
}

const DEFAULT_FLOWERS: BouquetFlower[] = [
  { id: 'trandafir',    name: 'Trandafir',          price: 12, colors: ['alb', 'roșu', 'roz'],      active: true },
  { id: 'crizantema',   name: 'Crizantemă',          price: 12, colors: ['albă'],                    active: true },
  { id: 'hortensia',    name: 'Hortensie',           price: 30, colors: ['alb', 'albastru', 'roz'],  active: true },
  { id: 'crin',         name: 'Crin',                price: 35, colors: ['alb'],                     active: true },
  { id: 'minigherbera', name: 'Mini Gherbera',       price: 5,  colors: ['alb', 'roz'],              active: true },
  { id: 'eustoma',      name: 'Eustomă',             price: 15, colors: ['alb', 'roz'],              active: true },
  { id: 'matiola',      name: 'Matiolă',             price: 10, colors: [],                          active: true },
  { id: 'gypsofila',    name: 'Gypsophilă',          price: 10, colors: ['albă'],                    active: true },
  { id: 'eucalipt',     name: 'Eucalipt',            price: 15, colors: ['verde', 'auriu'],          active: true },
  { id: 'pistacchio',   name: 'Verdeață Pistacchio', price: 0,  colors: [],                          active: true },
]

async function getFlowers(): Promise<BouquetFlower[]> {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'bouquet_flowers')
    .single()

  if (data?.value && Array.isArray(data.value)) return data.value as BouquetFlower[]
  return DEFAULT_FLOWERS
}

export async function GET() {
  const flowers = await getFlowers()
  return NextResponse.json(flowers)
}

export async function PUT(req: Request) {
  const cookieStore = cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const flowers: BouquetFlower[] = await req.json()

  await supabase.from('settings').upsert({
    key: 'bouquet_flowers',
    value: flowers,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'key' })

  return NextResponse.json({ ok: true })
}
