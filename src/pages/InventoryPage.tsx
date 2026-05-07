import { CurrencyPanel } from '../components/inventory/CurrencyPanel'
import { EquipmentPanel } from '../components/inventory/EquipmentPanel'
import { InventoryCenter } from '../components/inventory/InventoryCenter'
import './InventoryPage.css'

export function InventoryPage() {
  return (
    <div className="inventory-page">
      <EquipmentPanel />
      <InventoryCenter />
      <CurrencyPanel />
    </div>
  )
}
