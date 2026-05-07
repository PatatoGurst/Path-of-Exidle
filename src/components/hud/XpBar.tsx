import './XpBar.css'

interface Props {
  currentXp: number
  xpToLevel: number
  characterName: string
  level: number
}

export function XpBar({ currentXp, xpToLevel, characterName, level }: Props) {
  const totalPct = xpToLevel > 0 ? (currentXp / xpToLevel) * 100 : 0

  return (
    <div className="xp-container">
      <p className="xp-character">
        {characterName} — Level {level}
      </p>
      <div
        className="xp-bar"
        role="progressbar"
        aria-valuenow={Math.round(totalPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Experience"
      >
        {Array.from({ length: 10 }, (_, i) => {
          const segFillPct = Math.min(1, Math.max(0, (totalPct - i * 10) / 10)) * 100
          return (
            <div key={`xp-segment-${i}`} className="xp-segment">
              <div className="xp-segment-fill" style={{ width: `${segFillPct}%` }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
