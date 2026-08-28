# V0 Implementation Task Map

> Scope: everything required for a first playable draft.
> Ascension is excluded from V0 — the system is specced but not yet needed.
>
> **Ordering rationale:** UI phases (2–7) come first so visual progress is testable early.
> All UI phases use mock/hardcoded data — real data is connected in Phases 8–14.

---

## Phase 0 — Project Bootstrap ✓

- [x] **P0-01** Initialize React project (Vite + TypeScript)
- [x] **P0-02** Install and configure PixiJS
- [x] **P0-03** Install large number library (`decimal.js`)
- [x] **P0-04** Set up folder structure: `/src`, `/data`, `/public`
- [x] **P0-05** Set up data folder structure: `/data/monsters`, `/data/zones`, `/data/skills`, `/data/affixes`, `/data/nodes`
- [x] **P0-06** Configure path aliases and TypeScript strict mode
- [x] **P0-07** Set up linting and formatting (ESLint + Prettier)

---

## Phase 1 — Global Layout & CSS Foundation ✓

### 1.1 CSS Design Tokens
- [x] **L-01** Define CSS variables for the full color system (backgrounds, gold ramp, crimson ramp, rarity colors, HUD colors) — spec section 5.1
- [x] **L-02** Define CSS variables for typography (font family, size scale, line heights)
- [x] **L-03** Define CSS variables for spacing, border radius, z-index layers

### 1.2 App Shell
- [x] **L-04** Build fixed full-viewport layout: header / sidebar / content / footer HUD — spec section 5.3
- [x] **L-05** Header component: game name / logo placeholder, minimal bar — spec section 5.4
- [x] **L-06** Left sidebar component: expanded (~200px) and collapsed (~64px) states, toggle button, smooth transition — spec section 5.5
- [x] **L-07** Sidebar nav items: Character, Inventory, Map, Skill Tree, Options (icons + labels, active state highlight) — spec section 5.5
- [x] **L-08** Main content area: fills remaining space, scrollable vertically
- [x] **L-09** Footer HUD shell: fixed bottom bar, correct height, background

### 1.3 Footer HUD Elements
- [x] **L-10** Life Orb component: circular fill, red gradient, current/max HP display, overflows above footer — spec section 5.6
- [x] **L-11** Mana Orb component: circular fill, blue gradient, current/max Mana display, overflows above footer
- [x] **L-12** XP bar component: 10 segments × 10%, amber fill, fills left to right — spec section 5.6
- [x] **L-13** Character name + level display in footer, compact typography
- [x] **L-14** Content area bottom padding to compensate for orb overflow

### 1.4 Global UI Components
- [x] **L-15** Button component: gold text, crimson-to-black gradient, hover state with glow — spec section 5.1
- [x] **L-16** Tooltip component: dark background, gold border, positioned near target element
- [x] **L-17** Item tooltip component: name (rarity-colored), type, item level, quality, affixes list — spec section 5.13

---

## Phase 2 — Tab Routing & Page Shells

### 2.1 Routing
- [x] **R-01** Implement page routing in App — render the correct page component based on `activePage`

### 2.2 Page Shells
- [x] **R-02** Character page shell: two-column layout (identity + stats panel) — spec section 5.14
- [x] **R-03** Map page shell: two-row layout (pack bar / combat area + log) — spec section 5.9
- [x] **R-04** Inventory page shell: three-column layout (equipment / grid+stash / currency) — spec section 5.8
- [x] **R-05** Skill Tree page shell: full-area canvas container — spec section 5.10
- [x] **R-06** Options page shell: scrollable settings panel — spec section 5.15

---

## Phase 3 — Character Tab UI

> All tasks use hardcoded default values (STR 10 / DEX 10 / INT 10, HP 100, Mana 50).
> Connected to live `CharacterContext` in Phase 11.

- [x] **CH-01** Identity section: character name and level (no class system)
- [x] **CH-02** Attributes section: STR, DEX, INT with per-point bonus descriptions
- [x] **CH-03** Vitals section: max HP and max Mana colored bars with numeric display
- [x] **CH-04** Defence section: Armour, Evasion, fire / cold / lightning / chaos resistances
- [x] **CH-05** Offence section: damage range, attack speed, accuracy
- [x] **CH-06** Points section: available skill points and respec points

---

## Phase 4 — Map Tab UI ✓

- [x] **M-01** Zone selection view: act selector, 12 zones per act, zone state badges (locked / unlocked / completed / active) — spec section 5.9
- [x] **M-02** Zone entry: click unlocked/completed zone → activate combat view
- [x] **M-03** Pack overview bar: one indicator per pack, active highlighted, boss distinct, hover tooltip — spec section 5.9
- [x] **M-04** Combat view: player HP bar (left), monster name + rarity badge + HP bar (right) — spec section 5.9
- [x] **M-05** Combat log: scrollable feed, auto-scroll to bottom, pause on manual scroll, 500-line cap — spec section 5.11
- [x] **M-06** Combat log filter panel: toggle per event type — spec section 5.11
- [x] **M-07** Notification system: floating panel lower-right, stack newest-at-bottom, auto-dismiss 4s, click to dismiss — spec section 5.12
- [x] **M-08** Notification event wiring: death, notable loot (Rare+), level-up, zone complete, auto-craft stopped — spec section 5.12

---

## Phase 5 — Inventory Tab UI ✓

- [x] **I-01** Equipment panel: 10 named slots as character silhouette, empty placeholder, item thumbnail on equip — spec section 5.8
- [x] **I-02** Inventory grid: 12×12 CSS grid, item card per slot — spec section 3.2.3
- [x] **I-03** Stash tabs: tab switcher, Tab 1 and Tab 2 unlocked by default, locked shown as `+` — spec section 3.2.4
- [x] **I-04** Currency panel: right column, stack count badge, click to enter application mode — spec section 3.2.5
- [x] **I-05** Drag & drop: grid↔grid, grid↔equipment slot, grid↔stash, equipment↔grid — spec section 3.2.7
- [x] **I-06** Item tooltip on hover: uses `ItemTooltip` + `Tooltip` components — spec section 5.13
- [x] **I-07** Equipment comparison in tooltip: show stat delta vs currently equipped item
- [x] **I-08** Currency application mode: right-click → highlight valid targets → click → apply — spec section 3.2.5
- [x] **I-09** Item destroy / recycle action (right-click menu or button on selected item)

---

## Phase 6 — Skill Tree Tab UI ✓

- [x] **ST-01** PixiJS canvas mount: container div via React `ref`, PixiJS `Application` initialized once, canvas appended by renderer — spec section 3.4.7
- [x] **ST-02** Tree renderer: 5 node types (central/travel/small/notable/keystone), edges node-edge-to-node-edge, state colors (allocated gold / available dimmed / locked dark) — spec section 5.10
- [x] **ST-03** Pan and zoom: drag to pan (with click vs drag threshold), scroll to zoom (0.3×–3×), camera stored in renderer — spec section 3.4.8
- [x] **ST-04** Node hover: portal tooltip (name, type badge, effects, state, cost) via PixiJS pointerover events — spec section 5.10
- [x] **ST-05** Node click: confirmation panel (Allocate / Refund buttons, state-aware) — spec section 5.10
- [x] **ST-06** Allocate action: spend skill point, add node to allocated set, renderer redraws — spec section 3.4.3
- [x] **ST-07** Refund action: consume respec point, remove node from allocated set, returns skill point — spec section 3.4.4
- [x] **ST-08** Bridge path validation: BFS from root over remaining nodes blocks refund if disconnection detected — spec section 3.4.4
- [x] **ST-09** Available points counter: `SkillTreeHeader` component floating over canvas
- [ ] **ST-10** Skill point award on level-up: +1 per level, persisted in save (blocked on CharacterContext — Phase 11)

---

## Phase 7 — Options Tab UI

- [ ] **OPT-01** Options page layout: grouped settings panel inside the Options tab — spec section 5.15
- [ ] **OPT-02** Notification toggle (enable / disable panel) — spec section 5.12
- [ ] **OPT-03** Notification auto-dismiss duration slider — spec section 5.12
- [ ] **OPT-04** Notification hover-pause toggle — spec section 5.12
- [ ] **OPT-05** Combat log per-event-type toggles — spec section 5.11
- [ ] **OPT-06** Loot filter minimum rarity selector — spec section 3.2.3
- [ ] **OPT-07** Number format selector (suffixes K/M/B vs scientific notation) — spec section 6.6
- [ ] **OPT-08** Save / export / import buttons — spec section 4.6

---

## Phase 8 — State & Save Foundation

> Connects all UI (Phases 2–7) to persisted, reactive state.

### 8.1 React Contexts
- [ ] **S-01** `CharacterContext` — base stats, level, XP, respec points, derived stat computation
- [ ] **S-02** `ZoneContext` — zone states map, active zone, current pack state
- [ ] **S-02b** Wire `MapPage` active zone into `ZoneContext` so combat view persists when switching tabs and returning to Map (currently stored in local state — lost on unmount)
- [ ] **S-03** `InventoryContext` — equipped items, inventory grid, stash tabs
- [ ] **S-04** `CurrencyContext` — stack counts per currency type
- [ ] **S-05** `SkillTreeContext` — allocated nodes, available points, respec count
- [ ] **S-06** `SettingsContext` — UI preferences, loot filter, notification and combat log toggles

### 8.2 Save System
- [ ] **S-07** Save service: read/write per `irpg_*` localStorage key — spec section 4.1
- [ ] **S-08** Serialization helpers: serialize/deserialize each domain — spec section 4.2
- [ ] **S-09** Schema version check on load; stub migration runner for v1 — spec section 4.4
- [ ] **S-10** Auto-save every 60 seconds (dirty-key only) — spec section 4.5
- [ ] **S-11** Manual save button wired to `OPT-08`
- [ ] **S-12** Export save as JSON file download — spec section 4.6
- [ ] **S-13** Import save from JSON file with validation — spec section 4.6
- [ ] **S-14** New game initializer: write all default key values on first load

---

## Phase 9 — Game Data

- [ ] **D-01** Author 10 monster type definitions in `/data/monsters/*.json` — spec section 6.3.3
- [ ] **D-02** Author 10 monster skill definitions in `/data/skills/monster_skills.json` — spec section 6.3.8
- [ ] **D-03** Author monster affix pool in `/data/affixes/monster_affixes.json` (6 prefixes + 7 suffixes, 2 tiers each) — spec section 6.3.6
- [ ] **D-04** Author Act 1 zone definitions (12 zones) in `/data/zones/act1/*.json` — spec section 6.3.7
- [ ] **D-05** Author stub zone definitions for Acts 2–10 (unlock chain + placeholder pools)
- [ ] **D-06** Author initial skill tree nodes (~30–50 nodes) in `/data/nodes/main_tree.json` — spec section 3.4.10
- [ ] **D-07** Author loot list definitions: `list_equipment_common`, `list_currency_common` with null entry — spec section 6.4.2
- [ ] **D-08** Author loot table definitions referencing the above lists — spec section 6.4.3
- [ ] **D-09** Data loader service: load and validate all JSON at startup, build cumulative weight arrays — spec section 6.4.2

---

## Phase 10 — Tick Engine & Timers

- [ ] **T-01** Master RAF loop: compute elapsed ticks, advance `lastTimestamp`, carry sub-tick remainder — spec section 6.2.2
- [ ] **T-02** Subsystem timer registry: `register()`, `activate()`, `deactivate()`, tick dispatch — spec section 6.2.3
- [ ] **T-03** Combat timer subsystem: `offlineCatchup: false`, activates on zone entry — spec section 6.2.3
- [ ] **T-04** Auto-craft timer subsystem: `offlineCatchup: true`, activates on enable — spec section 6.2.3
- [ ] **T-05** Heavy operation recovery: batch tick processing with logical timestamps — spec section 6.2.4
- [ ] **T-06** Session resume: compute `missedRealTime`, catch up auto-craft ticks — spec section 6.2.5
- [ ] **T-07** UI decoupling: game state mutates per tick, React re-renders throttled to RAF — spec section 6.2.6

---

## Phase 11 — Character & Stats Logic

> Replaces mock data in the Character Tab (Phase 3) and Footer HUD with live computed values.

- [ ] **C-01** Character initialization: default base stats (STR 10, DEX 10, INT 10), level 1, XP 0 — spec section 6.1.1
- [ ] **C-02** Derived stat calculator: HP max, Mana max, Armour, Evasion, Accuracy from base stats + gear + nodes — spec section 6.1.4
- [ ] **C-03** Attribute implicit bonuses: STR → +2 HP/pt, DEX → +5 Accuracy/pt, INT → +2 Mana/pt — spec section 6.1.1
- [ ] **C-04** Unarmed attack values: 10–15 physical damage, 1.0s attack time — spec section 6.1.3
- [ ] **C-05** XP award on kill: `5 × level^1.1 × rarityMult × affixMod` — spec section 6.5.2
- [ ] **C-06** Level-up logic: `100 × 1.2^(level-1)` threshold, increment level, award skill point — spec section 6.5.1
- [ ] **C-07** Wire `CharacterContext` to Character Tab UI, Footer HUD orbs, XP bar, and name/level display

---

## Phase 12 — Combat System

- [ ] **CB-01** Pack generator: roll monster count (2–5), rarities (max 2 Magic, 1 Rare), last pack Unique — spec section 3.1.3
- [ ] **CB-02** Monster stat resolver: `baseStat × 1.05^(level-1)` then rarity multiplier — spec section 6.3.5
- [ ] **CB-03** Monster affix roller: draw from pool respecting rarity limits (0 / 2 / 6) — spec section 6.3.6
- [ ] **CB-04** Monster loot multiplier calculator: level + rarity + affix bonuses — spec section 6.4.6
- [ ] **CB-05** Combat tick handler: decrement attack timers, fire attacks, resolve hit/miss/damage — spec section 3.1.6
- [ ] **CB-06** Hit resolution: `1 - ((acc×1.25) / (acc + (eva/5)^0.9))`, clamp 0.05–0.95 — spec section 3.1.6
- [ ] **CB-07** Damage resolution: roll damage range → armour reduction → resistance reduction — spec section 3.1.6
- [ ] **CB-08** Monster death: award XP, roll loot, queue next monster in pack — spec section 3.1.6
- [ ] **CB-09** Pack cleared: advance to next pack, log event — spec section 3.1.3
- [ ] **CB-10** Zone completed: mark `completed` in save, unlock next zone — spec section 3.1.4
- [ ] **CB-11** Player death: restore HP + Mana, reset zone to Pack 1, re-generate packs — spec section 3.1.4
- [ ] **CB-12** Zone entry: activate combat timer, generate packs, set `ZoneContext` — spec section 3.1.3

---

## Phase 13 — Loot System

- [ ] **LT-01** Loot resolver: binary search cumulative weights, fractional draw model — spec section 6.4.2 & 6.4.5
- [ ] **LT-02** Extended loot table merger: prepend `additionalEntries` before null, recompute weights — spec section 6.4.4
- [ ] **LT-03** Guaranteed drop handler: append guaranteed items regardless of rolls — spec section 6.4.3
- [ ] **LT-04** Item generator: given `typeId` and `itemLevel`, generate item with rolled affixes at correct tier — spec section 3.3.5
- [ ] **LT-05** Item rarity assignment: roll rarity, apply affix count limits (1–2 / 3–6) — spec section 3.2.6
- [ ] **LT-06** Loot filter: apply `irpg_settings.lootFilter.minRarity` — discard below threshold — spec section 3.2.3
- [ ] **LT-07** Inventory overflow handler: discard if grid full, notify player — spec section 3.2.2

---

## Phase 14 — Crafting

- [ ] **CR-01** Currency application engine: validate applicability rules (rarity, slot availability, quality cap, item type) — spec section 3.3.4
- [ ] **CR-02** Orb of Transmutation: Normal → Magic, roll 1 affix — spec section 3.3.2
- [ ] **CR-03** Orb of Augmentation: add 1 affix to Magic if under 2 modifiers — spec section 3.3.2
- [ ] **CR-04** Regal Orb: Magic → Rare, add 1 affix — spec section 3.3.2
- [ ] **CR-05** Exalted Orb: add 1 affix to Rare if under 6 modifiers — spec section 3.3.2
- [ ] **CR-06** Chaos Orb: remove 1 random affix, add 1 new on Rare — spec section 3.3.2
- [ ] **CR-07** Orb of Annulment: remove 1 random affix from Magic or Rare — spec section 3.3.2
- [ ] **CR-08** Divine Orb: re-roll numeric values within current tier on all affixes — spec section 3.3.2 & 3.3.5
- [ ] **CR-09** Blacksmith's Whetstone: +1% quality on weapon, block at 20% cap — spec section 3.3.3
- [ ] **CR-10** Armourer's Scrap: +1% quality on armour, block at 20% cap — spec section 3.3.3
- [ ] **CR-11** Orb of Regret: grant 1 respec point to character — spec section 3.3.2

---

## Missing Specs — Needed Before or During Implementation

| Blocker | Blocks | Notes |
|---|---|---|
| Item base type definitions | LT-04, I-06 | Base weapon/armour types with base stats and slot |
| Item affix pool | LT-04, CB-03, CR-02–CR-11 | Affix IDs, tiers, value ranges, eligible item types |
| Loot table assignments per monster | CB-08, LT-01 | Which table each monster references (D-07/08) |
