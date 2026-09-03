import { Application, Container } from 'pixi.js'

export const NODE_RADIUS: Record<string, number> = {
  central: 14,
  travel: 5,
  small: 5,
  notable: 8,
  keystone: 12,
}

export const MIN_ZOOM = 0.3
export const MAX_ZOOM = 3.0
export const CLICK_THRESHOLD = 4

export interface HitCandidate {
  id: string
  x: number
  y: number
  radius: number
}

export async function initPixiApp(container: HTMLDivElement): Promise<Application> {
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
  return app
}

export abstract class TreeCanvasBase {
  protected readonly app: Application
  protected readonly world: Container

  protected camX: number
  protected camY: number
  protected camScale: number

  private readonly onWheelBound: (e: WheelEvent) => void
  private readonly onPointerDownBound: (e: PointerEvent) => void
  private readonly onPointerMoveBound: (e: PointerEvent) => void
  private readonly onPointerUpBound: (e: PointerEvent) => void

  protected constructor(app: Application) {
    this.app = app
    this.camX = app.screen.width / 2
    this.camY = app.screen.height / 2
    this.camScale = 1.2

    this.world = new Container()
    app.stage.addChild(this.world)

    this.onWheelBound = this.onWheel.bind(this)
    this.onPointerDownBound = this.onPointerDown.bind(this)
    this.onPointerMoveBound = this.onPointerMove.bind(this)
    this.onPointerUpBound = this.onPointerUp.bind(this)
    this.setupInput()
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
    const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.camScale * factor))
    if (newScale === this.camScale) {
      return
    }

    const canvas = this.app.canvas as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top
    const worldX = (localX - this.camX) / this.camScale
    const worldY = (localY - this.camY) / this.camScale

    this.camScale = newScale
    this.camX = localX - worldX * newScale
    this.camY = localY - worldY * newScale
    this.updateCamera()
  }

  protected abstract onPointerDown(e: PointerEvent): void
  protected abstract onPointerMove(e: PointerEvent): void
  protected abstract onPointerUp(e: PointerEvent): void

  protected updateCamera() {
    this.world.x = this.camX
    this.world.y = this.camY
    this.world.scale.set(this.camScale)
  }

  protected screenToWorld(clientX: number, clientY: number): { x: number; y: number } {
    const canvas = this.app.canvas as HTMLCanvasElement
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left - this.camX) / this.camScale,
      y: (clientY - rect.top - this.camY) / this.camScale,
    }
  }

  protected hitTest(clientX: number, clientY: number, candidates: HitCandidate[]): string | null {
    const { x: worldX, y: worldY } = this.screenToWorld(clientX, clientY)

    let closest: string | null = null
    let closestDist = Infinity

    for (const c of candidates) {
      const minR = Math.max(c.radius, 8)
      const dx = worldX - c.x
      const dy = worldY - c.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= minR && dist < closestDist) {
        closest = c.id
        closestDist = dist
      }
    }
    return closest
  }

  destroy() {
    const canvas = this.app.canvas as HTMLCanvasElement
    canvas.removeEventListener('wheel', this.onWheelBound)
    canvas.removeEventListener('pointerdown', this.onPointerDownBound)
    window.removeEventListener('pointermove', this.onPointerMoveBound)
    window.removeEventListener('pointerup', this.onPointerUpBound)
    canvas.parentElement?.removeChild(canvas)
    this.app.destroy(true, { children: true })
  }
}
