'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue, useSpring, useTransform,
  useScroll,
} from 'framer-motion'
import MagneticButton from '@/components/ui/MagneticButton'

const PETALS = ['❤', '✿', '✾', '❀', '✽', '🌸', '🌺']

interface Petal {
  id: number; symbol: string; left: number
  delay: number; duration: number; fontSize: number
}

export default function HeroSection() {
  const [petals, setPetals] = useState<Petal[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  /* ── Mouse parallax ── */
  const rawMX = useMotionValue(0)
  const rawMY = useMotionValue(0)
  const mx = useSpring(rawMX, { stiffness: 55, damping: 18 })
  const my = useSpring(rawMY, { stiffness: 55, damping: 18 })

  const c1x = useTransform(mx, [-0.5, 0.5], [-40, 40])
  const c1y = useTransform(my, [-0.5, 0.5], [-28, 28])
  const c2x = useTransform(mx, [-0.5, 0.5], [28, -28])
  const c2y = useTransform(my, [-0.5, 0.5], [20, -20])
  const c3x = useTransform(mx, [-0.5, 0.5], [-18, 18])
  const c3y = useTransform(my, [-0.5, 0.5], [32, -32])
  const tx  = useTransform(mx, [-0.5, 0.5], [-10, 10])
  const ty  = useTransform(my, [-0.5, 0.5], [-6, 6])

  /* ── Scroll parallax ── */
  const { scrollY } = useScroll()
  const bgY      = useTransform(scrollY, [0, 700], [0, -180])   // bg moves slow
  const contentY = useTransform(scrollY, [0, 700], [0,  -60])   // text moves medium
  const circle1Y = useTransform(scrollY, [0, 700], [0, -250])   // far bg moves fast
  const fadeOut  = useTransform(scrollY, [0, 400], [1, 0])      // fade page as scroll

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawMX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawMY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  useEffect(() => {
    setPetals(Array.from({ length: 24 }, (_, i) => ({
      id: i,
      symbol: PETALS[i % PETALS.length],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 9,
      fontSize: 10 + Math.random() * 20,
    })))
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { rawMX.set(0); rawMY.set(0) }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Scrolling background layer (slowest) ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #2A0A12 0%, #6B1A2E 40%, #8B2340 72%, #4A0D1E 100%)',
        }} />
        {/* Animated gradient glow that breathes */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(139,35,64,0.6) 0%, transparent 65%)' }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(107,26,46,0.5) 0%, transparent 55%)' }}
        />
      </motion.div>

      {/* ── Petals layer (mid speed) ── */}
      <motion.div style={{ y: useTransform(scrollY, [0, 700], [0, -110]) }} className="absolute inset-0 z-1 pointer-events-none">
        {petals.map(p => (
          <span key={p.id} className="petal" style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.fontSize}px`,
            color: `hsl(${328 + Math.random() * 35}, 80%, ${58 + Math.random() * 22}%)`,
          }}>{p.symbol}</span>
        ))}
      </motion.div>


      {/* ── Vignette ── */}
      <div className="absolute inset-0 z-3 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />

      {/* ── Content (fades on scroll) ── */}
      <motion.div style={{ x: tx, y: useTransform([ty, contentY], ([a, b]: number[]) => a + b), opacity: fadeOut }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20, letterSpacing: '0.8em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.4em' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-lato text-xs uppercase text-gold mb-6"
        >Bine ai venit la</motion.p>

        {/* Script title with letter-by-letter reveal */}
        <div className="overflow-hidden mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 80, filter: 'blur(16px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-greatvibes text-6xl md:text-8xl text-gold leading-none drop-shadow-lg"
          >Flowers With Heart</motion.h2>
        </div>

        {/* Main title */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-cormorant text-5xl md:text-7xl font-light text-white leading-tight"
          >Floraria Clory&apos;s</motion.h1>
        </div>

        {/* Gold line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px bg-gold mx-auto mb-6"
          style={{ boxShadow: '0 0 12px rgba(201,169,110,0.8)' }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15 }}
          className="font-lato text-base md:text-lg text-white/75 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Flori proaspete, aranjamente unice și livrare rapidă în Țara Oașului.
          Transformăm fiecare moment special într-o amintire de neuitat.
        </motion.p>

        {/* CTA buttons — magnetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <MagneticButton strength={0.4}>
            <Link href="/catalog" className="btn-primary px-10 py-4 text-base">
              Descoperă Colecția
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.4}>
            <Link href="/catalog" className="btn-secondary px-10 py-4 text-base">
              Comandă Acum
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        style={{ opacity: fadeOut }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <span className="font-lato text-[10px] tracking-[0.3em] uppercase text-white/35">Derulează</span>
          <motion.div
            className="w-[1px] h-14 origin-top"
            style={{ background: 'linear-gradient(to bottom, rgba(201,169,110,0.7), transparent)' }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
