'use client'

import { useEffect, useState } from 'react'
import { Order } from '@/types'
import OrderTable from '@/components/admin/OrderTable'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'

const STATUS_TABS: Array<{ value: Order['status'] | 'all'; label: string }> = [
  { value: 'all', label: 'Toate' },
  { value: 'pending', label: 'În așteptare' },
  { value: 'confirmed', label: 'Confirmate' },
  { value: 'in_progress', label: 'În pregătire' },
  { value: 'delivered', label: 'Livrate' },
  { value: 'cancelled', label: 'Anulate' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Order['status'] | 'all'>('all')

  const refresh = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch {
      toast.error('Eroare la încărcarea comenzilor')
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id: string, status: Order['status']) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success('Status actualizat!')
      await refresh()
    } else {
      toast.error('Eroare la actualizare')
    }
  }

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab)
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const countByStatus = (status: Order['status'] | 'all') => {
    if (status === 'all') return orders.length
    return orders.filter(o => o.status === status).length
  }

  return (
    <AdminShell pendingCount={countByStatus('pending')}>
      <div className="p-8">
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Admin / Comenzi</p>
          <h1 className="font-cormorant text-4xl text-textdark font-light">Gestionează Comenzi</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 font-lato text-xs font-semibold tracking-widest uppercase whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-white border border-light text-textdark/60 hover:border-accent hover:text-primary'
              }`}
            >
              {tab.label}
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-light text-textdark/60'
              }`}>
                {countByStatus(tab.value)}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white border border-light rounded-lg">
            <span className="text-4xl">📦</span>
            <p className="font-lato text-sm text-textdark/50 mt-3">Se încarcă comenzile...</p>
          </div>
        ) : (
          <div className="bg-white border border-light rounded-lg overflow-hidden">
            <OrderTable orders={sorted} onStatusChange={handleStatusChange} />
          </div>
        )}
      </div>
    </AdminShell>
  )
}
