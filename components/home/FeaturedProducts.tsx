'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingBag, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  motion, useMotionValue, useTransform, useSpring,
  useInView, AnimatePresence,
} from 'framer-motion'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import MagneticButton from '@/components/ui/MagneticButton'

/* ─── Category config with neon glow colors ─── */
const CATEGORIES = [
  { slug: 'buchete',     label: 'Buchete',          emoji: '💐', glow: '201,80,120',   border: '#C95078' },
  { slug: 'aranjamente', label: 'Aranjamente',       emoji: '🌿', glow: '80,180,120',  border: '#50B478' },
  { slug: 'cutii',       label: 'Cutii cu Flori',    emoji: '🎁', glow: '201,100,80',  border: '#C96450' },
  { slug: 'plante',      label: 'Plante',            emoji: '🌱', glow: '100,200,100', border: '#64C864' },
  { slug: 'ocazii',      label: 'Ocazii Speciale',   emoji: '✨', glow: '201,169,110', border: '#C9A96E' },
]

/* ─── Particle field ─── */
function ParticleField() {
  const particles = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 5,
    duration: 2.5 + Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.5,
    color: Math.random() > 0.6
      ? `rgba(201,169,110,${0.4 + Math.random() * 0.5})`
      : `rgba(255,${120 + Math.floor(Math.random() * 80)},${140 + Math.floor(Math.random() * 80)},${0.3 + Math.random() * 0.4})`,
  })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle-dot absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Grid lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridGlow 6s ease-in-out infinite',
      }} />

      {/* Corner accents */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 opacity-20`}
          style={{
            borderTop: i < 2 ? '1px solid #C9A96E' : 'none',
            borderBottom: i >= 2 ? '1px solid #C9A96E' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid #C9A96E' : 'none',
            borderRight: i % 2 === 1 ? '1px solid #C9A96E' : 'none',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Holographic Tilt Card ─── */
function HoloCard({ children, glowColor = '201,169,110', floatDelay = 0 }: {
  children: React.ReactNode; glowColor?: string; floatDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 300, damping: 28 })
  const y = useSpring(rawY, { stiffness: 300, damping: 28 })

  const rotateX = useTransform(y, [-0.5, 0.5], [14, -14])
  const rotateY = useTransform(x, [-0.5, 0.5], [-14, 14])
  const glowX   = useTransform(x, [-0.5, 0.5], [15, 85])
  const glowY   = useTransform(y, [-0.5, 0.5], [15, 85])
  const liftZ   = useSpring(hovered ? 30 : 0, { stiffness: 250, damping: 22 })

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    rawX.set(0); rawY.set(0); setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX, rotateY,
        z: liftZ,
        transformStyle: 'preserve-3d',
        perspective: 900,
        boxShadow: hovered
          ? `0 0 0 1px rgba(${glowColor},0.6), 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(${glowColor},0.25), 0 0 100px rgba(${glowColor},0.1)`
          : `0 0 0 1px rgba(${glowColor},0.2), 0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(${glowColor},0.08)`,
        transition: 'box-shadow 0.4s ease',
      }}
      className="futuristic-float"
      css-anim-delay=""
    >
      <style>{`
        .futuristic-float { animation-duration: ${4.5 + floatDelay * 0.4}s; animation-delay: ${floatDelay * 0.3}s; }
      `}</style>
      {children}

      {/* Rainbow holographic sheen */}
      <motion.div style={{
        background: useTransform([glowX, glowY], ([gx, gy]: number[]) =>
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(${glowColor},0.22) 0%, rgba(255,200,220,0.06) 35%, transparent 60%)`
        ),
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        pointerEvents: 'none', zIndex: 20,
      }} />

      {/* Edge glow when hovered */}
      {hovered && (
        <div className="absolute inset-0 rounded-inherit pointer-events-none z-10" style={{
          background: `linear-gradient(135deg, rgba(${glowColor},0.08) 0%, transparent 40%, rgba(${glowColor},0.05) 100%)`,
          borderRadius: 'inherit',
        }} />
      )}
    </motion.div>
  )
}

/* ─── Glass Product Card ─── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const cat = CATEGORIES.find(c => c.slug === product.category)
  const glowColor = cat?.glow ?? '201,169,110'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    toast.success(`${product.name} adăugat în coș! 🌸`, {
      style: { background: '#0D0306', color: '#C9A96E', border: '1px solid rgba(201,169,110,0.3)' },
    })
  }

  const emoji = product.category === 'buchete' ? '💐'
    : product.category === 'cutii' ? '🎁'
    : product.category === 'aranjamente' ? '🌿'
    : product.category === 'plante' ? '🌱' : '✨'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.88, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <HoloCard glowColor={glowColor} floatDelay={index}>
        <Link href={`/produs/${product.slug}`}>
          <div
            className="flex flex-col rounded-xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(145deg, rgba(20,5,10,0.85) 0%, rgba(42,10,18,0.75) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid rgba(${glowColor},0.25)`,
            }}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              {product.images?.[0] ? (
                <>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.92) contrast(1.05) saturate(1.1)' }}
                  />
                  {/* Scanline overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
                    mixBlendMode: 'multiply',
                  }} />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: `radial-gradient(ellipse at center, rgba(${glowColor},0.15) 0%, rgba(10,3,6,0.8) 70%)` }}
                >
                  <motion.span
                    className="text-7xl"
                    animate={{ y: [0, -8, 0], rotateZ: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >{emoji}</motion.span>
                </div>
              )}

              {/* Top gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)',
              }} />

              {/* NEW badge */}
              {product.isNew && (
                <div className="absolute top-3 left-3 z-10">
                  <motion.span
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1 font-lato text-[9px] font-bold px-2 py-1 tracking-widest uppercase"
                    style={{
                      background: 'rgba(0,0,0,0.7)',
                      border: '1px solid rgba(100,200,100,0.6)',
                      color: '#64C864',
                      boxShadow: '0 0 10px rgba(100,200,100,0.4)',
                    }}
                  >
                    <Zap size={8} /> NOU
                  </motion.span>
                </div>
              )}

              {/* Category chip */}
              <div className="absolute top-3 right-3 z-10">
                <span className="font-lato text-[9px] px-2 py-0.5 tracking-widest uppercase"
                  style={{
                    background: `rgba(${glowColor},0.15)`,
                    border: `1px solid rgba(${glowColor},0.35)`,
                    color: `rgba(${glowColor},1)`,
                    backdropFilter: 'blur(8px)',
                  }}
                >{product.category}</span>
              </div>

              {/* Quick-add */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <button onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 py-3 font-lato text-xs font-semibold tracking-widest uppercase"
                  style={{ background: `rgba(${glowColor},0.9)`, color: '#0D0306', backdropFilter: 'blur(8px)' }}
                >
                  <ShoppingBag size={13} /> Adaugă în coș
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-cormorant text-xl font-semibold leading-snug mb-1"
                style={{ color: '#F5E6EA' }}
              >{product.name}</h3>
              <p className="font-lato text-xs leading-relaxed mb-3 line-clamp-2 flex-1"
                style={{ color: 'rgba(245,230,234,0.5)' }}
              >{product.shortDescription}</p>

              <div className="flex items-center justify-between pt-3"
                style={{ borderTop: `1px solid rgba(${glowColor},0.15)` }}
              >
                <span className="font-cormorant text-2xl font-bold" style={{ color: `rgba(${glowColor},1)` }}>
                  {product.price} <span className="text-sm font-lato font-normal" style={{ color: `rgba(${glowColor},0.6)` }}>RON</span>
                </span>
                <motion.button onClick={handleAdd}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-2 font-lato text-[10px] font-bold tracking-wider uppercase"
                  style={{
                    background: `rgba(${glowColor},0.12)`,
                    border: `1px solid rgba(${glowColor},0.4)`,
                    color: `rgba(${glowColor},1)`,
                    boxShadow: `0 0 12px rgba(${glowColor},0.15)`,
                  }}
                >
                  <ShoppingBag size={11} /> Adaugă
                </motion.button>
              </div>
            </div>
          </div>
        </Link>
      </HoloCard>
    </motion.div>
  )
}

/* ─── Animated section title ─── */
function GlowTitle({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="text-center mb-4">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        animate={inView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
        transition={{ duration: 0.8 }}
        className="font-lato text-xs uppercase mb-3 tracking-widest"
        style={{ color: '#C9A96E', textShadow: '0 0 20px rgba(201,169,110,0.6)' }}
      >Selecție</motion.p>

      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: 70, opacity: 0, filter: 'blur(12px)' }}
          animate={inView ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-cormorant text-5xl md:text-6xl font-light"
          style={{
            color: '#F5E6EA',
            textShadow: '0 0 40px rgba(201,169,110,0.25), 0 0 80px rgba(201,169,110,0.1)',
          }}
        >
          {text.split(' ').map((word, i) => (
            <motion.span key={i} className="inline-block mr-4"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >{word}</motion.span>
          ))}
        </motion.h2>
      </div>

      {/* Animated divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-4 mt-6 mb-10"
      >
        <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ color: '#C9A96E', textShadow: '0 0 15px rgba(201,169,110,0.8)', fontSize: 18 }}
        >✦</motion.span>
        <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
      </motion.div>
    </div>
  )
}

/* ─── Neon category button ─── */
function NeonButton({ cat, active, onClick }: {
  cat: typeof CATEGORIES[0]; active: boolean; onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.7, rotateX: -30, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)',
          transition: { type: 'spring', stiffness: 220, damping: 22 } },
      }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.94, y: 2 }}
      className="relative flex items-center gap-2.5 px-6 py-3 font-cormorant font-semibold text-lg select-none overflow-hidden"
      style={{
        background: active
          ? `rgba(${cat.glow},0.18)`
          : 'rgba(10,3,6,0.6)',
        border: `1px solid rgba(${cat.glow}, ${active ? 0.8 : 0.3})`,
        color: active ? cat.border : 'rgba(245,230,234,0.65)',
        backdropFilter: 'blur(12px)',
        boxShadow: active
          ? `0 0 20px rgba(${cat.glow},0.4), 0 0 40px rgba(${cat.glow},0.15), inset 0 0 20px rgba(${cat.glow},0.08)`
          : `0 0 0px rgba(${cat.glow},0)`,
        borderRadius: 4,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Animated background shimmer when active */}
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: ['−100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${cat.glow},0.15) 50%, transparent 100%)`,
          }}
        />
      )}
      <motion.span
        animate={active ? { rotate: [0, -15, 15, 0], scale: [1, 1.35, 1.35, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="text-xl relative z-10"
      >{cat.emoji}</motion.span>
      <span className="relative z-10">{cat.label}</span>
    </motion.button>
  )
}

/* ─── Main Component ─── */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const catInView = useInView(catRef, { once: true, margin: '-40px' })

  useEffect(() => {
    setLoading(true)
    const url = activeCategory
      ? `/api/products?category=${activeCategory}`
      : '/api/products?featured=true'

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        } else if (!activeCategory) {
          return fetch('/api/products')
            .then(r => r.json())
            .then(all => setProducts(Array.isArray(all) ? all.slice(0, 8) : []))
        } else {
          setProducts([])
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <section className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080205 0%, #0D0306 40%, #130508 80%, #080205 100%)' }}
    >
      {/* Particle field background */}
      <ParticleField />

      {/* Top & bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #FDF8F9, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #FDF8F9, transparent)' }} />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <GlowTitle text="Colecția Noastră" />

        {/* Category filter */}
        <motion.div
          ref={catRef}
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial="hidden"
          animate={catInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {CATEGORIES.map(cat => (
            <NeonButton
              key={cat.slug}
              cat={cat}
              active={activeCategory === cat.slug}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
            />
          ))}
        </motion.div>

        {/* Active label */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              className="text-center mb-6"
            >
              <span className="font-lato text-xs tracking-widest uppercase" style={{ color: 'rgba(245,230,234,0.4)' }}>
                Categorie: <span style={{ color: '#C9A96E' }}>{CATEGORIES.find(c => c.slug === activeCategory)?.label}</span>
              </span>
              <button onClick={() => setActiveCategory(null)}
                className="ml-3 font-lato text-xs"
                style={{ color: 'rgba(201,169,110,0.6)' }}
              >× resetează</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse"
                style={{ background: 'rgba(42,10,18,0.5)', border: '1px solid rgba(201,169,110,0.1)' }}
              >
                <div style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.04)' }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)', width: '70%' }} />
                  <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="font-cormorant text-2xl font-light" style={{ color: 'rgba(245,230,234,0.5)' }}>
              Nu există produse în această categorie momentan.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory ?? 'all'}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            style={{ perspective: '1600px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <MagneticButton strength={0.3}>
            <Link href="/catalog"
              className="inline-flex items-center gap-3 px-10 py-4 font-lato text-sm font-semibold tracking-widest uppercase"
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,169,110,0.5)',
                color: '#C9A96E',
                boxShadow: '0 0 20px rgba(201,169,110,0.1)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(201,169,110,0.12)'
                el.style.boxShadow = '0 0 40px rgba(201,169,110,0.3)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.boxShadow = '0 0 20px rgba(201,169,110,0.1)'
              }}
            >
              <span>Vezi toate produsele</span>
              <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
                →
              </motion.span>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
