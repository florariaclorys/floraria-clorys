'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface DeliverySettings {
  homeDeliveryFee: number
  freeOverAmount: number
}

export default function DeliveryForm({ initial }: { initial: DeliverySettings }) {
  const [fee, setFee] = useState(String(initial.homeDeliveryFee))
  const [freeOver, setFreeOver] = useState(String(initial.freeOverAmount))
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeDeliveryFee: Number(fee) || 0,
          freeOverAmount: Number(freeOver) || 0,
        }),
      })
      if (res.ok) {
        toast.success('Prețurile de livrare au fost salvate! 🚚', { duration: 3500 })
      } else {
        toast.error('Eroare. Încearcă din nou.')
      }
    } catch {
      toast.error('Eroare de conexiune.')
    } finally {
      setSaving(false)
    }
  }

  const feeNum = Number(fee) || 0
  const freeNum = Number(freeOver) || 0

  return (
    <div className="space-y-5">
      <div>
        <label className="label-field">Taxă livrare la domiciliu (RON)</label>
        <div className="relative">
          <input
            type="number"
            min={0}
            value={fee}
            onChange={e => setFee(e.target.value)}
            className="input-field pr-14"
            placeholder="20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-lato text-sm text-textdark/40">RON</span>
        </div>
        <p className="font-lato text-[11px] text-textdark/40 mt-1">
          Se aplică doar la comenzile cu livrare la domiciliu. Pune 0 pentru livrare gratuită.
        </p>
      </div>

      <div>
        <label className="label-field">Livrare gratuită peste suma (RON)</label>
        <div className="relative">
          <input
            type="number"
            min={0}
            value={freeOver}
            onChange={e => setFreeOver(e.target.value)}
            className="input-field pr-14"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-lato text-sm text-textdark/40">RON</span>
        </div>
        <p className="font-lato text-[11px] text-textdark/40 mt-1">
          Dacă valoarea comenzii depășește această sumă, livrarea devine gratuită. Pune 0 ca să dezactivezi.
        </p>
      </div>

      {/* Previzualizare */}
      <div className="bg-light/50 rounded-lg p-4 space-y-1.5 border border-light">
        <p className="font-lato text-xs tracking-widest uppercase text-textdark/40 mb-2">Cum vede clientul</p>
        <div className="flex justify-between font-lato text-sm">
          <span className="text-textdark/60">🚚 Livrare la domiciliu</span>
          <span className="font-semibold text-textdark">{feeNum === 0 ? 'GRATUIT' : `${feeNum} RON`}</span>
        </div>
        <div className="flex justify-between font-lato text-sm">
          <span className="text-textdark/60">🏪 Ridicare din magazin</span>
          <span className="font-semibold text-green-600">GRATUIT</span>
        </div>
        {freeNum > 0 && (
          <div className="flex justify-between font-lato text-xs text-green-600 pt-1 border-t border-light mt-1">
            <span>✦ Livrare gratuită</span>
            <span>peste {freeNum} RON</span>
          </div>
        )}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="btn-primary w-full disabled:opacity-60"
      >
        {saving ? 'Se salvează...' : 'Salvează prețurile'}
      </button>
    </div>
  )
}
