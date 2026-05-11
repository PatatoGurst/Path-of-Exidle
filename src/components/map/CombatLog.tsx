import { useEffect, useRef, useState } from 'react'
import './CombatLog.css'

export type LogEventType =
  | 'player-damage'
  | 'enemy-damage'
  | 'player-evade'
  | 'enemy-evade'
  | 'enemy-death'
  | 'player-death'
  | 'pack-cleared'
  | 'loot-drop'
  | 'zone-completed'

export interface LogEntry {
  id: number
  type: LogEventType
  message: string
}

const EVENT_LABELS: Record<LogEventType, string> = {
  'player-damage': 'Player DMG',
  'enemy-damage': 'Enemy DMG',
  'player-evade': 'P. Evade',
  'enemy-evade': 'E. Evade',
  'enemy-death': 'Monster Death',
  'player-death': 'Player Death',
  'pack-cleared': 'Pack Clear',
  'loot-drop': 'Loot',
  'zone-completed': 'Zone',
}

const ALL_TYPES = Object.keys(EVENT_LABELS) as LogEventType[]

interface Props {
  entries: LogEntry[]
}

export function CombatLog({ entries }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [filters, setFilters] = useState<Record<LogEventType, boolean>>(
    Object.fromEntries(ALL_TYPES.map((t) => [t, true])) as Record<LogEventType, boolean>,
  )

  const visible = entries.filter((e) => filters[e.type])

  useEffect(() => {
    if (paused) {
      return
    }
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [visible.length, paused])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) {
      return
    }
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    setPaused(!atBottom)
  }

  function toggleFilter(type: LogEventType) {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  return (
    <div className="combat-log">
      <div className="combat-log-filters">
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            className={`log-filter-btn${filters[type] ? ' log-filter-btn--on' : ''}`}
            onClick={() => toggleFilter(type)}
          >
            {EVENT_LABELS[type]}
          </button>
        ))}
      </div>
      <div className="combat-log-scroll" ref={scrollRef} onScroll={handleScroll}>
        {visible.map((entry) => (
          <div key={entry.id} className={`log-entry log-entry--${entry.type}`}>
            {entry.message}
          </div>
        ))}
        {visible.length === 0 && (
          <div className="log-empty">No entries match the active filters.</div>
        )}
      </div>
      {paused && (
        <div className="log-paused-banner" onClick={() => setPaused(false)}>
          Auto-scroll paused — click to resume
        </div>
      )}
    </div>
  )
}
