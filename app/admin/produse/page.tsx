'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import ProductForm from '@/components/admin/ProductForm'
import AdminShell from '@/components/admin/AdminShell'
import toast from 'react-hot-toast'

const categoryEmoji: Record<string, string> = {
  buchete: '💐', cutii: '🎁', aranjamente: '🌿', plante: '🌱', ocazii: '✨',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const refresh = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data: Partial<Product>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success('Produs adăugat!')
      setShowForm(false)
      await refresh()
    } else {
      toast.error('Eroare la adăugare')
    }
  }

  const handleUpdate = async (data: Partial<Product>) => {
    if (!editProduct) return
    const res = await fetch(`/api/products/${editProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success('Produs actualizat!')
      setEditProduct(null)
      await refresh()
    } else {
      toast.error('Eroare la actualizare')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi "${name}"?`)) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Produs șters!')
      await refresh()
    } else {
      toast.error('Eroare la ștergere')
    }
  }

  return (
    <AdminShell>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-lato text-xs tracking-widest uppercase text-accent mb-1">Admin / Produse</p>
            <h1 className="font-cormorant text-4xl text-textdark font-light">Gestionează Produse</h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditProduct(null) }}
            className="btn-primary"
          >
            {showForm ? 'Anulează' : '+ Produs Nou'}
          </button>
        </div>

        {/* Form */}
        {(showForm || editProduct) && (
          <div className="bg-white border border-light p-8 mb-8 rounded-lg">
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">
              {editProduct ? `Editează: ${editProduct.name}` : 'Produs Nou'}
            </h2>
            <ProductForm
              product={editProduct || undefined}
              onSubmit={editProduct ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditProduct(null) }}
            />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <span className="text-4xl">🌸</span>
            <p className="font-lato text-sm text-textdark/50 mt-3">Se încarcă...</p>
          </div>
        ) : (
          <div className="bg-white border border-light rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Produs</th>
                  <th className="px-4 py-3 text-left font-lato text-xs tracking-widest uppercase">Categorie</th>
                  <th className="px-4 py-3 text-right font-lato text-xs tracking-widest uppercase">Preț</th>
                  <th className="px-4 py-3 text-center font-lato text-xs tracking-widest uppercase">Stoc</th>
                  <th className="px-4 py-3 text-center font-lato text-xs tracking-widest uppercase">Featured</th>
                  <th className="px-4 py-3 text-center font-lato text-xs tracking-widest uppercase">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={`border-b border-light ${i % 2 === 0 ? 'bg-white' : 'bg-background'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded product-img-placeholder flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{categoryEmoji[p.category] || '🌸'}</span>
                        </div>
                        <div>
                          <p className="font-lato text-sm font-semibold text-textdark">{p.name}</p>
                          <p className="font-lato text-xs text-textdark/40">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-lato text-xs text-textdark/60 uppercase tracking-wider">{p.category}</td>
                    <td className="px-4 py-3 font-cormorant text-xl font-bold text-primary text-right">{p.price} RON</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-lato text-xs font-semibold ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.inStock ? 'Da' : 'Nu'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-base ${p.isFeatured ? '⭐' : '—'}`}>
                        {p.isFeatured ? '⭐' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => { setEditProduct(p); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className="font-lato text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Editează
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="font-lato text-xs text-red-500 hover:text-red-700 underline"
                        >
                          Șterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
