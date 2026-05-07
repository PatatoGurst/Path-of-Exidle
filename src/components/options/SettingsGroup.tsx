import type { ReactNode } from 'react'
import './SettingsGroup.css'

interface Props {
  title: string
  children: ReactNode
}

export function SettingsGroup({ title, children }: Props) {
  return (
    <section className="settings-group">
      <h2 className="settings-group-title">{title}</h2>
      <div className="settings-group-body">{children}</div>
    </section>
  )
}
