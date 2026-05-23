'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import toast from 'react-hot-toast'

interface Review {
  id: string
  name: string
  rating: number
  text: string
  created_at: string
}

const FALLBACK: Review[] = [
  { id: '1', name: 'Ioan Bumb', rating: 5, text: 'Am comandat un buchet de trandafiri pentru aniversarea noastră și a fost absolut superb! Florile erau proaspete, ambalajul elegant și livrarea promptă. Soțul meu a fost încântat. Cu siguranță voi comanda din nou!', created_at: '2025-02-01' },
  { id: '2', name: 'Andrei Finta', rating: 5, text: "Serviciu impecabil! Am comandat o cutie cu trandafiri pentru Valentine's Day și a arătat exact ca în poze, ba chiar mai frumoasă. Livrarea a fost în intervalul promis. Recomand cu căldură tuturor!", created_at: '2025-02-14' },
  { id: '3', name: 'Carina Bura', rating: 5, text: "Am folosit Floraria Clory's pentru decorațiunile nunții noastre și a fost cea mai bună decizie. Aranjamentele au fost spectaculoase, exact cum le-am visat. Prețuri corecte și personal foarte amabil.", created_at: '2024-09-15' },
]

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const interactive = !!onChange
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange!(s) : undefined}
          onMouseEnter={interactive ? () => setHovered(s) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? 'cursor-pointer text-2xl transition-transform hover:scale-110' : 'text-lg cursor-default'}
          style={{ color: s <= (hovered || value) ? '#C9A96E' : '#E5D5C0', background: 'none', border: 'none', padding: '0 1px' }}
        >★</button>
      ))}
    </div>
  )
}

/* ─── Floating 3D testimonial card ─── */
function TestimonialCard({ review, index }: { review: Review; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 200, damping: 30 })
  const y = useSpring(rawY, { stiffness: 200, damping: 30 })
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8])

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 20, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, type: 'spring', stiffness: 160, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800, rotateX, rotateY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative bg-white border border-light rounded-2xl p-8 cursor-default"
    >
      {/* Glow overlay */}
      <motion.div
        style={{
          background: useTransform(
            [useTransform(x, [-0.5, 0.5], [20, 80]), useTransform(y, [-0.5, 0.5], [20, 80])],
            ([gx, gy]: number[]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(201,169,110,0.10) 0%, transparent 60%)`
          ),
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        }}
      />

      {/* Floating quote badge */}
      <motion.div
        className="absolute -top-4 left-8 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg"
        style={{ translateZ: 20 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.4, type: 'spring', stiffness: 400, damping: 20 }}
      >
        <span className="text-white text-xl leading-none font-serif">&ldquo;</span>
      </motion.div>

      <div className="flex gap-0.5 mb-4 mt-2">
        {Array.from({ length: review.rating }).map((_, j) => (
          <motion.span key={j} className="text-gold text-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.5 + j * 0.06, type: 'spring', stiffness: 500 }}
          >★</motion.span>
        ))}
      </div>

      <p className="font-lato text-sm text-textdark/70 leading-relaxed mb-6 italic">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="flex items-center gap-3 border-t border-light pt-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
          <span className="font-cormorant text-white text-lg font-bold">{review.name[0]}</span>
        </div>
        <p className="font-cormorant text-base font-semibold text-textdark">{review.name}</p>
      </div>
    </motion.div>
  )
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1400
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', rating: 5, text: '' })
  const [sending, setSending] = useState(false)
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true })

  const loadReviews = () => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) && data.length > 0 ? data : FALLBACK); setLoading(false) })
      .catch(() => { setReviews(FALLBACK); setLoading(false) })
  }

  useEffect(() => { loadReviews() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        toast.success('Mulțumim pentru recenzie! 🌸', { style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' }, duration: 4000 })
        setForm({ name: '', rating: 5, text: '' })
        loadReviews()
      } else toast.error('Ceva nu a mers. Încearcă din nou.')
    } catch { toast.error('Eroare de conexiune. Încearcă din nou.') }
    finally { setSending(false) }
  }

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div ref={headingRef}>
          <motion.p className="section-subheading"
            initial={{ opacity: 0, y: 20 }} animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >Recenzii</motion.p>
          <div className="text-center overflow-hidden">
            <motion.h2 className="section-heading"
              initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
              animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >Ce Spun Clienții Noștri</motion.h2>
          </div>
          <div className="section-divider">
            <motion.div className="w-16 h-px bg-accent origin-right"
              initial={{ scaleX: 0 }} animate={headingInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.3 }} />
            <motion.span className="text-accent text-lg"
              initial={{ scale: 0, rotate: -180 }} animate={headingInView ? { scale: 1, rotate: 0 } : {}} transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}>✿</motion.span>
            <motion.div className="w-16 h-px bg-accent origin-left"
              initial={{ scaleX: 0 }} animate={headingInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.4 }} />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white border border-light rounded-2xl p-8 animate-pulse">
                <div className="h-4 bg-light rounded w-24 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-light rounded w-full" />
                  <div className="h-3 bg-light rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4" style={{ perspective: '1200px' }}>
            {reviews.slice(0, 3).map((t, i) => (
              <TestimonialCard key={t.id} review={t} index={i} />
            ))}
          </div>
        )}

        {/* Stats bar */}
        <motion.div
          className="text-center mt-12 p-8 rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #2A0A12 0%, #6B1A2E 100%)' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.15) 0%, transparent 60%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div className="text-center">
              <p className="font-cormorant text-5xl font-bold text-gold">
                <Counter target={200} suffix="+" />
              </p>
              <p className="font-lato text-xs tracking-widest uppercase text-white/50 mt-1">Clienți fericiți</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <p className="font-cormorant text-5xl font-bold text-gold">
                <Counter target={5} suffix=".0" />
              </p>
              <p className="font-lato text-xs tracking-widest uppercase text-white/50 mt-1">Rating mediu</p>
            </div>
          </div>
        </motion.div>

        {/* Review form */}
        <motion.div
          className="mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-8">
            <p className="section-subheading">Experiența ta</p>
            <h3 className="font-cormorant text-3xl text-primary font-light">Lasă o Recenzie</h3>
          </div>
          <form onSubmit={handleSubmit} className="bg-white border border-light rounded-2xl p-8 space-y-5 shadow-sm">
            <div>
              <label className="label-field">Numele tău *</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ion Popescu" required />
            </div>
            <div>
              <label className="label-field">Calificativ *</label>
              <div className="mt-1"><StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} /></div>
            </div>
            <div>
              <label className="label-field">Mesajul tău *</label>
              <textarea className="input-field resize-none" rows={4} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Spune-ne ce ți-a plăcut..." required />
            </div>
            <motion.button type="submit" disabled={sending} className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              {sending ? 'Se trimite...' : <><span>✿</span> Trimite Recenzia</>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
