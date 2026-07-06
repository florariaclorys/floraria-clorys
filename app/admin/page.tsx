'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-11"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textdark/40 hover:text-primary transition-colors"
                  aria-label={showPassword ? 'Ascunde parola' : 'Arată parola'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
          <p className="font-lato text-xs text-center mt-3">
            <button
              type="button"
              onClick={async () => {
                const ok = window.confirm('Trimitem o parolă temporară la florariaclorys@gmail.com. Continui?')
                if (!ok) return
                const res = await fetch('/api/admin/reset-password', { method: 'POST' })
                if (res.ok) alert('Parolă temporară trimisă pe email!')
                else alert('Eroare la trimitere. Încearcă din nou.')
              }}
              className="text-accent hover:text-primary transition-colors underline"
            >
              Am uitat parola
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
