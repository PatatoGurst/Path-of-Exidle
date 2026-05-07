# §6.3–6.4 Data Architecture & Loot System

← [Character Stats & Tick System](07-Character-Stats-and-Tick.md) | [Table of Contents](README.md) | Next: [XP, Numbers & Achievements →](09-XP-Numbers-Achievements.md)

---

## 6.3 Data Architecture

### 6.3.1 Overview

All game content is defined as **static JSON configuration files** — no content is hardcoded in logic. This ensures that adding monsters, zones, items, affixes, or nodes never requires touching engine code.

Each major domain has its own config file or folder:

```
/data
  /monsters        — monster type definitions
  /zones           — zone and act definitions
  /items           — base item types
  /affixes         — affix pools (for items and monsters)
  /skills          — monster skills and (future) player skills
  /nodes           — skill tree node definitions per tree
```

---

### 6.3.2 Monster Data

**Monster type definition (JSON schema):**

```json
{
  "id": "skeleton_warrior",
  "name": "Skeleton Warrior",
  "baseStats": {
    "hp": 80,
    "armour": 10,
    "evasion": 0,
    "fireResistance": 0,
    "coldResistance": 0,
    "lightningResistance": 0,
    "chaosResistance": -20,
    "accuracy": 100
  },
  "skill": {
    "id": "basic_slash",
    "damageMin": 8,
    "damageMax": 14,
    "damageType": "physical",
    "attackTime": 1.5
  },
  "lootTable": "loot_humanoid_common",
  "experience": 40
}
```

Monsters do **not** have Attributes (STR / DEX / INT) or Mana — only the defensive and offensive stats relevant to combat.

---

### 6.3.3 V1 Monster Pool

For V1, **10 monster types** are defined as the global pool. Zones draw randomly from this pool (or a subset defined per zone). Unique encounters are also drawn randomly from this pool.

| ID | Name | Theme | Damage type | Notable trait |
|---|---|---|---|---|
| `skeleton_warrior` | Skeleton Warrior | Undead | Physical | Low evasion, moderate armour |
| `skeleton_archer` | Skeleton Archer | Undead | Physical | High accuracy, low HP |
| `zombie` | Zombie | Undead | Physical | High HP, very slow attack |
| `ghoul` | Ghoul | Undead | Physical | Fast attack, no armour |
| `fire_imp` | Fire Imp | Demon | Fire | Fire damage, low HP |
| `frost_wraith` | Frost Wraith | Spirit | Cold | Cold damage, high evasion |
| `lightning_wisp` | Lightning Wisp | Spirit | Lightning | Lightning damage, fast attack |
| `venomous_spider` | Venomous Spider | Beast | Chaos | Chaos damage, very fast |
| `stone_golem` | Stone Golem | Construct | Physical | Very high armour, slow |
| `dark_mage` | Dark Mage | Human | Chaos | Chaos damage, casts from range |

Each monster type has its own base stats and skill definition in the data config. Exact base stat values to be authored during implementation.

---

### 6.3.4 Monster Level Formula

Monster level is **derived from the zone**, not defined per monster type:

```
monsterLevel = floor((actIndex - 1) × 12 × 0.5 + (zoneIndex - 1) × 0.5) + 1
```

Where `actIndex` is 1–10 and `zoneIndex` is 1–12 within the act. This produces:

| Position | Monster level |
|---|---|
| Act 1, Zone 1 | Level 1 |
| Act 1, Zone 12 | Level 6 |
| Act 2, Zone 1 | Level 7 |
| Act 5, Zone 6 | Level 25 |
| Act 10, Zone 12 | Level 60 |

**Post-Acts content (V2+):** a tier system will replace this formula — exact calculation TBD.

---

### 6.3.5 Monster Stat Scaling

All base stats are scaled by level first, then by rarity.

**Level scaling (multiplicative per level):**
```
scaledStat = baseStat × (1.05 ^ (monsterLevel - 1))
```

A level 10 monster has `1.05^9 ≈ 1.55×` its base stats. A level 30 monster has `1.05^29 ≈ 4.12×`.

**Rarity multiplier (applied after level scaling):**

| Rarity | Stat multiplier | Notes |
|---|---|---|
| Normal | ×1.00 | Baseline |
| Magic | ×1.15 | +15% to all scaled stats |
| Rare | ×1.50 | +50% to all scaled stats |
| Unique | ×2.00 – ×3.00 | Range defined per unique monster |

```
finalStat = baseStat × (1.05 ^ (monsterLevel - 1)) × rarityMultiplier
```

---

### 6.3.6 Monster Affixes

In addition to the rarity multiplier, Magic, Rare, and Unique monsters can roll **affixes** that add specific modifiers beyond flat stat scaling:

| Rarity | Max affixes |
|---|---|
| Normal | 0 |
| Magic | 2 |
| Rare | 6 |
| Unique | Unlimited (hand-authored) |

#### Prefix Affixes (damage-focused)

Prefixes generally increase monster offensive output. Each affix has 2 tiers — Tier 1 is always the highest value.

| Affix | Type | Tier 1 | Tier 2 | Effect |
|---|---|---|---|---|
| Monster Damage | Prefix | +15% | +10% | Increases all damage dealt by the monster |
| Monster Physical Damage | Prefix | +15% | +10% | Increases physical damage dealt |
| Monster Fire Damage | Prefix | +15% | +10% | Increases fire damage dealt |
| Monster Cold Damage | Prefix | +15% | +10% | Increases cold damage dealt |
| Monster Lightning Damage | Prefix | +15% | +10% | Increases lightning damage dealt |
| Monster Chaos Damage | Prefix | +15% | +10% | Increases chaos damage dealt |

#### Suffix Affixes (tankyness-focused)

Suffixes generally increase monster survivability.

| Affix | Type | Tier 1 | Tier 2 | Effect |
|---|---|---|---|---|
| Monster Life | Suffix | +10% | +5% | Increases maximum HP of the monster |
| Monster Fire Resistance | Suffix | +10% | +5% | Increases fire resistance |
| Monster Cold Resistance | Suffix | +10% | +5% | Increases cold resistance |
| Monster Lightning Resistance | Suffix | +10% | +5% | Increases lightning resistance |
| Monster Chaos Resistance | Suffix | +10% | +5% | Increases chaos resistance |
| Monster Armour | Suffix | +20 | +10 | Flat armour added to the monster |
| Monster Evasion | Suffix | +20 | +10 | Flat evasion added to the monster |

#### Loot Bonus Component

Each affix carries its own **loot bonus multiplier** stored directly in the affix definition.

| Affix tier | Loot quantity bonus |
|---|---|
| Tier 1 | +4% |
| Tier 2 | +2% |

**All loot quantity bonuses (all multiplicative):**

| Source | Bonus | Stacking |
|---|---|---|
| Each affix (Tier 2) | +2% quantity | Multiplicative |
| Each affix (Tier 1) | +4% quantity | Multiplicative |
| Monster level | +0.5% per level | Multiplicative |
| Magic rarity | +10% quantity | Multiplicative |
| Rare rarity | +20% quantity | Multiplicative |
| Unique rarity | +50% quantity | Multiplicative |

**Example — Rare monster, level 10, 2 affixes (both Tier 1):**
```
totalLoot = 1.04 × 1.04 × (1 + 10 × 0.005) × 1.20
           = 1.04 × 1.04 × 1.05 × 1.20
           ≈ 1.363 → +36.3% loot quantity
```

#### Affix JSON Schema

```json
{
  "id": "monster_damage_generic",
  "name": "Monster Damage",
  "type": "prefix",
  "stat": "damageAll",
  "tiers": [
    { "tier": 1, "value": 15, "lootBonus": 0.04 },
    { "tier": 2, "value": 10, "lootBonus": 0.02 }
  ]
}
```

---

### 6.3.7 Zone Data

Zone definitions store **static metadata** only. Pack content is **generated at runtime** when the player enters the zone and is never saved to disk.

```json
{
  "id": "act1_zone3",
  "name": "Forgotten Cellar",
  "actIndex": 1,
  "zoneIndex": 3,
  "packCount": 3,
  "monsterPool": ["skeleton_warrior", "skeleton_archer", "zombie", "ghoul"],
  "unlockCondition": { "zoneId": "act1_zone2", "state": "completed" }
}
```

**Pack generation (runtime, on zone entry):**
- `packCount` is pre-computed from the formula `2 + floor(actIndex / 3) + floor(zoneIndex / 4)` and stored on the zone for convenience
- For each pack except the last: random monster count (2–5), types drawn randomly from `monsterPool`, rarities assigned within constraints (max 2 Magic, max 1 Rare)
- Last pack: same random composition, but the final monster is always forced to Unique rarity, type drawn randomly from `monsterPool`
- Generated pack content exists only in runtime memory — it is discarded when the player exits or dies

**Item level of drops:**
```
itemLevel = monsterLevel = floor((actIndex - 1) × 6 + (zoneIndex - 1) × 0.5) + 1
```

The `unlockCondition` field drives the zone state machine (locked → unlocked → completed) defined in [§3.1.2](02-Combat.md#312-zone-progression--unlocking).

---

### 6.3.8 Monster Skill Data

Each monster type references a skill by ID. Skills are defined in `/data/skills/monster_skills.json`:

```json
{
  "id": "basic_slash",
  "name": "Slash",
  "damageMin": 8,
  "damageMax": 14,
  "damageType": "physical",
  "attackTime": 1.5
}
```

`attackTime` is in seconds, consistent with the player's attack model. Converted to ticks: `attackTimerTicks = attackTime × 50`. Damage values scale by monster level and rarity using the same formula as defensive stats.

---

## 6.4 Loot System

### 6.4.1 Overview

The loot system is **table-driven** and **list-based**. Each monster references a loot table. A loot table contains one or more independent **loot lists** (e.g. one for equipment, one for currency). Each list is rolled independently when a monster dies.

---

### 6.4.2 Loot List Structure

Each loot list is an ordered array of **entries**, each with a numeric **weight**. The last entry is always the **null entry** (no drop), which acts as the baseline probability floor.

```json
{
  "id": "list_equipment_act1",
  "baseDraws": 1,
  "entries": [
    { "itemId": "iron_sword",   "weight": 10 },
    { "itemId": "leather_cap",  "weight": 15 },
    { "itemId": "wood_shield",  "weight": 8  },
    { "itemId": null,           "weight": 67 }
  ]
}
```

**Drop resolution per draw:**
```
roll = random(0, sum(all weights))
→ iterate entries until accumulated weight ≥ roll
→ that entry's item drops (null = no drop)
```

**Performance optimisation:** at load time each list pre-computes a **cumulative weight array** so drop resolution is an O(log n) binary search, not O(n) linear scan. Computed once on startup, never at runtime per kill.

---

### 6.4.3 Loot Table Structure

A loot table groups multiple lists and optionally defines **guaranteed drops**:

```json
{
  "id": "loot_humanoid_common",
  "lists": [
    { "listId": "list_equipment_act1" },
    { "listId": "list_currency_common" }
  ],
  "guaranteed": [
    { "itemId": "gold_coin", "quantity": 1 }
  ]
}
```

- Each list is rolled **independently** using its own draw count
- Guaranteed entries always drop regardless of weight rolls
- A loot table can reference any number of lists

---

### 6.4.4 Extended Loot Tables

An extended loot table inherits a base list and **prepends additional entries** before the null entry, reducing null weight and increasing overall drop chance:

```json
{
  "id": "list_equipment_act1_extended",
  "extends": "list_equipment_act1",
  "additionalEntries": [
    { "itemId": "steel_sword", "weight": 5 },
    { "itemId": "iron_helm",   "weight": 5 }
  ]
}
```

At load time the engine merges `additionalEntries` into the base list before the null entry and recomputes the cumulative weight array. The null entry's effective probability is reduced accordingly.

---

### 6.4.5 Draw Count & Loot Multiplier

Each list defines its own `baseDraws`. The effective draw count uses the fractional draw model:

```
effectiveDraws = floor(baseDraws × multiplier)
                 + (1 bonus draw with probability = frac(baseDraws × multiplier))
```

**Example** — `baseDraws: 1`, `multiplier: 1.6`:
- Base draws: `floor(1.6) = 1`
- Bonus draw chance: 60%
- Expected draws: 1.6

The multiplier can target:
- **All lists** — global sources (level, rarity, affixes)
- **A specific list** — modifier explicitly targets one list (e.g. `+50% currency draws` affects only the currency list)

Multiple copies of the same item **can** drop from a single kill — each draw is fully independent.

---

### 6.4.6 Loot Multiplier Sources

All sources are multiplicative:

| Source | Bonus | Scope |
|---|---|---|
| Monster level | +0.5% per level | All lists |
| Rarity: Magic | +10% | All lists |
| Rarity: Rare | +20% | All lists |
| Rarity: Unique | +50% | All lists |
| Affix Tier 2 | +2% | All lists |
| Affix Tier 1 | +4% | All lists |
| Ascension Tree nodes | TBD | Per list or global |
| Future modifiers | TBD | Per list |

```
finalMultiplier = (1 + 0.005 × level)
                × rarityBonus
                × ∏(1 + affixBonus_i)
                × otherBonuses
```

---

### 6.4.7 List Conversion Modifiers (V2+)

A future modifier will allow one list to be substituted by another at resolution time:

```
"equipment drops as currency instead"
→ equipment list rolls are resolved against the currency list
```

Defined as a flag on the loot resolution context, not in the loot table itself. Applied before draws are resolved.

---

### 6.4.8 Loot Resolution Flow (per monster kill)

```
1. Fetch monster's loot table
2. Compute loot multiplier (level + rarity + affixes + other sources)
3. Apply list conversion modifiers if any (V2+)
4. For each list in the table:
   a. Compute effectiveDraws = floor(base × mult) + fractional chance draw
   b. For each draw:
      - roll = random(0, totalWeight)
      - Binary search cumulative weights → resolve entry
      - If not null → add to drop result
5. Add guaranteed drops
6. Pass full drop result to loot filter → inventory
```

---

← [Character Stats & Tick System](07-Character-Stats-and-Tick.md) | [Table of Contents](README.md) | Next: [XP, Numbers & Achievements →](09-XP-Numbers-Achievements.md)
