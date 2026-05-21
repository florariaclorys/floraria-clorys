'use client'

import Link from 'next/link'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import DiscountCode from '@/components/cart/DiscountCode'
import { useState } from 'react'

const DELIVERY_FEE = 0
const FREE_DELIVERY_THRESHOLD = 0

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart()
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountCode, setDiscountCode] = useState('')
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'livrare' | 'ridicare'>('livrare')

  const handleDiscount = (amount: number, code: string) => {
    setDiscountAmount(amount)
    setDiscountCode(code)
  }

  const afterDiscount = Math.max(0, cartTotal - discountAmount)
  const deliveryFee = afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = afterDiscount + deliveryFee

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center bg-background">
        <span className="text-7xl mb-6">🛒</span>
        <h1 className="font-cormorant text-3xl text-textdark mb-3">Coșul tău este gol</h1>
        <p className="font-lato text-sm text-textdark/50 mb-8">Adaugă câteva aranjamente minunate</p>
        <Link href="/catalog" className="btn-primary">
          Mergi la catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Pasul 1 din 2</p>
          <h1 className="font-cormorant text-4xl text-textdark font-light">Coșul tău</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="bg-white border border-light p-5 flex gap-5 items-start">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded product-img-placeholder flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">
                    {item.product.category === 'buchete' ? '💐' :
                     item.product.category === 'cutii' ? '🎁' :
                     item.product.category === 'aranjamente' ? '🌿' :
                     item.product.category === 'plante' ? '🌱' : '✨'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/produs/${item.product.slug}`} className="font-cormorant text-xl font-semibold text-textdark hover:text-primary transition-colors line-clamp-1">
                    {item.product.name}
                  </Link>
                  <p className="font-lato text-xs text-accent uppercase tracking-widest mt-0.5">{item.product.category}</p>
                  <p className="font-cormorant text-lg font-bold text-primary mt-2">
                    {item.product.price} RON <span className="font-lato text-sm font-normal text-textdark/40">/ buc</span>
                  </p>
                </div>

                {/* Qty + Delete */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-textdark/30 hover:text-red-500 transition-colors"
                    aria-label="Șterge"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center border border-light">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-light transition-colors font-lato"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-lato text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-light transition-colors font-lato"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-cormorant text-xl font-bold text-textdark">
                    {item.product.price * item.quantity} RON
                  </span>
                </div>
              </div>
            ))}

            <Link href="/catalog" className="inline-flex items-center gap-2 font-lato text-sm text-accent hover:text-primary transition-colors mt-2">
              <ShoppingBag size={14} />
              Continuă cumpărăturile
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-light p-6 sticky top-28">
              <h2 className="font-cormorant text-2xl font-semibold text-textdark mb-6">Sumar comandă</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between font-lato text-sm text-textdark/70">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} produse)</span>
                  <span>{cartTotal} RON</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-lato text-sm text-green-600">
                    <span>Discount ({discountCode})</span>
                    <span>-{discountAmount} RON</span>
                  </div>
                )}
                <div className="flex justify-between font-lato text-sm text-textdark/70">
                  <span>Livrare</span>
                  <span className="text-green-600 font-semibold">GRATUIT</span>
                </div>
              </div>

              <DiscountCode onDiscount={handleDiscount} orderValue={cartTotal} />

              {/* Delivery info cards */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="border border-green-200 bg-green-50 rounded-lg px-3 py-2.5 flex flex-col items-center text-center gap-1">
                  <span className="text-lg">🚚</span>
                  <p className="font-lato text-[10px] font-bold text-green-800 leading-tight">Livrare gratuită</p>
                  <p className="font-lato text-[9px] text-green-700/70 leading-tight">Negrești-Oaș</p>
                </div>
                <div className="border border-green-200 bg-green-50 rounded-lg px-3 py-2.5 flex flex-col items-center text-center gap-1">
                  <span className="text-lg">📍</span>
                  <p className="font-lato text-[10px] font-bold text-green-800 leading-tight">Împrejurimi</p>
                  <p className="font-lato text-[9px] text-green-700/70 leading-tight">minim 250 RON</p>
                </div>
              </div>

              {/* Fulfillment method */}
              <div className="mt-4">
                <p className="font-lato text-xs tracking-widest uppercase text-textdark/50 mb-3">Cum dorești să primești comanda?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'livrare', icon: '🚚', title: 'Livrare la adresă', desc: 'Aducem noi la tine' },
                    { value: 'ridicare', icon: '🏪', title: 'Ridicare din magazin', desc: 'Vii personal la florărie' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFulfillmentMethod(opt.value as 'livrare' | 'ridicare')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                        fulfillmentMethod === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-light hover:border-accent'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <p className={`font-lato text-xs font-semibold ${fulfillmentMethod === opt.value ? 'text-primary' : 'text-textdark'}`}>{opt.title}</p>
                      <p className="font-lato text-[10px] text-textdark/50">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {fulfillmentMethod === 'ridicare' && (
                  <div className="mt-3 p-3 bg-light/60 rounded-lg">
                    <p className="font-lato text-xs text-textdark/60">
                      📍 <strong>Adresa florăriei:</strong> Negrești-Oaș, Satu Mare<br/>
                      🕐 <strong>Program:</strong> L-V 09:00–19:00 · S 10:00–17:00
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-light mt-4 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-cormorant text-xl font-semibold text-textdark">Total</span>
                  <span className="font-cormorant text-3xl font-bold text-primary">{total} RON</span>
                </div>
              </div>

              <Link
                href={`/comanda?discount=${discountAmount}&code=${discountCode}&fee=${deliveryFee}&total=${total}&fulfillment=${fulfillmentMethod}`}
                className="btn-primary w-full text-center block"
              >
                Continuă către comandă
              </Link>

              <div className="mt-4 flex items-center justify-center gap-4">
                {['🔒 Plată securizată', '🌿 Flori proaspete'].map(f => (
                  <span key={f} className="font-lato text-xs text-textdark/40">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
