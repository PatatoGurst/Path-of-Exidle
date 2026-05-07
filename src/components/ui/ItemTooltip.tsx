import './ItemTooltip.css'

export type Rarity = 'common' | 'magic' | 'rare' | 'unique'

export interface Affix {
  name: string
  type: 'prefix' | 'suffix'
  description: string
}

interface Props {
  name: string
  rarity: Rarity
  itemType: string
  itemLevel: number
  quality: number
  affixes: Affix[]
}

export function ItemTooltip({ name, rarity, itemType, itemLevel, quality, affixes }: Props) {
  const prefixes = affixes.filter((a) => a.type === 'prefix')
  const suffixes = affixes.filter((a) => a.type === 'suffix')

  return (
    <div className="item-tooltip">
      <p className={`item-tooltip-name item-tooltip-name--${rarity}`}>{name}</p>
      <p className="item-tooltip-type">{itemType}</p>

      <hr className="item-tooltip-divider" />

      <div className="item-tooltip-meta">
        <span>Item Level: {itemLevel}</span>
        {quality > 0 && <span>Quality: +{quality}%</span>}
      </div>

      {affixes.length > 0 && (
        <>
          <hr className="item-tooltip-divider" />
          {prefixes.map((affix, i) => (
            <p key={`prefix-affix-${i}`} className="item-tooltip-affix item-tooltip-affix--prefix">
              {affix.description}
            </p>
          ))}
          {suffixes.map((affix, i) => (
            <p key={`suffix-affix-${i}`} className="item-tooltip-affix item-tooltip-affix--suffix">
              {affix.description}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
