import { Application, Container, Graphics, Text } from 'pixi.js'
import type { TreeData, NodeMap, ThemeCatalog } from '../../types/skilltree'
import { buildNodeMap } from '../../lib/treeData'
import { TreeCanvasBase, NODE_RADIUS, CLICK_THRESHOLD, initPixiApp } from '../skilltree/TreeCanvasBase'
import type { HitCandidate } from '../skilltree/TreeCanvasBase'

export type EditorMode = 'select' | 'add-node'

const COLOR_EDGE = 0x6b5a30
const COLOR_EDGE_HIGHLIGHT = 0xd4a030
const COLOR_FILL = 0x2a2618
const COLOR_STROKE = 0xb09040
const COLOR_FILL_SELECTED = 0x4a3c1a
const COLOR_STROKE_SELECTED = 0xf0c860

function hexToNumber(hex: string, fallback = 0xffffff): number {
  const n = parseInt(hex.replace('#', ''), 16)
  return Number.isNaN(n) ? fallback : n
}

export class TreeEditorRenderer extends TreeCanvasBase {
  private data: TreeData
  private nodeMap: NodeMap
  private themeCatalog: ThemeCatalog = {}
  private showThemes = false
  private selectedNodeId: string | null = null
  private mode: EditorMode = 'select'

  private readonly edgeGfx: Graphics
  private readonly nodeLayer: Container
  private readonly labelLayer: Container
  private nodeGfxMap: Map<string, Graphics> = new Map()
  private nodeLabelMap: Map<string, Text> = new Map()

  private draggingNodeId: string | null = null
  private dragNodeOrigX = 0
  private dragNodeOrigY = 0
  private dragNodeStartWorldX = 0
  private dragNodeStartWorldY = 0

  private isPanning = false
  private dragStartClientX = 0
  private dragStartClientY = 0
  private dragStartCamX = 0
  private dragStartCamY = 0
  private dragDist = 0

  onSelect?: (nodeId: string | null) => void
  onNodeDragEnd?: (nodeId: string, x: number, y: number) => void
  onToggleEdge?: (aId: string, bId: string) => void
  onCanvasClick?: (x: number, y: number) => void

  static async create(container: HTMLDivElement, data: TreeData): Promise<TreeEditorRenderer> {
    const app = await initPixiApp(container)
    return new TreeEditorRenderer(app, data)
  }

  private constructor(app: Application, data: TreeData) {
    super(app)
    this.data = structuredClone(data)
    this.nodeMap = buildNodeMap(this.data)

    this.edgeGfx = new Graphics()
    this.world.addChild(this.edgeGfx)

    this.nodeLayer = new Container()
    this.labelLayer = new Container()
    this.world.addChild(this.nodeLayer)
    this.world.addChild(this.labelLayer)

    this.rebuildGraphics()
    this.updateCamera()
    this.render()
  }

  setData(data: TreeData) {
    this.data = structuredClone(data)
    this.nodeMap = buildNodeMap(this.data)
    this.rebuildGraphics()
    this.render()
  }

  setSelection(nodeId: string | null) {
    this.selectedNodeId = nodeId
    this.render()
  }

  setMode(mode: EditorMode) {
    this.mode = mode
    const canvas = this.app.canvas as HTMLCanvasElement
    canvas.style.cursor = mode === 'add-node' ? 'crosshair' : 'default'
  }

  setShowThemes(show: boolean) {
    this.showThemes = show
    this.render()
  }

  setThemeCatalog(catalog: ThemeCatalog) {
    this.themeCatalog = catalog
    this.render()
  }

  private rebuildGraphics() {
    for (const gfx of this.nodeLayer.removeChildren()) {
      gfx.destroy()
    }
    for (const label of this.labelLayer.removeChildren()) {
      label.destroy()
    }
    this.nodeGfxMap = new Map()
    this.nodeLabelMap = new Map()

    for (const node of this.data.nodes) {
      const gfx = new Graphics()
      this.nodeGfxMap.set(node.id, gfx)
      this.nodeLayer.addChild(gfx)

      if (node.type === 'notable' || node.type === 'keystone' || node.type === 'central') {
        const label = new Text({
          text: node.label,
          style: {
            fontSize: 10,
            fill: 0xffffff,
            align: 'center' as const,
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            wordWrap: true,
            wordWrapWidth: 72,
          },
        })
        label.anchor.set(0.5, 0)
        label.x = node.x
        label.y = node.y + NODE_RADIUS[node.type] + 3
        this.nodeLabelMap.set(node.id, label)
        this.labelLayer.addChild(label)
      }
    }
  }

  protected onPointerDown(e: PointerEvent) {
    if (e.button !== 0) {
      return
    }
    this.isPanning = true
    this.dragDist = 0
    this.dragStartClientX = e.clientX
    this.dragStartClientY = e.clientY
    this.dragStartCamX = this.camX
    this.dragStartCamY = this.camY

    const nodeId = this.hitTestNodes(e.clientX, e.clientY)
    if (nodeId && nodeId === this.selectedNodeId && this.mode === 'select') {
      const node = this.nodeMap.get(nodeId)
      if (node) {
        this.draggingNodeId = nodeId
        this.dragNodeOrigX = node.x
        this.dragNodeOrigY = node.y
        const world = this.screenToWorld(e.clientX, e.clientY)
        this.dragNodeStartWorldX = world.x
        this.dragNodeStartWorldY = world.y
      }
    }
  }

  protected onPointerMove(e: PointerEvent) {
    if (this.draggingNodeId) {
      const world = this.screenToWorld(e.clientX, e.clientY)
      const dx = world.x - this.dragNodeStartWorldX
      const dy = world.y - this.dragNodeStartWorldY
      const node = this.nodeMap.get(this.draggingNodeId)
      if (node) {
        node.x = this.dragNodeOrigX + dx
        node.y = this.dragNodeOrigY + dy
        this.render()
      }
      return
    }

    if (!this.isPanning) {
      return
    }
    const dx = e.clientX - this.dragStartClientX
    const dy = e.clientY - this.dragStartClientY
    this.dragDist = Math.sqrt(dx * dx + dy * dy)
    this.camX = this.dragStartCamX + dx
    this.camY = this.dragStartCamY + dy
    this.updateCamera()
  }

  protected onPointerUp(e: PointerEvent) {
    if (this.draggingNodeId) {
      const node = this.nodeMap.get(this.draggingNodeId)
      if (node) {
        this.onNodeDragEnd?.(this.draggingNodeId, node.x, node.y)
      }
      this.draggingNodeId = null
      this.isPanning = false
      return
    }

    if (!this.isPanning) {
      return
    }
    this.isPanning = false

    if (this.dragDist >= CLICK_THRESHOLD) {
      return
    }

    const nodeId = this.hitTestNodes(e.clientX, e.clientY)

    if (this.mode === 'add-node') {
      if (nodeId) {
        this.onSelect?.(nodeId)
      } else {
        const world = this.screenToWorld(e.clientX, e.clientY)
        this.onCanvasClick?.(world.x, world.y)
      }
      return
    }

    if (nodeId) {
      if (e.shiftKey && this.selectedNodeId && this.selectedNodeId !== nodeId) {
        this.onToggleEdge?.(this.selectedNodeId, nodeId)
      } else {
        this.onSelect?.(nodeId)
      }
    } else {
      this.onSelect?.(null)
    }
  }

  private hitTestNodes(clientX: number, clientY: number): string | null {
    const candidates: HitCandidate[] = this.data.nodes.map((n) => ({
      id: n.id,
      x: n.x,
      y: n.y,
      radius: NODE_RADIUS[n.type],
    }))
    return this.hitTest(clientX, clientY, candidates)
  }

  private render() {
    this.renderEdges()
    this.renderNodes()
  }

  private renderEdges() {
    this.edgeGfx.clear()
    const seen = new Set<string>()

    for (const node of this.data.nodes) {
      for (const neighborId of node.edges) {
        const key = node.id < neighborId ? `${node.id}|${neighborId}` : `${neighborId}|${node.id}`
        if (seen.has(key)) {
          continue
        }
        seen.add(key)

        const neighbor = this.nodeMap.get(neighborId)
        if (!neighbor) {
          continue
        }

        const startR = NODE_RADIUS[node.type]
        const endR = NODE_RADIUS[neighbor.type]
        const dx = neighbor.x - node.x
        const dy = neighbor.y - node.y
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len === 0) {
          continue
        }
        const nx = dx / len
        const ny = dy / len
        const startX = node.x + nx * startR
        const startY = node.y + ny * startR
        const endX = neighbor.x - nx * endR
        const endY = neighbor.y - ny * endR

        const highlighted = this.selectedNodeId === node.id || this.selectedNodeId === neighborId
        const color = highlighted ? COLOR_EDGE_HIGHLIGHT : COLOR_EDGE
        const width = highlighted ? 2.5 : 1.5
        this.edgeGfx.moveTo(startX, startY).lineTo(endX, endY).stroke({ color, width })
      }
    }
  }

  private renderNodes() {
    for (const node of this.data.nodes) {
      const gfx = this.nodeGfxMap.get(node.id)
      if (!gfx) {
        continue
      }
      gfx.clear()

      const r = NODE_RADIUS[node.type]
      const isKeystone = node.type === 'keystone'
      const isCentral = node.type === 'central'
      const isSelected = node.id === this.selectedNodeId

      const fillColor = isSelected ? COLOR_FILL_SELECTED : COLOR_FILL
      const strokeColor = isSelected ? COLOR_STROKE_SELECTED : COLOR_STROKE
      const strokeWidth = isSelected ? 2.5 : 1.5

      if (isCentral) {
        gfx.circle(node.x, node.y, r).fill({ color: fillColor }).stroke({ color: strokeColor, width: strokeWidth })
        gfx.circle(node.x, node.y, r - 5).stroke({ color: strokeColor, width: 1 })
      } else if (isKeystone) {
        gfx
          .moveTo(node.x, node.y - r)
          .lineTo(node.x + r, node.y)
          .lineTo(node.x, node.y + r)
          .lineTo(node.x - r, node.y)
          .closePath()
          .fill({ color: fillColor })
          .stroke({ color: strokeColor, width: strokeWidth })
      } else {
        gfx.circle(node.x, node.y, r).fill({ color: fillColor }).stroke({ color: strokeColor, width: strokeWidth })
      }

      if (this.showThemes && node.theme && this.themeCatalog[node.theme]) {
        const themeColor = hexToNumber(this.themeCatalog[node.theme].color)
        gfx.circle(node.x, node.y, r + 4).stroke({ color: themeColor, width: 2 })
      }

      const label = this.nodeLabelMap.get(node.id)
      if (label) {
        label.tint = isSelected ? COLOR_STROKE_SELECTED : COLOR_STROKE
      }
    }
  }
}
