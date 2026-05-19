'use client'

import { useState } from 'react'
import { Order } from '@/types'

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string }> = {
  pending: { label: 'În așteptare', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmată', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'În pregătire', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livrată', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Anulată', color: 'bg-red-100 text-red-800' },
}

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (id: string, status: Order['status']) => Promise<void>
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: Order['status']) => {
    setUpdating(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">ID</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Client</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Telefon</th>
              <th className="px-4 py-3 text-right font-lato text-xs tracking-widest uppercase">Total</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Data Livrare</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Status</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center font-lato text-sm text-textdark/40">
                  Nu există comenzi încă.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => {
                const sc = STATUS_CONFIG[order.status]
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-light hover:bg-light/40 cursor-pointer transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-background'}`}
                    onClick={() => setSelected(order)}
                  >
                    <td className="px-4 py-3 font-lato text-xs font-bold text-primary">{order.id}</td>
                    <td className="px-4 py-3 font-lato text-sm text-textdark">{order.customer.name}</td>
                    <td className="px-4 py-3 font-lato text-sm text-textdark/70">{order.customer.phone}</td>
                    <td className="px-4 py-3 font-cormorant text-lg font-bold text-primary text-right">{order.total} RON</td>
                    <td className="px-4 py-3 font-lato text-sm text-textdark/70">{formatDate(order.deliveryDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-lato text-xs font-semibold ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                        disabled={updating === order.id}
                        className="font-lato text-xs border border-light px-2 py-1 bg-white focus:outline-none focus:border-accent"
                      >
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-lato text-xs tracking-widest text-accent uppercase">Detalii Comandă</p>
                <h2 className="font-cormorant text-3xl text-primary font-semibold">{selected.id}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-textdark/40 hover:text-textdark text-2xl">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-lato text-xs text-textdark/40 uppercase tracking-widest mb-1">Client</p>
                <p className="font-lato text-sm font-semibold">{selected.customer.name}</p>
                <p className="font-lato text-sm text-textdark/60">{selected.customer.phone}</p>
                <p className="font-lato text-sm text-textdark/60">{selected.customer.email}</p>
              </div>
              <div>
                <p className="font-lato text-xs text-textdark/40 uppercase tracking-widest mb-1">Livrare</p>
                <p className="font-lato text-sm font-semibold">{formatDate(selected.deliveryDate)}</p>
                <p className="font-lato text-sm text-textdark/60">{selected.deliveryTimeSlot}</p>
                <p className="font-lato text-sm text-textdark/60">{selected.customer.address}, {selected.customer.city}</p>
              </div>
            </div>

            <div className="border-t border-light pt-4 mb-4">
              <p className="font-lato text-xs text-textdark/40 uppercase tracking-widest mb-3">Produse</p>
              {selected.items.map(item => (
                <div key={item.productId} className="flex justify-between font-lato text-sm mb-1">
                  <span>{item.productName} x{item.quantity}</span>
                  <span className="font-semibold">{(item.price * item.quantity)} RON</span>
                </div>
              ))}
            </div>

            <div className="border-t border-light pt-4">
              <div className="flex justify-between font-cormorant text-2xl font-bold text-primary">
                <span>Total</span>
                <span>{selected.total} RON</span>
              </div>
              <p className="font-lato text-xs text-textdark/50 mt-1">
                Plată: {selected.paymentMethod === 'ramburs' ? 'Ramburs la livrare' : 'Transfer bancar'}
              </p>
              {selected.giftMessage && (
                <p className="font-lato text-xs text-textdark/60 mt-2 italic">
                  Card: &ldquo;{selected.giftMessage}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
