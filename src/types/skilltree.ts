export type NodeType = 'central' | 'travel' | 'small' | 'notable' | 'keystone'
export type NodeState = 'allocated' | 'available' | 'locked'
export type NodeRegion = 'center' | 'str' | 'int' | 'dex' | 'str_int' | 'str_dex' | 'dex_int'

export interface NodeEffect {
  effectId?: string
  custom?: true
  label?: string
  description?: string
}

export interface TreeNode {
  id: string
  type: NodeType
  label: string
  x: number
  y: number
  region: NodeRegion
  description: string
  effects: NodeEffect[]
  edges: string[]
  unlockCondition: null
}

export interface TreeData {
  id: string
  version: string
  metadata: {
    startNodeId: string
    canvasWidth: number
    canvasHeight: number
  }
  nodes: TreeNode[]
}

export interface BaseValueEntry {
  stat: string
  modifier: 'flat' | 'increased'
  smallValue: number
  notableValue: number
  label: string
  unit: string
}

export type BaseValues = Record<string, BaseValueEntry>
export type NodeMap = Map<string, TreeNode>