import './MapActBar.css'

interface Props {
  activeAct: number
  onActChange: (act: number) => void
}

// Only Act 1 has unlocked zones in the current mock data
const ACCESSIBLE_ACTS = new Set([1])

export function MapActBar({ activeAct, onActChange }: Props) {
  return (
    <div className="map-act-bar">
      {Array.from({ length: 10 }, (_, i) => {
        const act = i + 1
        const accessible = ACCESSIBLE_ACTS.has(act)
        return (
          <button
            key={`act-${act}`}
            className={[
              'map-act-btn',
              activeAct === act ? 'map-act-btn--active' : '',
              !accessible ? 'map-act-btn--locked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!accessible}
            onClick={() => onActChange(act)}
          >
            Act {act}
          </button>
        )
      })}
    </div>
  )
}
