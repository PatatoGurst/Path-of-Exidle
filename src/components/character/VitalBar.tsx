import './VitalBar.css'

interface Props {
  type: 'hp' | 'mana'
  label: string
  value: number
}

export function VitalBar({ type, label, value }: Props) {
  return (
    <div className={`vital-bar vital-bar--${type}`}>
      <span className="vital-bar-label">{label}</span>
      <div className="vital-bar-track">
        <div className="vital-bar-fill" />
      </div>
      <span className="vital-bar-value">{value}</span>
    </div>
  )
}
