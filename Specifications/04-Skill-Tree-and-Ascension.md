# §3.4–3.6 Skill Tree, Ascension & Leagues

← [Inventory & Crafting](03-Inventory-and-Crafting.md) | [Table of Contents](README.md) | Next: [Persistence & Save System →](05-Persistence.md)

---

## 3.4 Skill Tree Module

### 3.4.1 General Concept

The skill tree is a **2D interactive node graph** — a large, navigable canvas of interconnected passive bonuses that the player builds toward over time. It is the primary long-term character customization system.

The system is designed to be **generic and reusable**: multiple distinct skill trees may exist in the game (e.g. a base character tree, a prestige tree, a league-specific tree). All trees share the same rendering engine, interaction model, and data format — only the node definitions and topology differ.

Points are earned primarily by **leveling up**. Some trees may have alternative point sources (prestige milestones, quest rewards — defined per tree).

---

### 3.4.2 Node Types

| Type | Visual size | Description |
|---|---|---|
| **Small** | Small circle | Simple incremental bonus (+5% damage, +10 HP) |
| **Notable** | Medium circle | More significant or compound bonus; acts as a regional milestone |
| **Keystone** | Large circle | Fundamentally alters a game mechanic; high-impact, often double-edged |

Nodes are connected by **edges** (lines). A node is **allocatable** only if it is adjacent to an already-allocated node (the starting node is always pre-allocated). This enforces path-building and strategic routing.

---

### 3.4.3 Node States

| State | Description |
|---|---|
| `allocated` | Point spent, bonus active |
| `available` | Adjacent to an allocated node, can be selected |
| `reachable` | Connected via a path but not yet adjacent (informational) |
| `locked` | Not reachable with current allocations |
| `planned` | Marked as a target in planning mode (no point spent) |

---

### 3.4.4 Point Refund

Allocated nodes on the **main skill tree** can be unallocated by spending **respec points**. Respec points are obtained by using an **Orb of Regret** from the currency panel — each orb grants exactly 1 respec point.

- Each respec point removes **one node** and returns its skill point
- Refunding a node that bridges the path to other allocated nodes is **not allowed** unless those nodes remain connected via another path
- Respec points are stored as a separate counter — they do not expire and carry over across sessions
- The Orb of Regret **does not apply to the Ascension Tree** — Ascension Tree allocations have their own refund mechanic (TBD, see [§10.2 M5](12-Open-Questions.md))

---

### 3.4.5 Topology & Layout

All trees must conform to these shared structural rules regardless of their shape:

- Defined entirely in a **JSON data file** (nodes, edges, positions, metadata)
- Each node has an explicit `x, y` position on the canvas — layout is hand-authored or tool-generated, not auto-computed at runtime
- Thematic **regions** group related nodes (e.g. Offense, Defense, Crafting, Speed) — visually delimited by background zones or labels
- Every tree has exactly **one starting node**, pre-allocated and non-refundable — it grants no bonus and exists purely as the required connection point for the first allocated nodes

---

### 3.4.6 Main Skill Tree Topology

The main character skill tree uses a **radial fractal structure**, directly inspired by PoE's passive tree:

**Overall shape**
- The **root node** sits at the center of the canvas, pre-allocated
- Branches extend outward in all directions from the root, forming an organic, roughly circular mass
- The tree grows through a repeating two-element pattern: **travel nodes** and **pattern clusters**

**Travel nodes**
- Small nodes connecting clusters to one another and to the root
- Always of type **Small** — no exceptions
- Serve purely as path infrastructure; their bonuses are minor and incremental
- Visually rendered as smaller circles with simple connecting lines

**Pattern clusters**
- Groups of **3 to 5 nodes** arranged in a small local shape (triangle, diamond, cross, arc, etc.)
- Contain a mix of node types: Small, Notable, or Keystone
- Each cluster has a thematic identity (e.g. "Physical damage cluster", "Life sustain cluster")
- Keystones appear isolated or as the centerpiece of a cluster — never as travel nodes
- Clusters are the primary decision points: the player routes toward clusters that match their build

**Fractal growth rules**
- Branches split and re-merge, creating multiple valid paths between distant clusters
- No strict symmetry is required — the tree should feel organically grown, not geometrically rigid
- Branch density increases toward the outer edges (more clusters, more specialization)
- The center region near the root is sparser and more generic (broad bonuses)

**Visual rhythm** (for implementation guidance)
```
Root → travel → travel → [cluster] → travel → [cluster] → travel → ...
                                  ↘ travel → [cluster] → ...
```

This structure gives the tree its characteristic "web of constellations" appearance.

---

### 3.4.7 Rendering & Technology

The skill tree — and all future canvas-based rendering (combat visualization, etc.) — is built on **PixiJS** as the single, unified 2D rendering engine.

**Why PixiJS:**
- WebGL-based: GPU-accelerated rendering, handles 500+ nodes with animations and effects at 60fps
- Single engine for all canvas needs — skill tree today, combat visualization in V2+ — no hybrid architecture
- Active community, TypeScript-native, well-documented
- Supports all required interactions: drag/pan, zoom, hover, click

**Integration model:**
- PixiJS renders into a `<canvas>` element managed via a React `ref`
- The PixiJS application instance is initialized once and lives outside the React render cycle
- React manages application state; PixiJS handles only rendering and user input on the canvas
- DOM UI layers (header, sidebar, HUD, tooltips) sit above the canvas via CSS `z-index`

**No other 2D canvas library is used in this project.** D3.js, Konva, Cytoscape and equivalents are explicitly excluded to avoid bundle bloat and API fragmentation.

---

### 3.4.8 Player Interactions

**Navigation**
- **Drag** to pan across the canvas
- **Scroll / pinch** to zoom in and out
- The canvas remembers the last camera position per tree

**Node interaction**
- **Hover** → tooltip appears with: node name, type badge, full bonus description, allocation cost, and current state
- **Click** → selects the node; a **confirmation panel** appears (node detail + "Allocate" button)
- **Allocate button** → spends a skill point and marks the node as `allocated` (disabled if no points available or node not `available`)
- **Refund** → available on allocated nodes; shows Respec Resource cost before confirmation

**Minimap (optional — V2)**
- A small overview of the full tree in the corner, showing current camera position and allocated nodes

---

### 3.4.9 Planning Mode (V2+)

An opt-in mode allowing the player to plan a future path without spending points:

- Nodes can be marked as `planned` by clicking without allocating
- The UI draws a highlighted path from the last allocated node to the planned target
- The panel shows the **total point cost** to reach the planned node and intermediate nodes
- Planned paths are saved in the save file and persist across sessions
- **Auto-allocation**: when points become available, the game can optionally spend them automatically along the planned path (toggle in settings)

---

### 3.4.10 Data Format (Node Definition)

Each node in a tree is defined in JSON:

```json
{
  "id": "node_042",
  "type": "notable",
  "x": 1240,
  "y": 380,
  "region": "offense",
  "label": "Iron Grip",
  "description": "+20% physical damage, +5% attack speed",
  "edges": ["node_039", "node_041", "node_045"],
  "unlockCondition": null
}
```

Optional `unlockCondition` allows gating nodes behind external criteria (zone reached, prestige level, etc.).

---

## 3.5 Ascension Module (Prestige System)

### 3.5.1 Concept

**Ascension** is the game's prestige system — a voluntary, repeatable reset that sacrifices current run progression in exchange for permanent meta-bonuses that persist across all future runs.

Each Ascension awards **Ascension Points**, which are spent in a dedicated **Ascension Tree** — a separate skill tree that provides meta-level bonuses to progression speed, loot quality, crafting efficiency, and other systemic improvements.

---

### 3.5.2 What Resets on Ascension

| Element | Reset |
|---|---|
| Character level | ✅ Reset to 1 |
| XP | ✅ Reset to 0 |
| Gear / equipment | ✅ Lost |
| Inventory items | ✅ Lost |
| Zone progression | ✅ Reset to Act 1, Zone 1 |
| Skill tree allocations | ✅ Reset (points refunded, tree cleared) |
| Crafting materials | ✅ Lost |

| Element | Kept |
|---|---|
| Ascension Points (accumulated) | ✅ Permanent |
| Ascension Tree allocations | ✅ Permanent |
| Ascension count | ✅ Tracked |
| Loot filters & automation config | ✅ Kept |
| Game settings | ✅ Kept |

---

### 3.5.3 Ascension Threshold

The exact threshold condition is **deferred** — it may be based on character level, zone progression, or a combination of both. What is architecturally decided:

- The threshold is a **fixed value per Ascension** — it does not increase between runs, making each subsequent Ascension equally accessible
- The **Ascension Point reward uses diminishing returns** — later Ascensions yield fewer points than earlier ones, following a curve inspired by the Fibonacci sequence:
  - The amount of Ascension Points awarded for run N is calculated from the player's accumulated progression (e.g. level reached), converted via a diminishing formula
  - Early Ascensions feel impactful; later ones are incremental — incentivizing continued play without making early runs feel wasteful
- The exact formula (Fibonacci-based or otherwise) is **to be determined during balancing**, but the principle is locked: **diminishing point yield, fixed threshold**

---

### 3.5.4 Ascension Tree

The Ascension Tree is a **separate skill tree** rendered in the same PixiJS engine as the main skill tree, accessed via its own dedicated tab. It follows all the structural rules defined in section 3.4 (node types, states, JSON format, interaction model).

**Key differences from the main skill tree:**

| Property | Main Skill Tree | Ascension Tree |
|---|---|---|
| Points source | Character level-ups | Ascension runs |
| Reset on Ascension | ✅ Yes | ❌ Never |
| Topology | Fractal radial (defined in 3.4.6) | TBD — likely thematic clusters |
| Refund mechanic | Respec Resource | TBD |

**Types of bonuses provided by Ascension Tree nodes:**

- Global progression speed (XP gain rate, kill speed multipliers)
- Loot quality improvements (rarity weight shifts, item level bonuses)
- Crafting bonuses (material drop rate, automation speed)
- Starting advantages for new runs (start at level X, unlock Zone Y immediately)
- Unlock gates for future systems (leagues, advanced automation, etc.)

The Ascension Tree has its own **regional structure** — thematic zones grouping related meta-bonuses (e.g. a Combat region, a Crafting region, a Progression region).

---

### 3.5.5 Ascension Flow (UX)

1. Player meets the Ascension threshold
2. A persistent notification appears in the HUD (non-intrusive — does not force action)
3. Player navigates to the Ascension tab and initiates the process
4. A **confirmation screen** displays:
   - What will be lost (full list)
   - Ascension Points to be awarded (and running total after)
   - Current Ascension count
   - A clear "Ascend" confirmation button and a cancel option
5. On confirmation: reset executes, Ascension Points are credited, player lands on the Ascension Tree to spend new points
6. Game resumes from Act 1, Zone 1 with all Ascension bonuses active

---

### 3.5.6 Ascension Tab (UI)

A dedicated tab added to the left sidebar navigation (icon and label TBD — suggested: 🔺 Ascension).

The tab contains two sections:

**Ascension Status panel (top)**
- Current Ascension count
- Threshold progress indicator (how close the player is to being able to Ascend)
- Available Ascension Points (unspent)
- Total Ascension Points earned (lifetime)
- "Ascend" button — enabled only when threshold is met, triggers the confirmation flow

**Ascension Tree (main area)**
- Full PixiJS canvas rendering the Ascension Tree
- Identical interaction model to the main skill tree (pan, zoom, hover tooltip, click to allocate)
- Points allocated here are permanent and never reset

---

## 3.6 Leagues Module (Seasonal Content — V2+)

Inspired by PoE leagues, adapted to the incremental format:

- Temporary or thematic mechanics added as an additional gameplay layer
- League concept examples:
  - **Storm League**: zones with weather events modifying combat
  - **Craft League**: new crafting recipes temporarily available
  - **Hunt League**: special target-tracking system with unique rewards
- Leagues do not affect the main save (additive layer only)
- They may introduce items or mechanics that later integrate into the base game

---

← [Inventory & Crafting](03-Inventory-and-Crafting.md) | [Table of Contents](README.md) | Next: [Persistence & Save System →](05-Persistence.md)
