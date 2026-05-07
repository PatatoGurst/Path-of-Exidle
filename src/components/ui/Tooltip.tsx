import type { ReactNode } from 'react'
import './Tooltip.css'

type Side = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  content: ReactNode
  children: ReactNode
  side?: Side
}

export function Tooltip({ content, children, side = 'top' }: Props) {
  return (
    <div className="tooltip-root">
      {children}
      <div className={`tooltip-box tooltip-box--${side}`} role="tooltip">
        {content}
      </div>
    </div>
  )
}
