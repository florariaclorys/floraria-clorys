'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  motion, useMotionValue, useTransform, useSpring,
  useInView, AnimatePresence,
} from 'framer-motion'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { StaggerContainer, staggerItem } from '@/components/ui/ScrollReveal'

const CATEGORIES = [
  { slug: 'buchete',     label: 'Buchete',          emoji: '💐', bg: '#6B1A2E', text: '#C9A96E', shadow: '#2A0A12' },
  { slug: 'aranjamente', label: 'Aranjamente',       emoji: '🌿', bg: '#1B3A2F', text: '#C9A96E', shadow: '#0D1F19' },
  { slug: 'cutii',       label: 'Cutii cu Flori',    emoji: '🎁', bg: '#8B2340', text: '#F5E6EA', shadow: '#2A0A12' },
  { slug: 'plante',      label: 'Plante',            emoji: '🌱', bg: '#2C4A1E', text: '#C9A96E', shadow: '#0D1F19' },
  { slug: 'ocazii',      label: 'Ocazii Speciale',   emoji: '✨', bg: '#C9A96E', text: '#2A0A12', shadow: '#8B6B3A' },
]

/* ─── 3D Holographic Tilt Card ─── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 280, damping: 28 }
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  const rotateX = useTransform(y, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(x, [-0.5, 0.5], [-12, 12])
  const glowX   = useTransform(x, [-0.5, 0.5], [20, 80])
  const glowY   = useTransform(y, [-0.5, 0.5], [20, 80])
  const shadowX = useTransform(x, [-0.5, 0.5], [-20, 20])
  const shadowY = useTransform(y, [-0.5, 0.5], [-20, 20])

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
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX, rotateY,
        transformStyle: 'preserve-3d',
        perspective: 900,
        boxShadow: useTransform(
          [shadowX, shadowY],
          ([sx, sy]: number[]) =>
            `${sx}px ${sy + 8}px 40px rgba(42,10,18,0.18), 0 2px 8px rgba(42,10,18,0.08)`
        ),
      }}
      className={className}
    >
      {children}
      {/* Holographic shine overlay */}
      <motion.div
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]: number[]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(201,169,110,0.18) 0%, rgba(255,255,255,0.07) 40%, transparent 65%)`
          ),
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </motion.div>
  )
}

/* ─── Product Card ─── */
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    toast.success(`${product.name} adăugat în coș! 🌸`, {
      style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
    })
  }

  const emoji = product.category === 'buchete' ? '💐'
    : product.category === 'cutii' ? '🎁'
    : product.category === 'aranjamente' ? '🌿'
    : product.category === 'plante' ? '🌱' : '✨'

  return (
    <TiltCard className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer relative">
      <Link href={`/produs/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#f9eef1]" style={{ aspectRatio: '3/4' }}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.span
                className="text-7xl filter drop-shadow"
                style={{ transformStyle: 'preserve-3d', translateZ: 30 }}
                whileHover={{ scale: 1.15, rotate: [-3, 3, -3, 0] }}
                transition={{ duration: 0.5 }}
              >
                {emoji}
              </motion.span>
            </div>
          )}

          {product.isNew && (
            <span className="absolute top-3 left-3 bg-green-600 text-white font-lato text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-widest uppercase z-20">
              Nou
            </span>
          )}

          {/* Quick-add overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-primary/95 backdrop-blur-sm text-white py-3 font-lato text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-colors"
            >
              <ShoppingBag size={14} />
              Adaugă în coș
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <p className="font-lato text-[10px] text-accent tracking-[0.2em] uppercase mb-2">{product.category}</p>
          <h3 className="font-cormorant text-xl text-textdark font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-lato text-xs text-textdark/55 leading-relaxed mb-4 line-clamp-2 flex-1">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-light">
            <span className="font-cormorant text-2xl font-bold text-primary">
              {product.price} <span className="text-sm font-lato font-normal">RON</span>
            </span>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 text-[11px] font-lato font-semibold tracking-wider uppercase rounded-sm hover:bg-secondary transition-colors"
            >
              <ShoppingBag size={13} />
              Adaugă
            </button>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}

/* ─── Animated Section Heading ─── */
function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const words = text.split(' ')

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  )
}

/* ─── Divider ─── */
function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="section-divider">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-px bg-accent origin-right"
      />
      <motion.span
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={inView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 300 }}
        className="text-accent text-lg"
      >
        ✿
      </motion.span>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-px bg-accent origin-left"
      />
    </div>
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

  const activeCat = CATEGORIES.find(c => c.slug === activeCategory)

  return (
    <section className="py-24 bg-light/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.p
          className="section-subheading"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Selecție
        </motion.p>

        <AnimatedHeading text="Colecția Noastră" className="section-heading" />
        <AnimatedDivider />

        {/* Category filter — staggered 3D entrance */}
        <motion.div
          ref={catRef}
          className="flex flex-wrap justify-center gap-4 mb-14"
          initial="hidden"
          animate={catInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.slug
            return (
              <motion.button
                key={cat.slug}
                variants={{
                  hidden: { opacity: 0, y: 35, scale: 0.75, rotateX: -25 },
                  visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: 'spring', stiffness: 250, damping: 22 } },
                }}
                onClick={() => setActiveCategory(isActive ? null : cat.slug)}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.96, y: 4 }}
                className="flex items-center gap-3 px-8 py-4 font-cormorant font-semibold text-xl tracking-wide select-none"
                style={{
                  background: cat.bg,
                  color: cat.text,
                  boxShadow: isActive ? `1px 1px 0px ${cat.shadow}` : `6px 6px 0px ${cat.shadow}`,
                  borderRadius: 4,
                  outline: isActive ? `2px solid ${cat.text}` : 'none',
                  outlineOffset: 2,
                  transition: 'box-shadow 0.15s, outline 0.1s',
                }}
              >
                <motion.span
                  className="text-2xl leading-none"
                  animate={isActive ? { rotate: [0, -15, 15, 0], scale: [1, 1.3, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {cat.emoji}
                </motion.span>
                <span>{cat.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Category label */}
        <AnimatePresence>
          {activeCat && (
            <motion.p
              key={activeCat.slug}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-lato text-xs tracking-widest uppercase text-textdark/40 text-center mb-6"
            >
              Categorie: <span className="font-semibold text-primary">{activeCat.label}</span>
              <button onClick={() => setActiveCategory(null)} className="ml-3 text-accent hover:text-primary underline underline-offset-2">
                × resetează
              </button>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="bg-light" style={{ aspectRatio: '3/4' }} />
                <div className="p-5 space-y-3">
                  <div className="h-2.5 bg-light rounded w-16" />
                  <div className="h-5 bg-light rounded w-3/4" />
                  <div className="h-3 bg-light rounded w-full" />
                  <div className="h-3 bg-light rounded w-2/3" />
                  <div className="h-8 bg-light rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="font-cormorant text-2xl text-primary font-light mb-2">
              Nu există produse în această categorie momentan.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory ?? 'all'}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            style={{ perspective: '1400px' }}
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {products.map(product => (
              <motion.div
                key={product.id}
                variants={staggerItem}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/catalog"
            className="btn-outline inline-flex items-center gap-2 group"
          >
            <span>Vezi toate produsele</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
