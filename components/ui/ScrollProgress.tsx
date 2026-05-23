'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: 'left',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 100,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, #C9A96E 0%, #F5D78E 50%, #C9A96E 100%)',
        boxShadow: '0 0 12px rgba(201,169,110,0.9), 0 0 24px rgba(201,169,110,0.4)',
      }}
    />
  )
}
