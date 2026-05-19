import { NextRequest, NextResponse } from 'next/server'
import { validateDiscount } from '@/lib/discounts'

export async function POST(request: NextRequest) {
  try {
    const { code, orderValue } = await request.json() as { code: string; orderValue: number }

    if (!code || typeof orderValue !== 'number') {
      return NextResponse.json(
        { valid: false, discount: null, discountAmount: 0, message: 'Date invalide' },
        { status: 400 }
      )
    }

    const result = await validateDiscount(code, orderValue)
    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { valid: false, discount: null, discountAmount: 0, message: 'Eroare server' },
      { status: 500 }
    )
  }
}
