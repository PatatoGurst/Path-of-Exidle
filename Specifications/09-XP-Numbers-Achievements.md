# §6.5–6.7 XP, Large Numbers & Achievements

← [Data Architecture & Loot](08-Data-Architecture-and-Loot.md) | [Table of Contents](README.md) | Next: [Roadmap & Constraints →](10-Roadmap-and-Constraints.md)

---

## 6.5 Experience System

### 6.5.1 XP Required per Level

XP required to advance from level N to level N+1 follows a geometric progression:

```
xpRequired(1→2) = 100
xpRequired(N→N+1) = xpRequired((N-1)→N) × 1.2
```

Which expands to:

```
xpRequired(N→N+1) = 100 × 1.2^(N-1)
```

Sample values:

| Level | XP to next level | Cumulative XP |
|---|---|---|
| 1 | 100 | 100 |
| 2 | 120 | 220 |
| 5 | 207 | 894 |
| 10 | 516 | 2,595 |
| 20 | 3,834 | 19,292 |
| 50 | 910,044 | ~4.5M |

XP is stored as an absolute cumulative value in `irpg_character`. Current level and progress within the level are derived from this value at runtime.

---

### 6.5.2 XP per Monster Kill

XP is awarded **immediately on monster death**, before the next monster in the pack is engaged.

```
monsterXP = 5 × (level ^ 1.1) × rarityMultiplier × affixModifier
```

**Rarity multipliers (XP-specific):**

| Rarity | Multiplier |
|---|---|
| Normal | ×1 |
| Magic | ×2 |
| Rare | ×3 |
| Unique | ×6 |

These are intentionally ×10 the loot rarity bonus values (e.g. loot Magic = +10% → XP Magic = ×2.0).

**Affix modifier:**

The affix modifier is a multiplicative product of all applicable XP bonuses from:
- Monster affixes that grant bonus XP (future — not in V1 initial affix pool)
- Zone modifiers (V2+)

In V1 with no XP-granting affixes, `affixModifier = 1.0`.

**Sample XP values (no affixes, V1):**

| Level | Normal | Magic | Rare | Unique |
|---|---|---|---|---|
| 1 | 5 | 10 | 15 | 30 |
| 10 | 62 | 124 | 186 | 372 |
| 30 | 218 | 436 | 654 | 1,308 |
| 60 | 536 | 1,072 | 1,608 | 3,216 |

---

### 6.5.3 Level Cap

No explicit level cap is defined in V1 — the XP curve naturally makes progression slower at higher levels. A soft cap may be introduced during balancing if needed.

---

## 6.6 Large Number System

- Damage values, HP, and resources will quickly reach very large magnitudes
- A large number library (e.g. `break_infinity.js` or `decimal.js`) must be integrated **from the start**
- Display: scientific notation or suffixes (K, M, B, T…), user-configurable
- Final library choice is TBD — see [§10.3 L10](12-Open-Questions.md)

---

## 6.7 Achievements (Optional — V2)

- Hidden or visible objectives rewarding progression milestones
- Some achievements unlock cosmetic bonuses or minor gameplay improvements
- Full design deferred to V2+

---

← [Data Architecture & Loot](08-Data-Architecture-and-Loot.md) | [Table of Contents](README.md) | Next: [Roadmap & Constraints →](10-Roadmap-and-Constraints.md)
