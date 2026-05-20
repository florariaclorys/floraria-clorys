'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const FLOWERS = [
  { id: 'trandafir',   name: 'Trandafir',          price: 12 },
  { id: 'crizantema',  name: 'Crizantemă',          price: 12 },
  { id: 'hortensia',   name: 'Hortensie',           price: 30 },
  { id: 'crin',        name: 'Crin',                price: 35 },
  { id: 'minigherbera',name: 'Mini Gherbera',       price: 5  },
  { id: 'eustoma',     name: 'Eustomă',             price: 15 },
  { id: 'matiola',     name: 'Matiolă',             price: 10 },
  { id: 'gypsofila',   name: 'Gypsophilă',          price: 10 },
  { id: 'eucalipt',    name: 'Eucalipt',            price: 15 },
  { id: 'pistacchio',  name: 'Verdeață Pistacchio', price: 0  },
]

const FOILS = [
  { id: 'alba',   label: 'Albă',   hex: '#f5f5f5' },
  { id: 'crem',   label: 'Crem',   hex: '#f5ead8' },
  { id: 'roz',    label: 'Roz',    hex: '#f48fb1' },
  { id: 'violet', label: 'Violet', hex: '#9b59b6' },
  { id: 'fucsia', label: 'Fucsia', hex: '#e91e8c' },
  { id: 'negru',  label: 'Neagră', hex: '#282838' },
]

const RIBBONS = [
  { id: 'roz',  label: 'Roz',   hex: '#f48fb1' },
  { id: 'crem', label: 'Crem',  hex: '#f5ead8' },
  { id: 'alb',  label: 'Albă',  hex: '#f8f8f8' },
  { id: 'negru',label: 'Neagră',hex: '#303030' },
]

const TIME_SLOTS = [
  '09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00',
  '15:00 – 17:00', '17:00 – 19:00',
]

type Qty = Record<string, number>

interface Form {
  name: string; phone: string; email: string
  address: string; city: string
  deliveryDate: string; deliveryTimeSlot: string
  giftMessage: string; paymentMethod: 'ramburs' | 'transfer'
}

export default function BuchetPersonalizat() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)

  const [qty, setQty] = useState<Qty>(() => Object.fromEntries(FLOWERS.map(f => [f.id, 0])))
  const [foil, setFoil] = useState('alba')
  const [ribbon, setRibbon] = useState('roz')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<Form>({
    name: '', phone: '', email: '',
    address: '', city: 'Negrești-Oaș',
    deliveryDate: '', deliveryTimeSlot: TIME_SLOTS[0],
    giftMessage: '', paymentMethod: 'ramburs',
  })

  const total = FLOWERS.reduce((s, f) => s + f.price * (qty[f.id] || 0), 0)
  const selected = FLOWERS.filter(f => qty[f.id] > 0)

  // Floating flower emoji particles in hero
  useEffect(() => {
    const container = heroRef.current
    if (!container) return
    const emojis = ['🌸', '🌺', '🌹', '🌼', '💐', '🌷', '✨']
    const els: HTMLDivElement[] = []
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div')
      const sz = 14 + Math.random() * 18
      const dur = 8 + Math.random() * 10
      const delay = -Math.random() * 14
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      el.style.cssText = `position:absolute;font-size:${sz}px;left:${Math.random() * 100}%;bottom:-40px;opacity:0;pointer-events:none;animation:floatUp ${dur}s linear ${delay}s infinite;user-select:none`
      container.appendChild(el)
      els.push(el)
    }
    return () => els.forEach(e => e.remove())
  }, [])

  // Spark particles when adding/removing a flower
  const spawnSparks = useCallback((cardId: string, adding: boolean) => {
    const card = document.getElementById(`fcard-${cardId}`)
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const colors = adding ? ['#d4a843', '#e8739a', '#fff5d6'] : ['#aaa', '#ccc']
    const n = adding ? 16 : 8
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2
      const dist = 28 + Math.random() * 42
      const dx = Math.cos(angle) * dist
      const dy = Math.sin(angle) * dist
      const sz = adding ? 4 + Math.random() * 6 : 3 + Math.random() * 4
      const el = document.createElement('div')
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${colors[i % colors.length]};pointer-events:none;z-index:9999;--dx:${dx}px;--dy:${dy}px;animation:bbSpark .55s ease-out forwards`
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 600)
    }
    if (adding) {
      const stars = ['✦', '✧', '⋆']
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2
        const dist = 18 + Math.random() * 28
        const el = document.createElement('div')
        el.style.cssText = `position:fixed;left:${cx}px;top:${cy - 10}px;font-size:${10 + Math.random() * 8}px;color:#d4a843;pointer-events:none;z-index:9999;--dx:${Math.cos(a) * dist}px;--dy:${Math.sin(a) * dist - 18}px;animation:bbSpark .7s ease-out forwards`
        el.textContent = stars[i % stars.length]
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 750)
      }
    }
  }, [])

  const changeQty = useCallback((id: string, delta: number) => {
    setQty(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta)
      if (next === prev[id]) return prev
      spawnSparks(id, delta > 0)
      return { ...prev, [id]: next }
    })
  }, [spawnSparks])

  const setField = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!total) { toast.error('Adaugă cel puțin o floare!'); return }

    setSubmitting(true)
    try {
      const foilLabel = FOILS.find(f => f.id === foil)?.label || ''
      const ribLabel  = RIBBONS.find(r => r.id === ribbon)?.label || ''
      const items = [
        ...selected.map(f => ({
          productId: `custom-${f.id}`,
          productName: f.name,
          price: f.price,
          quantity: qty[f.id],
          image: '',
        })),
        {
          productId: 'custom-ambalaj',
          productName: `Folie ${foilLabel} · Panglică ${ribLabel}`,
          price: 0,
          quantity: 1,
          image: '',
        },
      ]

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            city: form.city,
          },
          items,
          subtotal: total,
          discountAmount: 0,
          deliveryFee: 0,
          total,
          deliveryDate: form.deliveryDate,
          deliveryTimeSlot: form.deliveryTimeSlot,
          giftMessage: form.giftMessage || undefined,
          paymentMethod: form.paymentMethod,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la plasarea comenzii')
      router.push(`/confirmare/${data.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Eroare la plasarea comenzii')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          8%   { opacity: .7; }
          88%  { opacity: .35; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bbSpark {
          0%   { opacity: 1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(.1); }
        }
      `}</style>

      <div className="pt-20 min-h-screen bg-background">

        {/* Hero */}
        <div
          ref={heroRef}
          className="relative overflow-hidden bg-[#2A0A12] py-16 text-center"
          style={{ isolation: 'isolate' }}
        >
          <p className="font-lato text-xs tracking-[0.3em] uppercase text-accent mb-3">Floraria Clory&apos;s</p>
          <h1 className="font-cormorant text-4xl md:text-6xl font-light text-white mb-4">
            Buchet Personalizat
          </h1>
          <p className="font-lato text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            Alege florile tale, folia și panglica. Livrăm în 1–3 ore în Negrești-Oaș.
          </p>
        </div>

        {/* Builder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left: flowers + options */}
            <div>
              <h2 className="font-cormorant text-2xl text-textdark mb-5">🌸 Alege Florile</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {FLOWERS.map(f => (
                  <div
                    key={f.id}
                    id={`fcard-${f.id}`}
                    className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                      qty[f.id] > 0
                        ? 'border-primary bg-primary/5 shadow-[0_0_14px_rgba(180,50,80,.12)]'
                        : 'border-light bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-cormorant text-base font-semibold text-textdark leading-tight">
                        {f.name}
                      </span>
                      {qty[f.id] > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-lato">✓</span>
                      )}
                    </div>
                    <p className="font-lato text-xs text-textdark/45 mb-3">
                      {f.price === 0 ? 'GRATUIT' : `${f.price} RON / buc`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeQty(f.id, -1)}
                        className="w-7 h-7 rounded-full border border-light flex items-center justify-center text-textdark hover:bg-primary hover:text-white hover:border-primary transition-colors font-bold text-sm"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={qty[f.id]}
                        onChange={e => {
                          const val = Math.max(0, parseInt(e.target.value) || 0)
                          if (val !== qty[f.id]) {
                            spawnSparks(f.id, val > qty[f.id])
                            setQty(prev => ({ ...prev, [f.id]: val }))
                          }
                        }}
                        className="w-12 text-center font-lato font-bold text-sm text-textdark border border-light rounded-md py-0.5 focus:outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => changeQty(f.id, 1)}
                        className="w-7 h-7 rounded-full border border-light flex items-center justify-center text-textdark hover:bg-primary hover:text-white hover:border-primary transition-colors font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Foil */}
              <h2 className="font-cormorant text-2xl text-textdark mb-4">✨ Alege Folia</h2>
              <div className="flex gap-4 flex-wrap mb-8">
                {FOILS.map(f => (
                  <button key={f.id} onClick={() => setFoil(f.id)} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-11 h-11 rounded-full border-[3px] transition-all ${foil === f.id ? 'border-primary scale-110 shadow-md' : 'border-transparent'}`}
                      style={{ background: f.hex }}
                    />
                    <span className="font-lato text-[10px] text-textdark/60">{f.label}</span>
                  </button>
                ))}
              </div>

              {/* Ribbon */}
              <h2 className="font-cormorant text-2xl text-textdark mb-4">🎀 Alege Panglica</h2>
              <div className="flex gap-4 flex-wrap">
                {RIBBONS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRibbon(r.id)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-lg border-2 transition-all ${ribbon === r.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                  >
                    <svg width="60" height="30" viewBox="0 0 68 36">
                      <rect x="3" y="14" width="62" height="9" rx="4.5" fill={r.hex} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
                      <path d="M34,18.5 C27,12 17,9 12,12 C12,18 21,22 34,18.5Z" fill={r.hex} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
                      <path d="M34,18.5 C41,12 51,9 56,12 C56,18 47,22 34,18.5Z" fill={r.hex} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
                      <circle cx="34" cy="18.5" r="5" fill={r.hex} stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"/>
                    </svg>
                    <span className="font-lato text-[10px] text-textdark/60">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: summary + form */}
            <div className="lg:sticky lg:top-28 self-start">

              {/* Selection summary */}
              <div className="bg-white border border-light rounded-xl p-6 mb-6">
                <h3 className="font-cormorant text-xl text-textdark mb-4">💐 Buchetul Tău</h3>
                {selected.length === 0 ? (
                  <p className="font-lato text-sm text-textdark/40 italic py-4 text-center">
                    Nicio floare selectată încă...
                  </p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {selected.map(f => (
                      <div key={f.id} className="flex justify-between items-center font-lato text-sm">
                        <span className="text-textdark/70">{f.name} × {qty[f.id]}</span>
                        <span className="font-semibold text-textdark">
                          {f.price === 0 ? 'GRATUIT' : `${f.price * qty[f.id]} RON`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 items-center pt-3 border-t border-light">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full border border-light/60" style={{ background: FOILS.find(f => f.id === foil)?.hex }}/>
                    <span className="font-lato text-xs text-textdark/50">Folie {FOILS.find(f => f.id === foil)?.label}</span>
                  </div>
                  <span className="text-textdark/20">·</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-3 rounded-full border" style={{ background: RIBBONS.find(r => r.id === ribbon)?.hex, borderColor: 'rgba(0,0,0,.08)' }}/>
                    <span className="font-lato text-xs text-textdark/50">Panglică {RIBBONS.find(r => r.id === ribbon)?.label}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-light mt-3">
                  <span className="font-cormorant text-lg text-textdark">Total</span>
                  <span className="font-cormorant text-2xl font-bold text-primary">{total} RON</span>
                </div>
              </div>

              {/* Order form */}
              <form onSubmit={handleSubmit} className="bg-white border border-light rounded-xl p-6 space-y-4">
                <h3 className="font-cormorant text-xl text-textdark">📦 Date Livrare</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-field">Nume complet *</label>
                    <input className="input-field" required value={form.name} onChange={setField('name')} placeholder="Ion Popescu"/>
                  </div>
                  <div>
                    <label className="label-field">Telefon *</label>
                    <input className="input-field" required type="tel" value={form.phone} onChange={setField('phone')} placeholder="07XX XXX XXX"/>
                  </div>
                </div>

                <div>
                  <label className="label-field">Email *</label>
                  <input className="input-field" required type="email" value={form.email} onChange={setField('email')} placeholder="email@exemplu.ro"/>
                </div>

                <div>
                  <label className="label-field">Adresă livrare *</label>
                  <input className="input-field" required value={form.address} onChange={setField('address')} placeholder="Strada, număr"/>
                </div>

                <div>
                  <label className="label-field">Oraș *</label>
                  <input className="input-field" required value={form.city} onChange={setField('city')} placeholder="Negrești-Oaș"/>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-field">Data livrare *</label>
                    <input className="input-field" required type="date" min={today} value={form.deliveryDate} onChange={setField('deliveryDate')}/>
                  </div>
                  <div>
                    <label className="label-field">Interval orar *</label>
                    <select className="input-field" value={form.deliveryTimeSlot} onChange={setField('deliveryTimeSlot')}>
                      {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-field">Mesaj card (opțional)</label>
                  <textarea
                    className="input-field resize-none"
                    rows={2}
                    maxLength={200}
                    value={form.giftMessage}
                    onChange={setField('giftMessage')}
                    placeholder="Ex: La mulți ani cu drag! ❤"
                  />
                </div>

                <div>
                  <label className="label-field">Metodă plată</label>
                  <select className="input-field" value={form.paymentMethod} onChange={setField('paymentMethod')}>
                    <option value="ramburs">Ramburs la livrare</option>
                    <option value="transfer">Transfer bancar</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !total}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Se trimite...' : '🌸 Trimite Comanda'}
                </button>

                {!total && (
                  <p className="font-lato text-xs text-center text-textdark/40 -mt-2">
                    Adaugă cel puțin o floare pentru a comanda
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
