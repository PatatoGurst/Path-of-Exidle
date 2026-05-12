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
  comparedItem?: {
    name: string
    rarity: Rarity
    affixes: Affix[]
  }
}

export function ItemTooltip({ name, rarity, itemType, itemLevel, quality, affixes, comparedItem }: Props) {
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
            <p key={`prefix-${i}`} className="item-tooltip-affix item-tooltip-affix--prefix">
              {affix.description}
            </p>
          ))}
          {suffixes.map((affix, i) => (
            <p key={`suffix-${i}`} className="item-tooltip-affix item-tooltip-affix--suffix">
              {affix.description}
            </p>
          ))}
        </>
      )}

      {comparedItem && (
        <>
          <hr className="item-tooltip-divider" />
          <p className="item-tooltip-compare-label">Replaces equipped:</p>
          <p className={`item-tooltip-compare-name item-tooltip-name--${comparedItem.rarity}`}>
            {comparedItem.name}
          </p>
          <p className="item-tooltip-compare-delta">
            {affixes.length - comparedItem.affixes.length > 0 && (
              <span className="item-tooltip-delta--pos">
                +{affixes.length - comparedItem.affixes.length} affix
                {affixes.length - comparedItem.affixes.length !== 1 ? 'es' : ''}
              </span>
            )}
            {affixes.length - comparedItem.affixes.length < 0 && (
              <span className="item-tooltip-delta--neg">
                {affixes.length - comparedItem.affixes.length} affix
                {Math.abs(affixes.length - comparedItem.affixes.length) !== 1 ? 'es' : ''}
              </span>
            )}
            {affixes.length - comparedItem.affixes.length === 0 && (
              <span>Same number of affixes</span>
            )}
          </p>
        </>
      )}
    </div>
  )
}
