'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  hue: number
  symbol: string
}

const SYMBOLS = ['✦', '✧', '✿', '❀', '·', '∗', '⁕']
const MAX_PARTICLES = 60

export default function CursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animFrame = useRef<number>(0)
  const lastSpawn = useRef(0)
  const running = useRef(false)
  const [enabled, setEnabled] = useState(false)

  // Nu porni pe dispozitive touch (mobil/tabletă) sau dacă userul preferă mișcare redusă
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' &&
      (('ontouchstart' in window) || navigator.maxTouchPoints > 0)
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!isTouch && !reduced) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(p => p.life > 0)

      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.vx *= 0.98
        p.life -= 0.022

        const alpha = Math.max(0, p.life)
        const scale = p.life * 0.9 + 0.1

        ctx.globalAlpha = alpha * 0.85
        ctx.font = `${p.size * scale}px serif`
        ctx.fillStyle = `hsl(${p.hue}, 85%, 65%)`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.symbol, p.x, p.y)
      }
      ctx.globalAlpha = 1

      // Oprește loop-ul când nu mai sunt particule (economisește CPU/GPU în repaus)
      if (particles.current.length === 0) {
        running.current = false
        return
      }
      animFrame.current = requestAnimationFrame(animate)
    }

    const startLoop = () => {
      if (running.current) return
      running.current = true
      animFrame.current = requestAnimationFrame(animate)
    }

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawn.current < 45) return
      lastSpawn.current = now

      if (particles.current.length > MAX_PARTICLES) return

      const count = Math.floor(Math.random() * 2) + 1
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 1.2
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          life: 1,
          size: 8 + Math.random() * 10,
          hue: 35 + Math.random() * 20,
          symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        })
      }
      startLoop()
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animFrame.current)
      running.current = false
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
