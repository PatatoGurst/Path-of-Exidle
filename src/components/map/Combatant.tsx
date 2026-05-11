import type { MonsterRarity } from '../../types/map'
import './Combatant.css'

interface Props {
  name: string
  hpCurrent: number
  hpMax: number
  side: 'left' | 'right'
  rarityBadge?: MonsterRarity
}

export function Combatant({ name, hpCurrent, hpMax, side, rarityBadge }: Props) {
  const pct = Math.max(0, Math.min(100, (hpCurrent / hpMax) * 100))
  return (
    <div className={`combatant combatant--${side}`}>
      <div className="combatant-name-row">
        <span className="combatant-name">{name}</span>
        {rarityBadge && rarityBadge !== 'normal' && (
          <span className={`combatant-rarity combatant-rarity--${rarityBadge}`}>{rarityBadge}</span>
        )}
      </div>
      <div className="combatant-hp-track">
        <div className="combatant-hp-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="combatant-hp-text">
        {hpCurrent} / {hpMax}
      </div>
    </div>
  )
}
