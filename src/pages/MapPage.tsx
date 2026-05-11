import { useState } from 'react'
import { MapActBar } from '../components/map/MapActBar'
import { MapZoneGrid } from '../components/map/MapZoneGrid'
import { CombatView } from '../components/map/CombatView'
import { useNotifications } from '../contexts/NotificationContext'
import type { Zone } from '../types/map'
import './MapPage.css'

export function MapPage() {
  const [activeAct, setActiveAct] = useState(1)
  const [activeZone, setActiveZone] = useState<Zone | null>(null)
  const { addNotification } = useNotifications()

  function handleZoneEnter(zone: Zone) {
    setActiveZone(zone)
    // M-08: fire demo notifications that will be replaced by real game events in Phase 12
    addNotification({ type: 'loot', message: 'Iron Sword dropped', priority: 'medium', rarity: 'rare' })
    setTimeout(() => {
      addNotification({ type: 'level-up', message: 'Level 5 reached', priority: 'medium' })
    }, 1600)
  }

  function handleExit() {
    setActiveZone(null)
  }

  if (activeZone) {
    return (
      <div className="map-page map-page--combat">
        <CombatView zone={activeZone} onExit={handleExit} />
      </div>
    )
  }

  return (
    <div className="map-page">
      <MapActBar activeAct={activeAct} onActChange={setActiveAct} />
      <MapZoneGrid act={activeAct} onZoneEnter={handleZoneEnter} />
    </div>
  )
}
