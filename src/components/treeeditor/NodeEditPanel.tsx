import { useState } from 'react'
import type { BaseValues, NodeEffect, NodeRegion, NodeType, ThemeCatalog, TreeNode } from '../../types/skilltree'
import './NodeEditPanel.css'

const NODE_TYPES: NodeType[] = ['central', 'travel', 'small', 'notable', 'keystone']
const NODE_REGIONS: NodeRegion[] = ['center', 'str', 'int', 'dex', 'str_int', 'str_dex', 'dex_int']

interface Props {
  node: TreeNode
  baseValues: BaseValues
  themeCatalog: ThemeCatalog
  onChange: (patch: Partial<TreeNode>) => void
  onRename: (newId: string) => void
  onRemoveEdge: (neighborId: string) => void
  onClose: () => void
}

export function NodeEditPanel({ node, baseValues, themeCatalog, onChange, onRename, onRemoveEdge, onClose }: Props) {
  const [idDraft, setIdDraft] = useState(node.id)

  function commitId() {
    if (idDraft.trim() && idDraft !== node.id) {
      onRename(idDraft.trim())
    } else {
      setIdDraft(node.id)
    }
  }

  function updateEffect(index: number, patch: Partial<NodeEffect>) {
    const effects = node.effects.map((eff, i) => (i === index ? { ...eff, ...patch } : eff))
    onChange({ effects })
  }

  function removeEffect(index: number) {
    onChange({ effects: node.effects.filter((_, i) => i !== index) })
  }

  function addEffect() {
    onChange({ effects: [...node.effects, { custom: true, label: '', description: '' }] })
  }

  return (
    <div className="node-edit-panel">
      <button className="node-edit-panel__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <label className="node-edit-panel__field">
        <span>Id</span>
        <input
          value={idDraft}
          onChange={(e) => setIdDraft(e.target.value)}
          onBlur={commitId}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }
          }}
        />
      </label>

      <label className="node-edit-panel__field">
        <span>Type</span>
        <select value={node.type} onChange={(e) => onChange({ type: e.target.value as NodeType })}>
          {NODE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="node-edit-panel__field">
        <span>Label</span>
        <input value={node.label} onChange={(e) => onChange({ label: e.target.value })} />
      </label>

      <div className="node-edit-panel__row">
        <label className="node-edit-panel__field">
          <span>X</span>
          <input
            type="number"
            value={Math.round(node.x)}
            onChange={(e) => onChange({ x: Number(e.target.value) })}
          />
        </label>
        <label className="node-edit-panel__field">
          <span>Y</span>
          <input
            type="number"
            value={Math.round(node.y)}
            onChange={(e) => onChange({ y: Number(e.target.value) })}
          />
        </label>
      </div>

      <label className="node-edit-panel__field">
        <span>Region</span>
        <select value={node.region} onChange={(e) => onChange({ region: e.target.value as NodeRegion })}>
          {NODE_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="node-edit-panel__field">
        <span>Theme</span>
        <select value={node.theme ?? ''} onChange={(e) => onChange({ theme: e.target.value || undefined })}>
          <option value="">None</option>
          {Object.entries(themeCatalog).map(([id, entry]) => (
            <option key={id} value={id}>
              {entry.label}
            </option>
          ))}
        </select>
      </label>

      <label className="node-edit-panel__field">
        <span>Description</span>
        <textarea value={node.description} onChange={(e) => onChange({ description: e.target.value })} rows={3} />
      </label>

      <div className="node-edit-panel__section">
        <div className="node-edit-panel__section-header">
          <span>Effects</span>
          <button className="node-edit-panel__small-btn" onClick={addEffect}>
            + Add
          </button>
        </div>
        {node.effects.map((effect, i) => (
          <div key={i} className="node-edit-panel__effect-row">
            <select
              value={effect.custom ? 'custom' : (effect.effectId ?? '')}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  updateEffect(i, { custom: true, effectId: undefined, label: '', description: '' })
                } else {
                  updateEffect(i, { custom: undefined, effectId: e.target.value, label: undefined, description: undefined })
                }
              }}
            >
              <option value="custom">Custom</option>
              {Object.keys(baseValues).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            {effect.custom && (
              <input
                placeholder="Description"
                value={effect.description ?? ''}
                onChange={(e) => updateEffect(i, { description: e.target.value })}
              />
            )}
            <button className="node-edit-panel__small-btn" onClick={() => removeEffect(i)}>
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="node-edit-panel__section">
        <div className="node-edit-panel__section-header">
          <span>Edges ({node.edges.length})</span>
        </div>
        {node.edges.map((neighborId) => (
          <div key={neighborId} className="node-edit-panel__edge-row">
            <span>{neighborId}</span>
            <button className="node-edit-panel__small-btn" onClick={() => onRemoveEdge(neighborId)}>
              ×
            </button>
          </div>
        ))}
        {node.edges.length === 0 && <p className="node-edit-panel__hint">Shift+click another node on the canvas to connect.</p>}
      </div>
    </div>
  )
}
