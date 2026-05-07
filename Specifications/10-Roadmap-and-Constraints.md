# §7–8 Technical Roadmap & Development Constraints

← [XP, Numbers & Achievements](09-XP-Numbers-Achievements.md) | [Table of Contents](README.md) | Next: [Glossary →](11-Glossary.md)

---

## 7. Technical Roadmap

### Phase 0 — Foundations

- [ ] React project initialization
- [ ] Save system (localStorage + export/import)
- [ ] Tick engine and offline progress
- [ ] Large number library integration
- [ ] Global layout scaffolding (header, sidebar, footer HUD, content area)
- [ ] PixiJS integration scaffold (canvas mount, React bridge, pan/zoom foundation)

### Phase 1 — Playable MVP

- [ ] Character with base stats
- [ ] V1 Combat (automatic loop, 1 zone)
- [ ] Basic inventory (item list, equipment slots)
- [ ] Procedural item generation (random affixes)
- [ ] V1 Skill tree (simple nodes, point allocation)
- [ ] V1 Crafting (material application)
- [ ] Full HUD: Life orb, Mana orb, segmented XP bar, name & level display

### Phase 2 — Depth

- [ ] Multiple zones and content progression
- [ ] Advanced crafting and automation
- [ ] Extended skill tree (Notables, Keystones)
- [ ] Full Ascension system (reset flow, point award, confirmation screen)
- [ ] Ascension Tree (PixiJS, permanent nodes, meta-bonuses)
- [ ] Configurable loot filter

### Phase 3 — Enrichment

- [ ] Active skills in combat
- [ ] Bosses and special mechanics
- [ ] Achievements
- [ ] League system (first league)

---

## 8. Constraints & Development Principles

| Constraint | Detail |
|---|---|
| **No backend** | Fully client-side, zero server dependency |
| **No monetization** | No ads, no in-app purchases |
| **Tech stack** | React (version TBD), PixiJS (2D rendering), large number library (TBD) |
| **State management** | React native Context API — no external library (no Zustand, Redux, etc.). One context per domain: character, combat, inventory, ascension, settings |
| **Data-driven design** | Systems (items, affixes, zones, nodes) defined as data (JSON / config files), not hardcoded — facilitates future additions |
| **Offline capable** | Game must function without internet connection once loaded |
| **English only** | No localization or i18n system required |

---

← [XP, Numbers & Achievements](09-XP-Numbers-Achievements.md) | [Table of Contents](README.md) | Next: [Glossary →](11-Glossary.md)
