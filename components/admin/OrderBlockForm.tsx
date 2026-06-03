'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface OrderBlock {
  active: boolean
  blockedDates: string[]
  returnDate: string
}

export default function OrderBlockForm({ initial }: { initial: OrderBlock }) {
  const [block, setBlock] = useState<OrderBlock>(initial)
  const [saving, setSaving] = useState(false)
  const [date1, setDate1] = useState(initial.blockedDates[0] || '')
  const [date2, setDate2] = useState(initial.blockedDates[1] || '')

  const save = async (overrideActive?: boolean) => {
    setSaving(true)
    const active = overrideActive !== undefined ? overrideActive : block.active
    const blockedDates = [date1, date2].filter(Boolean)
    try {
      const res = await fetch('/api/orders/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active, blockedDates, returnDate: block.returnDate }),
      })
      if (res.ok) {
        setBlock(b => ({ ...b, active, blockedDates }))
        toast.success(
          active ? '🔴 Comenzile au fost suspendate.' : '🟢 Comenzile sunt din nou active!',
          { duration: 4000 }
        )
      } else {
        toast.error('Eroare. Încearcă din nou.')
      }
    } catch {
      toast.error('Eroare de conexiune.')
    } finally {
      setSaving(false)
    }
  }

  const activate = () => {
    if (!date1) { toast.error('Adaugă cel puțin o dată.'); return }
    save(true)
  }

  const deactivate = () => save(false)

  return (
    <div className={`rounded-xl border-2 transition-colors overflow-hidden ${block.active ? 'border-red-300' : 'border-light'}`}>
      {/* Header status */}
      <div className={`px-6 py-4 flex items-center gap-3 ${block.active ? 'bg-red-50' : 'bg-white'}`}>
        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${block.active ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
        <div>
          <p className={`font-cormorant text-xl font-semibold ${block.active ? 'text-red-700' : 'text-textdark'}`}>
            {block.active ? 'Comenzile sunt SUSPENDATE' : 'Comenzile sunt active'}
          </p>
          <p className="font-lato text-xs text-textdark/50">
            {block.active
              ? `Blocate în zilele: ${block.blockedDates.join(', ')}`
              : 'Clienții pot plasa comenzi online în mod normal.'}
          </p>
        </div>
      </div>

      <div className="px-6 py-6 bg-white space-y-5 border-t border-light">
        {/* Date 1 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Ziua 1 (blocată)</label>
            <input
              type="date"
              value={date1}
              onChange={e => setDate1(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Ziua 2 (opțional)</label>
            <input
              type="date"
              value={date2}
              onChange={e => setDate2(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Mesaj retur */}
        <div>
          <label className="label-field">Data revenirii (apare în popup)</label>
          <input
            type="text"
            value={block.returnDate}
            onChange={e => setBlock(b => ({ ...b, returnDate: e.target.value }))}
            placeholder="ex: vineri, 5 iunie"
            className="input-field"
          />
          <p className="font-lato text-[11px] text-textdark/40 mt-1">
            Apare în mesajul: „te așteptăm cu drag începând de <em>{block.returnDate || 'vineri, 5 iunie'}</em>"
          </p>
        </div>

        {/* Butoane */}
        <div className="flex gap-3 pt-2">
          {block.active ? (
            <button
              onClick={deactivate}
              disabled={saving}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-lato text-sm font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
            >
              {saving ? '...' : '✓ Reactivează comenzile'}
            </button>
          ) : (
            <button
              onClick={activate}
              disabled={saving}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-lato text-sm font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
            >
              {saving ? '...' : '⏸ Suspendă comenzile'}
            </button>
          )}
          {block.active && (
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="flex-1 py-3 bg-primary hover:bg-secondary text-white font-lato text-sm font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
            >
              {saving ? '...' : 'Salvează modificările'}
            </button>
          )}
        </div>

        {block.active && (
          <p className="font-lato text-xs text-red-600 bg-red-50 p-3 rounded">
            ⚠️ Popup-ul este activ pe homepage. Clienții văd mesajul și nu pot plasa comenzi în zilele blocate.
          </p>
        )}
      </div>
    </div>
  )
}
