import './CharacterIdentity.css'

export function CharacterIdentity() {
  return (
    <aside className="character-identity">
      <p className="character-name">Exile</p>
      <p className="character-level">Level 1</p>

      <div className="character-points">
        <div className="points-row">
          <span className="points-label">Skill Points</span>
          <span className="points-value">0</span>
        </div>
        <div className="points-row">
          <span className="points-label">Respec Points</span>
          <span className="points-value">0</span>
        </div>
      </div>
    </aside>
  )
}
