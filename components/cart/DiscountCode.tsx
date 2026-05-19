'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'

interface DiscountCodeProps {
  onDiscount: (amount: number, code: string) => void
  orderValue: number
}

export default function DiscountCode({ onDiscount, orderValue }: DiscountCodeProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setMessage('')
    setIsValid(null)

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), orderValue }),
      })
      const data = await res.json()
      setIsValid(data.valid)
      setMessage(data.message)
      if (data.valid) {
        onDiscount(data.discountAmount, code.trim().toUpperCase())
      }
    } catch {
      setIsValid(false)
      setMessage('Eroare la validarea codului. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setCode('')
    setMessage('')
    setIsValid(null)
    onDiscount(0, '')
  }

  return (
    <div className="mt-4">
      <p className="label-field flex items-center gap-1.5">
        <Tag size={14} className="text-accent" />
        Cod de discount
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Ex: CLORY10"
          className="input-field flex-1"
          disabled={isValid === true}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
        />
        {isValid === true ? (
          <button
            onClick={handleRemove}
            className="px-4 py-3 bg-gray-200 text-textdark font-lato text-sm font-semibold hover:bg-gray-300 transition-colors whitespace-nowrap"
          >
            Elimină
          </button>
        ) : (
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-3 bg-primary text-white font-lato text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '...' : 'Aplică'}
          </button>
        )}
      </div>
      {message && (
        <p className={`mt-2 font-lato text-xs ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {isValid ? '✓ ' : '✗ '}{message}
        </p>
      )}
    </div>
  )
}
