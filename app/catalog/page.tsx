'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/catalog/ProductCard'
import FilterSidebar from '@/components/catalog/FilterSidebar'
import { Product } from '@/types'

function CatalogContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const inStock = searchParams.get('inStock') === 'true'

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then((data: Product[]) => {
        let filtered = data

        if (inStock) filtered = filtered.filter(p => p.inStock)
        if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice))
        if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice))

        if (sort === 'pret_asc') filtered.sort((a, b) => a.price - b.price)
        else if (sort === 'pret_desc') filtered.sort((a, b) => b.price - a.price)
        else if (sort === 'noutati') filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))

        setProducts(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category, sort, search, minPrice, maxPrice, inStock])

  const categoryLabel: Record<string, string> = {
    buchete: 'Buchete',
    aranjamente: 'Aranjamente',
    cutii: 'Cutii cu Flori',
    plante: 'Plante',
    ocazii: 'Ocazii Speciale',
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <FilterSidebar />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-cormorant text-3xl text-textdark font-semibold">
              {category ? categoryLabel[category] || 'Catalog' : 'Toate Florile'}
            </h1>
            {!loading && (
              <p className="font-lato text-sm text-textdark/50 mt-1">
                {products.length} {products.length === 1 ? 'produs găsit' : 'produse găsite'}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-light rounded-lg" style={{ aspectRatio: '4/5' }} />
                <div className="bg-white border border-light p-4 space-y-2">
                  <div className="h-3 bg-light rounded w-16" />
                  <div className="h-5 bg-light rounded w-40" />
                  <div className="h-8 bg-light rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-6xl mb-4">🌸</span>
            <p className="font-cormorant text-2xl text-textdark/50 mb-2">Niciun produs găsit</p>
            <p className="font-lato text-sm text-textdark/40">Încearcă să modifici filtrele</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Floraria Clory&apos;s</p>
          <div className="w-12 h-px bg-accent" />
        </div>
        <Suspense fallback={<div className="font-lato text-sm text-textdark/50">Se încarcă...</div>}>
          <CatalogContent />
        </Suspense>
      </div>
    </div>
  )
}
