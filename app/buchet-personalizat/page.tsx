'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { BouquetFlower } from '@/app/api/bouquet-flowers/route'

const FOILS = [
  { id: 'alba',   label: 'Albă',   hex: '#f5f5f5' },
  { id: 'crem',   label: 'Crem',   hex: '#f5ead8' },
  { id: 'roz',    label: 'Roz',    hex: '#f48fb1' },
  { id: 'violet', label: 'Violet', hex: '#9b59b6' },
  { id: 'fucsia', label: 'Fucsia', hex: '#e91e8c' },
  { id: 'negru',  label: 'Neagră', hex: '#282838' },
]

const RIBBONS = [
  { id: 'roz',   label: 'Roz',   hex: '#f48fb1' },
  { id: 'crem',  label: 'Crem',  hex: '#f5ead8' },
  { id: 'alb',   label: 'Albă',  hex: '#f8f8f8' },
  { id: 'negru', label: 'Neagră',hex: '#303030' },
]

const TIME_SLOTS = [
  '09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00',
  '15:00 – 17:00', '17:00 – 19:00',
]

interface FlowerState { qty: number; color: string }
type BuilderState = Record<string, FlowerState>

interface Form {
  name: string; phone: string; email: string
  address: string; city: string
  deliveryDate: string; deliveryTimeSlot: string
  giftMessage: string
}

const C = {
  bg:    '#1a0a0e',
  bg2:   '#2d1219',
  card:  'rgba(61,26,36,.75)',
  gold:  '#d4a843',
  rose:  '#e8739a',
  text:  '#fdf0e8',
  text2: '#c9a8b8',
  border:'rgba(212,168,67,.2)',
}

export default function BuchetPersonalizat() {
  const router  = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)

  const [flowers, setFlowers] = useState<BouquetFlower[]>([])
  const [state, setState]     = useState<BuilderState>({})
  const [foil, setFoil]       = useState('alba')
  const [ribbon, setRibbon]   = useState('roz')
  const [submitting, setSub]  = useState(false)
  const [form, setForm]       = useState<Form>({
    name: '', phone: '', email: '',
    address: '', city: 'Negrești-Oaș',
    deliveryDate: '', deliveryTimeSlot: TIME_SLOTS[0],
    giftMessage: '',
  })

  // load flowers from API
  useEffect(() => {
    fetch('/api/bouquet-flowers')
      .then(r => r.json())
      .then((data: BouquetFlower[]) => {
        const active = data.filter(f => f.active)
        setFlowers(active)
        const init: BuilderState = {}
        active.forEach(f => { init[f.id] = { qty: 0, color: f.colors[0] || '' } })
        setState(init)
      })
  }, [])

  // floating emojis
  useEffect(() => {
    const c = heroRef.current
    if (!c) return
    const emojis = ['🌸', '🌺', '🌹', '🌼', '💐', '🌷', '✨']
    const els: HTMLElement[] = []
    for (let i = 0; i < 22; i++) {
      const el  = document.createElement('div')
      const sz  = 13 + Math.random() * 19
      const dur = 8  + Math.random() * 11
      const del = -Math.random() * 15
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      el.style.cssText = `position:absolute;font-size:${sz}px;left:${Math.random()*100}%;bottom:-40px;opacity:0;pointer-events:none;user-select:none;animation:bbFloat ${dur}s linear ${del}s infinite`
      c.appendChild(el); els.push(el)
    }
    return () => els.forEach(e => e.remove())
  }, [])

  // sparks
  const spawnSparks = useCallback((cardId: string, adding: boolean) => {
    const card = document.getElementById(`fcard-${cardId}`)
    if (!card) return
    const r  = card.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top  + r.height / 2
    const colors = adding ? ['#d4a843', '#e8739a', '#fff5d6'] : ['#888', '#aaa']
    const n = adding ? 16 : 8
    for (let i = 0; i < n; i++) {
      const a  = (i / n) * Math.PI * 2
      const d  = 30 + Math.random() * 44
      const sz = adding ? 4 + Math.random() * 6 : 3 + Math.random() * 4
      const el = document.createElement('div')
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${colors[i%colors.length]};pointer-events:none;z-index:9999;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;animation:bbSpark .55s ease-out forwards`
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 600)
    }
    if (adding) {
      const stars = ['✦', '✧', '⋆']
      for (let i = 0; i < 4; i++) {
        const a  = Math.random() * Math.PI * 2
        const d  = 18 + Math.random() * 30
        const el = document.createElement('div')
        el.style.cssText = `position:fixed;left:${cx}px;top:${cy-10}px;font-size:${10+Math.random()*9}px;color:#d4a843;pointer-events:none;z-index:9999;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-18}px;animation:bbSpark .7s ease-out forwards`
        el.textContent = stars[i % stars.length]
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 750)
      }
    }
  }, [])

  const changeQty = useCallback((id: string, delta: number) => {
    setState(prev => {
      const cur  = prev[id] || { qty: 0, color: '' }
      const next = Math.max(0, cur.qty + delta)
      if (next === cur.qty) return prev
      spawnSparks(id, delta > 0)
      return { ...prev, [id]: { ...cur, qty: next } }
    })
  }, [spawnSparks])

  const setQtyDirect = useCallback((id: string, raw: string) => {
    const val = Math.max(0, parseInt(raw) || 0)
    setState(prev => {
      const cur = prev[id] || { qty: 0, color: '' }
      if (val === cur.qty) return prev
      spawnSparks(id, val > cur.qty)
      return { ...prev, [id]: { ...cur, qty: val } }
    })
  }, [spawnSparks])

  const setColor = (id: string, color: string) =>
    setState(prev => ({ ...prev, [id]: { ...(prev[id] || { qty: 0, color: '' }), color } }))

  const setField = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const selected = flowers.filter(f => (state[f.id]?.qty || 0) > 0)
  const total    = flowers.reduce((s, f) => s + f.price * (state[f.id]?.qty || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!total) { toast.error('Adaugă cel puțin o floare!'); return }
    setSub(true)
    try {
      const foilLabel = FOILS.find(f => f.id === foil)?.label || ''
      const ribLabel  = RIBBONS.find(r => r.id === ribbon)?.label || ''
      const items = [
        ...selected.map(f => {
          const s    = state[f.id]
          const name = s.color ? `${f.name} (${s.color})` : f.name
          return { productId: `custom-${f.id}`, productName: name, price: f.price, quantity: s.qty, image: '' }
        }),
        { productId: 'custom-ambalaj', productName: `Folie ${foilLabel} · Panglică ${ribLabel}`, price: 0, quantity: 1, image: '' },
      ]
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email, address: form.address, city: form.city },
          items,
          subtotal: total, discountAmount: 0, deliveryFee: 0, total,
          deliveryDate: form.deliveryDate, deliveryTimeSlot: form.deliveryTimeSlot,
          giftMessage: form.giftMessage || undefined,
          paymentMethod: 'ramburs',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la plasarea comenzii')
      router.push(`/confirmare/${data.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Eroare la plasarea comenzii')
    } finally {
      setSub(false)
    }
  }

  const today      = new Date().toISOString().split('T')[0]
  const foilData   = FOILS.find(f => f.id === foil)!
  const ribbonData = RIBBONS.find(r => r.id === ribbon)!

  const inputSt: React.CSSProperties = {
    width: '100%', background: 'rgba(26,10,14,.65)', border: `1px solid ${C.border}`,
    borderRadius: 8, padding: '9px 12px', color: C.text, fontFamily: 'Lato,sans-serif',
    fontSize: 13, outline: 'none',
  }
  const labelSt: React.CSSProperties = {
    display: 'block', fontSize: 10, color: C.text2, letterSpacing: '0.08em',
    textTransform: 'uppercase', marginBottom: 4,
  }

  return (
    <>
      <style>{`
        @keyframes bbFloat {
          0%   { transform:translateY(0) rotate(0deg); opacity:0 }
          8%   { opacity:.72 }
          88%  { opacity:.35 }
          100% { transform:translateY(-110vh) rotate(360deg); opacity:0 }
        }
        @keyframes bbSpark {
          0%   { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1) }
          100% { opacity:0; transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(.1) }
        }
        .bb-input:focus { border-color:#d4a843 !important }
        .bb-select option { background:#2d1219 }
        input[type=number].bb-qty::-webkit-outer-spin-button,
        input[type=number].bb-qty::-webkit-inner-spin-button { -webkit-appearance:none; margin:0 }
        input[type=number].bb-qty { -moz-appearance:textfield }
        .color-pill { transition: all .18s; cursor: pointer; border: none; font-family: Lato,sans-serif; font-size: 10px; border-radius: 50px; padding: 3px 10px; font-weight: 600; letter-spacing:.04em }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh', paddingTop: 80 }}>

        {/* Hero */}
        <div ref={heroRef} style={{ position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at center,#2d1219 0%,#0d0508 70%)', padding:'72px 24px 56px', textAlign:'center', isolation:'isolate' }}>
          <p style={{ fontFamily:'Lato,sans-serif', fontSize:11, letterSpacing:'0.28em', textTransform:'uppercase', color: C.rose, marginBottom:12 }}>
            Floraria Clory&apos;s
          </p>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(38px,6vw,68px)', fontWeight:300, color:'#fff', lineHeight:1.1, marginBottom:14 }}>
            Buchet Personalizat
          </h1>
          <p style={{ fontFamily:'Lato,sans-serif', fontSize:14, color:'rgba(255,255,255,.45)', maxWidth:400, margin:'0 auto' }}>
            Alege florile tale, folia și panglica. Livrăm în 1–3 ore în Negrești-Oaș.
          </p>
        </div>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 20px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:32 }}>

          {/* LEFT */}
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color: C.gold, marginBottom:16 }}>🌸 Alege Florile</h2>

            {flowers.length === 0 && (
              <p style={{ color: C.text2, fontFamily:'Lato,sans-serif', fontSize:13 }}>Se încarcă...</p>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:32 }}>
              {flowers.map(f => {
                const fs  = state[f.id] || { qty: 0, color: f.colors[0] || '' }
                const sel = fs.qty > 0
                return (
                  <div
                    key={f.id}
                    id={`fcard-${f.id}`}
                    style={{
                      background:   sel ? 'rgba(61,26,36,.94)' : C.card,
                      border:       `1.5px solid ${sel ? C.gold : C.border}`,
                      borderRadius: 14,
                      padding:      14,
                      transition:   'all .22s',
                      position:     'relative',
                      boxShadow:    sel ? '0 0 18px rgba(212,168,67,.28)' : 'none',
                    }}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                      <span style={{ fontFamily:'Playfair Display,serif', fontSize:14, color: C.text, fontWeight:700 }}>{f.name}</span>
                      {sel && <span style={{ background: C.gold, color:'#1a0a0e', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:50 }}>✓</span>}
                    </div>
                    <p style={{ fontFamily:'monospace', fontSize:11, color: C.gold, marginBottom: f.colors.length > 0 ? 8 : 10 }}>
                      {f.price === 0 ? 'GRATUIT' : `${f.price} lei / buc`}
                    </p>

                    {/* Color pills */}
                    {f.colors.length > 1 && (
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
                        {f.colors.map(c => (
                          <button
                            key={c}
                            className="color-pill"
                            onClick={() => setColor(f.id, c)}
                            style={{
                              background: fs.color === c ? C.gold : 'rgba(212,168,67,.12)',
                              color:      fs.color === c ? '#1a0a0e' : C.text2,
                              outline: fs.color === c ? `2px solid ${C.gold}` : 'none',
                              outlineOffset: 1,
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    {f.colors.length === 1 && (
                      <div style={{ marginBottom:10 }}>
                        <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, color: C.text2, background:'rgba(212,168,67,.1)', padding:'2px 8px', borderRadius:50 }}>
                          {f.colors[0]}
                        </span>
                      </div>
                    )}

                    {/* Qty controls */}
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <button
                        onClick={() => changeQty(f.id, -1)}
                        style={{ width:26, height:26, borderRadius:'50%', border:'none', cursor:'pointer', background:'linear-gradient(135deg,#c4704a,#e8739a)', color:'#fff', fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}
                      >−</button>
                      <input
                        type="number" min={0}
                        className="bb-qty"
                        value={fs.qty}
                        onChange={e => setQtyDirect(f.id, e.target.value)}
                        style={{ width:48, textAlign:'center', fontFamily:'monospace', fontWeight:700, fontSize:14, color: C.gold, background:'rgba(26,10,14,.6)', border:`1px solid ${C.border}`, borderRadius:6, padding:'2px 4px', outline:'none' }}
                      />
                      <button
                        onClick={() => changeQty(f.id, 1)}
                        style={{ width:26, height:26, borderRadius:'50%', border:'none', cursor:'pointer', background:'linear-gradient(135deg,#c4704a,#e8739a)', color:'#fff', fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}
                      >+</button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Foil */}
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color: C.gold, marginBottom:14 }}>✨ Alege Folia</h2>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
              {FOILS.map(f => (
                <button key={f.id} onClick={() => setFoil(f.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, background:'transparent', border:'none', cursor:'pointer' }}>
                  <div style={{ width:50, height:50, borderRadius:'50%', background: f.hex, border:`3px solid ${foil===f.id ? C.gold : 'transparent'}`, boxShadow: foil===f.id ? '0 0 14px rgba(212,168,67,.5)' : '0 2px 8px rgba(0,0,0,.3)', transform: foil===f.id ? 'scale(1.1)' : 'scale(1)', transition:'all .2s', position:'relative' }}>
                    {foil === f.id && <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, fontWeight:700, color:'rgba(0,0,0,.55)' }}>✓</span>}
                  </div>
                  <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, color: C.text2 }}>{f.label}</span>
                </button>
              ))}
            </div>

            {/* Ribbon */}
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color: C.gold, marginBottom:14 }}>🎀 Alege Panglica</h2>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {RIBBONS.map(r => (
                <button key={r.id} onClick={() => setRibbon(r.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'5px 8px', borderRadius:8, border:`2px solid ${ribbon===r.id ? C.gold : 'transparent'}`, background: ribbon===r.id ? 'rgba(212,168,67,.08)' : 'transparent', cursor:'pointer', transition:'all .2s' }}>
                  <svg width="68" height="36" viewBox="0 0 68 36">
                    <rect x="3" y="14" width="62" height="9" rx="4.5" fill={r.hex} stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
                    <path d="M34,18.5 C27,12 17,9 12,12 C12,18 21,22 34,18.5Z" fill={r.hex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
                    <path d="M34,18.5 C41,12 51,9 56,12 C56,18 47,22 34,18.5Z" fill={r.hex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
                    <circle cx="34" cy="18.5" r="5" fill={r.hex} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"/>
                  </svg>
                  <span style={{ fontFamily:'Lato,sans-serif', fontSize:10, color: C.text2 }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Summary */}
            <div style={{ background:'rgba(45,18,25,.9)', border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
              <p style={{ fontFamily:'Playfair Display,serif', fontSize:17, color: C.gold, marginBottom:14 }}>💐 Buchetul Tău</p>
              {selected.length === 0 ? (
                <p style={{ fontFamily:'Lato,sans-serif', fontSize:12, color: C.text2, fontStyle:'italic', textAlign:'center', padding:'16px 0', opacity:.6 }}>Nicio floare selectată...</p>
              ) : (
                <div style={{ marginBottom:12 }}>
                  {selected.map(f => {
                    const fs   = state[f.id]
                    const name = fs.color ? `${f.name} (${fs.color})` : f.name
                    return (
                      <div key={f.id} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(212,168,67,.08)', fontFamily:'Lato,sans-serif', fontSize:12 }}>
                        <span style={{ color: C.text2 }}>{name} × {fs.qty}</span>
                        <span style={{ fontWeight:700, fontFamily:'monospace', color: C.gold }}>
                          {f.price === 0 ? 'GRATUIT' : `${f.price * fs.qty} lei`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Lato,sans-serif', fontSize:11, color: C.text2 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background: foilData.hex, border:'2px solid rgba(212,168,67,.3)', flexShrink:0 }}/>
                  Folie {foilData.label}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'Lato,sans-serif', fontSize:11, color: C.text2 }}>
                  <div style={{ width:22, height:9, borderRadius:4, background: ribbonData.hex, border:'1.5px solid rgba(0,0,0,.12)', flexShrink:0 }}/>
                  Panglică {ribbonData.label}
                </div>
              </div>
              <div style={{ height:1, background:'rgba(212,168,67,.2)', margin:'10px 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:15, color: C.text }}>TOTAL:</span>
                <span style={{ fontFamily:'monospace', fontSize:26, fontWeight:700, color: C.gold }}>{total} lei</span>
              </div>
            </div>

            {/* Availability note */}
            <p style={{
              fontFamily: 'Cormorant Garamond, Cormorant, serif',
              fontStyle: 'italic',
              fontSize: 15.5,
              lineHeight: 1.65,
              color: C.text,
              textAlign: 'center',
              padding: '0 8px',
            }}>
              Pentru flori precum Garofiță, Gherberă, Mini Trandafir, Lisianthus, Astromelia,
              Frunză de Palmier, Bujor și Floarea Miresei — vă rugăm să ne contactați pentru
              a verifica disponibilitatea în magazin. Vă mulțumim!
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ background:'rgba(45,18,25,.9)', border:`1px solid ${C.border}`, borderRadius:14, padding:20, display:'flex', flexDirection:'column', gap:12 }}>
              <p style={{ fontFamily:'Playfair Display,serif', fontSize:17, color: C.gold, marginBottom:4 }}>📦 Date Livrare</p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label style={labelSt}>Nume complet *</label><input className="bb-input" style={inputSt} required value={form.name} onChange={setField('name')} placeholder="Ion Popescu"/></div>
                <div><label style={labelSt}>Telefon *</label><input className="bb-input" style={inputSt} required type="tel" value={form.phone} onChange={setField('phone')} placeholder="07XX XXX XXX"/></div>
              </div>
              <div><label style={labelSt}>Email *</label><input className="bb-input" style={inputSt} required type="email" value={form.email} onChange={setField('email')} placeholder="email@exemplu.ro"/></div>
              <div><label style={labelSt}>Adresă livrare *</label><input className="bb-input" style={inputSt} required value={form.address} onChange={setField('address')} placeholder="Strada, număr"/></div>
              <div><label style={labelSt}>Oraș *</label><input className="bb-input" style={inputSt} required value={form.city} onChange={setField('city')} placeholder="Negrești-Oaș"/></div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label style={labelSt}>Data livrare *</label><input className="bb-input" style={inputSt} required type="date" min={today} value={form.deliveryDate} onChange={setField('deliveryDate')}/></div>
                <div>
                  <label style={labelSt}>Interval orar *</label>
                  <select className="bb-input bb-select" style={inputSt} value={form.deliveryTimeSlot} onChange={setField('deliveryTimeSlot')}>
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelSt}>Mesaj card (opțional)</label>
                <textarea className="bb-input" style={{ ...inputSt, resize:'vertical', minHeight:60 }} rows={2} maxLength={200} value={form.giftMessage} onChange={setField('giftMessage')} placeholder="Ex: La mulți ani cu drag! ❤"/>
              </div>

              <div style={{ padding:'6px 0 2px', fontFamily:'Lato,sans-serif', fontSize:11, color: C.text2, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>💵</span> Plată ramburs la livrare
              </div>

              <button
                type="submit"
                disabled={submitting || !total}
                style={{ height:50, border:'none', borderRadius:8, cursor:(!submitting&&total)?'pointer':'not-allowed', background:'linear-gradient(135deg,#c4704a,#d4a843,#e8739a)', color:'#1a0a0e', fontWeight:700, fontSize:14, letterSpacing:'1.5px', opacity:(!submitting&&total)?1:.4, boxShadow:'0 4px 16px rgba(212,168,67,.25)', transition:'all .2s' }}
              >
                {submitting ? 'Se trimite...' : '🌸 TRIMITE COMANDA'}
              </button>

              {!total && (
                <p style={{ fontFamily:'Lato,sans-serif', fontSize:11, color: C.text2, textAlign:'center', opacity:.6 }}>
                  Adaugă cel puțin o floare pentru a comanda
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
