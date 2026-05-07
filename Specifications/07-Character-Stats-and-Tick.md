# §6.1–6.2 Character Stats & Tick System

← [User Interface](06-UI.md) | [Table of Contents](README.md) | Next: [Data Architecture & Loot →](08-Data-Architecture-and-Loot.md)

---

## 6.1 Character Stats & Calculation Engine

### 6.1.1 Attributes

Attributes are the three primary stats that gate equipment requirements and provide implicit bonuses. They are gained from skill tree nodes and item affixes.

| Attribute | Equipment affinity | Implicit bonus |
|---|---|---|
| **Strength** | Armour-based gear, melee weapons | +2 max Life per point |
| **Dexterity** | Evasion-based gear, ranged weapons | +5 Accuracy Rating per point |
| **Intelligence** | Energy Shield gear, spell weapons | +2 max Mana per point |

Attributes provide **no damage bonus** unless a node or affix explicitly states otherwise.

---

### 6.1.2 Defensive Stats

**Life**
- Total health pool of the character
- Base value + bonuses from Strength (×2 per point) + gear affixes + skill tree nodes
- Reaches 0 → character dies, zone resets to Fight 1
- Restored to full on zone reset

**Mana**
- Resource consumed by skills (V1: basic attack has no mana cost — reserved for V2+ active skills)
- Base value + bonuses from Intelligence (×2 per point) + gear affixes + skill tree nodes
- Regenerates over time via Mana Regen

**Life Regeneration**
- Flat HP restored per second (converted to per-tick in the engine: `regenPerTick = lifeRegen / 50`)
- Sources: gear affixes, skill tree nodes

**Mana Regeneration**
- Flat Mana restored per second (same tick conversion as Life Regen)
- Sources: gear affixes, skill tree nodes

**Armour**
- Reduces **physical damage** taken from both attacks and spells
- Provides no mitigation against elemental or chaos damage
- Damage reduction formula (PoE-inspired):
  ```
  reduction = armour / (armour + 10 × incomingDamage)
  ```
- Reduction is **capped at 90%** regardless of Armour value

**Evasion**
- Grants a **chance to avoid** enemy strikes entirely — binary avoid/don't-avoid roll per hit
- Formula:
  ```
  hitChance = 1 - ((attackerAccuracy × 1.25) / (attackerAccuracy + (defenderEvasion / 5) ^ 0.9))
  hitChance = clamp(hitChance, 0.05, 0.95)
  ```
- Minimum 5% hit chance, maximum 95% hit chance regardless of evasion or accuracy values
- Monster Accuracy Rating is defined per monster type in the data config (see [§6.3.2](08-Data-Architecture-and-Loot.md#632-monster-data))

**Resistances**

Four resistance types, each capping at **75% by default** (hard cap 90%):

| Resistance | Damage type mitigated |
|---|---|
| Fire Resistance | Fire damage |
| Cold Resistance | Cold damage |
| Lightning Resistance | Lightning damage |
| Chaos Resistance | Chaos damage |

- Values can be **negative** (e.g. from certain item modifiers) — negative resistance causes the character to take **increased** damage of that type
- Default cap: **75%**; cap can be raised above 75% (up to 90%) via specific skill tree nodes or unique items
- Formula: `damageTaken = rawDamage × (1 - clamp(resistance, -∞, cap) / 100)`

---

### 6.1.3 Offensive Stats (V1 — Basic Attack)

In V1, the character has a single **basic attack**. Offensive stats are weapon-dependent:

| Condition | Values used |
|---|---|
| No weapon equipped (unarmed) | Fixed baseline values defined in game data config |
| Weapon equipped | Weapon's base damage + applicable modifiers from gear and skill tree |

**Core offensive stats (V1):**

| Stat | Description |
|---|---|
| **Physical Damage** | Base damage range (min–max) of the attack |
| **Attack Time** | Base time between attacks in seconds — default **1.0s** for unarmed; reduced by Attack Speed modifiers. Converted to ticks: `ticksPerAttack = attackTime × 50` |
| **Accuracy Rating** | Character stat (not weapon or skill dependent) — determines hit chance against evasive enemies. Base from Dexterity (+5 per point) + gear affixes + skill tree nodes |
| **Critical Strike Chance** | % chance to deal a critical hit (V1: defined but bonus damage TBD) |

**Unarmed base values (V1):**

| Stat | Value |
|---|---|
| Physical Damage | 10–15 |
| Attack Time | 1.0s (50 ticks) |

Damage types beyond physical (Fire, Cold, Lightning, Chaos) are added via weapon affixes or skill tree nodes and follow the resistance mitigation formula.

---

### 6.1.4 Stat Calculation Order

All final stats are computed dynamically from sources. Calculation follows this strict order to avoid inconsistencies:

```
1. Base value          (character base + attribute implicit bonuses)
2. + Flat additions    (gear affixes, skill tree small nodes)
3. × Additive %        (sum all additive % modifiers, apply once)
4. × Multiplicative %  (each multiplicative modifier applied separately)
5. Apply caps          (resistance cap, armour reduction cap, hit chance clamp)
```

This mirrors PoE's convention and ensures predictable, theorycraftable results.

---

### 6.1.5 Stat Display

All stats are visible in a **Stats panel** accessible from the character / inventory area. Stats are grouped by category:

- **Attributes** — Strength, Dexterity, Intelligence
- **Vitals** — Life (current/max), Mana (current/max), Life Regen/s, Mana Regen/s
- **Defence** — Armour, Evasion, Fire/Cold/Lightning/Chaos Resistance (with cap indicator)
- **Offence** — Physical Damage, Attack Speed, Accuracy Rating, Critical Strike Chance

Each stat shows its **final computed value** with a tooltip breaking down the contributing sources on hover (base + flat + % bonuses).

---

## 6.2 Tick / Time System

### 6.2.1 Tick Rate

- 1 second = **50 ticks**
- 1 tick = **20ms**
- All game operations are expressed in tick rates, never raw milliseconds:
  - Attack time: N ticks between attacks
  - Crafting speed: 1 craft every N ticks
  - Automation triggers: every N ticks
  - Time-based events: resolved against wall-clock timestamps, not ticks

---

### 6.2.2 Architecture — Master Loop + Subsystem Timers

The timing system uses a **single master `requestAnimationFrame` loop** as the heartbeat, driving a set of **independently activatable subsystem timers**. There is no per-subsystem RAF loop — the master loop is the only one.

```
requestAnimationFrame (master loop)
    ↓
Compute elapsed ticks since last frame
    ↓
For each registered subsystem timer:
    if active → dispatch ticks
    if inactive → skip entirely (zero overhead)
```

This keeps the browser rendering pipeline clean while giving each subsystem full independent control over when it runs.

**Master loop responsibilities:**
- Maintain an authoritative **wall-clock timestamp** (`Date.now()`) as the source of truth
- Compute `ticksToProcess = floor(elapsed / 20)` per frame
- Advance `lastTimestamp` by `ticksToProcess × 20` (never raw elapsed, prevents drift)
- Carry remaining sub-tick time to the next frame
- Dispatch ticks only to **active** subsystem timers, in deterministic order

---

### 6.2.3 Subsystem Timers

Each subsystem timer is a self-contained unit with its own activation state, offline behaviour, and tick handler. Two timers exist in V1:

**Combat Timer**

| Property | Value |
|---|---|
| Purpose | Drives zone combat (attack resolution, monster AI, loot generation) |
| Active when | A zone is actively running |
| Activates on | Player enters a zone |
| Deactivates on | Zone completed, player dies, player exits the zone |
| Offline behaviour | **Does not catch up** — combat is paused when the browser is closed |
| In-app tab switch | Remains active — combat continues if player navigates to Inventory or Skill Tree |

**Auto-Craft Timer**

| Property | Value |
|---|---|
| Purpose | Drives the automated crafting queue |
| Active when | Auto-craft is enabled and the selected currency has available stack |
| Activates on | Player enables auto-craft |
| Deactivates on | Currency stack reaches 0, player disables auto-craft, stop condition met |
| Offline behaviour | **Catches up** — computes missed ticks from elapsed real time on session resume |
| In-app tab switch | Remains active regardless of active tab |

**Conceptual registration interface:**

```js
timerSystem.register({
  id: 'combat',
  offlineCatchup: false,
  onTick: (logicalTimestamp) => { /* combat logic */ },
});

timerSystem.register({
  id: 'autoCraft',
  offlineCatchup: true,
  onTick: (logicalTimestamp) => { /* craft logic */ },
});

// Activation control
timerSystem.activate('combat');
timerSystem.deactivate('combat');
```

---

### 6.2.4 Heavy Operation Recovery

If a frame takes longer than 20ms (GC pause, heavy computation), the next frame detects a larger elapsed and processes multiple ticks in sequence — simulating each at its correct logical timestamp.

**Recovery rules:**
- Ticks processed **in chronological order**, never skipped
- Each tick receives its **logical timestamp** (`lastTimestamp + tickIndex × 20`), not current wall time
- **No cap on in-session catch-up** — if the browser stutters for 2 seconds, 100 ticks are processed in the next frame, in order
- Subsystem handlers must be written for efficient batch processing (no heavy I/O per tick)

**Example:**
```
Last processed: t=1000 — Current wall time: t=1120 → 6 ticks behind
→ Dispatch t=1020, t=1040, t=1060, t=1080, t=1100, t=1120 in sequence
```

---

### 6.2.5 Offline / Background Behaviour

Behaviour on browser close / session resume is defined **per subsystem timer**:

| Timer | On browser close | On session resume |
|---|---|---|
| **Combat** | Deactivates — state frozen | Resumes from frozen state; no catch-up ticks |
| **Auto-craft** | State preserved in save file | Computes `missedTicks = floor(missedRealTime / 20)`, processes in batch |
| **Time-based events** | Resolved via wall-clock `endTimestamp` | Compare `endTimestamp` vs `Date.now()` — resolve immediately if elapsed |

**Session resume sequence:**
1. Load save — read `lastSavedTimestamp`
2. Compute `missedRealTime = Date.now() - lastSavedTimestamp`
3. Auto-craft timer: if was active → compute and process `missedTicks` in batch
4. Time-based events: resolve any whose `endTimestamp` has passed
5. Combat timer: restore to last known state (zone progress intact, not replayed)
6. Restart master RAF loop

---

### 6.2.6 Dispatch Order

When multiple timers are active in the same frame, ticks are dispatched in this fixed order:

1. Time-based event resolution (wall-clock, not tick-driven)
2. Combat timer
3. Auto-craft timer
4. *(Future timers registered here)*
5. UI state snapshot (batched, once per frame — not per tick)

UI updates are **fully decoupled from tick processing**. Game state mutates every tick; React re-renders are throttled to the RAF frame rate.

---

### 6.2.7 Future Timers

Additional subsystem timers can be registered as new systems are introduced. Each follows the same pattern: declare purpose, activation condition, deactivation condition, and offline catch-up policy. Candidate future timers:

| Timer | Purpose | Likely activation |
|---|---|---|
| Auto-battle | Drives automated zone selection (V2+) | Auto-battle enabled + zone active |
| League events | Drives timed league mechanics (V2+) | League active |

---

← [User Interface](06-UI.md) | [Table of Contents](README.md) | Next: [Data Architecture & Loot →](08-Data-Architecture-and-Loot.md)
