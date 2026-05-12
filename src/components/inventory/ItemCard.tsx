import type { Item, DragPayload } from '../../types/inventory'
import './ItemCard.css'

interface Props {
  item: Item
  dragPayload: DragPayload
  isCurrencyTarget?: boolean
  onContextMenu: (e: React.MouseEvent, item: Item, payload: DragPayload) => void
}

export function ItemCard({ item, dragPayload, isCurrencyTarget, onContextMenu }: Props) {
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ payload: dragPayload, item }))
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu(e, item, dragPayload)
  }

  return (
    <div
      className={[
        'item-card',
        `item-card--${item.rarity}`,
        isCurrencyTarget ? 'item-card--currency-target' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      draggable
      onDragStart={handleDragStart}
      onContextMenu={handleContextMenu}
      title={item.name}
    >
      <span className="item-card-name">{item.name}</span>
    </div>
  )
}
