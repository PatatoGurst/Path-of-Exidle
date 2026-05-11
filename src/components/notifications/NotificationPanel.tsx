import { useNotifications } from '../../contexts/NotificationContext'
import { NotificationCard } from './NotificationCard'
import './NotificationPanel.css'

export function NotificationPanel() {
  const { notifications, dismissNotification } = useNotifications()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notif-panel" aria-live="polite">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} onDismiss={() => dismissNotification(n.id)} />
      ))}
    </div>
  )
}
