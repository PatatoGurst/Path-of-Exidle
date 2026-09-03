import { useState } from 'react'
import type { ThemeCatalog, TreeNode } from '../../types/skilltree'
import './ThemeManagerModal.css'

interface Props {
  catalog: ThemeCatalog
  nodes: TreeNode[]
  onChange: (catalog: ThemeCatalog) => void
  onDeleteTheme: (themeId: string) => void
  onClose: () => void
}

export function ThemeManagerModal({ catalog, nodes, onChange, onDeleteTheme, onClose }: Props) {
  const [newId, setNewId] = useState('')

  function updateEntry(id: string, patch: Partial<ThemeCatalog[string]>) {
    onChange({ ...catalog, [id]: { ...catalog[id], ...patch } })
  }

  function addTheme() {
    const id = newId.trim()
    if (!id || catalog[id]) {
      return
    }
    onChange({ ...catalog, [id]: { label: id, value: 0, color: '#c9a84c' } })
    setNewId('')
  }

  function census(id: string) {
    const count = nodes.filter((n) => n.theme === id).length
    return { count, total: count * (catalog[id]?.value ?? 0) }
  }

  return (
    <div className="theme-manager-backdrop" onClick={onClose}>
      <div className="theme-manager-modal" onClick={(e) => e.stopPropagation()}>
        <button className="theme-manager-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="theme-manager-modal__title">Theme Catalog</h2>

        <table className="theme-manager-modal__table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Label</th>
              <th>Value</th>
              <th>Color</th>
              <th>Nodes</th>
              <th>Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {Object.entries(catalog).map(([id, entry]) => {
              const { count, total } = census(id)
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>
                    <input value={entry.label} onChange={(e) => updateEntry(id, { label: e.target.value })} />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={entry.value}
                      onChange={(e) => updateEntry(id, { value: Number(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="color"
                      value={entry.color}
                      onChange={(e) => updateEntry(id, { color: e.target.value })}
                    />
                  </td>
                  <td>{count}</td>
                  <td>{total}</td>
                  <td>
                    <button className="theme-manager-modal__small-btn" onClick={() => onDeleteTheme(id)}>
                      ×
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="theme-manager-modal__new-row">
          <input
            placeholder="new-theme-id"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTheme()
              }
            }}
          />
          <button className="theme-manager-modal__btn" onClick={addTheme}>
            Add Theme
          </button>
        </div>
      </div>
    </div>
  )
}
