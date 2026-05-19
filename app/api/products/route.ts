import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/products'
import { Product } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')

  let products = getProducts()

  if (category) {
    products = products.filter(p => p.category === category)
  }
  if (featured === 'true') {
    products = products.filter(p => p.isFeatured)
  }
  if (search) {
    const q = search.toLowerCase()
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Omit<Product, 'id' | 'createdAt'>
    const product = createProduct(data)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la crearea produsului' }, { status: 500 })
  }
}
