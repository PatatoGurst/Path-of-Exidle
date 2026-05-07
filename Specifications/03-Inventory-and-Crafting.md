# §3.2–3.3 Inventory & Crafting

← [Combat Module](02-Combat.md) | [Table of Contents](README.md) | Next: [Skill Tree & Ascension →](04-Skill-Tree-and-Ascension.md)

---

## 3.2 Inventory & Items Module

### 3.2.1 Overview

The Inventory system is composed of three distinct areas, all accessible from the Inventory tab:

1. **Equipment panel** — the character's currently worn gear
2. **Immediate inventory** — the player's active item bag (12×12 grid)
3. **Stashes** — additional storage tabs unlocked through progression (12×12 grid each)

A **Currency panel** is always visible alongside the inventory grid, giving quick access to crafting materials without digging through the grid.

---

### 3.2.2 Equipment Panel

Displays the character's body with named slots. Each slot accepts one item of the correct type.

**V1 equipment slots:**

| Slot | Type accepted |
|---|---|
| Weapon | One-handed weapon |
| Shield | Shield / off-hand |
| Helmet | Helmet |
| Body Armour | Body armour |
| Gloves | Gloves |
| Boots | Boots |
| Belt | Belt |
| Ring (×2) | Ring |
| Amulet | Amulet |

**V2+ planned slot expansions:**
- Two-handed weapons (occupies both Weapon + Shield slots)
- Bow + Quiver slot pair
- Staves, Wands

Equipping an item from the inventory drags it into the slot. If a slot is already occupied, the existing item swaps back into the inventory. If the inventory is full, the swap is blocked and the player is notified.

---

### 3.2.3 Inventory Grid

- **Size**: 12×12 = 144 slots
- **V1**: every item occupies exactly **1 slot**, regardless of type
- **V2+**: variable item sizes (e.g. 1×2 for weapons, 2×2 for body armour) — grid snapping PoE-style
- Items are **draggable** between any valid targets: grid slot → grid slot, grid → equipment slot, equipment slot → grid, grid → stash, stash → grid
- Hovering an item shows its **tooltip** (name, rarity, type, all affixes, item level)
- **Right-clicking** a currency item in the grid or currency panel enters application mode (see section 3.2.5)

---

### 3.2.4 Stash Tabs

- Additional 12×12 grids for extended storage
- **Unlocked through progression** — starting tabs and unlock conditions:

| Stash tab | Unlock condition |
|---|---|
| Tab 1 | Available by default |
| Tab 2 | Available by default |
| Tab 3 | Complete Act 5, Zone 12 |
| Tab 4 | Complete Act 10, Zone 12 |

- Each stash tab can be **named and color-coded** by the player for organization
- Items in stashes are fully accessible for crafting (see section 3.2.6)
- Starting stash count: **1 tab unlocked by default**; additional tabs earned through play

---

### 3.2.5 Currency Panel

A dedicated panel displayed alongside the inventory grid, always visible within the Inventory tab. Contains all currency items and special items in **dedicated, named slots** — one slot per currency type.

- Currency slots display the **stack count** of each currency owned
- Clicking a currency item in this panel selects it for application (equivalent to right-click)
- Selected currency highlights valid target items in the inventory or equipment panel
- Clicking a valid target applies the currency effect (see Crafting module, section 3.3)
- Currency can also be applied from within the Craft tab using the same interaction model

**Currency is never stored in the main inventory grid** — it goes directly to the Currency panel on pickup.

---

### 3.2.6 Item Structure

Each item has:

| Property | Description |
|---|---|
| **Type** | Weapon, Armour, Accessory, Currency, Special |
| **Subtype** | e.g. Sword, Helmet, Ring, Chaos Shard |
| **Rarity** | Common, Magic (1–2 affixes), Rare (3–6 affixes), Unique |
| **Item level** | Determines available affix pool and value ranges |
| **Affixes** | List of prefix and suffix modifiers with rolled values |
| **Equipment slot** | Which slot(s) the item can be equipped in |
| **Stack size** | For currency items only — max stack size defined per currency type |

**V1**: all items occupy 1 grid slot. Item size (`w`, `h`) defaults to `1, 1` and is reserved for V2+.

---

### 3.2.7 Drag & Drop Rules

| From | To | Allowed |
|---|---|---|
| Inventory grid | Inventory grid | ✅ Always |
| Inventory grid | Equipment slot | ✅ If item type matches slot |
| Inventory grid | Stash tab | ✅ Always |
| Equipment slot | Inventory grid | ✅ If inventory has a free slot |
| Equipment slot | Equipment slot | ✅ If item type matches target slot |
| Stash tab | Inventory grid | ✅ If inventory has a free slot |
| Stash tab | Stash tab | ✅ Always |
| Any | Currency panel | ❌ Currency panel is read-only display |
| Currency item | Any item (right-click) | ✅ Via currency application mode |

If a drop target is invalid, the item returns to its original position.

---

## 3.3 Crafting Module

### 3.3.1 Currency Items

Currency items are the primary crafting tools. They are applied to items to modify their affixes, rarity, or quality. All currency items are stored in the **Currency panel** (never in the inventory grid) and applied via right-click interaction (see section 3.2.5).

Images for all currency items will be provided during the implementation phase.

---

### 3.3.2 Currency Reference

**Skill tree currency:**

| Currency | Applicable to | Effect |
|---|---|---|
| **Orb of Regret** | Main skill tree | Grants 1 respec point — spend it to unallocate one node on the main skill tree. Does not apply to the Ascension Tree. Displayed in the currency panel alongside crafting orbs |

**Rarity-modifying currency:**

| Currency | Applicable to | Effect |
|---|---|---|
| **Orb of Transmutation** | Normal items | Upgrades to Magic, adds 1 random modifier |
| **Orb of Augmentation** | Magic items | Adds 1 modifier — only applicable if the item has fewer than 2 modifiers |
| **Regal Orb** | Magic items | Upgrades to Rare, adds 1 random modifier |
| **Exalted Orb** | Rare items | Adds 1 modifier — only applicable if the item has fewer than 6 modifiers |
| **Chaos Orb** | Rare items | Removes 1 random modifier, then adds 1 new random modifier |
| **Orb of Annulment** | Magic or Rare items | Removes 1 random modifier |

**Value-modifying currency:**

| Currency | Applicable to | Effect |
|---|---|---|
| **Divine Orb** | Magic or Rare items with modifiers | Re-rolls the numeric values of all modifiers — tiers are unchanged |

**Quality currency:**

| Currency | Applicable to | Effect | Cap |
|---|---|---|---|
| **Blacksmith's Whetstone** | Weapons | +1% quality per use — bonus applies to Physical Damage | 20% (expandable in V2+) |
| **Armourer's Scrap** | Armour pieces | +1% quality per use — bonus applies to the item's primary armour stat | 20% (expandable in V2+) |

---

### 3.3.3 Quality Mechanic

Quality is a separate numeric property on weapons and armour pieces, ranging from **0% to 20%** (default cap, raiseable by future features).

**Effect by item type:**

| Item type | Key stat boosted by quality |
|---|---|
| Weapon | Physical Damage (+1% per quality point) |
| Helmet | Armour / Evasion (primary stat of the base type) |
| Body Armour | Armour / Evasion (primary stat of the base type) |
| Gloves | Armour / Evasion (primary stat of the base type) |
| Boots | Armour / Evasion (primary stat of the base type) |
| Belt | Armour (if applicable) |

Quality is displayed on the item tooltip. The Whetstone and Armourer's Scrap are not applicable once the cap is reached.

---

### 3.3.4 Applicability Rules

Before a currency item can be applied, the engine validates the following:

| Rule | Details |
|---|---|
| Rarity match | Currency only applies to its valid rarity tier (e.g. Exalted Orb requires Rare) |
| Modifier slot available | Augmentation currencies (Orb of Aug, Exalted) are blocked if item is already at max modifiers |
| Quality cap | Whetstone / Scrap blocked if item quality is already at 20% |
| Item type match | Quality currencies only apply to their respective item category (weapon vs armour) |

Invalid applications are silently blocked — the cursor returns to normal without consuming the currency.

---

### 3.3.5 Modifier Tiers

Modifiers have **tiers** that define their numeric value ranges. When a modifier is added (via Transmutation, Augmentation, Regal, Exalted, or Chaos), the tier rolled depends on the **item level**:

- Higher item level unlocks higher tiers of each modifier
- The Divine Orb re-rolls values **within the current tier** — it cannot change the tier itself
- Tier definitions are stored in `/data/affixes/item_affixes.json`, referenced by modifier ID

---

### 3.3.6 Crafting Automation

- Configurable crafting queue: apply a selected currency to a selected item repeatedly until a stop condition is met
- **Stop conditions:**
  - A specific modifier is present on the item
  - Item reaches a target rarity
  - A numeric value threshold is reached on a modifier
  - Currency stack is depleted
- The automation queue runs via the global tick system (see [§6.2](07-Character-Stats-and-Tick.md#62-tick--time-system)) and continues in the background when the Inventory tab is not active
- Queue configuration is saved and persists across sessions

---

### 3.3.7 Advanced Crafting (V2+)

- Deterministic crafting (lock modifiers before resetting)
- Combinatorial recipes (item merging)
- Crafting bench / station with targeted modifier options

---

← [Combat Module](02-Combat.md) | [Table of Contents](README.md) | Next: [Skill Tree & Ascension →](04-Skill-Tree-and-Ascension.md)
