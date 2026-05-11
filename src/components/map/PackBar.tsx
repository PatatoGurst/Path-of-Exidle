import type { Pack } from '../../types/map'
import { PackTooltipContent } from './PackTooltipContent'
import { Tooltip } from '../ui/Tooltip'
import './PackBar.css'

interface Props {
  packs: Pack[]
}

export function PackBar({ packs }: Props) {
  return (
    <div className="pack-bar">
      {packs.map((pack) => (
        <Tooltip key={pack.id} content={<PackTooltipContent pack={pack} />} side="bottom">
          <div
            className={[
              'pack-indicator',
              `pack-indicator--${pack.state}`,
              pack.isBoss ? 'pack-indicator--boss' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {pack.isBoss ? '★' : pack.id}
          </div>
        </Tooltip>
      ))}
    </div>
  )
}
