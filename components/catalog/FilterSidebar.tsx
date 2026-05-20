'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  { value: '',           label: 'Toate',           emoji: '🌸', bg: '#6B1A2E', text: '#C9A96E', shadow: '#2A0A12' },
  { value: 'buchete',    label: 'Buchete',          emoji: '💐', bg: '#6B1A2E', text: '#C9A96E', shadow: '#2A0A12' },
  { value: 'aranjamente',label: 'Aranjamente',      emoji: '🌿', bg: '#1B3A2F', text: '#C9A96E', shadow: '#0D1F19' },
  { value: 'cutii',      label: 'Cutii cu Flori',   emoji: '🎁', bg: '#8B2340', text: '#F5E6EA', shadow: '#2A0A12' },
  { value: 'plante',     label: 'Plante',           emoji: '🌱', bg: '#2C4A1E', text: '#C9A96E', shadow: '#0D1F19' },
  { value: 'ocazii',     label: 'Ocazii Speciale',  emoji: '✨', bg: '#C9A96E', text: '#2A0A12', shadow: '#8B6B3A' },
]

const sortOptions = [
  { value: 'recomandate', label: 'Recomandate' },
  { value: 'pret_asc',    label: 'Preț crescător' },
  { value: 'pret_desc',   label: 'Preț descrescător' },
  { value: 'noutati',     label: 'Noutăți' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category,    setCategory]    = useState(searchParams.get('category') || '')
  const [sort,        setSort]        = useState(searchParams.get('sort') || 'recomandate')
  const [minPrice,    setMinPrice]    = useState(searchParams.get('minPrice') || '')
  const [maxPrice,    setMaxPrice]    = useState(searchParams.get('maxPrice') || '')
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort && sort !== 'recomandate') params.set('sort', sort)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (inStockOnly) params.set('inStock', 'true')
    router.push(`/catalog?${params.toString()}`)
  }

  const resetFilters = () => {
    setCategory(''); setSort('recomandate')
    setMinPrice(''); setMaxPrice(''); setInStockOnly(false)
    router.push('/catalog')
  }

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, inStockOnly])

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div
        className="sticky top-24 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #2A0A12 0%, #1a0509 100%)',
          boxShadow: '0 8px 32px rgba(42,10,18,0.25), 0 2px 8px rgba(0,0,0,0.15)',
          border: '1px solid rgba(201,169,110,0.15)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <h3 className="font-cormorant text-xl font-semibold text-white tracking-wide">Filtre</h3>
          </div>
          <button
            onClick={resetFilters}
            className="font-lato text-[10px] tracking-widest uppercase text-white/40 hover:text-gold transition-colors"
            style={{ color: undefined }}
          >
            Resetează
          </button>
        </div>

        <div className="px-5 py-5 space-y-7">

          {/* Categories */}
          <div>
            <p className="font-lato text-[10px] tracking-[0.25em] uppercase text-white/35 mb-3">Categorie</p>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map(cat => {
                const isActive = category === cat.value
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left font-cormorant font-semibold text-base tracking-wide select-none"
                    style={{
                      background: isActive ? cat.bg : 'rgba(255,255,255,0.04)',
                      color: isActive ? cat.text : 'rgba(255,255,255,0.6)',
                      boxShadow: isActive
                        ? `3px 3px 0px ${cat.shadow}`
                        : '2px 2px 0px rgba(0,0,0,0.3)',
                      borderRadius: 6,
                      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      transform: isActive ? 'translate(2px,2px)' : 'translate(0,0)',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = cat.bg
                        e.currentTarget.style.color = cat.text
                        e.currentTarget.style.boxShadow = `3px 3px 0px ${cat.shadow}`
                        e.currentTarget.style.border = 'none'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                        e.currentTarget.style.boxShadow = '2px 2px 0px rgba(0,0,0,0.3)'
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'
                      }
                    }}
                  >
                    <span className="text-lg leading-none">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price range */}
          <div className="border-t pt-6" style={{ borderColor: 'rgba(201,169,110,0.12)' }}>
            <p className="font-lato text-[10px] tracking-[0.25em] uppercase text-white/35 mb-3">Preț (RON)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                onBlur={applyFilters}
                className="flex-1 text-center font-lato text-sm py-2.5 px-3 rounded-lg outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: '#fdf0e8',
                }}
              />
              <span className="font-lato text-xs text-white/25">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                onBlur={applyFilters}
                className="flex-1 text-center font-lato text-sm py-2.5 px-3 rounded-lg outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: '#fdf0e8',
                }}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="border-t pt-6" style={{ borderColor: 'rgba(201,169,110,0.12)' }}>
            <p className="font-lato text-[10px] tracking-[0.25em] uppercase text-white/35 mb-3">Sortare</p>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full font-lato text-sm py-2.5 px-3 rounded-lg outline-none appearance-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,169,110,0.2)',
                color: '#fdf0e8',
              }}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#2A0A12' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* In stock toggle */}
          <div className="border-t pt-6" style={{ borderColor: 'rgba(201,169,110,0.12)' }}>
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className="flex items-center justify-between w-full"
            >
              <span className="font-lato text-sm text-white/60">Doar în stoc</span>
              <div
                className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{ background: inStockOnly ? '#C9A96E' : 'rgba(255,255,255,0.12)' }}
              >
                <span
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  style={{ transform: inStockOnly ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </div>
            </button>
          </div>

        </div>
      </div>
    </aside>
  )
}
