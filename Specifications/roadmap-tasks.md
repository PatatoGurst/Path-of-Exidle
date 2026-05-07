# V0 Implementation Task Map

> Scope: everything required for a first playable draft.
> Ascension is excluded from V0 — the system is specced but not yet needed.
> Tasks are ordered by dependency — earlier groups must be complete before later ones can start.

---

## Phase 0 — Project Bootstrap

- [x] **P0-01** Initialize React project (Vite + TypeScript recommended)
- [x] **P0-02** Install and configure PixiJS
- [x] **P0-03** Install large number library (`break_infinity.js` or `decimal.js`)
- [x] **P0-04** Set up folder structure: `/src`, `/data`, `/public`
- [x] **P0-05** Set up data folder structure: `/data/monsters`, `/data/zones`, `/data/skills`, `/data/affixes`, `/data/nodes`
- [x] **P0-06** Configure path aliases and TypeScript strict mode
- [x] **P0-07** Set up linting and formatting (ESLint + Prettier)

---

## Phase 1 — Global Layout & CSS Foundation

### 1.1 CSS Design Tokens
- [x] **L-01** Define CSS variables for the full color system (backgrounds, gold ramp, crimson ramp, rarity colors, HUD colors) — spec section 5.1
- [x] **L-02** Define CSS variables for typography (font family, size scale, line heights)
- [x] **L-03** Define CSS variables for spacing, border radius, z-index layers

### 1.2 App Shell
- [ ] **L-04** Build fixed full-viewport layout: header / sidebar / content / footer HUD — spec section 5.2
- [ ] **L-05** Header component: game name / logo placeholder, minimal bar — spec section 5.4
- [ ] **L-06** Left sidebar component: expanded (~200px) and collapsed (~56px) states, toggle button, smooth transition — spec section 5.5
- [ ] **L-07** Sidebar nav items: Inventory, Map, Skill Tree (icons + labels, active state highlight)
- [ ] **L-08** Main content area: fills remaining space, scrollable vertically
- [ ] **L-09** Footer HUD shell: fixed bottom bar, correct height, background

### 1.3 Footer HUD Elements
- [ ] **L-10** Life Orb component: circular fill, red radial gradient, current/max HP display, overflows above footer — spec section 5.6
- [ ] **L-11** Mana Orb component: circular fill, blue radial gradient, current/max Mana display, overflows above footer
- [ ] **L-12** XP bar component: 10 segments × 10%, amber fill, fills left to right, resets on level-up — spec section 5.6
- [ ] **L-13** Character name + level display in footer, compact typography
- [ ] **L-14** Content area bottom padding to compensate for orb overflow

### 1.4 Global UI Components
- [ ] **L-15** Button component: gold text, crimson-to-black gradient, hover state with glow — spec section 5.1
- [ ] **L-16** Tooltip component: dark background, gold border, positioned near target element
- [ ] **L-17** Item tooltip component: name (rarity-colored), type, item level, quality, affixes list — spec section 5.13

---

## Phase 2 — State & Save Foundation

### 2.1 React Contexts
- [ ] **S-01** `CharacterContext` — base stats, level, XP, respec points, derived stat computation
- [ ] **S-02** `ZoneContext` — zone states map, active zone, current pack state
- [ ] **S-03** `InventoryContext` — equipped items, inventory grid, stash tabs
- [ ] **S-04** `CurrencyContext` — stack counts per currency type
- [ ] **S-05** `SkillTreeContext` — allocated nodes, available points, respec count
- [ ] **S-06** `SettingsContext` — UI preferences, loot filter, notification and combat log toggles

### 2.2 Save System
- [ ] **S-07** Save service: read/write per `irpg_*` localStorage key — spec section 4.1
- [ ] **S-08** Serialization helpers: serialize/deserialize each domain (character, zones, inventory, currency, skilltree, settings, timers, metagame) — spec section 4.2
- [ ] **S-09** Schema version check on load; stub migration runner for v1 — spec section 4.4
- [ ] **S-10** Auto-save every 60 seconds (dirty-key only) — spec section 4.5
- [ ] **S-11** Manual save button in UI (settings or header)
- [ ] **S-12** Export save as JSON file download — spec section 4.6
- [ ] **S-13** Import save from JSON file with validation — spec section 4.6
- [ ] **S-14** New game initializer: write all default key values on first load

---

## Phase 3 — Game Data

- [ ] **D-01** Author 10 monster type definitions in `/data/monsters/*.json` — spec section 6.3.3
- [ ] **D-02** Author 10 monster skill definitions in `/data/skills/monster_skills.json` (one per monster, `attackTime` model) — spec section 6.3.8
- [ ] **D-03** Author monster affix pool in `/data/affixes/monster_affixes.json` (6 prefixes + 7 suffixes, 2 tiers each) — spec section 3.3.8
- [ ] **D-04** Author Act 1 zone definitions (12 zones) in `/data/zones/act1/*.json` with pack count, monster pools, and unlock conditions — spec section 6.3.7
- [ ] **D-05** Author stub zone definitions for Acts 2–10 (can be minimal — just unlock chain and placeholder monster pools)
- [ ] **D-06** Author initial skill tree nodes (small draft of ~30–50 nodes) in `/data/nodes/main_tree.json` — spec section 3.4.10
- [ ] **D-07** Author loot list definitions: `list_equipment_common`, `list_currency_common` with null entry — spec section 6.4.2
- [ ] **D-08** Author loot table definitions referencing the above lists — spec section 6.4.3
- [ ] **D-09** Data loader service: load and validate all JSON files at startup, build cumulative weight arrays for loot lists — spec section 6.4.2

---

## Phase 4 — Tick Engine & Timers

- [ ] **T-01** Master RAF loop: compute elapsed ticks, advance `lastTimestamp`, carry sub-tick remainder — spec section 6.2.2
- [ ] **T-02** Subsystem timer registry: `register()`, `activate()`, `deactivate()`, tick dispatch in fixed order — spec section 6.2.3
- [ ] **T-03** Combat timer subsystem: `offlineCatchup: false`, activates on zone entry, deactivates on zone exit/death — spec section 6.2.3
- [ ] **T-04** Auto-craft timer subsystem: `offlineCatchup: true`, activates on auto-craft enable — spec section 6.2.3
- [ ] **T-05** Heavy operation recovery: batch tick processing with logical timestamps — spec section 6.2.4
- [ ] **T-06** Session resume: compute `missedRealTime`, catch up auto-craft ticks, restore combat state — spec section 6.2.5
- [ ] **T-07** UI decoupling: game state mutates per tick, React re-renders throttled to RAF frame rate — spec section 6.2.6

---

## Phase 5 — Character & Stats

- [ ] **C-01** Character initialization: default base stats (STR 10, DEX 10, INT 10), level 1, XP 0 — spec section 6.1.1
- [ ] **C-02** Derived stat calculator: compute HP max, Mana max, Armour, Evasion, Accuracy from base stats + gear + tree nodes — spec section 6.1.4
- [ ] **C-03** Attribute implicit bonuses: STR → +2 HP/pt, DEX → +5 Accuracy/pt, INT → +2 Mana/pt — spec section 6.1.1
- [ ] **C-04** Unarmed attack values: 10–15 physical damage, 1.0s attack time — spec section 6.1.3
- [ ] **C-05** XP award on kill: `5 × level^1.1 × rarityMult × affixMod` — spec section 6.5.2
- [ ] **C-06** Level-up logic: check `100 × 1.2^(level-1)` threshold, increment level, award skill point — spec section 6.5.1
- [ ] **C-07** Stats panel component: display all stats grouped (Attributes / Vitals / Defence / Offence) with source breakdown tooltip — spec section 6.1.5

---

## Phase 6 — Combat System

- [ ] **CB-01** Pack generator: given zone and act index, roll monster count (2–5), assign rarities (max 2 Magic, 1 Rare), last pack guarantees Unique — spec section 3.1.3
- [ ] **CB-02** Monster stat resolver: apply level scaling `baseStat × 1.05^(level-1)` then rarity multiplier — spec section 6.3.5
- [ ] **CB-03** Monster affix roller: draw random affixes from pool respecting rarity limits (0 / 2 / 6) — spec section 6.3.6
- [ ] **CB-04** Monster loot multiplier calculator: level + rarity + affix bonuses — spec section 6.4.6
- [ ] **CB-05** Combat tick handler: decrement attack timers, fire attacks when elapsed, resolve hit/miss/damage — spec section 3.1.6
- [ ] **CB-06** Hit resolution: evasion check formula `1 - ((acc×1.25) / (acc + (eva/5)^0.9))`, clamp 0.05–0.95 — spec section 3.1.6
- [ ] **CB-07** Damage resolution: roll damage range → armour reduction → resistance reduction — spec section 3.1.6
- [ ] **CB-08** Monster death: award XP, roll loot, queue next monster in pack — spec section 3.1.6
- [ ] **CB-09** Pack cleared: advance to next pack, log event — spec section 3.1.3
- [ ] **CB-10** Zone completed: mark zone as `completed` in save, write `irpg_zones`, unlock next zone — spec section 3.1.4
- [ ] **CB-11** Player death: restore HP + Mana to full, reset zone to Pack 1, re-generate pack content — spec section 3.1.4
- [ ] **CB-12** Zone entry: activate combat timer, generate packs, set `ZoneContext` state — spec section 3.1.3

---

## Phase 7 — Loot System

- [ ] **LT-01** Loot resolver: binary search cumulative weights, fractional draw model, independent draws per list — spec section 6.4.2 & 6.4.5
- [ ] **LT-02** Extended loot table merger: prepend `additionalEntries` before null, recompute weights — spec section 6.4.4
- [ ] **LT-03** Guaranteed drop handler: append guaranteed items regardless of rolls — spec section 6.4.3
- [ ] **LT-04** Item generator: given `typeId` and `itemLevel`, generate item with rolled affixes at correct tier — spec section 3.3.5
- [ ] **LT-05** Item rarity assignment: roll rarity from loot table, apply correct affix count limits (1–2 / 3–6) — spec section 3.2.6
- [ ] **LT-06** Loot filter: apply `irpg_settings.lootFilter.minRarity` — discard below threshold before adding to inventory — spec section 3.2.3
- [ ] **LT-07** Inventory overflow handler: drop items to ground (discard) if grid is full, notify player — spec section 3.2.2

---

## Phase 8 — Map Tab UI

- [ ] **M-01** Zone selection view: act selector, 12 zones per act displayed as grid, zone state badges (locked / unlocked / completed / active) — spec section 5.9
- [ ] **M-02** Zone entry: click unlocked/completed zone → activate combat, switch to combat view
- [ ] **M-03** Pack overview bar: one indicator per pack, active pack highlighted, boss pack visually distinct, hover tooltip showing pack composition — spec section 5.9
- [ ] **M-04** Combat view: player HP bar (left), monster name + rarity badge + HP bar (right), one-on-one layout — spec section 5.9
- [ ] **M-05** Combat log component: scrollable feed, auto-scroll to bottom, pause on manual scroll, 500-line cap — spec section 5.11
- [ ] **M-06** Combat log filter panel: toggle per event type (player dmg, enemy dmg, evade, deaths, pack advance, loot, zone complete) — spec section 5.11
- [ ] **M-07** Notification system: floating panel lower-right, stack newest-at-bottom, auto-dismiss 4s, click to dismiss, hover pauses timer — spec section 5.12
- [ ] **M-08** Notification event wiring: death, notable loot (Rare+), level-up, zone complete, auto-craft stopped — spec section 5.12

---

## Phase 9 — Inventory Tab UI

- [ ] **I-01** Equipment panel: 10 named slots laid out as character silhouette, empty placeholder style, item thumbnail on equip — spec section 5.8
- [ ] **I-02** Inventory grid: 12×12 CSS grid, slot highlighting on drag, item card per slot — spec section 3.2.3
- [ ] **I-03** Stash tabs: tab switcher above grid, Tab 1 and Tab 2 unlocked by default, locked tabs shown as `+` — spec section 3.2.4
- [ ] **I-04** Currency panel: right column, one row per currency type, stack count badge, click to enter application mode — spec section 3.2.5
- [ ] **I-05** Drag & drop: grid↔grid, grid↔equipment slot, grid↔stash, equipment↔grid — spec section 3.2.7
- [ ] **I-06** Item tooltip on hover: name, rarity color, type, item level, quality, all affixes with values — spec section 5.13
- [ ] **I-07** Equipment comparison in tooltip: show delta vs currently equipped item in same slot
- [ ] **I-08** Currency application mode: right-click currency → highlight valid targets → click target → apply and validate rules — spec section 3.2.5
- [ ] **I-09** Item destroy / recycle action (right-click menu or button on selected item)

---

## Phase 10 — Skill Tree Tab UI

- [ ] **ST-01** PixiJS canvas mount: `<canvas>` via React `ref`, app initialized once outside React cycle — spec section 3.4.7
- [ ] **ST-02** Tree renderer: draw nodes (3 sizes), draw edges, apply state colors (allocated gold / available dimmed / locked gray) — spec section 5.10
- [ ] **ST-03** Pan and zoom: drag to pan, scroll to zoom, camera position stored per tree — spec section 3.4.8
- [ ] **ST-04** Node hover: display tooltip near node (name, type badge, bonus description, state, cost) — spec section 5.10
- [ ] **ST-05** Node click: show confirmation panel with Allocate / Refund buttons — spec section 5.10
- [ ] **ST-06** Allocate action: spend skill point, update node state to `allocated`, recompute character stats — spec section 3.4.3
- [ ] **ST-07** Refund action: consume respec point, return skill point, update node state — spec section 3.4.4
- [ ] **ST-08** Bridge path validation: block refund if removing the node would orphan other allocated nodes — spec section 3.4.4
- [ ] **ST-09** Available points display: visible counter near tree (location TBD) — spec open item L15
- [ ] **ST-10** Skill point award on level-up: +1 point per level, persisted in `irpg_character` (via `irpg_skilltree` available points)

---

## Phase 11 — Crafting

- [ ] **CR-01** Currency application engine: validate applicability rules (rarity match, slot availability, quality cap, item type) — spec section 3.3.4
- [ ] **CR-02** Orb of Transmutation: upgrade Normal → Magic, roll 1 affix — spec section 3.3.2
- [ ] **CR-03** Orb of Augmentation: add 1 affix to Magic if under 2 modifiers — spec section 3.3.2
- [ ] **CR-04** Regal Orb: upgrade Magic → Rare, add 1 affix — spec section 3.3.2
- [ ] **CR-05** Exalted Orb: add 1 affix to Rare if under 6 modifiers — spec section 3.3.2
- [ ] **CR-06** Chaos Orb: remove 1 random affix, add 1 new affix on Rare — spec section 3.3.2
- [ ] **CR-07** Orb of Annulment: remove 1 random affix from Magic or Rare — spec section 3.3.2
- [ ] **CR-08** Divine Orb: re-roll numeric values within current tier on all affixes — spec section 3.3.2 & 3.3.5
- [ ] **CR-09** Blacksmith's Whetstone: +1% quality on weapon, block at 20% cap — spec section 3.3.3
- [ ] **CR-10** Armourer's Scrap: +1% quality on armour, block at 20% cap — spec section 3.3.3
- [ ] **CR-11** Orb of Regret: grant 1 respec point to character — spec section 3.3.2

---

## Phase 12 — Settings & Options

- [ ] **OPT-01** Settings panel / page (accessible from header icon or sidebar)
- [ ] **OPT-02** Notification toggle (enable / disable panel) — spec section 5.12
- [ ] **OPT-03** Notification auto-dismiss duration slider — spec section 5.12
- [ ] **OPT-04** Notification hover-pause toggle — spec section 5.12
- [ ] **OPT-05** Combat log per-event-type toggles — spec section 5.11
- [ ] **OPT-06** Loot filter minimum rarity selector — spec section 3.2.3
- [ ] **OPT-07** Number format selector (suffixes K/M/B vs scientific notation) — spec section 6.6
- [ ] **OPT-08** Save / export / import buttons — spec section 4.6

---

## Missing Specs — Needed Before or During Implementation

These are items not yet specced that will block specific tasks:

| Blocker | Blocks | Notes |
|---|---|---|
| Item base type definitions (L17) | LT-04, I-06 | Base weapon/armour types with base stats and slot |
| Item affix pool (L18) | LT-04, CB-03, CR-02–CR-11 | Affix IDs, tiers, value ranges, eligible item types |
| Skill tree node data (D-06) | ST-01–ST-10 | At least a small draft tree needed to test the renderer |
| Skill points display location (L15) | ST-09 | Footer HUD vs near tree header |
| Loot table assignments per monster (D-07/08) | CB-08, LT-01 | Which table does each monster reference |
