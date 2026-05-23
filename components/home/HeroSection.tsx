'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const PETALS = ['❤', '✿', '✾', '❀', '✽', '🌸', '🌺']

interface Petal {
  id: number
  symbol: string
  left: number
  delay: number
  duration: number
  fontSize: number
}

export default function HeroSection() {
  const [petals, setPetals] = useState<Petal[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  // Mouse parallax
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 60, damping: 20 })
  const mouseY = useSpring(rawMouseY, { stiffness: 60, damping: 20 })

  const circle1X = useTransform(mouseX, [-0.5, 0.5], [-30, 30])
  const circle1Y = useTransform(mouseY, [-0.5, 0.5], [-20, 20])
  const circle2X = useTransform(mouseX, [-0.5, 0.5], [20, -20])
  const circle2Y = useTransform(mouseY, [-0.5, 0.5], [15, -15])
  const circle3X = useTransform(mouseX, [-0.5, 0.5], [-15, 15])
  const circle3Y = useTransform(mouseY, [-0.5, 0.5], [25, -25])
  const textX    = useTransform(mouseX, [-0.5, 0.5], [-8, 8])
  const textY    = useTransform(mouseY, [-0.5, 0.5], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { rawMouseX.set(0); rawMouseY.set(0) }

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      symbol: PETALS[i % PETALS.length],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      fontSize: 10 + Math.random() * 18,
    }))
    setPetals(generated)
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2A0A12 0%, #6B1A2E 45%, #8B2340 75%, #4A0D1E 100%)' }}
    >
      {/* Animated petals */}
      {petals.map(petal => (
        <span key={petal.id} className="petal" style={{
          left: `${petal.left}%`,
          animationDelay: `${petal.delay}s`,
          animationDuration: `${petal.duration}s`,
          fontSize: `${petal.fontSize}px`,
          color: `hsl(${330 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`,
        }}>{petal.symbol}</span>
      ))}

      {/* Parallax decorative circles — depth layers */}
      <motion.div
        style={{ x: circle1X, y: circle1Y }}
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full border border-white/8 pointer-events-none"
      />
      <motion.div
        style={{ x: circle1X, y: circle1Y }}
        className="absolute top-1/4 -left-32 w-80 h-80 rounded-full border border-white/5 pointer-events-none"
      />
      <motion.div
        style={{ x: circle2X, y: circle2Y }}
        className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full border border-white/6 pointer-events-none"
      />
      <motion.div
        style={{ x: circle2X, y: circle2Y }}
        className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full border border-gold/10 pointer-events-none"
      />
      <motion.div
        style={{ x: circle3X, y: circle3Y }}
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white/4 pointer-events-none"
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)' }} />

      {/* Content with subtle parallax */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20, letterSpacing: '0.8em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.4em' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-lato text-xs uppercase text-gold mb-6"
        >
          Bine ai venit la
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-greatvibes text-6xl md:text-8xl text-gold mb-4 leading-none drop-shadow-lg"
        >
          Flowers With Heart
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="font-cormorant text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
        >
          Floraria Clory&apos;s
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px bg-gold mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15 }}
          className="font-lato text-base md:text-lg text-white/75 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Flori proaspete, aranjamente unice și livrare rapidă în Țara Oașului.
          Transformăm fiecare moment special într-o amintire de neuitat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="/catalog" className="btn-primary">Descoperă Colecția</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="/catalog" className="btn-secondary">Comandă Acum</Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="font-lato text-xs tracking-widest uppercase text-white/40">Derulează</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
