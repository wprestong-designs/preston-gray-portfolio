# R1 — Regression triage (gated). 2026-07-04

Evidence: `scratchpad/visual-matrix/` (state×theme matrix, `audit.json`, transition
frames), `scratchpad/live-cycle/` (80-frame real-cycle capture), code + git. Harness:
`scripts/visual-matrix.mjs` (permanent). **Headline: 4 of the 6 items share ONE root
cause — the live cycle randomly lands on tint-heavy palettes that wash the whole cast
into the ground. Fix that + advance the theme and most of this collapses.**

---

### 1. PALETTE CYCLING — CONFIRMED: `data-theme` never advances (your primary hypothesis)
- `index.html` hardcodes `<html data-theme="memphis">`; **nothing in the live tree ever
  writes `documentElement.dataset.theme`** (grep). The poster's only palette axis is
  `colorwayName`, cycling 8 colorways — but every colorway resolves through
  `resolveFill → var(--display-{family})/var(--ramp-{family}-{step})`, and those map to
  **memphis's** role tokens (`--lead`, `--pop-2`, …) because the theme never changes. So
  all 8 colorways only ever surface memphis's ~8 role colors at different lightnesses →
  the "~8 colors, not 64" you see.
- **Intra-palette distribution is healthy**: each state assigns 6 *distinct* family roles
  across the cast (green/orange/sage/sky/red/purple) + ink + paper ≈ 8 tokens. The
  collapse is on the THEME axis (stuck at 1 of 8), not the role axis.
- **The 64-color system is one `setState` away**: forcing `data-theme` (harness Pass M)
  re-hues the whole poster across all 8 themes with zero code change, because the fill
  tokens resolve *through* role tokens. Mechanism works; it's just never triggered.

### 2. MISSING STATES — REFUTED: nothing was dropped, roster is complete (9 states)
- `circles` is in `STATE_ORDER` (index 1) and renders correctly (border-radius, unclipped).
  The 80-frame live capture shows all 6 shapes present in **every** frame; the forced
  matrix renders circles in all 8 themes.
- The re-route (`TRIANGLE_NEIGHBORS = [columns, pillrhythm]`) dropped nothing — it only
  changed which states flank triangle. circles is already off the triangle border and
  morphs via border-radius, exactly as required.
- The "circles gone" perception is item 3/4: when the random colorway lands on an
  all-tint colorway, circles washes to near-white and reads as absent. Evidence:
  `live-cycle/f011.png` — six near-white pastel circles on white ground.

### 3. BROKEN STATES — two failures, both PALETTE-driven (not geometry)
- **(a) "quarter-round missing its fill"**: a colorway renders one family's fill ≈ ground.
  Audit: on white, `lisafrank/orange` (lime, 1.26:1) and `windbreaker/sage` (pale, 1.27:1)
  are near-invisible → that shape loses its fill. Within memphis, the *tint* step does the
  same to whichever family it lands on.
- **(b) "full white screen for a beat, then restarts"**: the live cycle's random colorway
  occasionally picks `memphis-pastel` (all-tint) → every fill = `16% role + 84% paper`
  ≈ 1.1:1 vs white → the entire cast vanishes for that dwell, then the next pick restores
  it (the "restart"). Evidence: `f011.png`. **Not a crash — a contrast collapse.**

### 4. PAPER-ON-PAPER — full matrix audit: 45/240 fills below 1.5:1 vs ground (`audit.json`)
- **Dark themes** (splash/techlab/arcade): *all* tint/soft steps collapse into the dark
  ground (1.11–1.33:1) — because tint/soft are `color-mix(role, --paper)` and paper is dark.
- **Light themes**: `lisafrank/orange` and `windbreaker/sage` collapse on white even at full
  canonical (1.26–1.27:1).
- The poster hits this whenever the colorway cycle picks a tint-heavy colorway
  (`memphis-pastel`, `dial-up-sunset`, `pool-party`).
- The analytic check now lives in the harness (Pass C) and moves into the validator in R2.

### 5. STRIPED PILLS — DECISION, not a leak
- **No S2 ornament is mounted on any live route**: `proofstrips.svg` lives only in
  `Ornaments.jsx`, whose sole host is `Styleguide`, which `App` never mounts (grep-confirmed).
- The stripes are `.comp-hatch` — the 39° hatching that is **columns' intended F1 signature**
  (`HATCH_STATES=['columns']`). Because columns → triangle → pillrhythm are adjacent, the
  hatch fades across that span, so you saw it on shapes approaching the pills. It is heavy
  (full-shape candy-stripes). **R2 default decision: tone to a subtle low-opacity texture;
  veto-able.**

### 6. STAGE FIT — composed geometry + poster lacks header clearance (not triangle-specific)
- `useStageFit` is identical for every state; triangle is not special-cased. The poster
  stage extends up behind the overlapping header. Every state bleeds there, but rounded
  states leave white margins so it's invisible — triangle fills the stage solid edge-to-edge
  (NORM spans 3%→97%), so it collides. Evidence: `matrix/landscape__memphis__triangle.png`.
- **R2 fix: give the poster top clearance so no state renders under the header** (fixes all
  states at once, and enables safe dark-theme grounds); triangle then obeys the same bounds.

---

## R2 direction (implementing now, per your spec — veto on return)
1. **Palette = data-theme, not colorway**: shuffle-bag over the 8 themes, scoped to the
   poster, canonical fills only (kills tint wash-out; delivers the 64-color system).
2. **Contrast-vs-ground check → validator** (permanent), computed vs the *active* ground.
3. **Random walk** on the precomputed legal-adjacency graph (exclude last 3, LRU-weighted).
4. **Seedable RNG** (live=time, harness/reduced-motion=fixed) + a coverage-proof harness mode.
5. **Header clearance** (item 6) + **hatch toned** (item 5).
6. Untouched: triangle morph, arming/hover/overlay pause, reduced-motion static, portrait.
