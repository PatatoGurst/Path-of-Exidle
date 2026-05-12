export type EquipSlot =
  | 'helmet'
  | 'weapon'
  | 'shield'
  | 'body'
  | 'gloves'
  | 'belt'
  | 'boots'
  | 'ring1'
  | 'ring2'
  | 'amulet'

export type ItemRarity = 'common' | 'magic' | 'rare' | 'unique'

export interface ItemAffix {
  name: string
  type: 'prefix' | 'suffix'
  description: string
}

export interface Item {
  id: string
  name: string
  rarity: ItemRarity
  itemType: string
  itemLevel: number
  quality: number
  affixes: ItemAffix[]
  equipSlot?: EquipSlot
}

export type GridContents = (Item | null)[]

export type EquipContents = Partial<Record<EquipSlot, Item>>

export type CurrencyStacks = Record<string, number>

export type DragSourceType = 'grid' | 'stash' | 'equip'

export interface DragPayload {
  sourceType: DragSourceType
  sourceIndex?: number
  sourceTab?: number
  sourceSlot?: EquipSlot
}
