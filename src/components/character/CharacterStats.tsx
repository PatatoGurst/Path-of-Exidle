import { StatGroup } from './StatGroup'
import { StatRow } from './StatRow'
import { VitalBar } from './VitalBar'
import './CharacterStats.css'

export function CharacterStats() {
  return (
    <div className="character-stats">
      <StatGroup title="Attributes">
        <StatRow label="Strength" value="10" note="+2 max HP per point" />
        <StatRow label="Dexterity" value="10" note="+5 Accuracy per point" />
        <StatRow label="Intelligence" value="10" note="+2 max Mana per point" />
      </StatGroup>

      <StatGroup title="Vitals">
        <VitalBar type="hp" label="Max HP" value={100} />
        <VitalBar type="mana" label="Max Mana" value={50} />
      </StatGroup>

      <StatGroup title="Defence">
        <StatRow label="Armour" value="0" />
        <StatRow label="Evasion" value="0" />
        <StatRow label="Fire Resistance" value="0%" />
        <StatRow label="Cold Resistance" value="0%" />
        <StatRow label="Lightning Resistance" value="0%" />
        <StatRow label="Chaos Resistance" value="-20%" />
      </StatGroup>

      <StatGroup title="Offence">
        <StatRow label="Damage" value="10–15" />
        <StatRow label="Attack Speed" value="1.00 /s" />
        <StatRow label="Accuracy" value="100" />
      </StatGroup>
    </div>
  )
}
