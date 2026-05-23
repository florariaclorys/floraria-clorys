'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
  symbol: string
}

const SYMBOLS = ['✦', '✧', '✿', '❀', '·', '∗', '⁕']

export default function CursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: -999, y: -999 })
  const animFrame = useRef<number>(0)
  const lastSpawn = useRef(0)

  useEffect(() => {
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

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }

      const now = Date.now()
      if (now - lastSpawn.current < 30) return
      lastSpawn.current = now

      // Spawn 2-3 particles
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
          maxLife: 0.6 + Math.random() * 0.8,
          size: 8 + Math.random() * 10,
          hue: 35 + Math.random() * 20, // gold range
          symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        })
      }
    }

    window.addEventListener('mousemove', onMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(p => p.life > 0)

      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04 // slight gravity
        p.vx *= 0.98
        p.life -= 0.022

        const alpha = Math.max(0, p.life / 1)
        const scale = p.life * 0.9 + 0.1

        ctx.save()
        ctx.globalAlpha = alpha * 0.85
        ctx.font = `${p.size * scale}px serif`
        ctx.fillStyle = `hsl(${p.hue}, 85%, 65%)`
        ctx.shadowColor = `hsl(${p.hue}, 100%, 70%)`
        ctx.shadowBlur = 8
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.symbol, p.x, p.y)
        ctx.restore()
      }

      animFrame.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animFrame.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
