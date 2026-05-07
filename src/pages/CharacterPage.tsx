import { CharacterIdentity } from '../components/character/CharacterIdentity'
import { CharacterStats } from '../components/character/CharacterStats'
import './CharacterPage.css'

export function CharacterPage() {
  return (
    <div className="character-page">
      <CharacterIdentity />
      <CharacterStats />
    </div>
  )
}
