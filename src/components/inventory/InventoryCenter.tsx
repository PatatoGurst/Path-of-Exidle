import { useState } from 'react'
import type { Item, GridContents, DragPayload } from '../../types/inventory'
import { InventoryCell } from './InventoryCell'
import './InventoryCenter.css'

const GRID_SIZE = 12
const CELL_COUNT = GRID_SIZE * GRID_SIZE

const STASH_TABS = [
  { id: 1, label: 'Stash 1', locked: false },
  { id: 2, label: 'Stash 2', locked: false },
  { id: 3, label: 'Stash 3', locked: true },
  { id: 4, label: 'Stash 4', locked: true },
]

type ActiveTab = 'inventory' | number

interface Props {
  gridItems: GridContents
  stashItems: Record<number, GridContents>
  selectedCurrency: string | null
  isCurrencyTarget: (item: Item) => boolean
  onDrop: (draggedItem: Item, from: DragPayload, toIndex: number, toTab: ActiveTab) => void
  onContextMenu: (e: React.MouseEvent, item: Item, payload: DragPayload) => void
  onCurrencyApply: (item: Item, payload: DragPayload) => void
}

export function InventoryCenter({
  gridItems,
  stashItems,
  selectedCurrency,
  isCurrencyTarget,
  onDrop,
  onContextMenu,
  onCurrencyApply,
}: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory')

  const currentItems: GridContents =
    activeTab === 'inventory'
      ? gridItems
      : (stashItems[activeTab as number] ?? Array(CELL_COUNT).fill(null))

  return (
    <div className="inventory-center">
      <div className="inventory-tab-bar">
        <button
          className={`inventory-tab${activeTab === 'inventory' ? ' inventory-tab--active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        {STASH_TABS.map((tab) => {
          if (tab.locked) {
            return (
              <button key={tab.id} className="inventory-tab inventory-tab--locked" disabled>
                +
              </button>
            )
          }
          return (
            <button
              key={tab.id}
              className={`inventory-tab${activeTab === tab.id ? ' inventory-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        className="inventory-grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: CELL_COUNT }, (_, i) => {
          const item = currentItems[i] ?? null
          return (
            <InventoryCell
              key={i}
              index={i}
              sourceTab={activeTab}
              item={item}
              selectedCurrency={selectedCurrency}
              isCurrencyTarget={item ? isCurrencyTarget(item) : false}
              onDrop={onDrop}
              onContextMenu={onContextMenu}
              onCurrencyApply={onCurrencyApply}
            />
          )
        })}
      </div>
    </div>
  )
}
