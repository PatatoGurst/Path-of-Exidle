import { type ReactNode, type CSSProperties, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Tooltip.css'

type Side = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  content: ReactNode
  children: ReactNode
  side?: Side
}

const GAP = 6

export function Tooltip({ content, children, side = 'top' }: Props) {
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const anchorRef = useRef<HTMLDivElement>(null)

  function updatePosition() {
    const el = anchorRef.current
    if (!el) {
      return
    }
    const r = el.getBoundingClientRect()
    switch (side) {
      case 'top':
        setStyle({ top: r.top - GAP, left: r.left + r.width / 2, transform: 'translate(-50%, -100%)' })
        break
      case 'bottom':
        setStyle({ top: r.bottom + GAP, left: r.left + r.width / 2, transform: 'translateX(-50%)' })
        break
      case 'left':
        setStyle({ top: r.top + r.height / 2, left: r.left - GAP, transform: 'translate(-100%, -50%)' })
        break
      case 'right':
        setStyle({ top: r.top + r.height / 2, left: r.right + GAP, transform: 'translateY(-50%)' })
        break
    }
  }

  return (
    <div
      className="tooltip-root"
      ref={anchorRef}
      onMouseEnter={() => {
        updatePosition()
        setVisible(true)
      }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        createPortal(
          <div className="tooltip-box" role="tooltip" style={style}>
            {content}
          </div>,
          document.body,
        )}
    </div>
  )
}
