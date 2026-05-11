import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

export type NotificationType = 'death' | 'loot' | 'level-up' | 'zone-complete' | 'auto-craft-stopped'
export type NotificationPriority = 'high' | 'medium' | 'low'
export type LootRarity = 'magic' | 'rare' | 'unique'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  priority: NotificationPriority
  rarity?: LootRarity
}

interface ContextValue {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id'>) => void
  dismissNotification: (id: string) => void
}

const NotificationContext = createContext<ContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const idRef = useRef(0)

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = String(++idRef.current)
    setNotifications((prev) => {
      const next = [...prev, { ...n, id }]
      return next.length > 5 ? next.slice(-5) : next
    })
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return ctx
}
