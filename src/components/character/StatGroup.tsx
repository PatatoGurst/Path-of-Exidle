import type { ReactNode } from 'react'
import './StatGroup.css'

interface Props {
  title: string
  children: ReactNode
}

export function StatGroup({ title, children }: Props) {
  return (
    <section className="stat-group">
      <h3 className="stat-group-title">{title}</h3>
      {children}
    </section>
  )
}
