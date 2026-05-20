'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Review {
  id: string
  name: string
  rating: number
  text: string
  created_at: string
}

const FALLBACK: Review[] = [
  {
    id: '1',
    name: 'Ioan Bumb',
    rating: 5,
    text: 'Am comandat un buchet de trandafiri pentru aniversarea noastră și a fost absolut superb! Florile erau proaspete, ambalajul elegant și livrarea promptă. Soțul meu a fost încântat. Cu siguranță voi comanda din nou!',
    created_at: '2025-02-01',
  },
  {
    id: '2',
    name: 'Andrei Finta',
    rating: 5,
    text: "Serviciu impecabil! Am comandat o cutie cu trandafiri pentru Valentine's Day și a arătat exact ca în poze, ba chiar mai frumoasă. Livrarea a fost în intervalul promis. Recomand cu căldură tuturor!",
    created_at: '2025-02-14',
  },
  {
    id: '3',
    name: 'Carina Bura',
    rating: 5,
    text: "Am folosit Floraria Clory's pentru decorațiunile nunții noastre și a fost cea mai bună decizie. Aranjamentele au fost spectaculoase, exact cum le-am visat. Prețuri corecte și personal foarte amabil.",
    created_at: '2024-09-15',
  },
]

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const interactive = !!onChange

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange!(s) : undefined}
          onMouseEnter={interactive ? () => setHovered(s) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? 'cursor-pointer text-2xl transition-transform hover:scale-110' : 'text-lg cursor-default'}
          style={{ color: s <= (hovered || value) ? '#C9A96E' : '#E5D5C0', background: 'none', border: 'none', padding: '0 1px' }}
          aria-label={interactive ? `${s} stele` : undefined}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', rating: 5, text: '' })
  const [sending, setSending] = useState(false)

  const loadReviews = () => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(Array.isArray(data) && data.length > 0 ? data : FALLBACK)
        setLoading(false)
      })
      .catch(() => { setReviews(FALLBACK); setLoading(false) })
  }

  useEffect(() => { loadReviews() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Mulțumim pentru recenzie! 🌸', {
          style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
          duration: 4000,
        })
        setForm({ name: '', rating: 5, text: '' })
        loadReviews()
      } else {
        toast.error('Ceva nu a mers. Încercă din nou.')
      }
    } catch {
      toast.error('Eroare de conexiune. Încercă din nou.')
    } finally {
      setSending(false)
    }
  }

  const displayed = reviews.slice(0, 3)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="section-subheading">Recenzii</p>
        <h2 className="section-heading">Ce Spun Clienții Noștri</h2>
        <div className="section-divider">
          <div className="w-16 h-px bg-accent" />
          <span className="text-accent text-lg">✿</span>
          <div className="w-16 h-px bg-accent" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-light rounded-lg p-8 animate-pulse">
                <div className="h-4 bg-light rounded w-24 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-light rounded w-full" />
                  <div className="h-3 bg-light rounded w-5/6" />
                  <div className="h-3 bg-light rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {displayed.map((t, i) => (
              <div key={t.id ?? i} className="bg-white border border-light rounded-lg p-8 relative card-hover">
                <div className="absolute -top-4 left-8 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-lg leading-none font-serif">&ldquo;</span>
                </div>
                <div className="flex gap-0.5 mb-4 mt-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-gold text-lg">★</span>
                  ))}
                </div>
                <p className="font-lato text-sm text-textdark/70 leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-light pt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <span className="font-cormorant text-white text-lg font-bold">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-cormorant text-base font-semibold text-textdark">{t.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 p-8 bg-light rounded-lg">
          <p className="font-cormorant text-3xl text-primary mb-2">Satisfacția ta este prioritatea noastră</p>
          <p className="font-lato text-sm text-textdark/60 mb-6">
            Peste 500 de clienți fericiți în ultimul an. Alătură-te comunității Clory&apos;s!
          </p>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className="text-gold text-2xl">★</span>
            ))}
            <span className="font-lato text-sm text-textdark/60 ml-2">5.0 / 5.0</span>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="section-subheading">Experiența ta</p>
            <h3 className="font-cormorant text-3xl text-primary font-light">Lasă o Recenzie</h3>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-light rounded-lg p-8 space-y-5">
            <div>
              <label className="label-field">Numele tău *</label>
              <input
                className="input-field"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ion Popescu"
                required
              />
            </div>

            <div>
              <label className="label-field">Calificativ *</label>
              <div className="mt-1">
                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>
            </div>

            <div>
              <label className="label-field">Mesajul tău *</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="Spune-ne ce ți-a plăcut..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {sending ? 'Se trimite...' : (
                <>
                  <span>✿</span>
                  Trimite Recenzia
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
