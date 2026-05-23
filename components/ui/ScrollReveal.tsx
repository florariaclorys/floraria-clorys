'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

const VARIANTS: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  },
  scale3D: {
    hidden: { opacity: 0, scale: 0.85, rotateX: 18, y: 40 },
    visible: { opacity: 1, scale: 1, rotateX: 0, y: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -70 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  slideRight: {
    hidden: { opacity: 0, x: 70 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
}

interface ScrollRevealProps {
  children: ReactNode
  variant?: keyof typeof VARIANTS
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export default function ScrollReveal({ children, variant = 'fadeUp', delay = 0, className, style }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={VARIANTS[variant]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}

// Staggered container
export function StaggerContainer({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.92, rotateX: 14 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { type: 'spring', stiffness: 200, damping: 22 },
  },
}
