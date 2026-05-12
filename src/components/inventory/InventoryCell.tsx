import { useState } from 'react'
import type { Item, DragPayload } from '../../types/inventory'
import { ItemCard } from './ItemCard'
import { ItemTooltip } from '../ui/ItemTooltip'
import { Tooltip } from '../ui/Tooltip'
import './InventoryCell.css'

interface Props {
  index: number
  sourceTab: 'inventory' | number
  item: Item | null
  selectedCurrency: string | null
  isCurrencyTarget: boolean
  onDrop: (draggedItem: Item, from: DragPayload, toIndex: number, toTab: 'inventory' | number) => void
  onContextMenu: (e: React.MouseEvent, item: Item, payload: DragPayload) => void
  onCurrencyApply: (item: Item, payload: DragPayload) => void
}

export function InventoryCell({
  index,
  sourceTab,
  item,
  selectedCurrency,
  isCurrencyTarget,
  onDrop,
  onContextMenu,
  onCurrencyApply,
}: Props) {
  const [dragOver, setDragOver] = useState(false)

  const dragPayload: DragPayload = {
    sourceType: sourceTab === 'inventory' ? 'grid' : 'stash',
    sourceIndex: index,
    sourceTab: typeof sourceTab === 'number' ? sourceTab : undefined,
  }

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
      onDrop(draggedItem, payload, index, sourceTab)
    } catch {
      // ignore malformed drag data
    }
  }

  function handleClick() {
    if (selectedCurrency && item && isCurrencyTarget) {
      onCurrencyApply(item, dragPayload)
    }
  }

  const cellClass = [
    'inventory-cell',
    dragOver ? 'inventory-cell--drag-over' : '',
    selectedCurrency && item && isCurrencyTarget ? 'inventory-cell--targetable' : '',
    selectedCurrency && item && !isCurrencyTarget ? 'inventory-cell--not-targetable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cellClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {item && (
        <Tooltip
          content={<ItemTooltip
            name={item.name}
            rarity={item.rarity}
            itemType={item.itemType}
            itemLevel={item.itemLevel}
            quality={item.quality}
            affixes={item.affixes}
          />}
          side="right"
        >
          <ItemCard
            item={item}
            dragPayload={dragPayload}
            isCurrencyTarget={isCurrencyTarget}
            onContextMenu={onContextMenu}
          />
        </Tooltip>
      )}
    </div>
  )
}
