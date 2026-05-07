import './MapZoneGrid.css'

const ZONES = Array.from({ length: 12 }, (_, i) => ({
  index: i + 1,
  name: `Zone ${i + 1}`,
  state: i === 0 ? 'active' : i <= 2 ? 'completed' : i === 3 ? 'unlocked' : 'locked',
}))

export function MapZoneGrid() {
  return (
    <div className="map-zone-grid">
      {ZONES.map((zone) => (
        <button
          key={`zone-${zone.index}`}
          className={`map-zone-card map-zone-card--${zone.state}`}
          disabled={zone.state === 'locked'}
        >
          <span className="map-zone-name">{zone.name}</span>
          <span className="map-zone-state">{zone.state}</span>
        </button>
      ))}
    </div>
  )
}
