import { NextRequest, NextResponse } from 'next/server'
import { getProductById, getProductBySlug, updateProduct, deleteProduct } from '@/lib/products'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  // Try by ID first, then by slug
  const product = await getProductById(id) ?? await getProductBySlug(id)
  if (!product) {
    return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const updated = await updateProduct(params.id, data)
    if (!updated) {
      return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = await deleteProduct(params.id)
  if (!success) {
    return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
