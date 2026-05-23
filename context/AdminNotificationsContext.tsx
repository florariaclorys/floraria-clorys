'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { Order } from '@/types'

interface Notification {
  id: string
  order: Order
  seenAt: null | number
}

interface AdminNotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAllRead: () => void
  lastRefresh: Date | null
  nextRefreshIn: number // secunde
}

const AdminNotificationsContext = createContext<AdminNotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  lastRefresh: null,
  nextRefreshIn: 0,
})

const POLL_INTERVAL = 10 * 60 // 10 minute în secunde
const STORAGE_KEY = 'clorys_known_order_ids'

export function AdminNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [nextRefreshIn, setNextRefreshIn] = useState(POLL_INTERVAL)
  const knownIdsRef = useRef<Set<string>>(new Set())
  const initialized = useRef(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const fetchOrders = useCallback(async (isFirstLoad = false) => {
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) return
      const orders: Order[] = await res.json()

      if (isFirstLoad) {
        // Prima încărcare — marcăm toate comenzile existente ca cunoscute
        const ids = orders.map(o => o.id)
        knownIdsRef.current = new Set(ids)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
        } catch {}
      } else {
        // Refresh ulterior — detectăm comenzile noi
        const newOrders = orders.filter(o => !knownIdsRef.current.has(o.id))
        if (newOrders.length > 0) {
          newOrders.forEach(o => knownIdsRef.current.add(o.id))
          setNotifications(prev => [
            ...newOrders.map(o => ({ id: o.id, order: o, seenAt: null })),
            ...prev,
          ].slice(0, 20)) // max 20 notificări
        }
      }
      setLastRefresh(new Date())
      setNextRefreshIn(POLL_INTERVAL)
    } catch {}
  }, [])

  // Countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) return POLL_INTERVAL
        return prev - 1
      })
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  // Polling
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Restaurăm ID-urile cunoscute din localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const ids: string[] = JSON.parse(stored)
        knownIdsRef.current = new Set(ids)
      }
    } catch {}

    fetchOrders(knownIdsRef.current.size === 0)

    const interval = setInterval(() => {
      fetchOrders(false)
    }, POLL_INTERVAL * 1000)

    return () => clearInterval(interval)
  }, [fetchOrders])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, seenAt: Date.now() })))
  }, [])

  const unreadCount = notifications.filter(n => n.seenAt === null).length

  return (
    <AdminNotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, lastRefresh, nextRefreshIn }}>
      {children}
    </AdminNotificationsContext.Provider>
  )
}

export function useAdminNotifications() {
  return useContext(AdminNotificationsContext)
}
