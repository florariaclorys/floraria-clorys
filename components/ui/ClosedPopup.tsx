'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClosedPopup() {
  const [visible, setVisible] = useState(false)
  const [returnDate, setReturnDate] = useState('')

  useEffect(() => {
    fetch('/api/orders/pause')
      .then(r => r.json())
      .then(data => {
        if (data.isBlockedToday) {
          setReturnDate(data.returnDate || '')
          setTimeout(() => setVisible(true), 600)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
          style={{ background: 'rgba(10, 2, 6, 0.82)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-lg w-full text-center"
            style={{
              background: 'linear-gradient(160deg, #1a0509 0%, #2A0A12 60%, #1a0509 100%)',
              border: '1px solid rgba(201,169,110,0.25)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(201,169,110,0.15)',
              borderRadius: 2,
            }}
          >
            {/* Linie aurie sus */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />

            <div className="px-10 py-12">
              {/* Floare decorativă */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="text-5xl mb-6"
              >
                🌸
              </motion.div>

              {/* Subtitlu */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="font-lato text-[10px] tracking-[0.35em] uppercase mb-4"
                style={{ color: '#C9A96E' }}
              >
                Floraria Clory&apos;s
              </motion.p>

              {/* Titlu principal */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="font-cormorant text-4xl font-light mb-2"
                style={{ color: '#fff', lineHeight: 1.2 }}
              >
                Comenzile online sunt
                <br />
                <span style={{ color: '#C9A96E', fontStyle: 'italic' }}>temporar suspendate</span>
              </motion.h2>

              {/* Linie decorativă */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="flex items-center justify-center gap-3 my-6"
              >
                <div style={{ height: 1, width: 48, background: 'rgba(201,169,110,0.4)' }} />
                <span style={{ color: '#C9A96E', fontSize: 14 }}>✦</span>
                <div style={{ height: 1, width: 48, background: 'rgba(201,169,110,0.4)' }} />
              </motion.div>

              {/* Mesaj */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-lato text-sm leading-relaxed mb-2"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Datorită volumului mare de comenzi, florăria noastră
                nu poate prelua comenzi online <strong style={{ color: 'rgba(255,255,255,0.9)' }}>în această perioadă</strong>.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.68 }}
                className="font-lato text-sm leading-relaxed mb-8"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Îți mulțumim pentru înțelegere și te așteptăm cu drag
                {returnDate ? (
                  <> începând de <strong style={{ color: '#C9A96E' }}>{returnDate}</strong>. 🌷</>
                ) : (
                  <> în curând. 🌷</>
                )}
              </motion.p>

              {/* Contact direct */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="mb-8 p-4 rounded-sm"
                style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.15)' }}
              >
                <p className="font-lato text-xs tracking-widest uppercase mb-2" style={{ color: '#C9A96E' }}>
                  Ne poți găsi la
                </p>
                <a
                  href="tel:+40770930786"
                  className="font-cormorant text-2xl font-semibold block transition-colors hover:opacity-80"
                  style={{ color: '#fff' }}
                >
                  📞 0770 930 786
                </a>
                <p className="font-lato text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  sau vizitează-ne în Negrești-Oaș
                </p>
              </motion.div>

              {/* Buton închide */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                onClick={() => setVisible(false)}
                className="font-lato text-xs tracking-widest uppercase transition-all hover:opacity-100"
                style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em' }}
              >
                Continuă navigarea →
              </motion.button>
            </div>

            {/* Linie aurie jos */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
