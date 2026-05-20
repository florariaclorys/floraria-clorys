'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    toast.success(`${product.name} adăugat în coș! 🌸`, {
      style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
    })
  }

  return (
    <Link href={`/produs/${product.slug}`} className="group flex-shrink-0 w-64">
      <div className="relative overflow-hidden rounded-t-lg" style={{ aspectRatio: '4/5' }}>
        <div
          className="w-full h-full transition-transform duration-500 group-hover:scale-105 product-img-placeholder flex items-center justify-center"
          style={{ minHeight: 240 }}
        >
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl filter drop-shadow">
              {product.category === 'buchete' ? '💐' :
               product.category === 'cutii' ? '🎁' :
               product.category === 'aranjamente' ? '🌿' :
               product.category === 'plante' ? '🌱' : '✨'}
            </span>
          )}
        </div>
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-600 text-white font-lato text-xs font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase">
            Nou
          </span>
        )}
      </div>
      <div className="bg-white border border-light border-t-0 rounded-b-lg p-4">
        <p className="font-lato text-xs text-accent tracking-widest uppercase mb-1">{product.category}</p>
        <h3 className="font-cormorant text-lg text-textdark font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-lato text-xs text-textdark/60 mb-3 line-clamp-2">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="font-cormorant text-2xl font-bold text-primary">{product.price} <span className="text-sm font-lato">RON</span></span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 text-xs font-lato font-semibold tracking-wider uppercase hover:bg-secondary transition-colors"
          >
            <ShoppingBag size={14} />
            Adaugă
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
          setLoading(false)
        } else {
          // Fallback: show any products if none are marked featured
          return fetch('/api/products')
            .then(r => r.json())
            .then(all => {
              setProducts(Array.isArray(all) ? all.slice(0, 8) : [])
              setLoading(false)
            })
        }
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-24 bg-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="section-subheading">Selecție</p>
        <h2 className="section-heading">Colecția Noastră</h2>
        <div className="section-divider">
          <div className="w-16 h-px bg-accent" />
          <span className="text-accent text-lg">✿</span>
          <div className="w-16 h-px bg-accent" />
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-64 animate-pulse">
                <div className="bg-light rounded-t-lg" style={{ aspectRatio: '4/5', minHeight: 240 }} />
                <div className="bg-white border border-light border-t-0 rounded-b-lg p-4 space-y-2">
                  <div className="h-3 bg-light rounded w-16" />
                  <div className="h-5 bg-light rounded w-40" />
                  <div className="h-3 bg-light rounded w-full" />
                  <div className="h-8 bg-light rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-cormorant text-2xl text-primary font-light mb-2">Produsele se adaugă în curând</p>
            <p className="font-lato text-sm text-textdark/50">Revin-o mai târziu sau vizitează catalogul complet.</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {products.map(p => (
              <div key={p.id} className="snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/catalog" className="btn-outline">
            Vezi Toate Produsele
          </Link>
        </div>
      </div>
    </section>
  )
}
