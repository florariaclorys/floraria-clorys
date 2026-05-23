'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { AdminNotificationsProvider, useAdminNotifications } from '@/context/AdminNotificationsContext'

const NAV = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/comenzi', icon: '📦', label: 'Comenzi' },
  { href: '/admin/produse', icon: '🌸', label: 'Produse' },
  { href: '/admin/discounturi', icon: '🏷️', label: 'Discounturi' },
  { href: '/admin/buchet', icon: '💐', label: 'Buchet Personalizat' },
  { href: '/admin/setari', icon: '⚙️', label: 'Setari' },
]

function NotificationBell() {
  const { notifications, unreadCount, markAllRead, lastRefresh, nextRefreshIn } = useAdminNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Închide dropdown-ul la click în afară
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(prev => !prev)
    if (!open && unreadCount > 0) {
      setTimeout(markAllRead, 1500)
    }
  }

  const formatTime = (date: Date) => date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        title="Notificări comenzi noi"
      >
        <Bell size={18} className="text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-primary text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white border border-light rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-light">
            <p className="font-lato text-xs font-bold text-textdark uppercase tracking-widest">Notificări</p>
            <div className="flex items-center gap-2">
              <span className="font-lato text-[10px] text-textdark/40">
                Refresh în {formatCountdown(nextRefreshIn)}
              </span>
              {lastRefresh && (
                <span className="font-lato text-[10px] text-textdark/30">· {formatTime(lastRefresh)}</span>
              )}
            </div>
          </div>

          {/* Lista notificări */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-2xl mb-2">🔔</p>
                <p className="font-lato text-sm text-textdark/40">Nicio notificare</p>
                <p className="font-lato text-xs text-textdark/30 mt-1">
                  Verificăm comenzi noi la fiecare 10 minute
                </p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  href="/admin/comenzi"
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-light/50 hover:bg-light/40 transition-colors ${
                    n.seenAt === null ? 'bg-gold/5' : ''
                  }`}
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">📦</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-lato text-xs font-bold text-primary">{n.order.id}</p>
                      {n.seenAt === null && (
                        <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                      )}
                    </div>
                    <p className="font-lato text-xs text-textdark/70 truncate">{n.order.customer.name}</p>
                    <p className="font-lato text-xs text-textdark/40">{n.order.total} RON · {n.order.deliveryDate}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-primary/5 border-t border-light">
            <Link
              href="/admin/comenzi"
              onClick={() => setOpen(false)}
              className="font-lato text-xs text-accent hover:text-primary transition-colors"
            >
              Vezi toate comenzile →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminShellInner({ children, pendingCount = 0 }: { children: React.ReactNode; pendingCount?: number }) {
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
        {/* Top bar cu clopoțel */}
        <div className="fixed top-0 left-56 right-0 h-12 bg-primary/95 backdrop-blur-sm flex items-center justify-end px-6 z-40 border-b border-white/10">
          <NotificationBell />
        </div>
        {/* Offset pentru top bar */}
        <div className="pt-12">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminShell({ children, pendingCount = 0 }: { children: React.ReactNode; pendingCount?: number }) {
  return (
    <AdminNotificationsProvider>
      <AdminShellInner pendingCount={pendingCount}>
        {children}
      </AdminShellInner>
    </AdminNotificationsProvider>
  )
}
