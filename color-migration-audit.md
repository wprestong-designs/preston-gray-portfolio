# Phase 0 — Color Migration Audit & Checklist

Inventory of every hardcoded color in `src/` and where it lives, plus the
migration map onto the new 90s Geometric role-token system. This is the
working checklist for Phase 2.

## Method
Authoritative literal inventory via `grep -riE '#[0-9a-f]{3,8}|rgba?\(|hsla?\('`
over `src/**`, cross-checked against the full token-usage map
(`var(--x)` consumers + `--x:` definers). Grep is complete for literals; a
fan-out reader can't beat it, so the inventory below is exact.

## Where color lives (literal counts)
| File | hex/rgb literals | Nature |
|---|---|---|
| `src/index.css` | 153 | **The token block** (`:root`, L6–324). All primitives, roles, floods, ramps, per-project palettes. |
| `src/App.css` | 16 | Scattered style literals (whites, ink shadows, one spruce, green-soft tapes/sweeps). |
| `src/components/FeaturedWork.jsx` | 4 | **CONTENT** — Summit's real brand swatches, shown verbatim as hex text. |
| `src/data/projects.js` | 2 | **CONTENT** — Pinnacle brand hexes inside prose copy. |
| `src/components/CompositionHero.jsx` | 1 | `#fff` inline fallback on the baked letterform. |
| `work.css`, `small-business.css`, all other components | 0 | Consume tokens only — re-theme for free. |

`work/index.html`, `small-business/index.html`, `index.html`: `theme-color=#1f5c43`
(HTML, outside `src/` — will update for correctness). `public/favicon.svg`:
spruce+cream (outside `src/`).

## The token remap (old family → new Memphis role)
The site defaults to **Memphis Playroom**. Each project keeps its hue family
and lands on a distinct role (preserves identity, obeys role architecture):

| Project | Old family | New role | Hex | Flood fg |
|---|---|---|---|---|
| summit (flagship) | green/spruce | **Lead** Bubblegum Pink | `#F85CA2` | ink (6.0) |
| ourco | orange | **Pop-2** Tangerine | `#FF9F1C` | ink (8.7) |
| bristol | sage | **Pop-1** Spearmint | `#63D471` | ink (9.5) |
| pinnacle | sky | **Support** Pool Blue | `#37C6F4` | ink (9.0) |
| prosource | red | **Signal** Tomato | `#F94144` | ink (5.0) |
| fieldintel | purple | **Wildcard** Grape Soda | `#7B2CBF` | white (7.1) |

Flash (Banana `#FFE156`) reserved as the universal highlighter/Flash accent.
Flagship→Lead is intentional: Lead *is* the theme's identity hue.

## Migration strategy: primitives → roles → derivation layer
1. **`src/styles/tokens.css`** (NEW, the ONLY file with hex): 64 primitives
   (namespaced), role tokens (Appendix A), constants (`--ink --paper
   --gray-utility --signal-text --ground-tint`), 8 `[data-theme]` blocks.
2. **`src/index.css` `:root`** becomes the derivation/legacy-alias layer:
   every one of the ~180 old token names is redefined as a `var()`/`color-mix`
   of a role token — **no hex**. This re-roots the entire codebase onto roles
   without touching hundreds of call sites, and makes `data-theme` swap
   everything. Structural tokens (`--radius-* --ease --gutter --font-*`) stay.

### Alias groups (old → role)
- **Neutrals:** `--ink`→`--ink`; `--ink-soft/-faint`→ ink mixes; `--bg --bg-card`→`--paper`; `--bg-off --bg-raised`→`--ground-tint`; `--ink-on-dark*`→`--paper` mixes; `--line-ink*`/`--border`→ anchor mixes; `--fg-white`→`--paper`.
- **Shadows:** `--press-xs/sm/md/lg` → hard `Npx Npx 0 var(--anchor)`, zero blur (offsets retuned to the 4px/6px grammar in Phase 4). `--shadow-sm` (blurred) → hard `--press-sm` (blur banned).
- **Identity accent:** `--accent* --green*` → `--lead` family. `--orange*`→`--pop-2`; `--sage*`→`--pop-1`; `--sky*`→`--support`; `--purple*`→`--wildcard`; `--coral*`→`--signal`.
- **Floods:** `--flood-green`→lead, `--flood-orange`→pop-2, `--flood-sage`→pop-1, `--flood-sky`→support, `--flood-red`→signal, `--flood-purple`→wildcard; each `-fg` per table above.
- **Display tier:** `--display-{green,orange,sage,sky,red,purple}` → lead/pop-2/pop-1/support/signal/wildcard (composition-hero shape fills).
- **Ramps:** `--ramp-{family}-{tint,soft,vivid,deep}` → `color-mix` of the family's role (tint 16%, soft 55%, vivid 100%, deep = role). `--accent-lime`→`--flash`-adjacent; `--accent-citrus`→`--flash`.
- **Per-project palettes:** `--{summit,ourco,bristol,pinnacle,prosource,fieldintel}-*` → the mapped role + its ramp mixes; `-fg` per table; `--bristol-ink`/`--pinnacle-black`→`--ink`.

### App.css literal fixes (16)
`L209–210` green-soft hero sweep → Flash mix (`color-mix(--flash 55%, transparent)`); `L593` `#fff` focus gap → `--paper`; `L683` debug shadow → `color-mix(--ink 45%)`; `L923/1324/2623` `#fff` → `--paper`; `L1765` white 14% → `color-mix(--paper 14%, transparent)`; `L1779` black 30% shadow → `--anchor`; `L1854` ink 4.5% hatch → `color-mix(--anchor 5%, transparent)`; `L2223` `#2d4f50` brand-type → driven from FeaturedWork data (see below); `L2510/2642` green-soft tape → `color-mix(--pop-1 55%, transparent)` / fg mix; `L2619/2624/2628` `#0e2b20` press → `--anchor`.

### Content-hex exception (documented, sanctioned)
`FeaturedWork.jsx` Summit swatch array (`Deep Spruce #2D4F50`, `Sunrise Orange
#FC7C39`, `Muted Yellow #FCBD59`, `Warm Cream #F6ECC9`) documents a **client's
real brand** and renders each hex as visible text — irreducibly content, not a
style token. Resolution: consolidate ALL content-hex here (drive `.brand-type-sample`
color from this data via inline style so `App.css` stays clean), and exempt
verbatim client-brand documentation from the token law (noted in CLAUDE.md).
`projects.js` prose hexes → reworded to color names ("Razorback Red, Apple
Blossom white, Neutral Black") to remove them cleanly.

`CompositionHero.jsx:299` `#fff` → `var(--paper)`.

## Spec conflicts surfaced (new system wins; noted for the report)
1. **Rule 2 color budget vs. proof-catalog hero (§1).** The poster hero casts
   6 project shapes, each its own color = 6 brights; Rule 2 caps a poster at 4.
   The per-project color-coding is a navigational requirement. → Keep 6 for
   function; flag as the top judgment call (recolor 2–3 shapes to ink/paper
   ornaments to hit 4, OR treat the poster as a sanctioned one-off).
2. **svg-fidelity ornaments (ink/paper fills)** already align with the new
   system (Rule 12 neutrals travel) — reused as the budget-reduction lever above.
3. **Corners.** Existing `--radius-sm/md/lg = 6/10/14px` violate the "0 or pill"
   grammar. → Retuned in Phase 4 (kept in Phase 2 to keep the build stable).
4. **`--ink` was spruce-tinted `#173b2f`; now true black `#171717`.** All ink
   text/borders shift to neutral black (the law's universal anchor).
5. **Blurred `--shadow-sm`** violates the flatness law → hard shadow.

## Done when
Both this checklist exists and Phase 2's grep confirms `tokens.css` is the only
`src/` file with styling hex (content-hex exception listed above).
