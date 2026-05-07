import './StatRow.css'

interface Props {
  label: string
  value: string
  note?: string
}

export function StatRow({ label, value, note }: Props) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {note && <span className="stat-note">{note}</span>}
    </div>
  )
}
