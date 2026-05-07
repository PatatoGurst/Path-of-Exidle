import './MapActBar.css'

export function MapActBar() {
  return (
    <div className="map-act-bar">
      {Array.from({ length: 10 }, (_, i) => (
        <button
          key={`act-${i + 1}`}
          className={`map-act-btn${i === 0 ? ' map-act-btn--active' : ''}`}
        >
          Act {i + 1}
        </button>
      ))}
    </div>
  )
}
