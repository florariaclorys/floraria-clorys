'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Mesajul a fost trimis! Te vom contacta în curând. 🌸', {
      style: { background: '#FDF8F9', color: '#2A0A12', border: '1px solid #F5E6EA' },
      duration: 4000,
    })
    setForm({ name: '', email: '', phone: '', message: '' })
    setSending(false)
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '40700000000'

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-subheading">Suntem alături de tine</p>
          <h1 className="section-heading">Contactează-ne</h1>
          <div className="section-divider">
            <div className="w-16 h-px bg-accent" />
            <span className="text-accent text-lg">✿</span>
            <div className="w-16 h-px bg-accent" />
          </div>
          <p className="font-lato text-sm text-textdark/60 max-w-lg mx-auto">
            Avem o echipă dedicată pregătită să te ajute cu orice întrebare sau comandă personalizată.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white border border-light p-8">
            <h2 className="font-cormorant text-2xl text-textdark font-semibold mb-6">Trimite un mesaj</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-field">Numele tău *</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Ion Popescu"
                  required
                />
              </div>
              <div>
                <label className="label-field">Email *</label>
                <input
                  className="input-field"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email@exemplu.ro"
                  required
                />
              </div>
              <div>
                <label className="label-field">Telefon</label>
                <input
                  className="input-field"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="07XX XXX XXX"
                />
              </div>
              <div>
                <label className="label-field">Mesaj *</label>
                <textarea
                  className="input-field resize-none"
                  rows={6}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Spune-ne cum te putem ajuta..."
                  required
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full py-4">
                {sending ? 'Se trimite...' : 'Trimite Mesajul'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="bg-primary p-8 text-white">
              <h2 className="font-cormorant text-2xl font-light mb-6">Informații de contact</h2>
              <div className="space-y-5">
                {[
                  { icon: '📞', label: 'Telefon', value: '0770 930 786', href: 'tel:0770930786' },
                  { icon: '📧', label: 'Email', value: 'florariaclorys@gmail.com', href: 'mailto:florariaclorys@gmail.com' },
                  { icon: '📍', label: 'Adresă', value: 'Strada Victoriei 28, Negrești Oaș', href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-lato text-xs text-white/50 tracking-widest uppercase mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-lato text-sm text-white hover:text-gold transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-lato text-sm text-white/80">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white border border-light p-6">
              <h3 className="font-cormorant text-xl font-semibold text-textdark mb-4">Program de lucru</h3>
              <div className="space-y-2">
                {[
                  ['Luni - Vineri', '08:00 - 20:00'],
                  ['Sâmbătă', '09:00 - 18:00'],
                  ['Duminică', '10:00 - 16:00'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-light/50 last:border-0">
                    <span className="font-lato text-sm text-textdark/60">{day}</span>
                    <span className="font-lato text-sm font-semibold text-textdark">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="rounded-lg overflow-hidden flex items-center justify-center"
              style={{ height: 200, background: 'linear-gradient(135deg, #F5E6EA, #C4708A30)' }}
            >
              <div className="text-center">
                <span className="text-4xl">📍</span>
                <p className="font-cormorant text-lg text-primary mt-2 font-semibold">Găsește-ne pe hartă</p>
                <p className="font-lato text-xs text-textdark/50 mt-1">Strada Victoriei 28, Negrești Oaș</p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}?text=Bună ziua! Aș dori mai multe informații.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-lato font-semibold text-sm tracking-widest uppercase transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Scrie-ne pe WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
