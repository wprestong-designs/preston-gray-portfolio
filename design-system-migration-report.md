# 90s Geometric Design System — Migration Report (Phase 5)

Full restyle of the portfolio onto the 8-palette / 64-color **90s Geometric Design
System**, replacing the spruce-green editorial palette. Phases 0–1 were already
committed; the force-quit interrupted Phase 2 mid-flight (done but uncommitted).
This report closes out the migration.

## What changed, per phase

- **Phase 0 — Audit** *(pre-existing commit)*: full literal color inventory,
  old-family→role map, five spec conflicts surfaced (`color-migration-audit.md`).
- **Phase 1 — Persistent rules** *(pre-existing commit)*: `CLAUDE.md` (the 13 House
  Rules, role tokens, tier map, shape grammar) + `.claude/commands/design-review.md`.
- **Phase 2 — Token system** *(recovered + committed)*: `src/styles/tokens.css` — 64
  palette-namespaced primitives → role tokens → all 8 `[data-theme]` blocks
  (arcade/splash/techlab invert `--paper`/`--ink` as dark registers; `--edge` flips
  to white there). `src/index.css` became a pure **derivation layer** re-rooting every
  legacy token name onto roles via `var()`/`color-mix` — **zero hex**. `data-theme`
  wired on all three HTML entries; favicon + theme-color migrated off spruce.
- **Morph color-shift fix** *(your callout)*: the poster hero ran geometry and colorway
  on two independent cycles, the colorway **offset half a cycle** — so shapes sat still
  and re-inked mid-dwell, reading as a color-only glitch. The colorway is now **coupled
  to the shape morph** (same interval tick, under the crossfade cover for triangle
  states): a shape only changes color as it changes silhouette. This supersedes the
  prior "P6" offset tuning. (The `/work/` ambient composition already coupled both — left
  as-is.)
- **Phase 3 — Shape kit** *(committed)*: `src/components/shapes/` — 12 SVG shape
  components in role tokens only; `shape-kit.js` encodes the grammar as code (legal
  strokes 2/3/4, rotation `snap()`, density caps, and §5.3 exclusivity via
  `useExclusivityGuard` — splat→splash, sparkle/arc→lisafrank, pixel→techlab/arcade).
  `PatternField` renders whisper/chatter/shout within the coverage caps, in
  Lead+Support+one-Pop. New `/styleguide/` route (noindex) shows every shape + density
  under all 8 themes; exclusives render as locked tiles (no console noise).
- **Phase 4 — Components** *(committed)*: buttons (primary = ink fill + white label +
  hard `--lead` shadow, the signature move; secondary; loud CTA; disabled; focus =
  2px gap + 3px `--edge` ring); cards (§3.2, + inverted/flood); badges & stickers
  (§3.7, white keylines, ±8°). Sitewide: every timid px radius → 0 (pills/circles kept),
  all `1.5px` strokes → 2px, no blurred shadows remain, nav → palette-neutral `--paper`.
  Styleguide gained a Components specimen section per theme.
- **Phase 5 — Self-audit** *(this commit)*: an 8-dimension multi-agent audit
  (28 agents, each finding adversarially verified) returned **15 confirmed, 5 correctly
  rejected**. All 15 fixed, plus 2 more a follow-up sweep caught.

## Spec conflicts (Phase 0) and how each was resolved — new system wins

1. **Rule 2 color budget vs. `proof-catalog-interactive-hero-spec.md` (§1).** The poster
   hero casts 6 project shapes, one color each = 6 brights; Rule 2 caps a poster at 4.
   The per-project color is a **navigational** requirement (each shape is a door).
   → **Kept 6** as a sanctioned poster one-off. This is the top item to eyeball.
2. **`svg-fidelity-spec.md` ornaments (ink/paper fills).** Already align with the new
   system (Rule 12: neutrals travel) — reused unchanged.
3. **Corners.** `--radius-sm/md/lg = 6/10/14px` violated "0 or pill." → Retuned to **0**
   in Phase 4 (kept non-zero through Phase 2 only to keep the build stable).
4. **`--ink` was spruce-tinted `#173b2f`.** → Now true black **`#171717`** (the law's
   universal anchor); all ink text/borders shifted to neutral black.
5. **Blurred `--shadow-sm`.** → Hard offset shadow (flatness law); no blur remains
   anywhere in the codebase.

## Self-audit — the 15 confirmed findings, all fixed

Root causes clustered tightly; **Lead (Bubblegum, 3.0:1 on white = shapes-only per
Appendix B) used as text or as a light "dark" ground** was the theme.

- **Contact CTA panel** (`.contact__card`) — comment said "solid plum panel" but the
  token remap had aliased its ground to Lead (pink); white title/subtitle were 3.0:1 and
  the pale-pink eyebrow 1.8:1. → Ground restored to `--wildcard` (Grape, white passes
  ~7:1); eyebrow → `--flash`. Fixes 3 findings at once.
- **Inline links / step numbers / signature / hero accent** painted in Lead → moved to
  the text-grade `--accent-deep`/`--wildcard`, or to `--ink` under its Flash sweep
  (hero, §3.6). (`work.css` `.wk-inline-link`, `small-business.css` `.sb-steps`,
  `.about__signature`, `.hero__headline-accent`.)
- **Service hover number** used `--green` (Lead) where its siblings correctly used the
  text-grade deep → `--green-deep`.
- **Off-grammar strokes**: `.wk-proof` top rule 5px → 4px; two `.comp-marks`
  `stroke-width: 1.5` → 2 (plus the composer debug line, for full cleanliness).
- **Color budget (Rule 2)**: Services and About each stacked **4 brights** (Lead +
  Support + Pop-2 + Pop-1). The sage/Pop-1 accent was **retired** in both → each now
  wears Lead + Support + one Pop = 3.
- **`--ink-faint`** was 55% ink = 4.00:1 (just under the 4.5:1 body floor), used on ~13
  body-size labels → raised to **62%** (~5:1) — one token fix, sitewide.

**Correctly rejected (5):** four decorative poster shapes in `work.css` use `%`-based
partial radii (24 / 36 / 45%) — deliberate arch/D silhouettes, not timid UI corners; the
verifier exempted them and they're left as-is.

## House Rules not fully satisfied (by design)

- **Rule 2 on the poster hero** — 6 project colors, kept for navigation (conflict #1).
- **Dark-register card shadows** — `.card`'s `4px 4px 0 var(--anchor)` shadow is
  invisible on dark grounds (where `--anchor == --paper`). Cards are a light-surface
  component per §3.2, so this only shows in the styleguide's dark-theme sections; left
  as spec-literal rather than special-casing.

## Judgment calls to review visually (open `/styleguide/`)

1. **Primary buttons are now black** (ink fill + Lead shadow) instead of pink — the §3.3
   signature. Site-wide CTA appearance change.
2. **Contact panel is now grape/plum** instead of pink (restores the stated intent).
3. **Phone device-frames are now square** (0 radius). Grammar-consistent but loses the
   device-realism cue — you may want to restore a radius as a sanctioned
   device-depiction exception.
4. **Services/About dropped from 4 to 3 accent hues** (sage retired).
5. **Hero headline accent + About signature** are no longer pink (ink / grape).
6. **`/styleguide/` ships in the build** (noindex) so CI compiles it — exclude from the
   production input if you'd rather it stay dev-only.

## Verification status

`npm run build` and `npm run lint` pass. `tokens.css` is the sole styling-hex file (the
`FeaturedWork` client-brand swatches are the sanctioned content exception). No dangling
`var()` refs. **Not done this session:** a live visual pass of all 8 themes at
`/styleguide/` — the Chrome extension was offline, so that eyeball is still worth doing.
