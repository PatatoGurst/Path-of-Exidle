import { Application, Container, Graphics, Text } from 'pixi.js'
import type { FederatedPointerEvent } from 'pixi.js'
import type { TreeData, TreeNode, NodeState } from '../../types/skilltree'
import { buildNodeMap, computeNodeState } from '../../lib/treeData'
import type { NodeMap } from '../../types/skilltree'

const NODE_RADIUS: Record<string, number> = {
  central: 14,
  travel: 5,
  small: 5,
  notable: 8,
  keystone: 12,
}

const MIN_ZOOM = 0.3
const MAX_ZOOM = 3.0
const CLICK_THRESHOLD = 4

const COLOR_EDGE_LOCKED = 0x4a4638
const COLOR_EDGE_ALLOCATED = 0xd4a030

export class TreeRenderer {
  private readonly app: Application
  private readonly world: Container
  private readonly edgeLockedGfx: Graphics
  private readonly edgeAllocatedGfx: Graphics
  private readonly nodeGfxMap: Map<string, Graphics>
  private readonly nodeLabelMap: Map<string, Text>
  private readonly data: TreeData
  private readonly nodeMap: NodeMap

  private allocated: Set<string>
  private camX: number
  private camY: number
  private camScale: number

  private isDragging = false
  private dragStartClientX = 0
  private dragStartClientY = 0
  private dragStartCamX = 0
  private dragStartCamY = 0
  private dragDist = 0
  private lastClickNodeId: string | null = null
  private lastClickTime = 0

  onHover?: (nodeId: string | null, clientX: number, clientY: number) => void
  onClick?: (nodeId: string) => void
  onDoubleClick?: (nodeId: string) => void

  private readonly onWheelBound: (e: WheelEvent) => void
  private readonly onPointerDownBound: (e: PointerEvent) => void
  private readonly onPointerMoveBound: (e: PointerEvent) => void
  private readonly onPointerUpBound: (e: PointerEvent) => void

  static async create(container: HTMLDivElement, data: TreeData): Promise<TreeRenderer> {
    const app = new Application()
    await app.init({
      background: 0x0c0b09,
      resizeTo: container,
      antialias: true,
      autoDensity: true,
    })
    const canvas = app.canvas as HTMLCanvasElement
    canvas.style.display = 'block'
    container.appendChild(canvas)
    return new TreeRenderer(app, data)
  }

  private constructor(app: Application, data: TreeData) {
    this.app = app
    this.data = data
    this.nodeMap = buildNodeMap(data)
    this.allocated = new Set(['root'])

    this.camX = app.screen.width / 2
    this.camY = app.screen.height / 2
    this.camScale = 1.2

    this.world = new Container()
    app.stage.addChild(this.world)

    this.edgeLockedGfx = new Graphics()
    this.edgeAllocatedGfx = new Graphics()
    this.world.addChild(this.edgeLockedGfx)
    this.world.addChild(this.edgeAllocatedGfx)

    const nodeLayer = new Container()
    const labelLayer = new Container()
    this.world.addChild(nodeLayer)
    this.world.addChild(labelLayer)

    this.nodeGfxMap = new Map()
    this.nodeLabelMap = new Map()

    for (const node of data.nodes) {
      const gfx = new Graphics()
      gfx.eventMode = 'static'
      gfx.cursor = 'pointer'

      const { id } = node
      gfx.on('pointerover', (e) => {
        if (this.isDragging) {
          return
        }
        const fe = e as FederatedPointerEvent
        this.onHover?.(id, fe.clientX, fe.clientY)
      })
      gfx.on('pointerout', () => {
        if (this.isDragging) {
          return
        }
        this.onHover?.(null, 0, 0)
      })

      this.nodeGfxMap.set(id, gfx)
      nodeLayer.addChild(gfx)

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
        this.nodeLabelMap.set(id, label)
        labelLayer.addChild(label)
      }
    }

    this.onWheelBound = this.onWheel.bind(this)
    this.onPointerDownBound = this.onPointerDown.bind(this)
    this.onPointerMoveBound = this.onPointerMove.bind(this)
    this.onPointerUpBound = this.onPointerUp.bind(this)

    this.setupInput()
    this.updateCamera()
    this.render()
  }

  private setupInput() {
    const canvas = this.app.canvas as HTMLCanvasElement
    canvas.addEventListener('wheel', this.onWheelBound, { passive: false })
    canvas.addEventListener('pointerdown', this.onPointerDownBound)
    window.addEventListener('pointermove', this.onPointerMoveBound)
    window.addEventListener('pointerup', this.onPointerUpBound)
  }

  private onWheel(e: WheelEvent) {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    this.camScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.camScale * factor))
    this.updateCamera()
  }

  private onPointerDown(e: PointerEvent) {
    if (e.button !== 0) {
      return
    }
    this.isDragging = true
    this.dragDist = 0
    this.dragStartClientX = e.clientX
    this.dragStartClientY = e.clientY
    this.dragStartCamX = this.camX
    this.dragStartCamY = this.camY
    this.onHover?.(null, 0, 0)
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.isDragging) {
      return
    }
    const dx = e.clientX - this.dragStartClientX
    const dy = e.clientY - this.dragStartClientY
    this.dragDist = Math.sqrt(dx * dx + dy * dy)
    this.camX = this.dragStartCamX + dx
    this.camY = this.dragStartCamY + dy
    this.updateCamera()
  }

  private onPointerUp(e: PointerEvent) {
    if (!this.isDragging) {
      return
    }
    this.isDragging = false
    if (this.dragDist < CLICK_THRESHOLD) {
      const node = this.hitTest(e.clientX, e.clientY)
      if (node) {
        const now = Date.now()
        const isDouble = node.id === this.lastClickNodeId && now - this.lastClickTime < 300
        if (isDouble) {
          this.onDoubleClick?.(node.id)
          this.lastClickNodeId = null
          this.lastClickTime = 0
        } else {
          this.onClick?.(node.id)
          this.lastClickNodeId = node.id
          this.lastClickTime = now
        }
      } else {
        this.lastClickNodeId = null
      }
    }
  }

  private hitTest(clientX: number, clientY: number): TreeNode | null {
    const canvas = this.app.canvas as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const worldX = (clientX - rect.left - this.camX) / this.camScale
    const worldY = (clientY - rect.top - this.camY) / this.camScale

    let closest: TreeNode | null = null
    let closestDist = Infinity

    for (const node of this.data.nodes) {
      const minR = Math.max(NODE_RADIUS[node.type], 8)
      const dx = worldX - node.x
      const dy = worldY - node.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= minR && dist < closestDist) {
        closest = node
        closestDist = dist
      }
    }
    return closest
  }

  private updateCamera() {
    this.world.x = this.camX
    this.world.y = this.camY
    this.world.scale.set(this.camScale)
  }

  updateAllocation(allocated: Set<string>) {
    this.allocated = allocated
    this.render()
  }

  private render() {
    this.renderEdges()
    this.renderNodes()
  }

  private renderEdges() {
    this.edgeLockedGfx.clear()
    this.edgeAllocatedGfx.clear()

    const seen = new Set<string>()

    for (const node of this.data.nodes) {
      for (const neighborId of node.edges) {
        const key =
          node.id < neighborId ? `${node.id}|${neighborId}` : `${neighborId}|${node.id}`
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

        const bothAllocated =
          this.allocated.has(node.id) && this.allocated.has(neighborId)
        const target = bothAllocated ? this.edgeAllocatedGfx : this.edgeLockedGfx
        target.moveTo(startX, startY).lineTo(endX, endY)
      }
    }

    this.edgeLockedGfx.stroke({ color: COLOR_EDGE_LOCKED, width: 1.5 })
    this.edgeAllocatedGfx.stroke({ color: COLOR_EDGE_ALLOCATED, width: 2.5 })
  }

  private renderNodes() {
    for (const node of this.data.nodes) {
      const gfx = this.nodeGfxMap.get(node.id)!
      const state = computeNodeState(node.id, this.allocated, this.nodeMap)
      this.drawNode(gfx, node, state)
      this.updateLabel(node.id, state)
    }
  }

  private drawNode(gfx: Graphics, node: TreeNode, state: NodeState) {
    gfx.clear()

    const r = NODE_RADIUS[node.type]
    const isKeystone = node.type === 'keystone'
    const isCentral = node.type === 'central'

    const fillColor = isCentral
      ? 0x4a3c1a
      : state === 'allocated'
        ? isKeystone
          ? 0x4a1208
          : 0x4a3c1a
        : state === 'available'
          ? 0x2a2618
          : 0x1a1812

    const strokeColor = isCentral
      ? 0xf0e090
      : state === 'allocated'
        ? isKeystone
          ? 0xff7040
          : 0xf0c860
        : state === 'available'
          ? 0xb09040
          : 0x706858

    const strokeWidth = isCentral ? 2.5 : state === 'allocated' ? 2.5 : 1.5

    if (isCentral) {
      gfx
        .circle(node.x, node.y, r)
        .fill({ color: fillColor })
        .stroke({ color: strokeColor, width: strokeWidth })
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
      gfx
        .circle(node.x, node.y, r)
        .fill({ color: fillColor })
        .stroke({ color: strokeColor, width: strokeWidth })
    }
  }

  private updateLabel(nodeId: string, state: NodeState) {
    const label = this.nodeLabelMap.get(nodeId)
    if (!label) {
      return
    }
    label.tint =
      state === 'allocated' ? 0xf0c860 : state === 'available' ? 0xb09040 : 0x706858
  }

  destroy() {
    const canvas = this.app.canvas as HTMLCanvasElement
    canvas.removeEventListener('wheel', this.onWheelBound)
    canvas.removeEventListener('pointerdown', this.onPointerDownBound)
    window.removeEventListener('pointermove', this.onPointerMoveBound)
    window.removeEventListener('pointerup', this.onPointerUpBound)
    canvas.parentElement?.removeChild(canvas)
    this.app.destroy(true)
  }
}