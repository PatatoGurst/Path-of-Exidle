import type { NodeType, TreeData, TreeNode } from '../types/skilltree'

export function nextNodeId(nodes: TreeNode[]): string {
  const existing = new Set(nodes.map((n) => n.id))
  let i = nodes.length + 1
  let id = `node_${i}`
  while (existing.has(id)) {
    i += 1
    id = `node_${i}`
  }
  return id
}

export function createNode(data: TreeData, x: number, y: number, type: NodeType): TreeData {
  const node: TreeNode = {
    id: nextNodeId(data.nodes),
    type,
    label: 'New Node',
    x,
    y,
    region: 'center',
    description: '',
    effects: [],
    edges: [],
    unlockCondition: null,
  }
  return { ...data, nodes: [...data.nodes, node] }
}

export function deleteNode(data: TreeData, nodeId: string): TreeData {
  if (nodeId === data.metadata.startNodeId) {
    throw new Error('Cannot delete the start node')
  }
  const nodes = data.nodes
    .filter((n) => n.id !== nodeId)
    .map((n) => (n.edges.includes(nodeId) ? { ...n, edges: n.edges.filter((e) => e !== nodeId) } : n))
  return { ...data, nodes }
}

export function toggleEdge(data: TreeData, aId: string, bId: string): TreeData {
  if (aId === bId) {
    return data
  }
  const nodes = data.nodes.map((n) => {
    if (n.id === aId) {
      const has = n.edges.includes(bId)
      return { ...n, edges: has ? n.edges.filter((e) => e !== bId) : [...n.edges, bId] }
    }
    if (n.id === bId) {
      const has = n.edges.includes(aId)
      return { ...n, edges: has ? n.edges.filter((e) => e !== aId) : [...n.edges, aId] }
    }
    return n
  })
  return { ...data, nodes }
}

export function renameNodeId(data: TreeData, oldId: string, newId: string): TreeData {
  if (oldId === newId) {
    return data
  }
  if (data.nodes.some((n) => n.id === newId)) {
    throw new Error(`Node id "${newId}" already exists`)
  }
  const nodes = data.nodes.map((n) => ({
    ...n,
    id: n.id === oldId ? newId : n.id,
    edges: n.edges.map((e) => (e === oldId ? newId : e)),
  }))
  const metadata =
    data.metadata.startNodeId === oldId ? { ...data.metadata, startNodeId: newId } : data.metadata
  return { ...data, nodes, metadata }
}

export function validateTreeData(data: TreeData): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const node of data.nodes) {
    if (ids.has(node.id)) {
      errors.push(`Duplicate node id: ${node.id}`)
    }
    ids.add(node.id)
  }
  if (!ids.has(data.metadata.startNodeId)) {
    errors.push(`Start node "${data.metadata.startNodeId}" does not exist`)
  }
  for (const node of data.nodes) {
    for (const edgeId of node.edges) {
      if (!ids.has(edgeId)) {
        errors.push(`Node "${node.id}" has an edge to unknown node "${edgeId}"`)
      }
    }
  }
  return errors
}
