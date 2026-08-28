import { useEffect } from 'react'
import type { BaseValues, NodeMap } from '../../types/skilltree'
import { computeNodeState, canRefund, formatEffects, getNodeTypeName } from '../../lib/treeData'
import './NodeConfirmPanel.css'

interface Props {
  nodeId: string
  nodeMap: NodeMap
  baseValues: BaseValues
  allocated: Set<string>
  skillPoints: number
  respecPoints: number
  onAllocate: (nodeId: string) => void
  onRefund: (nodeId: string) => void
  onClose: () => void
}

export function NodeConfirmPanel({
  nodeId,
  nodeMap,
  baseValues,
  allocated,
  skillPoints,
  respecPoints,
  onAllocate,
  onRefund,
  onClose,
}: Props) {
  const node = nodeMap.get(nodeId)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!node) {
    return null
  }

  const state = computeNodeState(nodeId, allocated, nodeMap)
  const effects = formatEffects(node, baseValues)
  const bridgeBlock = state === 'allocated' && nodeId !== 'root' && !canRefund(nodeId, allocated, nodeMap)

  return (
    <div className="node-confirm-panel">
      <button className="node-confirm-panel__close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <div className="node-confirm-panel__type-badge">
        <span className={`ncp-type ncp-type--${node.type}`}>{getNodeTypeName(node.type)}</span>
      </div>

      <h2 className="node-confirm-panel__name">{node.label}</h2>

      {effects.length > 0 && (
        <ul className="node-confirm-panel__effects">
          {effects.map((line, i) => (
            <li key={i} className="node-confirm-panel__effect">
              {line}
            </li>
          ))}
        </ul>
      )}

      {node.type === 'central' && (
        <p className="node-confirm-panel__note">This is the starting node. It cannot be refunded.</p>
      )}

      {node.type !== 'central' && (
        <div className="node-confirm-panel__actions">
          {state === 'available' && (
            <button
              className="node-confirm-panel__btn node-confirm-panel__btn--allocate"
              disabled={skillPoints <= 0}
              onClick={() => onAllocate(nodeId)}
            >
              Allocate
              <span className="node-confirm-panel__cost">1 Skill Point</span>
            </button>
          )}

          {state === 'allocated' && nodeId !== 'root' && (
            <button
              className="node-confirm-panel__btn node-confirm-panel__btn--refund"
              disabled={respecPoints <= 0 || bridgeBlock}
              onClick={() => onRefund(nodeId)}
            >
              Refund
              <span className="node-confirm-panel__cost">1 Respec Point</span>
            </button>
          )}

          {state === 'locked' && (
            <p className="node-confirm-panel__note">Not reachable with current allocations.</p>
          )}

          {bridgeBlock && (
            <p className="node-confirm-panel__note node-confirm-panel__note--warn">
              Cannot refund — removing this node would disconnect other allocated nodes.
            </p>
          )}
        </div>
      )}
    </div>
  )
}