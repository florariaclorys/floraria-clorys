'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/comenzi', icon: '📦', label: 'Comenzi' },
  { href: '/admin/produse', icon: '🌸', label: 'Produse' },
  { href: '/admin/discounturi', icon: '🏷️', label: 'Discounturi' },
]

export default function AdminShell({ children, pendingCount = 0 }: { children: React.ReactNode; pendingCount?: number }) {
  const path = usePathname()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-primary flex flex-col z-50 shadow-xl">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-lato text-[10px] tracking-[0.25em] uppercase text-gold mb-0.5">Floraria</p>
          <p className="font-cormorant text-2xl font-light text-white">Clory&apos;s</p>
          <p className="font-lato text-[10px] tracking-widest uppercase text-white/30 mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => {
            const active = path === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-lato text-sm transition-all ${
                  active
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {item.label === 'Comenzi' && pendingCount > 0 && (
                  <span className="ml-auto bg-gold text-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-lato text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="text-base">🌐</span>
            <span>Vezi site-ul</span>
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-lato text-sm text-white/60 hover:bg-white/10 hover:text-red-300 transition-all"
            >
              <span className="text-base">🚪</span>
              <span>Deconectare</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
