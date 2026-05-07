import { MapActBar } from '../components/map/MapActBar'
import { MapZoneGrid } from '../components/map/MapZoneGrid'
import './MapPage.css'

export function MapPage() {
  return (
    <div className="map-page">
      <MapActBar />
      <MapZoneGrid />
    </div>
  )
}
