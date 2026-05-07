# §1–2 Vision & Progression Architecture

← [Table of Contents](README.md) | Next: [Combat Module →](02-Combat.md)

---

## 1. Vision & Positioning

### 1.1 Value Proposition

A browser-based incremental RPG requiring no installation or account. It borrows from **Path of Exile (PoE)** its build depth (passive skill tree, affixed items, crafting), and from **idle/incremental games** their automated progression loops and passive/active rhythm.

The goal is a game that is approachable at entry level yet deeply rewarding for players who want to optimize.

### 1.2 Target Users

| Profile | Description |
|---|---|
| **Idle / incremental gamer** | Enjoys automated progression loops, exponential curves, prestige mechanics |
| **RPG / ARPG player** | Seeks depth in character management and build theorycrafting |
| **PoE fan** | Will recognize familiar systems: affixed items, passive tree, leagues, crafting |

### 1.3 Direct References

- **Path of Exile** — item systems, passive skill tree, seasonal leagues, crafting
- **Melvor Idle, Idlescape** — idle game structure, automation
- **Trimps, NGU Idle** — prestige depth and meta-progression

---

## 2. Progression Architecture

### 2.1 Core Game Loop

```
[Combat] → [Item & resource drops]
    ↓
[Crafting / Inventory management]
    ↓
[Character improvement (stats, gear)]
    ↓
[Skill tree (leveling)]
    ↓
[Access to harder content / new zones]
    ↓
[Optional Prestige → partial reset + permanent bonus]
```

### 2.2 Progression Cycles

| Cycle | Estimated duration | Description |
|---|---|---|
| **Short** | Seconds / minutes | Combat, loot, automated crafting |
| **Medium** | Minutes / hours | Leveling up, skill tree allocation |
| **Long** | Hours / days | Zone unlocks, league objectives |
| **Meta** | Multi-session | Prestige, permanent bonuses, achievements |

---

← [Table of Contents](README.md) | Next: [Combat Module →](02-Combat.md)
