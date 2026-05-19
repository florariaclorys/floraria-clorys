import fs from 'fs'
import path from 'path'
import { Product } from '@/types'

const dataPath = path.join(process.cwd(), 'data', 'products.json')

export function getProducts(): Product[] {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as Product[]
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find(p => p.slug === slug)
}

export function saveProducts(products: Product[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf-8')
}

export function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const products = getProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return null
  products[idx] = { ...products[idx], ...data }
  saveProducts(products)
  return products[idx]
}

export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return false
  products.splice(idx, 1)
  saveProducts(products)
  return true
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter(p => p.isFeatured)
}

export function getProductsByCategory(category: string): Product[] {
  return getProducts().filter(p => p.category === category)
}
