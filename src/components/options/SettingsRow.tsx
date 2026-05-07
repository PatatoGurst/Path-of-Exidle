import type { ReactNode } from 'react'
import './SettingsRow.css'

interface Props {
  label: string
  children: ReactNode
}

export function SettingsRow({ label, children }: Props) {
  return (
    <div className="settings-row">
      <span className="settings-row-label">{label}</span>
      <div className="settings-row-control">{children}</div>
    </div>
  )
}
