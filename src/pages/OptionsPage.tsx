import { SettingsGroup } from '../components/options/SettingsGroup'
import { SettingsRow } from '../components/options/SettingsRow'
import './OptionsPage.css'

const COMBAT_LOG_EVENTS = [
  'Player damage',
  'Enemy damage',
  'Evades',
  'Deaths',
  'Pack advance',
  'Loot drops',
  'Zone complete',
]

export function OptionsPage() {
  return (
    <div className="options-page">
      <SettingsGroup title="Notifications">
        <SettingsRow label="Enable notifications">
          <input type="checkbox" defaultChecked />
        </SettingsRow>
        <SettingsRow label="Auto-dismiss duration">
          <input type="range" min={1} max={10} defaultValue={4} />
        </SettingsRow>
        <SettingsRow label="Pause on hover">
          <input type="checkbox" defaultChecked />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Combat Log">
        {COMBAT_LOG_EVENTS.map((label) => (
          <SettingsRow key={label} label={label}>
            <input type="checkbox" defaultChecked />
          </SettingsRow>
        ))}
      </SettingsGroup>

      <SettingsGroup title="Loot Filter">
        <SettingsRow label="Minimum rarity">
          <select className="options-select" defaultValue="all">
            <option value="all">All items</option>
            <option value="magic">Magic and above</option>
            <option value="rare">Rare and above</option>
            <option value="unique">Unique only</option>
          </select>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Display">
        <SettingsRow label="Number format">
          <select className="options-select" defaultValue="suffix">
            <option value="suffix">Short suffixes (K / M / B)</option>
            <option value="scientific">Scientific notation</option>
          </select>
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Save">
        <SettingsRow label="Manual save">
          <button className="options-btn">Save now</button>
        </SettingsRow>
        <SettingsRow label="Export">
          <button className="options-btn">Export JSON</button>
        </SettingsRow>
        <SettingsRow label="Import">
          <button className="options-btn">Import JSON</button>
        </SettingsRow>
      </SettingsGroup>
    </div>
  )
}
