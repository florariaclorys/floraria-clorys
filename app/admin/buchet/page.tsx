'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'
import type { BouquetFlower } from '@/app/api/bouquet-flowers/route'

function newFlower(): BouquetFlower {
  return { id: Date.now().toString(), name: '', price: 10, colors: [], active: true }
}

export default function AdminBuchetPage() {
  const [flowers, setFlowers] = useState<BouquetFlower[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    fetch('/api/bouquet-flowers')
      .then(r => r.json())
      .then(data => { setFlowers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const update = (idx: number, patch: Partial<BouquetFlower>) =>
    setFlowers(prev => prev.map((f, i) => i === idx ? { ...f, ...patch } : f))

  const updateColors = (idx: number, raw: string) =>
    update(idx, { colors: raw.split(',').map(c => c.trim()).filter(Boolean) })

  const remove = (idx: number) => setFlowers(prev => prev.filter((_, i) => i !== idx))

  const moveUp = (idx: number) => {
    if (idx === 0) return
    setFlowers(prev => { const a = [...prev]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a })
  }
  const moveDown = (idx: number) => {
    setFlowers(prev => {
      if (idx >= prev.length - 1) return prev
      const a = [...prev]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; return a
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/bouquet-flowers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowers),
      })
      if (!res.ok) throw new Error()
      toast.success('Lista de flori salvată!')
    } catch {
      toast.error('Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell>
      <div className="p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-cormorant text-3xl text-textdark">💐 Flori Buchet Personalizat</h1>
            <p className="font-lato text-xs text-textdark/50 mt-1">Modifică prețuri, culori, adaugă sau elimină flori.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFlowers(p => [...p, newFlower()])}
              className="btn-outline text-sm"
            >
              + Adaugă floare
            </button>
            <button onClick={save} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
              {saving ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="font-lato text-sm text-textdark/50">Se încarcă...</p>
        ) : (
          <div className="space-y-3">
            {flowers.map((f, idx) => (
              <div
                key={f.id}
                className={`bg-white border rounded-xl p-4 transition-opacity ${f.active ? 'border-light opacity-100' : 'border-light opacity-50'}`}
              >
                <div className="grid grid-cols-[1fr_100px_1fr_auto] gap-3 items-center">
                  {/* Name */}
                  <div>
                    <label className="label-field">Nume</label>
                    <input
                      className="input-field"
                      value={f.name}
                      onChange={e => update(idx, { name: e.target.value })}
                      placeholder="Ex: Trandafir"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="label-field">Preț (RON)</label>
                    <input
                      className="input-field"
                      type="number"
                      min={0}
                      value={f.price}
                      onChange={e => update(idx, { price: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="label-field">Culori (separate cu virgulă)</label>
                    <input
                      className="input-field"
                      value={f.colors.join(', ')}
                      onChange={e => updateColors(idx, e.target.value)}
                      placeholder="Ex: alb, roșu, roz"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-1.5 pt-4">
                    <div className="flex gap-1">
                      <button onClick={() => moveUp(idx)} className="w-6 h-6 text-xs text-textdark/40 hover:text-textdark border border-light rounded flex items-center justify-center">↑</button>
                      <button onClick={() => moveDown(idx)} className="w-6 h-6 text-xs text-textdark/40 hover:text-textdark border border-light rounded flex items-center justify-center">↓</button>
                    </div>
                    <button
                      onClick={() => update(idx, { active: !f.active })}
                      className={`font-lato text-[10px] px-2 py-0.5 rounded border ${f.active ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-500 bg-gray-50'}`}
                    >
                      {f.active ? 'Activ' : 'Inactiv'}
                    </button>
                    <button onClick={() => remove(idx)} className="font-lato text-[10px] text-red-400 hover:text-red-600">
                      Șterge
                    </button>
                  </div>
                </div>

                {/* Color preview chips */}
                {f.colors.length > 0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {f.colors.map(c => (
                      <span key={c} className="font-lato text-[10px] bg-light px-2 py-0.5 rounded-full text-textdark/60">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Se salvează...' : '💾 Salvează tot'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
