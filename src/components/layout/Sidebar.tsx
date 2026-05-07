import { Link } from '@tanstack/react-router'
import { GiBackpack, GiGears, GiSkills, GiSwordman, GiTreasureMap } from 'react-icons/gi'
import type { IconType } from 'react-icons'
import './Sidebar.css'

const NAV_ITEMS: Array<{
  to: '/character' | '/inventory' | '/map' | '/skill-tree' | '/options'
  label: string
  Icon: IconType
}> = [
  { to: '/character', label: 'Character', Icon: GiSwordman },
  { to: '/inventory', label: 'Inventory', Icon: GiBackpack },
  { to: '/map', label: 'Map', Icon: GiTreasureMap },
  { to: '/skill-tree', label: 'Skill Tree', Icon: GiSkills },
  { to: '/options', label: 'Options', Icon: GiGears },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: Props) {
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
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="sidebar-nav-item"
            activeProps={{
              className: 'sidebar-nav-item sidebar-nav-item--active',
              'aria-current': 'page',
            }}
            title={collapsed ? label : undefined}
            aria-label={label}
          >
            <Icon size={20} aria-hidden={true} className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
