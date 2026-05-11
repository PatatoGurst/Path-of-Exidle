import type { Zone, Pack } from '../../types/map'
import { PackBar } from './PackBar'
import { Combatant } from './Combatant'
import { CombatLog, type LogEntry } from './CombatLog'
import './CombatView.css'

const MOCK_PACKS: Pack[] = [
  {
    id: 1,
    monsters: [
      { name: 'Fallen Warrior', rarity: 'normal', tier: 1 },
      { name: 'Fallen Warrior', rarity: 'normal', tier: 1 },
      { name: 'Fallen Marksman', rarity: 'normal', tier: 1 },
    ],
    state: 'defeated',
    isBoss: false,
  },
  {
    id: 2,
    monsters: [
      { name: 'Skeleton', rarity: 'magic', tier: 1 },
      { name: 'Skeleton', rarity: 'normal', tier: 1 },
    ],
    state: 'active',
    isBoss: false,
  },
  {
    id: 3,
    monsters: [
      { name: 'Zombie', rarity: 'normal', tier: 1 },
      { name: 'Zombie', rarity: 'normal', tier: 1 },
      { name: 'Ghoul', rarity: 'normal', tier: 1 },
    ],
    state: 'pending',
    isBoss: false,
  },
  {
    id: 4,
    monsters: [
      { name: 'Corrupted Knight', rarity: 'rare', tier: 1 },
      { name: 'Fallen Warrior', rarity: 'normal', tier: 1 },
    ],
    state: 'pending',
    isBoss: false,
  },
  {
    id: 5,
    monsters: [{ name: 'Undead Tyrant', rarity: 'unique', tier: 1 }],
    state: 'pending',
    isBoss: true,
  },
]

const MOCK_LOG: LogEntry[] = [
  { id: 1, type: 'player-damage', message: 'You hit Fallen Warrior for 22 physical damage' },
  { id: 2, type: 'enemy-damage', message: 'Fallen Warrior hits you for 8 physical damage' },
  { id: 3, type: 'player-damage', message: 'You hit Fallen Warrior for 18 physical damage' },
  { id: 4, type: 'enemy-death', message: 'Fallen Warrior slain' },
  { id: 5, type: 'loot-drop', message: 'Dropped: Tattered Cap (Common)' },
  { id: 6, type: 'player-damage', message: 'You hit Fallen Warrior for 25 physical damage' },
  { id: 7, type: 'enemy-evade', message: 'Fallen Warrior evaded your attack' },
  { id: 8, type: 'enemy-damage', message: 'Fallen Warrior hits you for 11 physical damage' },
  { id: 9, type: 'player-damage', message: 'You hit Fallen Warrior for 20 physical damage' },
  { id: 10, type: 'enemy-death', message: 'Fallen Warrior slain' },
  { id: 11, type: 'loot-drop', message: 'Dropped: Iron Sword (Rare)' },
  { id: 12, type: 'player-damage', message: 'You hit Fallen Marksman for 19 physical damage' },
  { id: 13, type: 'player-evade', message: "You evaded Fallen Marksman's attack" },
  { id: 14, type: 'player-damage', message: 'You hit Fallen Marksman for 24 physical damage' },
  { id: 15, type: 'enemy-death', message: 'Fallen Marksman slain' },
  { id: 16, type: 'pack-cleared', message: 'Pack 1 cleared — advancing to Pack 2' },
  { id: 17, type: 'player-damage', message: 'You hit Skeleton for 21 physical damage' },
  { id: 18, type: 'enemy-damage', message: 'Skeleton hits you for 14 physical damage' },
]

interface Props {
  zone: Zone
  onExit: () => void
}

export function CombatView({ zone, onExit }: Props) {
  return (
    <div className="combat-view">
      <div className="combat-view-header">
        <button className="combat-exit-btn" onClick={onExit}>
          ← Map
        </button>
        <span className="combat-zone-name">{zone.name}</span>
        <span className="combat-act-label">Act {zone.act}</span>
      </div>
      <PackBar packs={MOCK_PACKS} />
      <div className="combat-arena">
        <Combatant name="Exile" hpCurrent={120} hpMax={150} side="left" />
        <div className="combat-vs">VS</div>
        <Combatant name="Skeleton" hpCurrent={45} hpMax={80} side="right" rarityBadge="magic" />
      </div>
      <CombatLog entries={MOCK_LOG} />
    </div>
  )
}
