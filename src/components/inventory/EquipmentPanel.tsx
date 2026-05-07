import './EquipmentPanel.css'

const EQUIPMENT_SLOTS = [
  'Helmet',
  'Weapon',
  'Shield',
  'Body Armour',
  'Gloves',
  'Belt',
  'Boots',
  'Ring',
  'Ring',
  'Amulet',
]

export function EquipmentPanel() {
  return (
    <aside className="equipment-panel">
      <h2 className="inv-panel-title">Equipment</h2>
      <div className="equipment-slots">
        {EQUIPMENT_SLOTS.map((slot, i) => (
          <div key={`equipment-slot-${i}`} className="equipment-slot">
            <span className="equipment-slot-name">{slot}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
