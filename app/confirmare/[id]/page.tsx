'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Order } from '@/types'

export default function ConfirmationPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <span className="text-4xl animate-bounce">🌸</span>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="font-greatvibes text-4xl text-gold mb-2">Mulțumim!</p>
          <h1 className="font-cormorant text-4xl md:text-5xl text-textdark font-light mb-4">
            Comanda ta a fost plasată!
          </h1>
          <p className="font-lato text-sm text-textdark/60 leading-relaxed mb-8">
            Vei primi un email de confirmare în scurt timp. Echipa noastră te va contacta pentru confirmare.
          </p>

          <div className="bg-light rounded-lg px-8 py-5 mb-8 inline-block">
            <p className="font-lato text-xs text-textdark/40 tracking-widest uppercase mb-1">Număr Comandă</p>
            <p className="font-cormorant text-3xl font-bold text-primary">{id}</p>
          </div>

          {order && (
            <div className="bg-white border border-light rounded-lg p-6 text-left mb-8">
              <h2 className="font-cormorant text-xl font-semibold text-textdark mb-4">Detalii comandă</h2>
              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between font-lato text-sm">
                    <span className="text-textdark/70">{item.productName} x{item.quantity}</span>
                    <span className="font-semibold text-textdark">{item.price * item.quantity} RON</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-light pt-3 space-y-1">
                <div className="flex justify-between font-cormorant text-xl font-bold text-primary">
                  <span>Total plătit</span>
                  <span>{order.total} RON</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-light space-y-2">
                <div className="flex items-center gap-2 font-lato text-sm text-textdark/70">
                  <span className="text-base">📅</span>
                  <span><strong>Data livrare:</strong> {formatDate(order.deliveryDate)}, {order.deliveryTimeSlot}</span>
                </div>
                <div className="flex items-center gap-2 font-lato text-sm text-textdark/70">
                  <span className="text-base">📍</span>
                  <span><strong>Adresă:</strong> {order.customer.address}, {order.customer.city}</span>
                </div>
                <div className="flex items-center gap-2 font-lato text-sm text-textdark/70">
                  <span className="text-base">💵</span>
                  <span><strong>Plată:</strong> Ramburs la livrare</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 mb-8">
            <p className="font-lato text-sm text-textdark/70">
              <strong className="text-textdark">Contact:</strong> pentru orice întrebări sau modificări, sunați la{' '}
              <a href="tel:0700000000" className="text-primary font-bold hover:text-secondary transition-colors">0700 000 000</a>
              {' '}sau scrieți la{' '}
              <a href="mailto:floraria@clorys.ro" className="text-primary font-bold hover:text-secondary transition-colors">floraria@clorys.ro</a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog" className="btn-primary">Continuă cumpărăturile</Link>
            <Link href="/" className="btn-outline">Înapoi la pagina principală</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
