import './Orb.css'

interface Props {
  type: 'life' | 'mana'
  current: number
  max: number
}

export function Orb({ type, current, max }: Props) {
  const fillPct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0

  return (
    <div
      className={`orb orb--${type}`}
      role="img"
      aria-label={`${type === 'life' ? 'Life' : 'Mana'}: ${current} / ${max}`}
    >
      <div className="orb-fill" style={{ height: `${fillPct}%` }} />
      <span className="orb-value">
        {current}/{max}
      </span>
    </div>
  )
}
