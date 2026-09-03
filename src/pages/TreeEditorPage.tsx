import { useEffect, useRef, useState } from 'react'
import type { ThemeCatalog, TreeData, TreeNode } from '../types/skilltree'
import { baseValues } from '../lib/treeData'
import { listTreeFiles, loadTreeFile, loadThemes, saveTreeFile, saveThemes } from '../lib/treeEditorApi'
import { createNode, deleteNode, renameNodeId, toggleEdge, validateTreeData } from '../lib/treeEditorOps'
import { TreeEditorRenderer } from '../components/treeeditor/TreeEditorRenderer'
import type { EditorMode } from '../components/treeeditor/TreeEditorRenderer'
import { TreeEditorToolbar } from '../components/treeeditor/TreeEditorToolbar'
import { NodeEditPanel } from '../components/treeeditor/NodeEditPanel'
import { ThemeManagerModal } from '../components/treeeditor/ThemeManagerModal'
import './TreeEditorPage.css'

const EMPTY_TREE: TreeData = {
  id: '',
  version: '',
  metadata: { startNodeId: '', canvasWidth: 4000, canvasHeight: 4000 },
  nodes: [],
}

export function TreeEditorPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<TreeEditorRenderer | null>(null)

  const [files, setFiles] = useState<string[]>([])
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [treeData, setTreeData] = useState<TreeData | null>(null)
  const [themeCatalog, setThemeCatalog] = useState<ThemeCatalog>({})
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [mode, setMode] = useState<EditorMode>('select')
  const [showThemes, setShowThemes] = useState(false)
  const [showThemeManager, setShowThemeManager] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    listTreeFiles().then(setFiles)
    loadThemes().then(setThemeCatalog)
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let mounted = true
    let renderer: TreeEditorRenderer | null = null

    TreeEditorRenderer.create(containerRef.current, EMPTY_TREE).then((r) => {
      if (!mounted) {
        r.destroy()
        return
      }
      renderer = r
      rendererRef.current = r
      r.onSelect = (id) => setSelectedNodeId(id)
      r.onNodeDragEnd = (id, x, y) => {
        setTreeData((prev) => (prev ? { ...prev, nodes: prev.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)) } : prev))
        setDirty(true)
      }
      r.onToggleEdge = (a, b) => {
        setTreeData((prev) => (prev ? toggleEdge(prev, a, b) : prev))
        setDirty(true)
      }
      r.onCanvasClick = (x, y) => {
        setTreeData((prev) => {
          if (!prev) {
            return prev
          }
          const updated = createNode(prev, x, y, 'small')
          setSelectedNodeId(updated.nodes[updated.nodes.length - 1].id)
          return updated
        })
        setDirty(true)
      }
    })

    return () => {
      mounted = false
      renderer?.destroy()
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!currentFile) {
      return
    }
    let cancelled = false
    loadTreeFile(currentFile).then((data) => {
      if (cancelled) {
        return
      }
      setTreeData(data)
      setSelectedNodeId(null)
      setDirty(false)
    })
    return () => {
      cancelled = true
    }
  }, [currentFile])

  useEffect(() => {
    if (!treeData) {
      return
    }
    rendererRef.current?.setData(treeData)
  }, [treeData])

  useEffect(() => {
    rendererRef.current?.setSelection(selectedNodeId)
  }, [selectedNodeId])

  useEffect(() => {
    rendererRef.current?.setMode(mode)
  }, [mode])

  useEffect(() => {
    rendererRef.current?.setShowThemes(showThemes)
  }, [showThemes])

  useEffect(() => {
    rendererRef.current?.setThemeCatalog(themeCatalog)
  }, [themeCatalog])

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!dirty) {
        return
      }
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [dirty])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Delete' && e.key !== 'Backspace') {
        return
      }
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }
      handleDeleteSelected()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedNodeId, treeData]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleteSelected() {
    if (!treeData || !selectedNodeId) {
      return
    }
    if (!window.confirm(`Delete node "${selectedNodeId}"?`)) {
      return
    }
    try {
      setTreeData(deleteNode(treeData, selectedNodeId))
      setSelectedNodeId(null)
      setDirty(true)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Cannot delete node')
    }
  }

  function handleNodeChange(patch: Partial<TreeNode>) {
    if (!treeData || !selectedNodeId) {
      return
    }
    setTreeData({
      ...treeData,
      nodes: treeData.nodes.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n)),
    })
    setDirty(true)
  }

  function handleRenameNode(newId: string) {
    if (!treeData || !selectedNodeId) {
      return
    }
    try {
      const updated = renameNodeId(treeData, selectedNodeId, newId)
      setTreeData(updated)
      setSelectedNodeId(newId)
      setDirty(true)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Rename failed')
    }
  }

  function handleRemoveEdge(neighborId: string) {
    if (!treeData || !selectedNodeId) {
      return
    }
    setTreeData(toggleEdge(treeData, selectedNodeId, neighborId))
    setDirty(true)
  }

  async function handleNewFile() {
    const filename = window.prompt('New tree filename (e.g. class_marauder_tree.json):')
    if (!filename) {
      return
    }
    const name = filename.endsWith('.json') ? filename : `${filename}.json`
    const defaultId = name.replace(/\.json$/, '')
    const id = window.prompt('Tree id:', defaultId) || defaultId

    const fresh: TreeData = {
      id,
      version: '1.0.0',
      metadata: { startNodeId: 'root', canvasWidth: 4000, canvasHeight: 4000 },
      nodes: [
        {
          id: 'root',
          type: 'central',
          label: 'Start',
          x: 0,
          y: 0,
          region: 'center',
          description: '',
          effects: [],
          edges: [],
          unlockCondition: null,
        },
      ],
    }
    await saveTreeFile(name, fresh)
    const updatedFiles = await listTreeFiles()
    setFiles(updatedFiles)
    setCurrentFile(name)
  }

  async function handleSave() {
    if (currentFile && treeData) {
      const errors = validateTreeData(treeData)
      if (errors.length > 0) {
        window.alert(`Cannot save:\n${errors.join('\n')}`)
        return
      }
      await saveTreeFile(currentFile, treeData)
    }
    await saveThemes(themeCatalog)
    setDirty(false)
  }

  function handleThemeCatalogChange(catalog: ThemeCatalog) {
    setThemeCatalog(catalog)
    setDirty(true)
  }

  function handleDeleteTheme(themeId: string) {
    setThemeCatalog((prev) => {
      const next = { ...prev }
      delete next[themeId]
      return next
    })
    setTreeData((prev) =>
      prev ? { ...prev, nodes: prev.nodes.map((n) => (n.theme === themeId ? { ...n, theme: undefined } : n)) } : prev,
    )
    setDirty(true)
  }

  const selectedNode = treeData?.nodes.find((n) => n.id === selectedNodeId) ?? null

  return (
    <div className="tree-editor-page">
      <TreeEditorToolbar
        files={files}
        currentFile={currentFile}
        onSelectFile={setCurrentFile}
        onNewFile={handleNewFile}
        dirty={dirty}
        onSave={handleSave}
        mode={mode}
        onModeChange={setMode}
        hasSelection={!!selectedNodeId}
        onDelete={handleDeleteSelected}
        showThemes={showThemes}
        onToggleShowThemes={() => setShowThemes((s) => !s)}
        onManageThemes={() => setShowThemeManager(true)}
      />
      <div ref={containerRef} className="tree-editor-page__canvas" />
      {selectedNode && (
        <NodeEditPanel
          key={selectedNode.id}
          node={selectedNode}
          baseValues={baseValues}
          themeCatalog={themeCatalog}
          onChange={handleNodeChange}
          onRename={handleRenameNode}
          onRemoveEdge={handleRemoveEdge}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
      {showThemeManager && (
        <ThemeManagerModal
          catalog={themeCatalog}
          nodes={treeData?.nodes ?? []}
          onChange={handleThemeCatalogChange}
          onDeleteTheme={handleDeleteTheme}
          onClose={() => setShowThemeManager(false)}
        />
      )}
    </div>
  )
}
