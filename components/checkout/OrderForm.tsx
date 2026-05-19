'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import { CartItem } from '@/types'

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
]

const tomorrow = () => {
  return new Date().toISOString().split('T')[0]
}

const STEPS = ['Date personale', 'Adresă livrare', 'Data & Oră', 'Mesaj card', 'Confirmare']

interface FormData {
  name: string
  phone: string
  email: string
  address: string
  addressExtra: string
  city: string
  county: string
  deliveryDate: string
  deliveryTimeSlot: string
  giftMessage: string
  paymentMethod: 'ramburs' | 'transfer'
}

export default function OrderForm({ items, total, deliveryFee, discountAmount, discountCode }: {
  items: CartItem[]
  total: number
  deliveryFee: number
  discountAmount: number
  discountCode: string
}) {
  const router = useRouter()
  const { clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    addressExtra: '',
    city: '',
    county: '',
    deliveryDate: tomorrow(),
    deliveryTimeSlot: TIME_SLOTS[0],
    giftMessage: '',
    paymentMethod: 'ramburs',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateStep = () => {
    const errs: Partial<FormData> = {}
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Numele este obligatoriu'
      if (!form.phone.trim()) errs.phone = 'Telefonul este obligatoriu'
      if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Email valid obligatoriu'
    }
    if (step === 2) {
      if (!form.address.trim()) errs.address = 'Adresa este obligatorie'
      if (!form.city.trim()) errs.city = 'Orașul este obligatoriu'
    }
    if (step === 3) {
      if (!form.deliveryDate) errs.deliveryDate = 'Data livrării este obligatorie'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const nextStep = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 5))
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    try {
      const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: `${form.address}${form.addressExtra ? ', ' + form.addressExtra : ''}`,
            city: form.city,
            county: form.county,
          },
          items: items.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images[0] || '',
          })),
          subtotal,
          discountCode: discountCode || undefined,
          discountAmount,
          deliveryFee,
          total,
          deliveryDate: form.deliveryDate,
          deliveryTimeSlot: form.deliveryTimeSlot,
          giftMessage: form.giftMessage || undefined,
          paymentMethod: form.paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la plasarea comenzii')
      clearCart()
      router.push(`/confirmare/${data.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare necunoscută'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-light p-6 lg:p-8">
      {/* Step indicators */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEPS.map((label, i) => {
          const num = i + 1
          const active = num === step
          const done = num < step
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-lato text-sm font-bold transition-colors ${
                  done ? 'bg-green-600 text-white' : active ? 'bg-primary text-white' : 'bg-light text-textdark/40'
                }`}>
                  {done ? '✓' : num}
                </div>
                <span className={`font-lato text-xs mt-1 whitespace-nowrap ${active ? 'text-primary font-semibold' : 'text-textdark/40'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 sm:w-12 mx-1 mb-4 ${done ? 'bg-green-600' : 'bg-light'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Personal */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">Date personale</h2>
          <div>
            <label className="label-field">Nume complet *</label>
            <input className="input-field" value={form.name} onChange={set('name')} placeholder="Ion Popescu" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label-field">Număr de telefon *</label>
            <input className="input-field" value={form.phone} onChange={set('phone')} placeholder="07XX XXX XXX" type="tel" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="label-field">Email *</label>
            <input className="input-field" value={form.email} onChange={set('email')} placeholder="email@exemplu.ro" type="email" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Address */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">Adresa de livrare</h2>
          <div>
            <label className="label-field">Stradă și număr *</label>
            <input className="input-field" value={form.address} onChange={set('address')} placeholder="Str. Florilor nr. 5" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div>
            <label className="label-field">Bloc, scară, apartament (opțional)</label>
            <input className="input-field" value={form.addressExtra} onChange={set('addressExtra')} placeholder="Bl. A1, Sc. 2, Ap. 15" />
          </div>
          <div>
            <label className="label-field">Oraș *</label>
            <input className="input-field" value={form.city} onChange={set('city')} placeholder="Negrești Oaș" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="label-field">Județ (opțional)</label>
            <input className="input-field" value={form.county} onChange={set('county')} placeholder="Ilfov" />
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">Data și ora livrării</h2>
          <div>
            <label className="label-field">Data livrării *</label>
            <input
              className="input-field"
              type="date"
              value={form.deliveryDate}
              onChange={set('deliveryDate')}
              min={tomorrow()}
            />
            {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
          </div>
          <div>
            <label className="label-field">Interval orar *</label>
            <select className="input-field" value={form.deliveryTimeSlot} onChange={set('deliveryTimeSlot')}>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div className="bg-light/60 rounded p-4">
            <p className="font-lato text-xs text-textdark/60">
              <strong>Notă:</strong> Livrăm în Țara Oașului. Comenzile plasate înainte de ora 14:00 pot fi livrate în aceeași zi (supliment 30 RON). Livrare standard: ziua următoare.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Gift message */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">Mesaj pentru card</h2>
          <p className="font-lato text-sm text-textdark/60">Opțional — includem un card scris de mână cu mesajul tău personal.</p>
          <div>
            <label className="label-field">Mesaj (max. 200 caractere)</label>
            <textarea
              className="input-field resize-none"
              rows={5}
              value={form.giftMessage}
              onChange={set('giftMessage')}
              maxLength={200}
              placeholder="Ex: La mulți ani cu multă sănătate și fericire! Cu drag, ❤"
            />
            <p className="font-lato text-xs text-textdark/40 mt-1 text-right">{form.giftMessage.length}/200</p>
          </div>
        </div>
      )}

      {/* Step 5: Payment */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">Metodă de plată</h2>
          <div className="space-y-3">
            {([
              <div className="flex items-start gap-4 p-4 border-2 border-primary bg-light/40 rounded-lg">
              <span className="text-2xl mt-0.5">💵</span>
              <div>
                <p className="font-lato text-sm font-bold text-textdark">Ramburs la livrare</p>
                <p className="font-lato text-xs text-textdark/60 mt-0.5">Plătești cash la livrare</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-light/50 rounded">
            <p className="font-cormorant text-lg text-textdark font-semibold mb-3">Sumar comandă</p>
            {items.map(i => (
              <div key={i.product.id} className="flex justify-between font-lato text-sm text-textdark/70 mb-1">
                <span>{i.product.name} x{i.quantity}</span>
                <span>{(i.product.price * i.quantity)} RON</span>
              </div>
            ))}
            <div className="border-t border-light mt-3 pt-3 space-y-1">
              {discountAmount > 0 && (
                <div className="flex justify-between font-lato text-sm text-green-600">
                  <span>Discount ({discountCode})</span>
                  <span>-{discountAmount} RON</span>
                </div>
              )}
              <div className="flex justify-between font-lato text-sm text-textdark/70">
                <span>Livrare</span>
                <span>{deliveryFee === 0 ? 'GRATUIT' : `${deliveryFee} RON`}</span>
              </div>
              <div className="flex justify-between font-cormorant text-xl font-bold text-primary border-t border-light pt-2 mt-1">
                <span>Total</span>
                <span>{total} RON</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-light">
        {step > 1 ? (
          <button onClick={prevStep} className="btn-outline">
            Înapoi
          </button>
        ) : <div />}

        {step < 5 ? (
          <button onClick={nextStep} className="btn-primary">
            Continuă
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-60"
          >
            {loading ? 'Se procesează...' : 'Plasează Comanda'}
          </button>
        )}
      </div>
    </div>
  )
}
