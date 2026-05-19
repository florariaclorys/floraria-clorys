import { supabase } from './supabase'
import { Product } from '@/types'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(dbToProduct)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return undefined
  return dbToProduct(data)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return undefined
  return dbToProduct(data)
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const { data: row, error } = await supabase
    .from('products')
    .insert([productToDb(data)])
    .select()
    .single()
  if (error) throw error
  return dbToProduct(row)
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const { data: row, error } = await supabase
    .from('products')
    .update(productToDb(data as Product))
    .eq('id', id)
    .select()
    .single()
  if (error) return null
  return dbToProduct(row)
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  return !error
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
  if (error) throw error
  return (data || []).map(dbToProduct)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
  if (error) throw error
  return (data || []).map(dbToProduct)
}

function dbToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    category: row.category as string,
    price: row.price as number,
    originalPrice: row.original_price as number | undefined,
    images: row.images as string[],
    description: row.description as string,
    shortDescription: row.short_description as string,
    inStock: row.in_stock as boolean,
    isFeatured: row.is_featured as boolean,
    isNew: row.is_new as boolean,
    tags: row.tags as string[],
    createdAt: row.created_at as string,
  }
}

function productToDb(p: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (p.name !== undefined) row.name = p.name
  if (p.slug !== undefined) row.slug = p.slug
  if (p.category !== undefined) row.category = p.category
  if (p.price !== undefined) row.price = p.price
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice
  if (p.images !== undefined) row.images = p.images
  if (p.description !== undefined) row.description = p.description
  if (p.shortDescription !== undefined) row.short_description = p.shortDescription
  if (p.inStock !== undefined) row.in_stock = p.inStock
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured
  if (p.isNew !== undefined) row.is_new = p.isNew
  if (p.tags !== undefined) row.tags = p.tags
  return row
}
