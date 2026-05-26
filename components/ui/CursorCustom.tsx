'use client'

import { useEffect } from 'react'

export default function CursorCustom() {
  useEffect(() => {
    /* Hide on touch devices */
    if (typeof window === 'undefined' || 'ontouchstart' in window) return

    const dot  = document.getElementById('clorys-cursor')
    const ring = document.getElementById('clorys-cursor-ring')
    if (!dot || !ring) return

    /* Show cursors */
    dot.style.opacity  = '1'
    ring.style.opacity = '1'

    let mx = window.innerWidth  / 2
    let my = window.innerHeight / 2
    let cx = mx, cy = my
    let rafId: number

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }

    const tick = () => {
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
      cx += (mx - cx) * 0.12
      cy += (my - cy) * 0.12
      ring.style.left = Math.round(cx) + 'px'
      ring.style.top  = Math.round(cy) + 'px'
      rafId = requestAnimationFrame(tick)
    }

    /* Hover grow/shrink via event delegation */
    const grow   = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a, button')) {
        dot.classList.add('hi-cur-big')
        ring.classList.add('hi-ring-big')
      }
    }
    const shrink = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a, button')) {
        dot.classList.remove('hi-cur-big')
        ring.classList.remove('hi-ring-big')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover',  grow)
    document.addEventListener('mouseout',   shrink)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  grow)
      document.removeEventListener('mouseout',   shrink)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
