'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/catalog/ProductCard'

const categoryEmoji: Record<string, string> = {
  buchete: '💐', cutii: '🎁', aranjamente: '🌿', plante: '🌱', ocazii: '✨',
}

export default function ProductPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showMessage, setShowMessage] = useState(false)
  const [giftMsg, setGiftMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
        if (data.category) {
          fetch(`/api/products?category=${data.category}`)
            .then(r => r.json())
            .then((all: Product[]) => setRelated(all.filter(p => p.id !== data.id).slice(0, 4)))
        }
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl">🌸</span>
          <p className="font-lato text-sm text-textdark/50 mt-4">Se încarcă...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🥀</span>
        <p className="font-cormorant text-2xl text-textdark mb-4">Produsul nu a fost găsit</p>
        <Link href="/catalog" className="btn-primary">Înapoi la catalog</Link>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, quantity)
    toast.success(`${product.name} adăugat în coș! 🌸`, {
      style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
    })
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-lato text-xs text-textdark/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Acasă</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-textdark">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Image */}
          <div>
            <div
              className="rounded-lg overflow-hidden flex items-center justify-center bg-[#f9eef1]"
              style={{ aspectRatio: '4/5' }}
            >
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[8rem] filter drop-shadow-lg">
                  {categoryEmoji[product.category] || '🌸'}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isNew && (
                <span className="bg-green-600 text-white font-lato text-xs font-bold px-3 py-1 uppercase tracking-widest">Nou</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-600 text-white font-lato text-xs font-bold px-3 py-1 uppercase tracking-widest">Promoție</span>
              )}
              {!product.inStock && (
                <span className="bg-gray-400 text-white font-lato text-xs font-bold px-3 py-1 uppercase tracking-widest">Indisponibil</span>
              )}
            </div>

            <p className="font-lato text-xs tracking-widest uppercase text-accent mb-2">{product.category}</p>
            <h1 className="font-cormorant text-4xl md:text-5xl font-light text-textdark mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-cormorant text-4xl font-bold text-primary">{product.price} RON</span>
              {product.originalPrice && (
                <span className="font-lato text-lg text-textdark/40 line-through">{product.originalPrice} RON</span>
              )}
            </div>

            <div className="w-12 h-px bg-accent mb-6" />

            <p className="font-lato text-base text-textdark/70 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(tag => (
                  <span key={tag} className="font-lato text-xs text-accent border border-accent/40 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <label className="font-lato text-sm font-semibold text-textdark">Cantitate:</label>
              <div className="flex items-center border border-light">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-light transition-colors font-lato text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-lato text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-light transition-colors font-lato text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Gift message toggle */}
            <button
              onClick={() => setShowMessage(!showMessage)}
              className="flex items-center gap-2 font-lato text-sm text-accent hover:text-primary transition-colors mb-4"
            >
              <ChevronDown size={16} className={`transition-transform ${showMessage ? 'rotate-180' : ''}`} />
              {showMessage ? 'Ascunde mesajul pentru card' : 'Adaugă mesaj pentru card (opțional)'}
            </button>
            {showMessage && (
              <textarea
                value={giftMsg}
                onChange={e => setGiftMsg(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Ex: La mulți ani cu drag! ❤"
                className="input-field resize-none mb-4"
              />
            )}

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {product.inStock ? 'Adaugă în Coș' : 'Indisponibil momentan'}
            </button>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                ['🚚', 'Livrare 1-3h'],
                ['🌿', 'Flori proaspete'],
                ['💌', 'Card personalizat'],
                ['🔒', 'Plată securizată'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 bg-light/40 px-3 py-2 rounded">
                  <span className="text-sm">{icon}</span>
                  <span className="font-lato text-xs text-textdark/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div className="mb-8">
              <p className="section-subheading">Ai putea dori și</p>
              <h2 className="section-heading">Produse Similare</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
