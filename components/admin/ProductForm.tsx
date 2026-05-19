'use client'

import { useState, useRef } from 'react'
import { Product } from '@/types'

const CATEGORIES = ['buchete', 'aranjamente', 'cutii', 'plante', 'ocazii']
const COMMON_TAGS = ['romantic', 'valentine', 'nunta', 'zi-de-nastere', 'craciun', 'cadou', 'primavara', 'iarna', 'feminin', 'lux']

interface ProductFormProps {
  product?: Product
  onSubmit: (data: Partial<Product>) => Promise<void>
  onCancel: () => void
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || 'buchete',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    inStock: product?.inStock ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? false,
    tags: product?.tags || [] as string[],
    imageUrl: product?.images?.[0] || '',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setForm(prev => ({ ...prev, imageUrl: data.path }))
      } else {
        alert(data.error || 'Eroare la upload')
      }
    } catch {
      alert('Eroare la upload')
    } finally {
      setUploading(false)
    }
  }

  const toSlug = (val: string) =>
    val.toLowerCase()
      .replace(/[ăâ]/g, 'a').replace(/î/g, 'i').replace(/[șş]/g, 's').replace(/[țţ]/g, 't')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (field === 'name' && !product) {
      setForm(prev => ({ ...prev, name: e.target.value, slug: toSlug(e.target.value) }))
    } else {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  const toggle = (field: 'inStock' | 'isFeatured' | 'isNew') => {
    setForm(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Obligatoriu'
    if (!form.slug.trim()) errs.slug = 'Obligatoriu'
    if (!form.price || isNaN(Number(form.price))) errs.price = 'Preț valid obligatoriu'
    if (!form.shortDescription.trim()) errs.shortDescription = 'Obligatoriu'
    if (!form.description.trim()) errs.description = 'Obligatoriu'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        name: form.name,
        slug: form.slug,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        shortDescription: form.shortDescription,
        description: form.description,
        inStock: form.inStock,
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        tags: form.tags,
        images: form.imageUrl ? [form.imageUrl] : ['/images/products/default.jpg'],
      })
    } finally {
      setLoading(false)
    }
  }

  const ToggleSwitch = ({ field, label }: { field: 'inStock' | 'isFeatured' | 'isNew'; label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => toggle(field)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form[field] ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form[field] ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="font-lato text-sm text-textdark">{label}</span>
    </label>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label-field">Nume produs *</label>
          <input className="input-field" value={form.name} onChange={set('name')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="label-field">Slug URL *</label>
          <input className="input-field" value={form.slug} onChange={set('slug')} />
          {!product && <p className="font-lato text-xs text-textdark/40 mt-1">Se generează automat din numele produsului</p>}
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
        </div>
        <div>
          <label className="label-field">Categorie</label>
          <select className="input-field" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Preț (RON) *</label>
          <input className="input-field" type="number" value={form.price} onChange={set('price')} min={0} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="label-field">Preț original (opțional, dacă e promoție)</label>
          <input className="input-field" type="number" value={form.originalPrice} onChange={set('originalPrice')} min={0} />
        </div>
        <div>
          <label className="label-field">Imagine principală</label>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-light hover:border-accent transition-colors cursor-pointer rounded p-4 flex flex-col items-center justify-center gap-2 min-h-[120px] relative"
          >
            {uploading ? (
              <p className="font-lato text-sm text-textdark/50">Se încarcă...</p>
            ) : form.imageUrl ? (
              <>
                <img src={form.imageUrl} alt="preview" className="max-h-24 object-contain rounded" />
                <p className="font-lato text-xs text-textdark/40">Click pentru a schimba</p>
              </>
            ) : (
              <>
                <span className="text-3xl">📷</span>
                <p className="font-lato text-sm text-textdark/50">Click pentru a încărca o poză</p>
                <p className="font-lato text-xs text-textdark/30">JPG, PNG, WebP — max 5MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="label-field">Descriere scurtă *</label>
        <input className="input-field" value={form.shortDescription} onChange={set('shortDescription')} maxLength={150} />
        {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
      </div>

      <div>
        <label className="label-field">Descriere completă *</label>
        <textarea className="input-field resize-none" rows={5} value={form.description} onChange={set('description')} />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <ToggleSwitch field="inStock" label="În stoc" />
        <ToggleSwitch field="isFeatured" label="Produs recomandat" />
        <ToggleSwitch field="isNew" label="Produs nou" />
      </div>

      {/* Tags */}
      <div>
        <label className="label-field">Tag-uri</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {COMMON_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 font-lato text-xs border transition-colors ${
                form.tags.includes(tag)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-textdark border-light hover:border-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-light">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Se salvează...' : product ? 'Actualizează' : 'Adaugă produs'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Anulează
        </button>
      </div>
    </form>
  )
}
