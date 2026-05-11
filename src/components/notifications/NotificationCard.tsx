import { useEffect, useRef, useState, useCallback } from 'react'
import type { Notification } from '../../contexts/NotificationContext'
import './NotificationCard.css'

const DISMISS_DELAY = 4000
const FADE_DURATION = 300

const TYPE_ICONS: Record<Notification['type'], string> = {
  death: '☠',
  loot: '⚔',
  'level-up': '↑',
  'zone-complete': '✓',
  'auto-craft-stopped': '⚙',
}

interface Props {
  notification: Notification
  onDismiss: () => void
}

export function NotificationCard({ notification, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  const triggerDismiss = useCallback(() => {
    if (!mountedRef.current) {
      return
    }
    setFading(true)
    setTimeout(() => {
      if (mountedRef.current) {
        onDismissRef.current()
      }
    }, FADE_DURATION)
  }, [])

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(triggerDismiss, DISMISS_DELAY)
  }, [triggerDismiss])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const raf = requestAnimationFrame(() => setVisible(true))
    startTimer()
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(raf)
      clearTimer()
    }
  }, [])

  const classes = [
    'notif-card',
    `notif-card--${notification.priority}`,
    visible && 'notif-card--visible',
    fading && 'notif-card--fading',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      role="status"
      className={classes}
      onClick={triggerDismiss}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <span className="notif-icon">{TYPE_ICONS[notification.type]}</span>
      <span className="notif-message">{notification.message}</span>
      {notification.rarity && (
        <span className={`notif-rarity notif-rarity--${notification.rarity}`}>
          {notification.rarity}
        </span>
      )}
    </div>
  )
}
