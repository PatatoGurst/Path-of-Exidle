import './InventoryCenter.css'

const GRID_SIZE = 12

export function InventoryCenter() {
  return (
    <div className="inventory-center">
      <div className="inventory-tab-bar">
        <button className="inventory-tab inventory-tab--active">Inventory</button>
        <button className="inventory-tab">Stash 1</button>
        <button className="inventory-tab">Stash 2</button>
        <button className="inventory-tab inventory-tab--locked">+</button>
      </div>
      <div className="inventory-grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
          <div key={`inventory-cell-${i}`} className="inventory-cell" />
        ))}
      </div>
    </div>
  )
}
