import { GiBackpack, GiGears, GiSkills, GiSwordman, GiTreasureMap } from 'react-icons/gi'
import type { IconType } from 'react-icons'
import './Sidebar.css'

export type Page = 'character' | 'inventory' | 'map' | 'skill-tree' | 'options'

const NAV_ITEMS: Array<{ id: Page; label: string; Icon: IconType }> = [
  { id: 'character', label: 'Character', Icon: GiSwordman },
  { id: 'inventory', label: 'Inventory', Icon: GiBackpack },
  { id: 'map', label: 'Map', Icon: GiTreasureMap },
  { id: 'skill-tree', label: 'Skill Tree', Icon: GiSkills },
  { id: 'options', label: 'Options', Icon: GiGears },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ collapsed, onToggle, activePage, onNavigate }: Props) {
  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar-toggle-row">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`sidebar-nav-item${activePage === id ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => onNavigate(id)}
            title={collapsed ? label : undefined}
            aria-label={label}
            aria-current={activePage === id ? 'page' : undefined}
          >
            <Icon className="sidebar-nav-icon" size={20} aria-hidden={true} />
            <span className="sidebar-nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
