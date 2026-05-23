'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordForm() {
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirm) {
      toast.error('Parolele noi nu coincid!')
      return
    }
    if (newPass.length < 6) {
      toast.error('Parola trebuie să aibă minim 6 caractere!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Parola a fost schimbată cu succes!')
      setCurrent('')
      setNewPass('')
      setConfirm('')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm) {
      const ok = window.confirm('Vrei să trimitem o parolă temporară la florariaclorys@gmail.com?')
      if (!ok) return
    }
    setResetLoading(true)
    try {
      const res = await fetch('/api/admin/reset-password', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Parolă temporară trimisă pe email!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Eroare la trimiterea emailului')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleChange} className="space-y-4">
        {/* Parola curentă */}
        <div>
          <label className="label-field">Parola curentă</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="input-field pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textdark/40 hover:text-textdark transition-colors"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Parola nouă */}
        <div>
          <label className="label-field">Parola nouă</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              className="input-field pr-10"
              placeholder="Minim 6 caractere"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textdark/40 hover:text-textdark transition-colors"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirmare */}
        <div>
          <label className="label-field">Confirmă parola nouă</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={`input-field ${confirm && newPass !== confirm ? 'border-red-400' : ''}`}
            placeholder="Repetă parola nouă"
            required
          />
          {confirm && newPass !== confirm && (
            <p className="text-red-500 text-xs mt-1">Parolele nu coincid</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? 'Se salvează...' : 'Schimbă parola'}
        </button>
      </form>

      {/* Recuperare parolă */}
      <div className="border-t border-light pt-5">
        <p className="font-lato text-xs text-textdark/50 mb-3">
          Ai uitat parola curentă? Trimitem o parolă temporară pe <strong>florariaclorys@gmail.com</strong>.
        </p>
        <button
          onClick={handleReset}
          disabled={resetLoading}
          className="btn-outline text-sm disabled:opacity-60"
        >
          {resetLoading ? 'Se trimite...' : '📧 Trimite parolă temporară pe email'}
        </button>
      </div>
    </div>
  )
}
