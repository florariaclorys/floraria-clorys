'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import OrderForm from '@/components/checkout/OrderForm'

function CheckoutContent() {
  const { items, cartTotal } = useCart()
  const searchParams = useSearchParams()

  const discountAmount = Number(searchParams.get('discount') || 0)
  const discountCode = searchParams.get('code') || ''
  const deliveryFee = 0
  const total = Number(searchParams.get('total') || cartTotal)
  const fulfillmentMethod = (searchParams.get('fulfillment') || 'livrare') as 'livrare' | 'ridicare'

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-6xl mb-4">🛒</span>
        <p className="font-cormorant text-2xl text-textdark mb-4">Coșul tău este gol</p>
        <Link href="/catalog" className="btn-primary">Mergi la catalog</Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Form */}
      <div className="lg:col-span-2">
        <OrderForm
          items={items}
          total={total}
          deliveryFee={deliveryFee}
          discountAmount={discountAmount}
          discountCode={discountCode}
          fulfillmentMethod={fulfillmentMethod}
        />
      </div>

      {/* Summary sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-light p-6 sticky top-28">
          <h3 className="font-cormorant text-xl font-semibold text-textdark mb-4">Produsele tale</h3>
          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded product-img-placeholder flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {item.product.category === 'buchete' ? '💐' : item.product.category === 'cutii' ? '🎁' : '🌿'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-lato text-xs text-textdark font-semibold line-clamp-1">{item.product.name}</p>
                  <p className="font-lato text-xs text-textdark/50">x{item.quantity}</p>
                </div>
                <span className="font-lato text-sm font-bold text-textdark">{item.product.price * item.quantity} RON</span>
              </div>
            ))}
          </div>

          <div className="border-t border-light pt-4 space-y-2">
            <div className="flex justify-between font-lato text-sm text-textdark/60">
              <span>Subtotal</span>
              <span>{cartTotal} RON</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-lato text-sm text-green-600">
                <span>Discount</span>
                <span>-{discountAmount} RON</span>
              </div>
            )}
            <div className="flex justify-between font-lato text-sm text-textdark/60">
              <span>Livrare</span>
              <span>{deliveryFee === 0 ? 'GRATUIT' : `${deliveryFee} RON`}</span>
            </div>
            <div className="flex justify-between font-cormorant text-2xl font-bold text-primary border-t border-light pt-2 mt-1">
              <span>Total</span>
              <span>{total} RON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Pasul 2 din 2</p>
          <h1 className="font-cormorant text-4xl text-textdark font-light">Finalizează Comanda</h1>
        </div>
        <Suspense fallback={<div className="font-lato text-sm text-textdark/50">Se încarcă...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  )
}
