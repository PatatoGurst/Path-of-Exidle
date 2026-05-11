import type { Pack } from '../../types/map'
import './PackTooltipContent.css'

interface Props {
  pack: Pack
}

export function PackTooltipContent({ pack }: Props) {
  return (
    <div className="pack-tooltip">
      <div className="pack-tooltip-title">
        Pack {pack.id}
        {pack.isBoss ? ' (Boss)' : ''}
      </div>
      <div className="pack-tooltip-count">
        {pack.monsters.length} monster{pack.monsters.length !== 1 ? 's' : ''}
      </div>
      {pack.monsters.map((m, i) => (
        <div key={i} className={`pack-tooltip-monster pack-tooltip-monster--${m.rarity}`}>
          {m.name} <span className="pack-tooltip-tier">T{m.tier}</span>
        </div>
      ))}
    </div>
  )
}
