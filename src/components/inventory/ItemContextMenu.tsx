import { useEffect, useRef } from 'react'
import type { Item, DragPayload } from '../../types/inventory'
import './ItemContextMenu.css'

interface Props {
  x: number
  y: number
  item: Item
  payload: DragPayload
  onDestroy: (item: Item, payload: DragPayload) => void
  onClose: () => void
}

export function ItemContextMenu({ x, y, item, payload, onDestroy, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  function handleDestroy() {
    onDestroy(item, payload)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="item-context-menu"
      style={{ left: x, top: y }}
    >
      <div className="item-context-menu-header">
        <span className={`item-context-menu-name item-context-menu-name--${item.rarity}`}>
          {item.name}
        </span>
      </div>
      <button className="item-context-menu-action item-context-menu-action--danger" onClick={handleDestroy}>
        Destroy item
      </button>
    </div>
  )
}
