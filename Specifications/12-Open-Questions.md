# §10 Open Questions & Pending Decisions

← [Glossary](11-Glossary.md) | [Table of Contents](README.md)

This section tracks everything that has been intentionally deferred, is not yet fully defined, or requires further discussion before or during implementation. It should be updated as decisions are made.

---

## 10.1 High Priority — Required for V1

| # | Topic | Status | Notes |
|---|---|---|---|
| H1 | **Inventory UI layout** | 🟢 Decided | Three-column layout: equipment panel, 12×12 grid + stash tabs, currency panel — see [§3.2](03-Inventory-and-Crafting.md) & [§5.8](06-UI.md#58-inventory-tab--layout) |
| H2 | **Character stat list** | 🟢 Decided | HP, Mana, Life/Mana Regen, Armour, Evasion, 4 resistances, STR/DEX/INT, basic attack offensive stats — see [§6.1](07-Character-Stats-and-Tick.md#61-character-stats--calculation-engine) |
| H3 | **Data architecture** | 🟢 Decided | JSON config files per domain (/monsters, /zones, /items, /affixes, /skills, /nodes) — see [§6.3](08-Data-Architecture-and-Loot.md#63-data-architecture) |
| H4 | **Save file schema** | 🟢 Decided | Multiple `irpg_*` localStorage keys, full schema with item object structure — see [§4](05-Persistence.md) |
| H6 | **Respec Resource naming** | 🟢 Decided | Called **Orb of Regret** — grants 1 respec point on use, applies to main skill tree only — see [§3.3.2](03-Inventory-and-Crafting.md#332-currency-reference) & [§3.4.4](04-Skill-Tree-and-Ascension.md#344-point-refund) |
| H7 | **Stash unlock conditions** | 🟢 Decided | 2 default tabs; Tab 3 on Act 5 Zone 12 completion; Tab 4 on Act 10 Zone 12 completion — see [§3.2.4](03-Inventory-and-Crafting.md#324-stash-tabs) |
| H8 | **Currency item list** | 🟢 Decided | 9 currency types defined — see [§3.3.2](03-Inventory-and-Crafting.md#332-currency-reference) |
| H10 | **Unarmed base values** | 🟢 Decided | 10–15 physical damage, 1.0s base attack time (50 ticks) — see [§6.1.3](07-Character-Stats-and-Tick.md#613-offensive-stats-v1--basic-attack) |
| H12 | **Monster affix pool** | 🟢 Decided | 6 prefixes (damage) + 7 suffixes (tankyness), 2 tiers each, loot bonus stored per tier in affix definition — see [§6.3.6](08-Data-Architecture-and-Loot.md#636-monster-affixes) |
| H13 | **Loot table structure** | 🟢 Decided | Table-driven, list-based, weighted draws with null entry, binary search optimisation, fractional draw model — see [§6.4](08-Data-Architecture-and-Loot.md#64-loot-system) |

---

## 10.2 Medium Priority — Required Before or During V2

| # | Topic | Status | Notes |
|---|---|---|---|
| M1 | **Loot system** | 🟢 Decided | Table + list structure, multiplier model, draw resolution — see [§6.4](08-Data-Architecture-and-Loot.md#64-loot-system). Item base types and affix pool still TBD (L17, L18) |
| M2 | **Crafting UI** | 🔴 Not discussed | Queue interface, material management panel, stop condition configuration |
| M3 | **Ascension Point formula** | 🟡 Partially defined | Fibonacci-inspired diminishing returns — exact formula TBD during balancing |
| M4 | **Ascension tree topology** | 🔴 Not discussed | Shape and regional structure of the Ascension Tree |
| M5 | **Ascension tree refund mechanic** | 🔴 Not discussed | Whether Ascension Tree nodes can be refunded, and at what cost |
| M6 | **Enemy stat scaling** | 🔴 Not discussed | How monster HP, damage, and modifiers scale across zones and acts |
| M7 | **XP curve** | 🟢 Decided | `100 × 1.2^(N-1)` per level; monster XP = `5 × level^1.1 × rarityMult × affixMod` — see [§6.5](09-XP-Numbers-Achievements.md) |
| M8 | **Item level calculation** | 🟢 Decided | Item level = zone level = monster level — same formula: `floor((actIndex-1)×6 + (zoneIndex-1)×0.5) + 1` |
| M9 | **Auto-battle unlock condition** | 🔴 Not discussed | What gates the auto-battle feature (level, Ascension Tree node, zone reached?) |
| M10 | **Ascension threshold condition** | 🟡 Partially defined | Not in V1 — may be player level, zone progression, or a mix; TBD during balancing |

---

## 10.3 Low Priority — V2+ / Intentionally Deferred

| # | Topic | Status | Notes |
|---|---|---|---|
| L1 | **League system** | 🔴 Not discussed | Mechanics, structure, integration with base game — full design TBD |
| L2 | **Combat visualization (PixiJS)** | 🔴 Not discussed | Real-time combat rendering in PixiJS — V2+ only |
| L3 | **Achievements system** | 🔴 Not discussed | Structure, unlock conditions, reward types |
| L4 | **Boss mechanics** | 🔴 Not discussed | Special attack patterns, phases, unique drops |
| L5 | **Zone modifiers** | 🔴 Not discussed | PoE map mod equivalent — increased monster life, extra rares, etc. |
| L6 | **Active skills in combat** | 🔴 Not discussed | How active skills are acquired, triggered, and integrated into the tick system |
| L7 | **Minimap for skill trees** | 🔴 Not discussed | Optional overview panel for navigating large trees |
| L8 | **Game name** | 🔴 Not discussed | The game has no name yet |
| L9 | **Logo / visual identity** | 🔴 Not discussed | Header logo, iconography style, font choice |
| L10 | **Large number library** | 🟡 Partially defined | Candidates: `break_infinity.js` or `decimal.js` — final choice TBD |
| L11 | **React version** | 🔴 Not discussed | Specific React version to target |
| L12 | **Second prestige layer** | 🔴 Not discussed | Whether a prestige-of-prestige system exists beyond Ascension |
| L13 | **Critical strike behaviour (V1)** | 🔴 Not discussed | Moved from H9 — not relevant until active skills are designed |
| L14 | **Post-Acts tier system** | 🔴 Not discussed | Monster level formula beyond Act 10, replaces zone-based calculation |
| L15 | **Skill points display location** | 🔴 Not discussed | Footer HUD vs near tree header — to decide during UI implementation |
| L16 | **Tick engine / Context bridge** | 🟢 Decided | Single RAF master loop + subsystem timers; UI decoupled via batched frame-rate updates — see [§6.2](07-Character-Stats-and-Tick.md#62-tick--time-system) |
| L17 | **Item base types** | 🔴 Not discussed | Base weapon/armour types and their base stats — to discuss alongside loot tables |
| L18 | **Item affix pool** | 🔴 Not discussed | Full item affix definitions, tiers, value ranges — to discuss alongside loot tables |
| L19 | **Save file schema** | 🟢 Decided | Multiple localStorage keys (`irpg_*`), one per domain, single save slot — see [§4](05-Persistence.md) |

---

## 10.4 Decision Log

Decisions that were discussed and explicitly closed, for traceability.

| # | Decision | Outcome | Section |
|---|---|---|---|
| D1 | 2D rendering library | **PixiJS** — single engine for all canvas needs | [§3.4.7](04-Skill-Tree-and-Ascension.md#347-rendering--technology) |
| D2 | State management | **React native Context API** — no external library, one context per domain | [§8](10-Roadmap-and-Constraints.md) |
| D3 | Backend | **None** — fully client-side | [§8](10-Roadmap-and-Constraints.md) |
| D4 | Monetization | **None** — free passion project | [§1.2](01-Vision-and-Progression.md) |
| D5 | Save storage | **localStorage / IndexedDB** — client-side only | [§4.1](05-Persistence.md#41-storage-model) |
| D6 | Tick rate | **50 ticks/second** (20ms per tick) | [§6.2.1](07-Character-Stats-and-Tick.md#621-tick-rate) |
| D7 | Timer architecture | **Single master RAF loop + independently activatable subsystem timers** | [§6.2.2](07-Character-Stats-and-Tick.md#622-architecture--master-loop--subsystem-timers) |
| D8 | In-app tab navigation during combat | **Continues** — combat timer stays active regardless of active tab | [§3.1.7](02-Combat.md#317-background-combat) |
| D9 | Monster rarity system | **Normal / Magic / Rare / Unique** — exact PoE naming | [§3.1.5](02-Combat.md#315-monster-rarity) |
| D10 | Skill point refund | **Respec Resource** — one node at a time, bridge-path protected | [§3.4.4](04-Skill-Tree-and-Ascension.md#344-point-refund) |
| D11 | Ascension repeatable | **Yes** — fixed threshold, diminishing point returns | [§3.5.3](04-Skill-Tree-and-Ascension.md#353-ascension-threshold) |
| D12 | Ascension tree persistence | **Permanent** — points accumulate across all runs, never reset | [§3.5.4](04-Skill-Tree-and-Ascension.md#354-ascension-tree) |
| D13 | Language | **English only** — no i18n system | [§8](10-Roadmap-and-Constraints.md) |
| D14 | Skill tree topology | **Radial fractal** — root at center, travel nodes + pattern clusters | [§3.4.6](04-Skill-Tree-and-Ascension.md#346-main-skill-tree-topology) |
| D15 | Travel node type | **Always Small** — no exceptions | [§3.4.6](04-Skill-Tree-and-Ascension.md#346-main-skill-tree-topology) |
| D16 | Inventory grid size | **12×12**, same size for stash tabs — revisit in V2 if needed | [§3.2.3](03-Inventory-and-Crafting.md#323-inventory-grid) |
| D17 | Item grid size (V1) | **1 slot per item** — variable sizes (NxM) deferred to V2+ | [§3.2.3](03-Inventory-and-Crafting.md#323-inventory-grid) |
| D18 | Stash tab management | **4 tabs total** — 2 default, Tab 3 on Act 5 Z12, Tab 4 on Act 10 Z12 | [§3.2.4](03-Inventory-and-Crafting.md#324-stash-tabs) |
| D19 | Currency storage | **Dedicated currency panel** — never stored in the main grid | [§3.2.5](03-Inventory-and-Crafting.md#325-currency-panel) |
| D20 | Resistance cap | **75% default, 90% hard cap** — negative values allowed | [§6.1.2](07-Character-Stats-and-Tick.md#612-defensive-stats) |
| D21 | Armour formula | **PoE-inspired**: `armour / (armour + 10 × damage)`, capped at 90% | [§6.1.2](07-Character-Stats-and-Tick.md#612-defensive-stats) |
| D22 | Stat calculation order | **Base → flat → additive % → multiplicative % → caps** | [§6.1.4](07-Character-Stats-and-Tick.md#614-stat-calculation-order) |
| D23 | V1 offensive system | **Single basic attack** — unarmed fallback values, weapon values when equipped | [§6.1.3](07-Character-Stats-and-Tick.md#613-offensive-stats-v1--basic-attack) |
| D24 | Monster level formula | **Zone-derived**: `floor((actIndex-1)×6 + (zoneIndex-1)×0.5) + 1` — levels 1–60 | [§6.3.4](08-Data-Architecture-and-Loot.md#634-monster-level-formula) |
| D25 | Monster level scaling | **5% multiplicative per level**: `baseStat × 1.05^(level-1)` | [§6.3.5](08-Data-Architecture-and-Loot.md#635-monster-stat-scaling) |
| D26 | Monster rarity multipliers | Normal ×1.0 / Magic ×1.15 / Rare ×1.50 / Unique ×2.00–3.00 | [§6.3.5](08-Data-Architecture-and-Loot.md#635-monster-stat-scaling) |
| D27 | Monster affix limits | Normal: 0 / Magic: max 2 / Rare: max 6 / Unique: unlimited (hand-authored) | [§6.3.6](08-Data-Architecture-and-Loot.md#636-monster-affixes) |
| D28 | Monster attributes | Monsters have no STR/DEX/INT or Mana — defensive and offensive stats only | [§6.3.2](08-Data-Architecture-and-Loot.md#632-monster-data) |
| D29 | Currency item list | 9 currency types defined | [§3.3.2](03-Inventory-and-Crafting.md#332-currency-reference) |
| D30 | Quality mechanic | +1% per use, cap 20%, applies to key stat per item type | [§3.3.3](03-Inventory-and-Crafting.md#333-quality-mechanic) |
| D31 | Divine Orb behaviour | Re-rolls values within current tier only — cannot change tier | [§3.3.5](03-Inventory-and-Crafting.md#335-modifier-tiers) |
| D32 | Respec currency | **Orb of Regret** — 1 orb = 1 respec point, main skill tree only | [§3.3.2](03-Inventory-and-Crafting.md#332-currency-reference), [§3.4.4](04-Skill-Tree-and-Ascension.md#344-point-refund) |
| D33 | Accuracy source | **Character stat only** — base from Dexterity + gear + tree | [§6.1.3](07-Character-Stats-and-Tick.md#613-offensive-stats-v1--basic-attack) |
| D34 | Unarmed base values | **10–15 physical damage**, 1.0s base attack time | [§6.1.3](07-Character-Stats-and-Tick.md#613-offensive-stats-v1--basic-attack) |
| D35 | Attack time model | Base attack time in seconds, reduced by Attack Speed modifiers | [§6.1.3](07-Character-Stats-and-Tick.md#613-offensive-stats-v1--basic-attack) |
| D36 | Monster affix structure | Prefix = damage, Suffix = tankyness; 2 tiers (T1 highest) | [§6.3.6](08-Data-Architecture-and-Loot.md#636-monster-affixes) |
| D37 | Monster loot bonuses | Affix T1 +4%, T2 +2%; level +0.5%/level; Magic +10%, Rare +20%, Unique +50% | [§6.3.6](08-Data-Architecture-and-Loot.md#636-monster-affixes) |
| D38 | Pack count formula | `2 + floor(actIndex/3) + floor(zoneIndex/4)` — ranges from 2 to 7 | [§3.1.3](02-Combat.md#313-zone--pack-structure) |
| D39 | Pack monster composition | 2–5 monsters per pack; max 2 Magic, max 1 Rare, 0 Unique except last pack | [§3.1.3](02-Combat.md#313-zone--pack-structure) |
| D40 | Boss pack rule | Last pack of every zone guarantees a Unique as the final monster | [§3.1.3](02-Combat.md#313-zone--pack-structure) |
| D41 | Monster selection | **Random from zone pool** — V1 uses 10 globally defined monster types | [§6.3.3](08-Data-Architecture-and-Loot.md#633-v1-monster-pool), [§6.3.7](08-Data-Architecture-and-Loot.md#637-zone-data) |
| D42 | Unique per zone | **Random from zone pool** — no fixed boss per zone in V1 | [§6.3.7](08-Data-Architecture-and-Loot.md#637-zone-data) |
| D43 | Pack content persistence | **Generated at runtime on zone entry, never saved** — discarded on exit or death | [§6.3.7](08-Data-Architecture-and-Loot.md#637-zone-data) |
| D44 | Item level | **Equals zone level** — same formula as monster level | [§6.3.7](08-Data-Architecture-and-Loot.md#637-zone-data) |
| D45 | Orb of Regret UI placement | **Currency panel** — displayed alongside crafting orbs | [§3.3.2](03-Inventory-and-Crafting.md#332-currency-reference) |
| D46 | Starting node bonus | **None** — grants no stat, exists only as a connection anchor | [§3.4.5](04-Skill-Tree-and-Ascension.md#345-topology--layout) |
| D47 | Death recovery | **HP and Mana fully restored** on zone reset | [§3.1.4](02-Combat.md#314-zone-completion) |
| D48 | Loot list draw model | **Floor + fractional chance** — e.g. 1.6x = 1 draw + 60% chance of a 2nd | [§6.4.5](08-Data-Architecture-and-Loot.md#645-draw-count--loot-multiplier) |
| D49 | Loot list independence | **Each list has its own base draw count** — rolled independently | [§6.4.3](08-Data-Architecture-and-Loot.md#643-loot-table-structure) |
| D50 | Duplicate drops | **Allowed** — each draw is independent, same item can drop multiple times | [§6.4.5](08-Data-Architecture-and-Loot.md#645-draw-count--loot-multiplier) |
| D51 | Loot resolution optimisation | **Pre-computed cumulative weight array** — binary search O(log n) per draw | [§6.4.2](08-Data-Architecture-and-Loot.md#642-loot-list-structure) |
| D52 | Null entry position | **Always last** in the list — acts as the probability floor | [§6.4.2](08-Data-Architecture-and-Loot.md#642-loot-list-structure) |
| D53 | Save structure | **Multiple localStorage keys** (`irpg_*`), one per domain — single save slot | [§4.1](05-Persistence.md#41-storage-model) |
| D54 | Derived stats not saved | HP max, mana max, armour total etc. recomputed at load — never persisted | [§4.2](05-Persistence.md#42-save-schema--per-key) |
| D55 | Active zone not saved | Pack contents discarded on exit — regenerated on next entry | [§4.2](05-Persistence.md#42-save-schema--per-key) |
| D56 | Item rolled values persisted | `rolledValue` stored per affix — Divine Orb can re-roll without tier lookup | [§4.3](05-Persistence.md#43-item-object-schema) |
| D57 | Auto-save scope | Only dirty keys written per auto-save tick — not the full save | [§4.5](05-Persistence.md#45-auto-save--manual-save) |
| D58 | Combat log placement | In Map tab, scrollable feed, auto-scrolls to bottom unless player scrolled up | [§5.11](06-UI.md#511-combat-log) |
| D59 | Combat log persistence | Not persisted — cleared on zone exit or reload; max 500 lines | [§5.11](06-UI.md#511-combat-log) |
| D60 | Combat log toggles | Each event type individually toggleable; saved in `irpg_settings` | [§5.11](06-UI.md#511-combat-log) |
| D61 | Notification stacking | Newest at bottom; max 5 visible at once | [§5.12](06-UI.md#512-notification-system) |
| D62 | Notification dismissal | Auto-dismiss (default 4s); click to dismiss early; hover pauses timer | [§5.12](06-UI.md#512-notification-system) |
| D63 | Notification panel toggle | Can be fully disabled in settings | [§5.12](06-UI.md#512-notification-system) |
| D64 | Sound system | Deferred to V2+ — bindable per event | [§5.12](06-UI.md#512-notification-system) |
| D65 | XP curve formula | `100 × 1.2^(N-1)` XP required per level — geometric progression | [§6.5.1](09-XP-Numbers-Achievements.md#651-xp-required-per-level) |
| D66 | Monster XP formula | `5 × level^1.1 × rarityMultiplier × affixModifier` | [§6.5.2](09-XP-Numbers-Achievements.md#652-xp-per-monster-kill) |
| D67 | XP rarity multipliers | Normal ×1 / Magic ×2 / Rare ×3 / Unique ×6 | [§6.5.2](09-XP-Numbers-Achievements.md#652-xp-per-monster-kill) |
| D68 | XP award timing | **Per monster kill** — awarded immediately on death | [§6.5.2](09-XP-Numbers-Achievements.md#652-xp-per-monster-kill) |
| D69 | XP storage | Stored as absolute cumulative value — level derived at runtime | [§6.5.1](09-XP-Numbers-Achievements.md#651-xp-required-per-level) |

---

← [Glossary](11-Glossary.md) | [Table of Contents](README.md)
