import { useState } from 'react'
import type { Item, DragPayload, EquipSlot } from '../../types/inventory'
import { ItemCard } from './ItemCard'
import { ItemTooltip } from '../ui/ItemTooltip'
import { Tooltip } from '../ui/Tooltip'
import './EquipmentSlot.css'

interface Props {
  slotId: EquipSlot
  label: string
  item: Item | null
  equippedItem?: Item | null
  selectedCurrency: string | null
  isCurrencyTarget: boolean
  onDrop: (draggedItem: Item, from: DragPayload, toSlot: EquipSlot) => void
  onContextMenu: (e: React.MouseEvent, item: Item, payload: DragPayload) => void
  onCurrencyApply: (item: Item, payload: DragPayload) => void
}

export function EquipmentSlot({
  slotId,
  label,
  item,
  equippedItem,
  selectedCurrency,
  isCurrencyTarget,
  onDrop,
  onContextMenu,
  onCurrencyApply,
}: Props) {
  const [dragOver, setDragOver] = useState(false)

  const dragPayload: DragPayload = { sourceType: 'equip', sourceSlot: slotId }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  function handleDragLeave() {
    setDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    try {
      const { payload, item: draggedItem } = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (draggedItem.equipSlot && draggedItem.equipSlot !== slotId) {
        if (draggedItem.equipSlot !== 'ring1' || (slotId !== 'ring1' && slotId !== 'ring2')) {
          return
        }
      }
      onDrop(draggedItem, payload, slotId)
    } catch {
      // ignore malformed drag data
    }
  }

  function handleClick() {
    if (selectedCurrency && item && isCurrencyTarget) {
      onCurrencyApply(item, dragPayload)
    }
  }

  const slotClass = [
    'equip-slot',
    dragOver ? 'equip-slot--drag-over' : '',
    item ? 'equip-slot--occupied' : 'equip-slot--empty',
    selectedCurrency && item && isCurrencyTarget ? 'equip-slot--targetable' : '',
    selectedCurrency && item && !isCurrencyTarget ? 'equip-slot--not-targetable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={slotClass} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
      <span className="equip-slot-label">{label}</span>
      {item ? (
        <Tooltip
          content={
            <ItemTooltip
              name={item.name}
              rarity={item.rarity}
              itemType={item.itemType}
              itemLevel={item.itemLevel}
              quality={item.quality}
              affixes={item.affixes}
              comparedItem={equippedItem ?? undefined}
            />
          }
          side="right"
        >
          <ItemCard
            item={item}
            dragPayload={dragPayload}
            isCurrencyTarget={isCurrencyTarget}
            onContextMenu={onContextMenu}
          />
        </Tooltip>
      ) : (
        <div className="equip-slot-placeholder" />
      )}
    </div>
  )
}
