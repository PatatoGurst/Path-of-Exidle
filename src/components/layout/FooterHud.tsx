import { Orb } from '../hud/Orb'
import { XpBar } from '../hud/XpBar'
import './FooterHud.css'

export function FooterHud() {
  return (
    <footer className="footer-hud">
      <div className="footer-orb footer-orb--left">
        <Orb type="life" current={70} max={100} />
      </div>

      <div className="footer-center">
        <XpBar currentXp={73} xpToLevel={100} characterName="Exile" level={1} />
      </div>

      <div className="footer-orb footer-orb--right">
        <Orb type="mana" current={31} max={50} />
      </div>
    </footer>
  )
}
