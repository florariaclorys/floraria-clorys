'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const categories = [
  { value: '', label: 'Toate categoriile' },
  { value: 'buchete', label: 'Buchete' },
  { value: 'aranjamente', label: 'Aranjamente' },
  { value: 'cutii', label: 'Cutii cu Flori' },
  { value: 'plante', label: 'Plante' },
  { value: 'ocazii', label: 'Ocazii Speciale' },
]

const sortOptions = [
  { value: 'recomandate', label: 'Recomandate' },
  { value: 'pret_asc', label: 'Preț crescător' },
  { value: 'pret_desc', label: 'Preț descrescător' },
  { value: 'noutati', label: 'Noutăți' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'recomandate')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
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
    setCategory('')
    setSort('recomandate')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    router.push('/catalog')
  }

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, inStockOnly])

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-light p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-cormorant text-xl font-semibold text-textdark">Filtre</h3>
          <button
            onClick={resetFilters}
            className="font-lato text-xs text-accent hover:text-primary transition-colors"
          >
            Resetează
          </button>
        </div>

        {/* Category */}
        <div className="mb-6">
          <p className="label-field">Categorie</p>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={category === cat.value}
                  onChange={() => setCategory(cat.value)}
                  className="accent-primary"
                />
                <span className={`font-lato text-sm transition-colors group-hover:text-primary ${
                  category === cat.value ? 'text-primary font-semibold' : 'text-textdark/70'
                }`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-6 border-t border-light pt-6">
          <p className="label-field">Preț (RON)</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              onBlur={applyFilters}
              className="input-field text-center"
            />
            <span className="text-textdark/30 font-lato text-sm">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              onBlur={applyFilters}
              className="input-field text-center"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6 border-t border-light pt-6">
          <p className="label-field">Sortare</p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-field"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* In stock */}
        <div className="border-t border-light pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                inStockOnly ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  inStockOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="font-lato text-sm text-textdark/70">Doar în stoc</span>
          </label>
        </div>
      </div>
    </aside>
  )
}
