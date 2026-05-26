'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'

/* ── Category colour maps ───────────────────────────────────── */
const CAT_BG: Record<string, string> = {
  buchete:     'radial-gradient(ellipse at 50% 95%, rgba(92,15,43,.9) 0%, rgba(5,1,4,.98) 68%)',
  aranjamente: 'radial-gradient(ellipse at 50% 95%, rgba(20,60,20,.9) 0%, rgba(2,7,3,.98) 68%)',
  plante:      'radial-gradient(ellipse at 50% 95%, rgba(5,30,10,.9) 0%, rgba(1,6,2,.98) 68%)',
  cutii:       'radial-gradient(ellipse at 50% 95%, rgba(80,5,5,.9) 0%, rgba(8,1,1,.98) 68%)',
  ocazii:      'radial-gradient(ellipse at 50% 95%, rgba(60,25,5,.9) 0%, rgba(7,3,1,.98) 68%)',
}
const DEF_BG = 'radial-gradient(ellipse at 50% 95%, rgba(50,20,5,.9) 0%, rgba(6,3,1,.98) 68%)'

const CAT_GLOW: Record<string, string> = {
  buchete:     'rgba(201,50,100,.3)',
  aranjamente: 'rgba(50,180,80,.25)',
  plante:      'rgba(30,180,60,.22)',
  cutii:       'rgba(200,50,50,.28)',
  ocazii:      'rgba(201,168,76,.3)',
}
const DEF_GLOW = 'rgba(201,168,76,.22)'

const CAT_LABEL: Record<string, string> = {
  buchete:     'Buchete',
  aranjamente: 'Aranjamente',
  plante:      'Plante',
  cutii:       'Cutii cu Flori',
  ocazii:      'Ocazii Speciale',
}

/* ── Static petal config ────────────────────────────────────── */
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  left:  5 + (i * 5.8) % 90,
  size:  10 + (i % 5) * 4,
  dur:   9  + (i % 14),
  del:   (i * 1.3) % 9,
  gold:  i % 2 === 0,
  rot:   45 + i * 22,
}))

/* ── Helpers ────────────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, '0')

/* ── Gold divider ───────────────────────────────────────────── */
function GoldDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ width: 56, height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,.5))' }} />
      <span style={{ color: 'rgba(201,168,76,.7)', fontSize: '1rem' }}>✦</span>
      <div style={{ width: 56, height: 1, background: 'linear-gradient(90deg,rgba(201,168,76,.5),transparent)' }} />
    </div>
  )
}

/* ── Progress Dots ──────────────────────────────────────────── */
function ProgressDots({ total, active, onDotClick }: {
  total: number; active: number; onDotClick: (i: number) => void
}) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 300,
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onDotClick(i)} aria-label={`Scenă ${i + 1}`} style={{
          width:  active === i ? 14 : 8,
          height: active === i ? 14 : 8,
          borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          background: active === i ? '#C9A84C' : 'rgba(201,168,76,.32)',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  )
}

/* ── Petals ─────────────────────────────────────────────────── */
function FloatingPetals() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PETALS.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: -14, left: `${p.left}%`,
          width: p.size, height: p.size,
          borderRadius: '50% 50% 50% 0',
          background: p.gold ? 'rgba(201,168,76,.5)' : 'rgba(220,110,150,.4)',
          animation: `heroPetalFall ${p.dur}s linear ${p.del}s infinite`,
          transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  )
}

/* ── Intro Scene ────────────────────────────────────────────── */
function IntroScene() {
  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      flexShrink: 0, overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 60%, rgba(92,15,43,.75) 0%, rgba(5,1,4,.97) 65%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <FloatingPetals />

      {/* Thin vertical light shaft */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 1, height: '100%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,.08) 40%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 2rem' }}>
        <p style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.6rem',
          letterSpacing: '0.38em', color: 'rgba(201,168,76,.75)',
          textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>
          Bine ai venit la
        </p>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          fontStyle: 'italic', fontWeight: 300,
          color: '#C9A84C', lineHeight: 1, marginBottom: '1rem',
        }}>
          Flowers With Heart
        </h1>

        <p style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(0.7rem, 1.4vw, 1.4rem)',
          letterSpacing: '0.28em', color: 'rgba(255,255,255,.82)',
          textTransform: 'uppercase', marginBottom: '2rem',
        }}>
          Floraria Clory&apos;s
        </p>

        <div style={{ marginBottom: '2rem' }}><GoldDivider /></div>

        <p style={{
          fontFamily: 'Lato, sans-serif', fontWeight: 200,
          fontSize: '0.82rem', color: 'rgba(255,255,255,.42)',
          letterSpacing: '0.06em', maxWidth: 400, margin: '0 auto 2.5rem',
        }}>
          Aranjamente florale unice · Livrare rapidă în Țara Oașului
        </p>

        {/* Scroll cue */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          <span style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.48rem',
            letterSpacing: '0.25em', color: 'rgba(201,168,76,.45)',
            textTransform: 'uppercase',
          }}>Derulează</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(j => (
              <span key={j} style={{
                color: 'rgba(201,168,76,.55)', fontSize: '0.7rem',
                animation: `heroScrollArrow 1.5s ease-in-out ${j * 0.18}s infinite`,
                display: 'inline-block',
              }}>→</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Vase (reusable, no outer positioning) ──────────────────── */
function VaseBody({ product, glow, isMobile }: { product: Product; glow: string; isMobile: boolean }) {
  const bodyW  = isMobile ? 160 : 280
  const bodyH  = isMobile ? 240 : 400
  const rimW   = isMobile ? 70  : 110
  const rimH   = isMobile ? 10  : 16
  const neckW  = isMobile ? 52  : 80
  const neckH  = isMobile ? 22  : 38
  const baseW  = isMobile ? 96  : 150
  const baseH  = isMobile ? 14  : 20
  const imgW   = isMobile ? 190 : 320
  const imgBot = isMobile ? 222 : 375
  const beamW  = isMobile ? 190 : 290
  const beamH  = isMobile ? 310 : 450

  return (
    <>
      {/* Spotlight beam from above */}
      <div style={{
        position: 'absolute', top: -(beamH + 10), left: '50%', transform: 'translateX(-50%)',
        width: beamW, height: beamH,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
        background: 'linear-gradient(to bottom, rgba(201,168,76,.07), transparent 80%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Product image floating in vase */}
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            position: 'absolute', bottom: imgBot, left: '50%',
            transform: 'translateX(-50%)', width: imgW, height: 'auto',
            objectFit: 'contain', zIndex: 5,
            filter: `drop-shadow(0 -8px 24px ${glow}) drop-shadow(0 20px 28px rgba(0,0,0,.55))`,
          }}
        />
      )}

      {/* Rim */}
      <div style={{
        width: rimW, height: rimH, borderRadius: '50%', position: 'relative', zIndex: 4,
        background: 'linear-gradient(180deg,rgba(201,168,76,.22) 0%,rgba(14,5,10,.96) 100%)',
        boxShadow: `0 0 18px ${glow}, inset 0 2px 6px rgba(201,168,76,.12)`,
      }} />

      {/* Neck */}
      <div style={{
        width: neckW, height: neckH, position: 'relative', zIndex: 4,
        background: 'linear-gradient(180deg,rgba(22,7,16,.96) 0%,rgba(7,1,5,.99) 100%)',
        boxShadow: `inset 0 0 12px ${glow}`,
      }} />

      {/* Body */}
      <div style={{
        width: bodyW, height: bodyH, position: 'relative', zIndex: 3,
        clipPath: 'polygon(20% 0%,80% 0%,88% 20%,94% 55%,88% 88%,80% 100%,20% 100%,12% 88%,6% 55%,12% 20%)',
        background: 'linear-gradient(160deg,rgba(22,7,16,.98) 0%,rgba(7,1,5,1) 100%)',
        boxShadow: `inset 0 0 40px ${glow}, inset 0 0 80px rgba(0,0,0,.5)`,
      }}>
        {/* Gold decorative bands */}
        <div style={{ position: 'absolute', top: '12%', left: 0, right: 0, height: 22, background: 'linear-gradient(transparent,rgba(201,168,76,.22),transparent)' }} />
        <div style={{ position: 'absolute', bottom: '12%', left: 0, right: 0, height: 22, background: 'linear-gradient(transparent,rgba(201,168,76,.22),transparent)' }} />
      </div>

      {/* Base */}
      <div style={{
        width: baseW, height: baseH, borderRadius: '50%', position: 'relative', zIndex: 4,
        background: 'linear-gradient(180deg,rgba(14,5,10,.96) 0%,rgba(7,1,5,1) 100%)',
        boxShadow: `0 4px 18px rgba(0,0,0,.7), 0 0 14px ${glow}`,
      }} />

      {/* Ground shadow */}
      <div style={{
        width: isMobile ? 120 : 200, height: 14, borderRadius: '50%', marginTop: 4,
        background: 'radial-gradient(ellipse,rgba(0,0,0,.65) 0%,transparent 70%)',
      }} />
    </>
  )
}

/* ── Product Scene ──────────────────────────────────────────── */
function ProductScene({ product, index, isMobile }: {
  product: Product; index: number; isMobile: boolean
}) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const vaseRef  = useRef<HTMLDivElement>(null)

  const bg   = CAT_BG[product.category]   || DEF_BG
  const glow = CAT_GLOW[product.category] || DEF_GLOW
  const side = index % 2 === 0 ? 'left' : 'right'

  /* Mouse tilt */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = vaseRef.current
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!el || !rect) return
    const cx = ((e.clientX - rect.left) / rect.width  - 0.5) * 24
    const cy = ((e.clientY - rect.top)  / rect.height - 0.5) * 16
    el.style.transform = `translateX(-50%) perspective(900px) rotateY(${cx}deg) rotateX(${-cy}deg)`
    el.style.transition = 'transform 0.06s linear'
  }
  const onMouseLeave = () => {
    const el = vaseRef.current
    if (!el) return
    el.style.transform = 'translateX(-50%) perspective(900px) rotateY(0deg) rotateX(0deg)'
    el.style.transition = 'transform 0.95s cubic-bezier(0.175,0.885,0.32,1.275)'
  }

  return (
    <div
      ref={sceneRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        flexShrink: 0, overflow: 'hidden', background: bg,
      }}
    >
      {/* Vase group — tiltable */}
      <div ref={vaseRef} style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%) perspective(900px)',
        transformStyle: 'preserve-3d',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        zIndex: 2, transition: 'transform 0.95s cubic-bezier(0.175,0.885,0.32,1.275)',
      }}>
        <VaseBody product={product} glow={glow} isMobile={isMobile} />
      </div>

      {/* Text card */}
      <div className="hi-card" style={{
        position: 'absolute',
        ...(side === 'left' ? { left: isMobile ? '2%' : '7%' } : { right: isMobile ? '2%' : '7%' }),
        top: '50%', transform: 'translateY(-50%)',
        maxWidth: isMobile ? '44vw' : 300,
        padding: isMobile ? '1rem 0.9rem' : '2.5rem 2rem',
        background: 'linear-gradient(135deg,rgba(7,0,15,.93),rgba(15,2,10,.89))',
        border: '1px solid rgba(201,168,76,.18)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 20px 60px rgba(0,0,0,.7)',
        zIndex: 10,
      }}>
        {/* Gold accent lines top & bottom */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(201,168,76,.4),transparent)' }} />

        {/* Scene number */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: 400, color: 'rgba(201,168,76,.07)',
          lineHeight: 1, marginBottom: '-0.4rem',
        }}>
          {pad(index + 1)}
        </div>

        {/* Category */}
        <p style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.48rem',
          letterSpacing: '0.2em', color: 'rgba(201,168,76,.78)',
          textTransform: 'uppercase', marginBottom: '0.45rem',
        }}>
          {CAT_LABEL[product.category] || product.category}
        </p>

        {/* Name */}
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: isMobile ? '1.15rem' : '2.3rem',
          fontWeight: 300, color: '#fff',
          lineHeight: 1.15, marginBottom: '0.8rem',
        }}>
          {product.name}
        </h2>

        {/* Gold line */}
        <div style={{
          width: 40, height: 1,
          background: 'rgba(201,168,76,.6)',
          marginBottom: '0.8rem',
        }} />

        {/* Description — hidden on mobile */}
        {!isMobile && (
          <p style={{
            fontFamily: 'Lato, sans-serif', fontSize: '0.78rem',
            color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: '1rem',
          }}>
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: isMobile ? '1.2rem' : '1.9rem',
          color: 'rgba(201,168,76,.9)', marginBottom: '1.2rem',
        }}>
          {product.price}{' '}
          <span style={{ fontSize: '0.72rem', fontFamily: 'Lato, sans-serif', fontWeight: 300 }}>RON</span>
        </div>

        {/* Button */}
        <Link href={`/produs/${product.slug}`} className="hi-btn" style={{
          display: 'inline-block',
          fontFamily: 'Cinzel, serif', fontSize: '0.5rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(201,168,76,.85)',
          border: '1px solid rgba(201,168,76,.35)',
          padding: isMobile ? '0.5rem 0.8rem' : '0.7rem 1.4rem',
          textDecoration: 'none',
        }}>
          Comandă Acum
        </Link>
      </div>
    </div>
  )
}

/* ── CTA Scene ──────────────────────────────────────────────── */
function CTAScene() {
  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      flexShrink: 0, overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 45%, rgba(120,18,50,.88) 0%, rgba(5,1,4,.97) 58%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Vertical light shaft */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 1, height: '60%',
        background: 'linear-gradient(to bottom,transparent,rgba(201,168,76,.1),transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, padding: '0 2rem' }}>
        <p style={{
          fontFamily: 'Cinzel, serif', fontSize: '0.58rem',
          letterSpacing: '0.32em', color: 'rgba(201,168,76,.65)',
          textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          Floraria Clory&apos;s
        </p>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2.8rem, 7vw, 6rem)',
          fontStyle: 'italic', fontWeight: 300,
          color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem',
        }}>
          Transmite Dragostea
        </h2>

        <div style={{ marginBottom: '1.5rem' }}><GoldDivider /></div>

        <p style={{
          fontFamily: 'Lato, sans-serif', fontWeight: 300,
          fontSize: '0.82rem', color: 'rgba(255,255,255,.42)',
          marginBottom: '2.5rem', maxWidth: 380, margin: '0 auto 2.5rem',
        }}>
          Buchetul perfect pentru fiecare moment special
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/catalog" style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.55rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#0d0206', background: '#C9A84C',
            padding: '0.9rem 2.2rem', textDecoration: 'none',
            transition: 'opacity 0.3s',
          }}>
            Comandă Acum
          </Link>
          <Link href="/buchet-personalizat" style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.55rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,.85)',
            border: '1px solid rgba(201,168,76,.4)',
            padding: '0.9rem 2.2rem', textDecoration: 'none',
          }}>
            Buchet Personalizat
          </Link>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0.9rem 2rem',
        background: 'rgba(0,0,0,.28)',
        borderTop: '1px solid rgba(201,168,76,.1)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '1.2rem', flexWrap: 'wrap',
      }}>
        {['Livrare Gratuită', 'Flori Proaspete', 'Mesaj Personal', 'Buchet Personalizat'].map((txt, i, arr) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '1.2rem',
            fontFamily: 'Cinzel, serif', fontSize: '0.48rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,.55)',
          }}>
            {txt}
            {i < arr.length - 1 && <span style={{ color: 'rgba(201,168,76,.3)' }}>✦</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Ticker Bar (named export) ──────────────────────────────── */
const TICKER_ITEMS = [
  '✦ Livrare Gratuită — Negrești-Oaș',
  '✦ Flori Proaspete Garantate de la Producători',
  '✦ Mesaj Personal Inclus Gratuit',
  '✦ Buchete Personalizate la Comandă',
]

export function TickerBar() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div style={{
      overflow: 'hidden', height: 40,
      background: 'rgba(201,168,76,.07)',
      borderTop:    '1px solid rgba(201,168,76,.14)',
      borderBottom: '1px solid rgba(201,168,76,.14)',
      display: 'flex', alignItems: 'center',
    }}>
      <div className="hi-ticker-track">
        {items.map((t, i) => (
          <span key={i} style={{
            fontFamily: 'Cinzel, serif', fontSize: '0.55rem',
            letterSpacing: '0.2em', color: 'rgba(201,168,76,.68)',
            whiteSpace: 'nowrap', paddingRight: '3.5rem',
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────────── */
export default function HeroImmersive() {
  const [products, setProducts] = useState<Product[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [active,   setActive]   = useState(0)

  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const killRef  = useRef<(() => void) | null>(null)

  /* ── Fetch featured products ── */
  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then((d: unknown) => {
        const arr = Array.isArray(d) && d.length > 0 ? (d as Product[]) : null
        if (arr) { setProducts(arr.slice(0, 5)); return }
        return fetch('/api/products')
          .then(r => r.json())
          .then((all: unknown) => {
            if (Array.isArray(all)) setProducts((all as Product[]).slice(0, 5))
          })
      })
      .catch(() => {})
  }, [])

  /* ── Client-side detection ── */
  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* ── GSAP scroll hijack — desktop only ── */
  useEffect(() => {
    if (!mounted || isMobile) return
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track) return

    let alive = true
    const totalScenes = 1 + products.length + 1

    ;(async () => {
      const { default: gsap }    = await import('gsap')
      const { ScrollTrigger }    = await import('gsap/ScrollTrigger')
      if (!alive) return
      gsap.registerPlugin(ScrollTrigger)

      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          start:   'top top',
          end:     () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub:   1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            setActive(Math.round(self.progress * (totalScenes - 1)))
          },
        },
      })

      killRef.current = () => {
        tween.kill()
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
    })()

    return () => {
      alive = false
      killRef.current?.()
    }
  }, [mounted, isMobile, products])

  /* ── Scroll to scene (dot click) ── */
  const scrollToScene = (i: number) => {
    const outer = outerRef.current
    if (!outer) return
    if (isMobile) {
      const scenes = outer.querySelectorAll<HTMLElement>('.hi-mobile-scene')
      scenes[i]?.scrollIntoView({ behavior: 'smooth' })
    } else {
      const totalScenes = 1 + products.length + 1
      const trackWidth  = (trackRef.current?.scrollWidth ?? 0) - window.innerWidth
      const progress    = totalScenes > 1 ? i / (totalScenes - 1) : 0
      const target      = outer.offsetTop + trackWidth * progress
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  /* Wait for mount before rendering anything (avoids SSR/CSR mismatch) */
  if (!mounted) {
    return (
      <div style={{
        height: '100vh', background: '#050104',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,.3)', borderTopColor: '#C9A84C', animation: 'spin 0.9s linear infinite' }} />
      </div>
    )
  }

  const totalScenes = 1 + products.length + 1

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <div ref={outerRef} style={{ position: 'relative' }}>
        <div className="hi-mobile-scene" style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 60%, rgba(92,15,43,.75) 0%, rgba(5,1,4,.97) 65%)' }}>
          <IntroScene />
        </div>
        {products.map((p, i) => (
          <div key={p.id} className="hi-mobile-scene" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <ProductScene product={p} index={i} isMobile={true} />
          </div>
        ))}
        <div className="hi-mobile-scene" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
          <CTAScene />
        </div>
        <ProgressDots total={totalScenes} active={active} onDotClick={scrollToScene} />
      </div>
    )
  }

  /* ── Desktop layout ── */
  return (
    <>
      <div ref={outerRef} style={{ height: `${totalScenes * 100}vh` }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <div ref={trackRef} style={{ display: 'flex', height: '100%', willChange: 'transform' }}>
            <IntroScene />
            {products.map((p, i) => (
              <ProductScene key={p.id} product={p} index={i} isMobile={false} />
            ))}
            <CTAScene />
          </div>
        </div>
      </div>
      <ProgressDots total={totalScenes} active={active} onDotClick={scrollToScene} />
    </>
  )
}
