import './CurrencyPanel.css'

const CURRENCY_TYPES = [
  'Orb of Transmutation',
  'Orb of Augmentation',
  'Regal Orb',
  'Exalted Orb',
  'Chaos Orb',
  'Orb of Annulment',
  'Divine Orb',
  "Blacksmith's Whetstone",
  "Armourer's Scrap",
  'Orb of Regret',
]

export function CurrencyPanel() {
  return (
    <aside className="currency-panel">
      <h2 className="inv-panel-title">Currency</h2>
      <div className="currency-list">
        {CURRENCY_TYPES.map((name) => (
          <div key={name} className="currency-row">
            <span className="currency-name">{name}</span>
            <span className="currency-count">0</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
