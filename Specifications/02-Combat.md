# §3.1 Combat Module

← [Vision & Progression](01-Vision-and-Progression.md) | [Table of Contents](README.md) | Next: [Inventory & Crafting →](03-Inventory-and-Crafting.md)

---

## 3.1.1 World Structure

The game world is divided into **Acts** and **Zones**:

| Level | Count | Description |
|---|---|---|
| **Acts** | 10 | Major narrative / thematic chapters |
| **Zones per Act** | 12 | Individual areas within an Act |
| **Fights per Zone** | 1 – N | Sequential packs of monsters |
| **Monsters per Fight** | 1 – M | Individual enemies within a pack |

Total content at launch: **120 zones**, each with a unique pool of monsters and a boss encounter.

---

## 3.1.2 Zone Progression & Unlocking

- All zones within an Act are **visible to the player from the start**, but locked until the prerequisite zone is completed
- Zones unlock **sequentially**: completing Zone N unlocks Zone N+1
- The final zone of each Act contains the **Act Boss**
- Completing the Act Boss unlocks Act N+1 (first zone pre-unlocked)
- **Completed zones can be replayed freely** for farming — no reward penalty

Zone states:

| State | Description |
|---|---|
| `locked` | Visible, not yet accessible |
| `unlocked` | Available to enter, not yet completed |
| `completed` | All monsters defeated at least once; replayable |
| `active` | Currently selected and running |

---

## 3.1.3 Zone & Pack Structure

**Pack count per zone:**

The number of packs in a zone is fixed and determined by the Act and Zone indices:

```
packCount = 2 + floor(actIndex / 3) + floor(zoneIndex / 4)
```

Sample values:

| Act | Zone | Pack count |
|---|---|---|
| 1 | 1 | 2 |
| 1 | 4 | 3 |
| 3 | 1 | 3 |
| 3 | 8 | 4 |
| 6 | 12 | 7 |
| 10 | 12 | 7 |

**Pack composition:**

Each pack (except the last) contains a **random number of monsters between 2 and 5**, with the following rarity constraints:

| Rarity | Max per pack |
|---|---|
| Normal | Unlimited (fills remaining slots) |
| Magic | At most 2 |
| Rare | At most 1 |
| Unique | 0 (except last pack) |

**Last pack (boss pack):**

The final pack of every zone always contains a **guaranteed Unique monster** as the last monster to fight. Other monsters in the pack (if any) follow the standard composition rules above.

**Combat order within a pack:**

V1: monsters are fought sequentially one at a time. Normal and Magic monsters are resolved first; the Rare (if present) fights next; the Unique (in the last pack) always fights last.

---

## 3.1.4 Zone Completion

A zone is considered **completed** when every monster in every pack has been defeated. Completion is recorded in the save file and persists across sessions.

If the player dies at any point during a zone, the **zone resets to Pack 1**, and the player's HP and Mana are fully restored. Pack content is re-generated on re-entry (see section 3.1.3).

---

## 3.1.5 Monster Rarity

Monsters follow the same rarity system as items, using PoE naming conventions:

| Rarity | Frequency | Characteristics |
|---|---|---|
| **Normal** | Common | Base stats, low rewards |
| **Magic** | Occasional | 1–2 stat modifiers, slightly increased rewards |
| **Rare** | Uncommon | 3–6 stat modifiers, named, notable rewards |
| **Unique** | Boss only | Unique mechanics, fixed abilities, major rewards |

Higher rarity monsters have increased HP, damage, and drop rates. Rare and Unique monsters may have special modifiers (resistances, regeneration, extra speed, etc.) — defined in data config per monster.

---

## 3.1.6 Combat Mechanics — V1

Combat is **fully automatic** (idle). The player does not need to interact for combat to proceed.

**Combat resolution (per tick):**
1. If the player's attack timer has elapsed → player attacks the current monster
2. If the monster's attack timer has elapsed → monster attacks the player
3. Each attack rolls for evasion, then applies damage through armour and resistances
4. If monster HP reaches 0 → monster defeated, loot rolled, next monster in pack queued
5. If player HP reaches 0 → zone resets to Pack 1, player HP and Mana fully restored

**Attack timing:**
Both the player and each monster have an **attack time** (in seconds). Each is tracked independently via its own countdown timer driven by the global tick system.

```
attackTimerTicks = attackTime × 50
```

On each tick the timer decrements. When it reaches 0, the attack fires and the timer resets.

**Hit resolution:**

Evasion is resolved as a probability check before damage is applied:

```
hitChance = 1 - ((attackerAccuracy × 1.25) / (attackerAccuracy + (defenderEvasion / 5) ^ 0.9))
hitChance = clamp(hitChance, 0.05, 0.95)
```

If the attack misses, no damage is dealt. If it hits, damage is calculated as:

```
1. Roll damage in [damageMin, damageMax]
2. Apply armour reduction: reduction = armour / (armour + 10 × damage), capped at 90%
3. Apply resistance for the damage type: damageTaken = damage × (1 - clamp(resistance, -∞, cap) / 100)
```

**On player death:**
- Zone resets to Pack 1
- Player HP restored to full
- Player Mana restored to full
- Pack content is re-generated (see section 3.1.3)

Combat is **one-on-one** in V1: monsters in a pack are fought sequentially one at a time.

---

## 3.1.7 Background Combat

Combat is driven entirely by the global tick system (see [§6.2 Tick System](07-Character-Stats-and-Tick.md#62-tick--time-system)) and has no dependency on the Map tab being the active view. When the player navigates away from the Map tab:

- All combat logic continues uninterrupted — ticks fire, damage is resolved, monsters die, loot is rolled, zone progression advances
- Auto-battle automation (when unlocked) continues operating normally
- The **only thing that stops** is PixiJS rendering — the canvas is not updated while the tab is not visible
- On returning to the Map tab, the canvas re-renders the current game state immediately — the player sees the accurate live state, not a stale snapshot

This is a natural consequence of the architecture: game state and rendering are fully decoupled. The tick engine owns state; PixiJS only reads it to render.

**Note:** this applies to navigating between in-app tabs (Inventory, Map, Skill Tree). Browser tab backgrounding follows the separate hybrid policy defined in [§6.2.5](07-Character-Stats-and-Tick.md#625-offline--background-behaviour).

---

## 3.1.8 Auto-Battle System (V2+)

Once unlocked (via skill tree node or progression milestone), the player can configure automatic zone selection:

| Mode | Behavior |
|---|---|
| **Repeat zone** | Farm the current zone indefinitely |
| **Advance on completion** | Move to the next zone automatically upon completion |
| **Best farming zone** | Auto-select the highest completed zone (configurable criteria) |

Auto-battle runs fully in the background and respects offline progress rules (see [§6.2](07-Character-Stats-and-Tick.md#62-tick--time-system)).

---

## 3.1.9 Planned Evolutions (V2+)

- Multi-monster simultaneous combat (AoE, splash damage)
- Active skills triggerable manually or automatically
- Advanced mechanics: evasion, elemental resistances, status effects (burn, freeze, stun…)
- Monster special abilities and boss attack patterns
- Zone modifiers (increased monster life, extra magic monsters, etc. — inspired by PoE map mods)

---

← [Vision & Progression](01-Vision-and-Progression.md) | [Table of Contents](README.md) | Next: [Inventory & Crafting →](03-Inventory-and-Crafting.md)
