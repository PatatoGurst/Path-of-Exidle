import type { Zone, ZoneState } from '../../types/map'
import './MapZoneGrid.css'

const ACT_ZONE_NAMES: Record<number, string[]> = {
  1: [
    'The Twilight Strand',
    'The Coast',
    'The Mud Flats',
    'The Ledge',
    'The Tidal Island',
    'The Submerged Passage',
    'The Flooded Depths',
    'The Cavern of Wrath',
    'The Western Forest',
    'The Riverways',
    'The Crossroads',
    'The Vaal Ruins',
  ],
}

const ACT_ZONE_STATES: Record<number, ZoneState[]> = {
  1: [
    'completed',
    'completed',
    'completed',
    'unlocked',
    'locked',
    'locked',
    'locked',
    'locked',
    'locked',
    'locked',
    'locked',
    'locked',
  ],
}

function getZones(act: number): Zone[] {
  const names = ACT_ZONE_NAMES[act] ?? Array.from({ length: 12 }, (_, i) => `Zone ${i + 1}`)
  const states: ZoneState[] = ACT_ZONE_STATES[act] ?? Array.from({ length: 12 }, () => 'locked')
  return names.map((name, i) => ({
    id: `act${act}-zone${i + 1}`,
    name,
    act,
    state: states[i],
  }))
}

const STATE_BADGE: Record<ZoneState, string> = {
  completed: '✓',
  active: '▶',
  unlocked: '',
  locked: '',
}

interface Props {
  act: number
  onZoneEnter: (zone: Zone) => void
}

export function MapZoneGrid({ act, onZoneEnter }: Props) {
  const zones = getZones(act)

  return (
    <div className="map-zone-grid">
      {zones.map((zone) => {
        const interactive = zone.state === 'unlocked' || zone.state === 'completed'
        return (
          <button
            key={zone.id}
            className={`map-zone-card map-zone-card--${zone.state}`}
            disabled={!interactive}
            onClick={() => interactive && onZoneEnter(zone)}
          >
            <span className="map-zone-name">{zone.name}</span>
            <div className="map-zone-footer">
              <span className="map-zone-state">{zone.state}</span>
              {STATE_BADGE[zone.state] && (
                <span className="map-zone-badge">{STATE_BADGE[zone.state]}</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
