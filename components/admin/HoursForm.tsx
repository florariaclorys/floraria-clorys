'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { BusinessHours } from '@/lib/settings'

export default function HoursForm({ initialHours }: { initialHours: BusinessHours }) {
  const [hours, setHours] = useState(initialHours)
  const [loading, setLoading] = useState(false)

  const set = (field: keyof BusinessHours) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setHours(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hours),
      })
      if (!res.ok) throw new Error('Eroare la salvare')
      toast.success('Programul a fost actualizat!')
    } catch {
      toast.error('Eroare la salvarea programului')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label-field">Luni - Vineri</label>
        <input
          className="input-field"
          value={hours.weekdays}
          onChange={set('weekdays')}
          placeholder="09:00-19:00"
        />
      </div>
      <div>
        <label className="label-field">Sambata</label>
        <input
          className="input-field"
          value={hours.saturday}
          onChange={set('saturday')}
          placeholder="10:00-17:00"
        />
      </div>
      <div>
        <label className="label-field">Duminica</label>
        <input
          className="input-field"
          value={hours.sunday}
          onChange={set('sunday')}
          placeholder="Inchis"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? 'Se salveaza...' : 'Salveaza programul'}
        </button>
      </div>
    </form>
  )
}
