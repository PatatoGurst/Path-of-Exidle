import { useState } from 'react'
import type { Item, GridContents, EquipContents, CurrencyStacks, DragPayload, EquipSlot } from '../types/inventory'
import { EquipmentPanel } from '../components/inventory/EquipmentPanel'
import { InventoryCenter } from '../components/inventory/InventoryCenter'
import { CurrencyPanel } from '../components/inventory/CurrencyPanel'
import { ItemContextMenu } from '../components/inventory/ItemContextMenu'
import { useNotifications } from '../contexts/NotificationContext'
import './InventoryPage.css'

const GRID_SIZE = 144

const MOCK_ITEMS: Item[] = [
  {
    id: 'item-1',
    name: 'Rusted Sword',
    rarity: 'common',
    itemType: 'One-Handed Sword',
    itemLevel: 1,
    quality: 0,
    affixes: [],
    equipSlot: 'weapon',
  },
  {
    id: 'item-2',
    name: 'Jagged Foil',
    rarity: 'magic',
    itemType: 'One-Handed Sword',
    itemLevel: 4,
    quality: 5,
    affixes: [
      { name: 'Serrated', type: 'prefix', description: '+8–12 Physical Damage' },
    ],
    equipSlot: 'weapon',
  },
  {
    id: 'item-3',
    name: 'Soldier Helmet',
    rarity: 'rare',
    itemType: 'Helmet',
    itemLevel: 6,
    quality: 10,
    affixes: [
      { name: 'Armoured', type: 'prefix', description: '+24 Armour' },
      { name: 'of the Ox', type: 'suffix', description: '+15 max HP' },
      { name: 'Sturdy', type: 'prefix', description: '+8 Evasion' },
    ],
    equipSlot: 'helmet',
  },
  {
    id: 'item-4',
    name: 'Tattered Robe',
    rarity: 'common',
    itemType: 'Body Armour',
    itemLevel: 1,
    quality: 0,
    affixes: [],
    equipSlot: 'body',
  },
]

function buildInitialGrid(): GridContents {
  const grid: GridContents = Array(GRID_SIZE).fill(null)
  grid[0] = MOCK_ITEMS[1]
  grid[1] = MOCK_ITEMS[2]
  grid[2] = MOCK_ITEMS[3]
  return grid
}

const INITIAL_EQUIP: EquipContents = {
  weapon: MOCK_ITEMS[0],
}

const INITIAL_STASH: Record<number, GridContents> = {
  1: Array(GRID_SIZE).fill(null),
  2: Array(GRID_SIZE).fill(null),
}

const INITIAL_CURRENCY: CurrencyStacks = {
  'Orb of Transmutation': 5,
  'Orb of Augmentation': 3,
  'Regal Orb': 1,
  'Exalted Orb': 0,
  'Chaos Orb': 2,
  'Orb of Annulment': 0,
  'Divine Orb': 0,
  "Blacksmith's Whetstone": 8,
  "Armourer's Scrap": 4,
  'Orb of Regret': 1,
}

function isCurrencyApplicable(currency: string, item: Item): boolean {
  switch (currency) {
    case 'Orb of Transmutation': return item.rarity === 'common'
    case 'Orb of Augmentation': return item.rarity === 'magic' && item.affixes.length < 2
    case 'Regal Orb': return item.rarity === 'magic'
    case 'Exalted Orb': return item.rarity === 'rare' && item.affixes.length < 6
    case 'Chaos Orb': return item.rarity === 'rare'
    case 'Orb of Annulment': return (item.rarity === 'magic' || item.rarity === 'rare') && item.affixes.length > 0
    case 'Divine Orb': return (item.rarity === 'magic' || item.rarity === 'rare') && item.affixes.length > 0
    case "Blacksmith's Whetstone": return item.equipSlot === 'weapon' && item.quality < 20
    case "Armourer's Scrap": {
      const armorSlots: EquipSlot[] = ['body', 'helmet', 'gloves', 'boots', 'belt']
      return armorSlots.includes(item.equipSlot as EquipSlot) && item.quality < 20
    }
    default: return false
  }
}

interface ContextMenuState {
  x: number
  y: number
  item: Item
  payload: DragPayload
}

type ActiveTab = 'inventory' | number

export function InventoryPage() {
  const [gridItems, setGridItems] = useState<GridContents>(buildInitialGrid)
  const [stashItems, setStashItems] = useState<Record<number, GridContents>>(INITIAL_STASH)
  const [equip, setEquip] = useState<EquipContents>(INITIAL_EQUIP)
  const [currency, setCurrency] = useState<CurrencyStacks>(INITIAL_CURRENCY)
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const { addNotification } = useNotifications()

  function removeFromSource(from: DragPayload): void {
    if (from.sourceType === 'grid') {
      setGridItems((prev) => {
        const next = [...prev]
        next[from.sourceIndex!] = null
        return next
      })
    } else if (from.sourceType === 'stash') {
      setStashItems((prev) => {
        const tab = [...(prev[from.sourceTab!] ?? [])]
        tab[from.sourceIndex!] = null
        return { ...prev, [from.sourceTab!]: tab }
      })
    } else if (from.sourceType === 'equip') {
      setEquip((prev) => {
        const next = { ...prev }
        delete next[from.sourceSlot!]
        return next
      })
    }
  }

  function placeAtTarget(item: Item, to: DragPayload | { toIndex: number; toTab: ActiveTab } | { toSlot: EquipSlot }): Item | null {
    if ('toSlot' in to) {
      const displaced = equip[to.toSlot] ?? null
      setEquip((prev) => ({ ...prev, [to.toSlot]: item }))
      return displaced
    }
    const target = to as { toIndex: number; toTab: ActiveTab }
    if (target.toTab === 'inventory') {
      const displaced = gridItems[target.toIndex] ?? null
      setGridItems((prev) => {
        const next = [...prev]
        next[target.toIndex] = item
        return next
      })
      return displaced
    }
    const tab = target.toTab as number
    const displaced = (stashItems[tab] ?? [])[target.toIndex] ?? null
    setStashItems((prev) => {
      const tabArr = [...(prev[tab] ?? Array(GRID_SIZE).fill(null))]
      tabArr[target.toIndex] = item
      return { ...prev, [tab]: tabArr }
    })
    return displaced
  }

  function handleGridDrop(draggedItem: Item, from: DragPayload, toIndex: number, toTab: ActiveTab) {
    removeFromSource(from)
    const displaced = placeAtTarget(draggedItem, { toIndex, toTab })
    if (displaced) {
      if (from.sourceType === 'grid') {
        setGridItems((prev) => {
          const next = [...prev]
          next[from.sourceIndex!] = displaced
          return next
        })
      } else if (from.sourceType === 'stash') {
        setStashItems((prev) => {
          const tab = [...(prev[from.sourceTab!] ?? [])]
          tab[from.sourceIndex!] = displaced
          return { ...prev, [from.sourceTab!]: tab }
        })
      } else if (from.sourceType === 'equip') {
        setEquip((prev) => ({ ...prev, [from.sourceSlot!]: displaced }))
      }
    }
  }

  function handleEquipDrop(draggedItem: Item, from: DragPayload, toSlot: EquipSlot) {
    removeFromSource(from)
    const displaced = placeAtTarget(draggedItem, { toSlot })
    if (displaced) {
      if (from.sourceType === 'grid') {
        setGridItems((prev) => {
          const next = [...prev]
          next[from.sourceIndex!] = displaced
          return next
        })
      } else if (from.sourceType === 'stash') {
        setStashItems((prev) => {
          const tab = [...(prev[from.sourceTab!] ?? [])]
          tab[from.sourceIndex!] = displaced
          return { ...prev, [from.sourceTab!]: tab }
        })
      }
    }
  }

  function handleCurrencyApply(item: Item, _payload: DragPayload) {
    if (!selectedCurrency) {
      return
    }
    if (currency[selectedCurrency] <= 0) {
      return
    }
    setCurrency((prev) => ({ ...prev, [selectedCurrency]: (prev[selectedCurrency] ?? 0) - 1 }))
    addNotification({
      type: 'loot',
      message: `${selectedCurrency} applied to ${item.name}`,
      priority: 'low',
    })
    setSelectedCurrency(null)
  }

  function handleContextMenu(e: React.MouseEvent, item: Item, payload: DragPayload) {
    setContextMenu({ x: e.clientX, y: e.clientY, item, payload })
  }

  function handleDestroy(item: Item, payload: DragPayload) {
    removeFromSource(payload)
    addNotification({
      type: 'loot',
      message: `${item.name} destroyed`,
      priority: 'low',
    })
  }

  return (
    <div className="inventory-page">
      <EquipmentPanel
        equip={equip}
        selectedCurrency={selectedCurrency}
        isCurrencyTarget={(item) => selectedCurrency ? isCurrencyApplicable(selectedCurrency, item) : false}
        onDrop={handleEquipDrop}
        onContextMenu={handleContextMenu}
        onCurrencyApply={handleCurrencyApply}
      />
      <InventoryCenter
        gridItems={gridItems}
        stashItems={stashItems}
        selectedCurrency={selectedCurrency}
        isCurrencyTarget={(item) => selectedCurrency ? isCurrencyApplicable(selectedCurrency, item) : false}
        onDrop={handleGridDrop}
        onContextMenu={handleContextMenu}
        onCurrencyApply={handleCurrencyApply}
      />
      <CurrencyPanel
        stacks={currency}
        selectedCurrency={selectedCurrency}
        onSelect={setSelectedCurrency}
      />
      {contextMenu && (
        <ItemContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          payload={contextMenu.payload}
          onDestroy={handleDestroy}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
