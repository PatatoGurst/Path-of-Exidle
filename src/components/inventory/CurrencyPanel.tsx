import type { CurrencyStacks } from '../../types/inventory'
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

interface Props {
  stacks: CurrencyStacks
  selectedCurrency: string | null
  onSelect: (name: string | null) => void
}

export function CurrencyPanel({ stacks, selectedCurrency, onSelect }: Props) {
  function handleContextMenu(e: React.MouseEvent, name: string) {
    e.preventDefault()
    onSelect(selectedCurrency === name ? null : name)
  }

  function handleClick(name: string) {
    onSelect(selectedCurrency === name ? null : name)
  }

  return (
    <aside className="currency-panel">
      <h2 className="inv-panel-title">Currency</h2>
      {selectedCurrency && (
        <p className="currency-mode-hint">Click a valid item to apply. Click currency again to cancel.</p>
      )}
      <div className="currency-list">
        {CURRENCY_TYPES.map((name) => (
          <div
            key={name}
            className={[
              'currency-row',
              selectedCurrency === name ? 'currency-row--selected' : '',
              stacks[name] === 0 ? 'currency-row--empty' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleClick(name)}
            onContextMenu={(e) => handleContextMenu(e, name)}
          >
            <span className="currency-name">{name}</span>
            <span className="currency-count">{stacks[name] ?? 0}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
