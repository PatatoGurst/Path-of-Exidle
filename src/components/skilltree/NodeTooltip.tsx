import { createPortal } from 'react-dom'
import type { BaseValues, NodeMap } from '../../types/skilltree'
import { computeNodeState, formatEffects, getNodeTypeName } from '../../lib/treeData'
import './NodeTooltip.css'

interface Props {
  nodeId: string
  clientX: number
  clientY: number
  nodeMap: NodeMap
  baseValues: BaseValues
  allocated: Set<string>
}

const STATE_LABEL: Record<string, string> = {
  allocated: 'Allocated',
  available: 'Available',
  locked: 'Locked',
}

export function NodeTooltip({ nodeId, clientX, clientY, nodeMap, baseValues, allocated }: Props) {
  const node = nodeMap.get(nodeId)
  if (!node) {
    return null
  }

  const state = computeNodeState(nodeId, allocated, nodeMap)
  const effects = formatEffects(node, baseValues)

  const top = clientY + 14
  const left = clientX + 16

  return createPortal(
    <div
      className={`node-tooltip node-tooltip--${state}`}
      style={{ top, left }}
    >
      <div className="node-tooltip__name">{node.label}</div>
      <div className="node-tooltip__meta">
        <span className={`node-tooltip__type node-tooltip__type--${node.type}`}>
          {getNodeTypeName(node.type)}
        </span>
        <span className={`node-tooltip__state node-tooltip__state--${state}`}>
          {STATE_LABEL[state]}
        </span>
      </div>
      {effects.length > 0 && (
        <ul className="node-tooltip__effects">
          {effects.map((line, i) => (
            <li key={i} className="node-tooltip__effect">
              {line}
            </li>
          ))}
        </ul>
      )}
      {node.type !== 'central' && state !== 'allocated' && (
        <div className="node-tooltip__cost">Cost: 1 Skill Point</div>
      )}
    </div>,
    document.body,
  )
}