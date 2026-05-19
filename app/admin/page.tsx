'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        window.location.href = '/admin/dashboard'
      } else {
        toast.error('Parolă incorectă!')
        setPassword('')
      }
    } catch {
      toast.error('Eroare de conexiune')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-0 min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-light">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-light p-10 shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold mb-1">Floraria</p>
            <p className="font-cormorant text-4xl text-primary font-semibold">Clory&apos;s</p>
            <p className="font-lato text-xs tracking-widest uppercase text-textdark/40 mt-3">Panou Administrare</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field">Parolă administrator</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4"
            >
              {loading ? 'Se verifică...' : 'Intră în panou'}
            </button>
          </form>

          <p className="font-lato text-xs text-textdark/30 text-center mt-6">
            Acces restricționat — numai personal autorizat
          </p>
        </div>
      </div>
    </div>
  )
}
