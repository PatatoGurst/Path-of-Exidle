# Specifications — Incremental RPG (Path of Exile-inspired)

> **Version** : 0.2  
> **Status** : In progress  
> **Last updated** : 2026-04-28  
> **Business model** : Free / Passion project  
> **Target platform** : Web (React), 100% client-side  
> **Language** : English only

---

## Table of Contents

| # | File | Sections covered |
|---|---|---|
| 1 | [Vision & Progression](01-Vision-and-Progression.md) | §1 Value prop, target users, references — §2 Progression architecture |
| 2 | [Combat Module](02-Combat.md) | §3.1 World structure, zones, packs, combat mechanics, auto-battle |
| 3 | [Inventory & Crafting](03-Inventory-and-Crafting.md) | §3.2 Inventory, equipment, stash — §3.3 Currency, crafting, quality |
| 4 | [Skill Tree & Ascension](04-Skill-Tree-and-Ascension.md) | §3.4 Passive tree — §3.5 Prestige/Ascension system — §3.6 Leagues |
| 5 | [Persistence & Save System](05-Persistence.md) | §4 localStorage keys, schemas, migration, auto-save |
| 6 | [User Interface](06-UI.md) | §5 Color system, layout, sidebar, HUD, tabs, combat log, notifications |
| 7 | [Character Stats & Tick System](07-Character-Stats-and-Tick.md) | §6.1 Attributes, defensive/offensive stats — §6.2 Tick engine, subsystem timers |
| 8 | [Data Architecture & Loot](08-Data-Architecture-and-Loot.md) | §6.3 JSON config structure, monsters, zones — §6.4 Loot tables, multipliers |
| 9 | [XP, Numbers & Achievements](09-XP-Numbers-Achievements.md) | §6.5 XP curve — §6.6 Large number system — §6.7 Achievements |
| 10 | [Roadmap & Constraints](10-Roadmap-and-Constraints.md) | §7 Technical phases — §8 Dev principles |
| 11 | [Glossary](11-Glossary.md) | §9 Term definitions |
| 12 | [Open Questions](12-Open-Questions.md) | §10 Pending decisions, decision log |

---

## Quick Reference

### Core decisions at a glance

| Topic | Decision |
|---|---|
| Rendering | **PixiJS** — single engine for all canvas work |
| State management | **React Context API** — one context per domain |
| Tick rate | **50 ticks/s** (20ms per tick), single master RAF loop |
| Save storage | **localStorage** — multiple `irpg_*` keys, one per domain |
| Item grid | **12×12**, 1 slot per item in V1 |
| Resistances | 75% default cap, 90% hard cap |
| Ascension | Fixed threshold, diminishing point returns, permanent tree |
| Language | **English only** |
| Backend | **None** — fully client-side |

---

*Each file is self-contained and can be read independently by a human or an AI agent working on a specific module.*
