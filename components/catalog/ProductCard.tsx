'use client'

import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

const categoryEmoji: Record<string, string> = {
  buchete: '💐',
  cutii: '🎁',
  aranjamente: '🌿',
  plante: '🌱',
  ocazii: '✨',
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${product.name} adăugat în coș! 🌸`, {
      style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast('Adăugat la favorite! ❤', {
      style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
    })
  }

  return (
    <Link href={`/produs/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-white border border-light card-hover rounded-lg">
        {/* Image area */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <div className="w-full h-full product-img-placeholder flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-7xl filter drop-shadow-md">
                {categoryEmoji[product.category] || '🌸'}
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-green-600 text-white font-lato text-xs font-bold px-2 py-0.5 tracking-widest uppercase">
                Nou
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-red-600 text-white font-lato text-xs font-bold px-2 py-0.5 tracking-widest uppercase">
                Promo
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-500 text-white font-lato text-xs font-bold px-2 py-0.5 tracking-widest uppercase">
                Indisponibil
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-light shadow-sm"
            aria-label="Adaugă la favorite"
          >
            <Heart size={14} className="text-primary" />
          </button>

          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="w-full bg-primary text-white py-3 font-lato text-xs font-bold tracking-widest uppercase hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              Adaugă în Coș
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-lato text-[10px] text-accent tracking-widest uppercase mb-0.5">{product.category}</p>
          <h3 className="font-cormorant text-base font-semibold text-textdark group-hover:text-primary transition-colors leading-tight mb-1">
            {product.name}
          </h3>
          <p className="font-lato text-[11px] text-textdark/55 leading-relaxed mb-2 line-clamp-1">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-cormorant text-xl font-bold text-primary">
              {product.price} <span className="text-xs font-lato font-normal">RON</span>
            </span>
            {product.originalPrice && (
              <span className="font-lato text-xs text-textdark/40 line-through">
                {product.originalPrice} RON
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
