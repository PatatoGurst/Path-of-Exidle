import type { Item, EquipContents, DragPayload, EquipSlot } from '../../types/inventory'
import { EquipmentSlot } from './EquipmentSlot'
import './EquipmentPanel.css'

const SLOTS: Array<{ id: EquipSlot; label: string; area: string }> = [
  { id: 'helmet', label: 'Helmet', area: 'helmet' },
  { id: 'weapon', label: 'Weapon', area: 'weapon' },
  { id: 'body', label: 'Body', area: 'body' },
  { id: 'shield', label: 'Shield', area: 'shield' },
  { id: 'gloves', label: 'Gloves', area: 'gloves' },
  { id: 'belt', label: 'Belt', area: 'belt' },
  { id: 'boots', label: 'Boots', area: 'boots' },
  { id: 'ring1', label: 'Ring', area: 'ring1' },
  { id: 'amulet', label: 'Amulet', area: 'amulet' },
  { id: 'ring2', label: 'Ring', area: 'ring2' },
]

interface Props {
  equip: EquipContents
  selectedCurrency: string | null
  isCurrencyTarget: (item: Item) => boolean
  onDrop: (draggedItem: Item, from: DragPayload, toSlot: EquipSlot) => void
  onContextMenu: (e: React.MouseEvent, item: Item, payload: DragPayload) => void
  onCurrencyApply: (item: Item, payload: DragPayload) => void
}

export function EquipmentPanel({
  equip,
  selectedCurrency,
  isCurrencyTarget,
  onDrop,
  onContextMenu,
  onCurrencyApply,
}: Props) {
  return (
    <aside className="equipment-panel">
      <h2 className="inv-panel-title">Equipment</h2>
      <div className="equipment-grid">
        {SLOTS.map(({ id, label, area }) => {
          const item = equip[id] ?? null
          return (
            <div key={id} style={{ gridArea: area }}>
              <EquipmentSlot
                slotId={id}
                label={label}
                item={item}
                selectedCurrency={selectedCurrency}
                isCurrencyTarget={item ? isCurrencyTarget(item) : false}
                onDrop={onDrop}
                onContextMenu={onContextMenu}
                onCurrencyApply={onCurrencyApply}
              />
            </div>
          )
        })}
      </div>
    </aside>
  )
}
