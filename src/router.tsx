import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import App from './App'
import { CharacterPage } from './pages/CharacterPage'
import { InventoryPage } from './pages/InventoryPage'
import { MapPage } from './pages/MapPage'
import { OptionsPage } from './pages/OptionsPage'
import { SkillTreePage } from './pages/SkillTreePage'
import { TreeEditorPage } from './pages/TreeEditorPage'

const rootRoute = createRootRoute({ component: App })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/map' })
  },
})

const characterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character',
  component: CharacterPage,
})

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryPage,
})

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: MapPage,
})

const skillTreeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/skill-tree',
  component: SkillTreePage,
})

const optionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/options',
  component: OptionsPage,
})

const treeEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dev/tree-editor',
  component: TreeEditorPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  characterRoute,
  inventoryRoute,
  mapRoute,
  skillTreeRoute,
  optionsRoute,
  ...(import.meta.env.DEV ? [treeEditorRoute] : []),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
