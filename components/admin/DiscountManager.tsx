'use client'

import { useState } from 'react'
import { Discount } from '@/types'
import toast from 'react-hot-toast'

interface DiscountManagerProps {
  initialDiscounts: Discount[]
}

const emptyForm = {
  code: '',
  type: 'percentage' as 'percentage' | 'fixed',
  value: '',
  minOrderValue: '0',
  maxUses: '',
  expiresAt: '',
  isActive: true,
}

export default function DiscountManager({ initialDiscounts }: DiscountManagerProps) {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    const res = await fetch('/api/discounts')
    const data = await res.json()
    setDiscounts(data)
  }

  const handleToggle = async (discount: Discount) => {
    try {
      const res = await fetch(`/api/discounts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: discount.id, isActive: !discount.isActive }),
      })
      if (res.ok) {
        setDiscounts(prev => prev.map(d => d.id === discount.id ? { ...d, isActive: !d.isActive } : d))
        toast.success(discount.isActive ? 'Cod dezactivat' : 'Cod activat')
      }
    } catch {
      toast.error('Eroare la actualizare')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ești sigur că vrei să ștergi acest cod?')) return
    try {
      const res = await fetch(`/api/discounts?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDiscounts(prev => prev.filter(d => d.id !== id))
        toast.success('Cod șters')
      }
    } catch {
      toast.error('Eroare la ștergere')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.value) {
      toast.error('Completează codul și valoarea')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: Number(form.value),
          minOrderValue: Number(form.minOrderValue) || 0,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
          isActive: form.isActive,
        }),
      })
      if (res.ok) {
        toast.success('Cod creat cu succes!')
        setForm(emptyForm)
        setShowForm(false)
        await refresh()
      }
    } catch {
      toast.error('Eroare la creare')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-cormorant text-2xl text-textdark">Coduri de Discount</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Anulează' : '+ Cod Nou'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-light/40 border border-light p-6 rounded-lg mb-8">
          <h3 className="font-cormorant text-xl text-textdark mb-4 font-semibold">Cod Nou</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label-field">Cod *</label>
              <input className="input-field uppercase" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="EX: SAVE20" />
            </div>
            <div>
              <label className="label-field">Tip</label>
              <select className="input-field" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as 'percentage' | 'fixed' }))}>
                <option value="percentage">Procent (%)</option>
                <option value="fixed">Sumă fixă (RON)</option>
              </select>
            </div>
            <div>
              <label className="label-field">Valoare *</label>
              <input className="input-field" type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} min={1} />
            </div>
            <div>
              <label className="label-field">Comandă minimă (RON)</label>
              <input className="input-field" type="number" value={form.minOrderValue} onChange={e => setForm(p => ({ ...p, minOrderValue: e.target.value }))} min={0} />
            </div>
            <div>
              <label className="label-field">Max utilizări (gol = nelimitat)</label>
              <input className="input-field" type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} min={1} />
            </div>
            <div>
              <label className="label-field">Expiră la (opțional)</label>
              <input className="input-field" type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Se creează...' : 'Creează Cod'}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Cod</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Tip</th>
              <th className="px-4 py-3 text-right font-lato text-xs tracking-widest uppercase">Valoare</th>
              <th className="px-4 py-3 text-right font-lato text-xs tracking-widest uppercase">Min. comandă</th>
              <th className="px-4 py-3 text-center font-lato text-xs tracking-widest uppercase">Utilizări</th>
              <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Expiră</th>
              <th className="px-4 py-3 text-center font-lato text-xs tracking-widest uppercase">Status</th>
              <th className="px-4 py-3 text-center font-lato text-xs tracking-widest uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d, i) => (
              <tr key={d.id} className={`border-b border-light ${i % 2 === 0 ? 'bg-white' : 'bg-background'}`}>
                <td className="px-4 py-3 font-lato text-sm font-bold text-primary">{d.code}</td>
                <td className="px-4 py-3 font-lato text-xs text-textdark/60 uppercase">{d.type === 'percentage' ? 'Procent' : 'Fix'}</td>
                <td className="px-4 py-3 font-lato text-sm font-semibold text-textdark text-right">
                  {d.type === 'percentage' ? `${d.value}%` : `${d.value} RON`}
                </td>
                <td className="px-4 py-3 font-lato text-sm text-textdark/60 text-right">{d.minOrderValue} RON</td>
                <td className="px-4 py-3 font-lato text-sm text-textdark/60 text-center">
                  {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ''}
                </td>
                <td className="px-4 py-3 font-lato text-xs text-textdark/60">{d.expiresAt || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full font-lato text-xs font-semibold ${d.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {d.isActive ? 'Activ' : 'Inactiv'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleToggle(d)}
                      className="font-lato text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      {d.isActive ? 'Dezactivează' : 'Activează'}
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="font-lato text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Șterge
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
