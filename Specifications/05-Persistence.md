# §4 Persistence & Save System

← [Skill Tree & Ascension](04-Skill-Tree-and-Ascension.md) | [Table of Contents](README.md) | Next: [User Interface →](06-UI.md)

---

## 4.1 Storage Model

The save system uses **multiple localStorage keys**, one per domain. There is a **single save slot** — no multiple characters or save files.

Each key is prefixed with `irpg_` to avoid collisions with other applications:

| localStorage key | Domain | Notes |
|---|---|---|
| `irpg_meta` | Save metadata | Schema version, timestamps, tutorial state |
| `irpg_character` | Character | Base stats, level, XP, respec points |
| `irpg_zones` | Zone progression | Completion state per zone |
| `irpg_inventory` | Items & stashes | Equipped items, inventory grid, stash tabs |
| `irpg_currency` | Currency panel | Stack counts per currency type |
| `irpg_skilltree` | Main skill tree | Allocated node IDs, planned path |
| `irpg_ascension` | Ascension | Ascension count, points, tree allocations |
| `irpg_timers` | Timer state | Last saved timestamp, auto-craft state |
| `irpg_settings` | Player settings | Loot filter config, UI preferences |
| `irpg_metagame` | Meta progression | Tutorial flags, unlocked features |

Writing is always **per-key** — only the domain that changed is written. This avoids serialising the full save on every auto-save tick.

---

## 4.2 Save Schema — Per Key

### `irpg_meta`
```json
{
  "schemaVersion": 1,
  "createdAt": 1700000000000,
  "lastSavedAt": 1700001000000,
  "tutorialsSeen": ["tutorial_combat", "tutorial_inventory"]
}
```
- `schemaVersion` drives the migration system (see section 4.4)
- `tutorialsSeen` is an array of tutorial IDs — a tutorial is shown if its ID is absent

---

### `irpg_character`
```json
{
  "name": "Exile",
  "level": 12,
  "xp": 4200,
  "baseStats": {
    "strength": 14,
    "dexterity": 10,
    "intelligence": 8
  },
  "respecs": 2
}
```
- `baseStats` stores **base attribute values only** — all derived stats (HP, mana, armour…) are computed at runtime from base stats + gear + tree
- `respecs` is the current unspent respec point count

---

### `irpg_zones`
```json
{
  "progress": {
    "act1_zone1": "completed",
    "act1_zone2": "completed",
    "act1_zone3": "unlocked",
    "act1_zone4": "locked"
  },
  "currentZone": null
}
```
- Only zone **state** is saved (`locked` / `unlocked` / `completed`)
- `currentZone` is always `null` on save — the active zone's pack content is never persisted (regenerated on entry)

---

### `irpg_inventory`
```json
{
  "equipped": {
    "weapon":      { "itemId": "uuid-abc", "...": "item data" },
    "shield":      null,
    "helmet":      null,
    "bodyArmour":  { "itemId": "uuid-def", "...": "item data" },
    "gloves":      null,
    "boots":       null,
    "belt":        null,
    "ring1":       null,
    "ring2":       null,
    "amulet":      null
  },
  "grid": [
    { "slot": 14, "item": { "itemId": "uuid-ghi", "...": "item data" } }
  ],
  "stashes": [
    {
      "id": "stash_1",
      "name": "Tab 1",
      "color": "#c9a84c",
      "unlocked": true,
      "grid": []
    },
    {
      "id": "stash_2",
      "name": "Tab 2",
      "color": "#6fa8dc",
      "unlocked": true,
      "grid": []
    },
    {
      "id": "stash_3",
      "name": "Tab 3",
      "color": "#888888",
      "unlocked": false,
      "grid": []
    },
    {
      "id": "stash_4",
      "name": "Tab 4",
      "color": "#888888",
      "unlocked": false,
      "grid": []
    }
  ]
}
```
- Grid slots are stored as `{ slot: index, item: {...} }` — only occupied slots are stored (sparse)
- Each item object stores all data needed to reconstruct it: type, rarity, affixes with rolled values, item level, quality

---

### `irpg_currency`
```json
{
  "orb_of_transmutation": 14,
  "orb_of_augmentation": 7,
  "regal_orb": 2,
  "exalted_orb": 1,
  "divine_orb": 0,
  "chaos_orb": 5,
  "orb_of_annulment": 3,
  "blacksmiths_whetstone": 22,
  "armourers_scrap": 18,
  "orb_of_regret": 4
}
```
- One key per currency type, value is the current stack count
- Stored separately from inventory to allow fast reads by the crafting system

---

### `irpg_skilltree`
```json
{
  "main": {
    "allocatedNodes": ["node_001", "node_002", "node_015"],
    "plannedPath": ["node_030", "node_045"]
  }
}
```
- `allocatedNodes` — array of node IDs with spent points
- `plannedPath` — ordered array of planned (unallocated) target nodes for planning mode
- The tree topology itself is never saved — it is loaded from the static data config

---

### `irpg_ascension`
```json
{
  "count": 3,
  "totalPointsEarned": 18,
  "availablePoints": 4,
  "allocatedNodes": ["asc_node_001", "asc_node_005"]
}
```

---

### `irpg_timers`
```json
{
  "lastSavedAt": 1700001000000,
  "autoCraft": {
    "active": false,
    "targetItemSlot": null,
    "selectedCurrency": null,
    "stopCondition": null
  }
}
```
- `lastSavedAt` is used by the auto-craft timer to compute missed ticks on resume
- Combat timer state is **not saved** — active zone is always null on save

---

### `irpg_settings`
```json
{
  "lootFilter": {
    "minRarity": "magic",
    "autoEquip": false
  },
  "ui": {
    "sidebarExpanded": true,
    "notifications": {
      "enabled": true,
      "autoDismissMs": 4000,
      "dismissOnHover": true
    },
    "combatLog": {
      "playerDamage": true,
      "enemyDamage": true,
      "evades": true,
      "deaths": true,
      "packAdvance": true,
      "lootDrops": true,
      "zoneComplete": true
    }
  }
}
```

---

### `irpg_metagame`
```json
{
  "tutorials": {
    "combat_intro": true,
    "inventory_intro": false,
    "crafting_intro": false,
    "skilltree_intro": false,
    "ascension_intro": false
  },
  "unlockedFeatures": {
    "autoCraft": false,
    "stash_tab_3": false,
    "stash_tab_4": false
  }
}
```
- `tutorials` — a flag per tutorial ID; `true` means already seen, `false` means not yet shown
- `unlockedFeatures` — tracks features unlocked through progression that are not derivable from zone state alone
- New tutorials and features are added here as the game expands; missing keys default to `false`

---

## 4.3 Item Object Schema

All items share a common structure wherever they appear (equipped, grid, stash):

```json
{
  "uid": "uuid-abc-123",
  "baseTypeId": "iron_sword",
  "rarity": "rare",
  "itemLevel": 12,
  "quality": 8,
  "affixes": [
    { "affixId": "prefix_phys_damage", "tier": 1, "rolledValue": 14 },
    { "affixId": "suffix_life",        "tier": 2, "rolledValue": 22 }
  ]
}
```

- `uid` — unique identifier generated at drop time
- `baseTypeId` — references `/data/items` for base type stats
- `rolledValue` — the specific value rolled within the tier's range, persisted so Divine Orb can re-roll it

---

## 4.4 Schema Versioning & Migration

- Every save includes `schemaVersion` in `irpg_meta`
- On load, the engine compares the saved version against the current game version
- If versions differ, a **migration chain** runs: `migrate_v1_to_v2()`, `migrate_v2_to_v3()`, etc.
- If migration is not possible (version too old, data corrupt): the player is warned before any overwrite
- After successful migration, the new schema version is written back immediately

---

## 4.5 Auto-Save & Manual Save

- Auto-save triggers every **60 seconds**, writing only keys that have changed since the last save
- Manual save available via the settings UI at any time
- On browser close (`beforeunload` event): a final save attempt is made for all dirty keys
- Import / export: the full save is serialised as a single JSON object (all keys merged) for portability

---

## 4.6 Corruption Protection

- On load, each key is independently JSON-parsed and schema-validated
- A key that fails validation is treated as missing — the game initialises that domain to defaults and logs a warning
- A fully missing save initialises the full default state (new game)
- Export files are validated on import before any key is overwritten

---

← [Skill Tree & Ascension](04-Skill-Tree-and-Ascension.md) | [Table of Contents](README.md) | Next: [User Interface →](06-UI.md)
