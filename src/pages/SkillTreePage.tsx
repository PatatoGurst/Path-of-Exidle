import { useEffect, useMemo, useRef, useState } from 'react'
import { treeData, baseValues, buildNodeMap, computeNodeState, canRefund } from '../lib/treeData'
import { TreeRenderer } from '../components/skilltree/TreeRenderer'
import { NodeTooltip } from '../components/skilltree/NodeTooltip'
import { NodeConfirmPanel } from '../components/skilltree/NodeConfirmPanel'
import { SkillTreeHeader } from '../components/skilltree/SkillTreeHeader'
import './SkillTreePage.css'

interface HoverState {
  nodeId: string
  clientX: number
  clientY: number
}

export function SkillTreePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<TreeRenderer | null>(null)

  const [allocated, setAllocated] = useState<Set<string>>(() => new Set(['root']))
  const [skillPoints, setSkillPoints] = useState(5)
  const [respecPoints, setRespecPoints] = useState(1)
  const [hovered, setHovered] = useState<HoverState | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const handleAllocateRef = useRef<(nodeId: string) => void>(() => {})

  const nodeMap = useMemo(() => buildNodeMap(treeData), [])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let mounted = true
    let renderer: TreeRenderer | null = null

    TreeRenderer.create(containerRef.current, treeData).then((r) => {
      if (!mounted) {
        r.destroy()
        return
      }
      renderer = r
      rendererRef.current = r
      r.updateAllocation(new Set(['root']))
      r.onHover = (nodeId, clientX, clientY) => {
        if (nodeId) {
          setHovered({ nodeId, clientX, clientY })
        } else {
          setHovered(null)
        }
      }
      r.onClick = (nodeId) => {
        setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId))
      }
      r.onDoubleClick = (nodeId) => {
        handleAllocateRef.current(nodeId)
      }
    })

    return () => {
      mounted = false
      renderer?.destroy()
      rendererRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    rendererRef.current?.updateAllocation(allocated)
  }, [allocated])

  function handleAllocate(nodeId: string) {
    if (skillPoints <= 0) {
      return
    }
    if (computeNodeState(nodeId, allocated, nodeMap) !== 'available') {
      return
    }
    setAllocated((prev) => new Set([...prev, nodeId]))
    setSkillPoints((p) => p - 1)
    setSelectedNodeId(null)
  }
  handleAllocateRef.current = handleAllocate

  function handleRefund(nodeId: string) {
    if (respecPoints <= 0) {
      return
    }
    if (nodeId === 'root') {
      return
    }
    if (!canRefund(nodeId, allocated, nodeMap)) {
      return
    }
    setAllocated((prev) => {
      const next = new Set(prev)
      next.delete(nodeId)
      return next
    })
    setRespecPoints((p) => p - 1)
    setSkillPoints((p) => p + 1)
    setSelectedNodeId(null)
  }

  return (
    <div className="skill-tree-page">
      <SkillTreeHeader skillPoints={skillPoints} respecPoints={respecPoints} />
      <div ref={containerRef} className="skill-tree-canvas-container" />
      {hovered && (
        <NodeTooltip
          nodeId={hovered.nodeId}
          clientX={hovered.clientX}
          clientY={hovered.clientY}
          nodeMap={nodeMap}
          baseValues={baseValues}
          allocated={allocated}
        />
      )}
      {selectedNodeId && (
        <NodeConfirmPanel
          nodeId={selectedNodeId}
          nodeMap={nodeMap}
          baseValues={baseValues}
          allocated={allocated}
          skillPoints={skillPoints}
          respecPoints={respecPoints}
          onAllocate={handleAllocate}
          onRefund={handleRefund}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  )
}