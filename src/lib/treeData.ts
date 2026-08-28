import rawTree from '@data/nodes/main_tree.json'
import rawBase from '@data/nodes/base_values.json'
import type { TreeData, BaseValues, TreeNode, NodeMap, NodeState, NodeType } from '../types/skilltree'

export const treeData: TreeData = rawTree as unknown as TreeData
export const baseValues: BaseValues = rawBase as unknown as BaseValues

export function buildNodeMap(data: TreeData): NodeMap {
  return new Map(data.nodes.map((n) => [n.id, n]))
}

export function computeNodeState(nodeId: string, allocated: Set<string>, nodeMap: NodeMap): NodeState {
  if (allocated.has(nodeId)) {
    return 'allocated'
  }
  const node = nodeMap.get(nodeId)
  if (!node) {
    return 'locked'
  }
  for (const edgeId of node.edges) {
    if (allocated.has(edgeId)) {
      return 'available'
    }
  }
  return 'locked'
}

export function canRefund(nodeId: string, allocated: Set<string>, nodeMap: NodeMap): boolean {
  if (nodeId === 'root') {
    return false
  }
  const remaining = new Set(allocated)
  remaining.delete(nodeId)

  const reachable = new Set<string>()
  const queue: string[] = ['root']
  while (queue.length > 0) {
    const current = queue.shift()!
    if (reachable.has(current)) {
      continue
    }
    reachable.add(current)
    const node = nodeMap.get(current)
    if (!node) {
      continue
    }
    for (const neighbor of node.edges) {
      if (remaining.has(neighbor) && !reachable.has(neighbor)) {
        queue.push(neighbor)
      }
    }
  }

  for (const id of remaining) {
    if (!reachable.has(id)) {
      return false
    }
  }
  return true
}

export function formatEffects(node: TreeNode, base: BaseValues): string[] {
  return node.effects
    .map((effect) => {
      if (effect.custom) {
        return effect.description ?? ''
      }
      if (!effect.effectId) {
        return ''
      }
      const entry = base[effect.effectId]
      if (!entry) {
        return effect.effectId
      }
      const value =
        node.type === 'notable' || node.type === 'central'
          ? entry.notableValue
          : entry.smallValue
      if (entry.modifier === 'flat') {
        return `+${value} ${entry.label}`
      }
      return `${value}% increased ${entry.label}`
    })
    .filter(Boolean)
}

export function getNodeTypeName(type: NodeType): string {
  switch (type) {
    case 'central':
      return 'Starting Node'
    case 'travel':
      return 'Travel'
    case 'small':
      return 'Small'
    case 'notable':
      return 'Notable'
    case 'keystone':
      return 'Keystone'
  }
}