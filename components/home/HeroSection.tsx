'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

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

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: PETALS[i % PETALS.length],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 6,
      fontSize: 12 + Math.random() * 16,
    }))
    setPetals(generated)
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2A0A12 0%, #6B1A2E 45%, #8B2340 75%, #4A0D1E 100%)',
      }}
    >
      {/* Animated petals */}
      {petals.map(petal => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            fontSize: `${petal.fontSize}px`,
            color: `hsl(${330 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`,
          }}
        >
          {petal.symbol}
        </span>
      ))}

      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-lato text-xs tracking-[0.4em] uppercase text-gold mb-6"
        >
          Bine ai venit la
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-greatvibes text-6xl md:text-8xl text-gold mb-4 leading-none drop-shadow-lg"
        >
          Flowers With Heart
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-cormorant text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
        >
          Floraria Clory&apos;s
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="w-24 h-px bg-gold mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="font-lato text-base md:text-lg text-white/75 mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Flori proaspete, aranjamente unice și livrare rapidă în Țara Oașului.
          Transformăm fiecare moment special într-o amintire de neuitat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/catalog" className="btn-primary">
            Descoperă Colecția
          </Link>
          <Link href="/catalog" className="btn-secondary">
            Comandă Acum
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-lato text-xs tracking-widest uppercase text-white/40">Derulează</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
