export type ZoneState = 'locked' | 'unlocked' | 'completed' | 'active'

export interface Zone {
  id: string
  name: string
  act: number
  state: ZoneState
}

export type MonsterRarity = 'normal' | 'magic' | 'rare' | 'unique'
export type PackState = 'pending' | 'active' | 'defeated'

export interface Monster {
  name: string
  rarity: MonsterRarity
  tier: number
}

export interface Pack {
  id: number
  monsters: Monster[]
  state: PackState
  isBoss: boolean
}
