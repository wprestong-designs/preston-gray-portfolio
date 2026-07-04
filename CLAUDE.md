# CLAUDE.md — Preston Gray Portfolio

Vite + React portfolio ("Proof Catalog"): a poster homepage (`/`), a plainspoken
work index (`/work/`), and an owner-facing services page (`/small-business/`) —
three static entries, no router. Styling is driven entirely by the **90s Geometric
Design System** (8 palettes, 64 colors, role tokens). Full law:
`90s-geometric-color-system-strategy.md`. Dev route: `/styleguide/`.

**Commands:** `npm run dev` · `npm run build` · `npm run lint`

---

## Design System Law

**Principle:** structure is constant, color is the variable. Every palette sits on
the same white ground, same ink, same strokes/shadows/shape grammar. Palettes are
costumes; the skeleton never changes.

### Role tokens (components consume ONLY these)
`--ink` (all reading text, `#171717`) · `--paper` (white ground) · `--anchor`
(outlines/dark fields/shadows) · `--lead` (identity hue, largest bright) `--support`
(2nd field, opposite temp) · `--flash` (the yellow) · `--pop-1` `--pop-2` (confetti/
badges) · `--signal` (urgency/error) · `--wildcard` (deep bright, only bright for text
on white) · `--signal-text` (`#E71D36`, text-grade red) · `--ground-tint` (8% Lead) ·
`--gray-utility` (Floppy Disk Gray, decorative hairlines).

### Tier map (theme = surface-level via `data-theme`, never per component)
- **memphis** — default theme, everything. (Tier 1 Core.)
- **cartoon** (product/UI) · **windbreaker** (editorial) · **techlab** (dark/technical) — context themes. (Tier 2.)
- **foodcourt** (promos) · **lisafrank** (social, sole gradient license) — campaign. (Tier 3.)
- **arcade** · **splash** — gated dark registers, high-energy moments only. (Tier 4.)

### Shape grammar (5.1 — never themed)
- Strokes **2px** (UI/icons), **3px** (illustration/patterns), **4px** (sticker keylines). Nothing between, nothing outside.
- Shadows: **hard offset only** — 4px (components) or 6px (display), 100% `--anchor`, **zero blur, zero opacity**.
- Rotation snaps: **±8°** (stickers), **15°** or **45°** (pattern elements). No arbitrary angles.
- Corners: **0 radius or full pill/circle**. Never a timid 4–8px radius.
- Grid: **8pt** base; pattern tiles at **240px**. Density: whisper ≤8% / chatter 15–20% / shout ≥35%.

### The 13 House Rules
1. **One palette per surface** — section/post/poster/card/screen wears exactly one palette; never per-component.
2. **Color budget** — ground + anchor + **≤3 brights**. UI screens: 2. Posters/Shout: may earn a 4th. Count before shipping.
3. **Area logic 60-25-10-5** — ground ~60%, Lead ~25%, Pops ~10%, anchor ~5% (type excluded). Yellow gets large areas; hot pink/red get small ones.
4. **Ink law** — reading text is `--ink` on light / white on dark. `#073B4C` (Midnight) is the one alternate dark, Cartoon headings only. Colored body text = active `--wildcard` only, links/emphasis only, only where matrix says ≥4.5:1.
5. **Ground law** — default white; tints 6–10% of a bright; full-saturation grounds are display surfaces only; neons are never grounds in light themes.
6. **Keyline law** — any two touching brights get a **2px+ `--anchor` or white line**. When in doubt, outline it.
7. **Temperature law** — every composition contains ≥1 cool color.
8. **Vibration law** — equal-brightness saturated complements never share an edge; add a keyline, white gap, or lightness step.
9. **One dark per composition** — chosen deliberately; never two different darks in one composition.
10. **Accessibility floor** — AA 4.5:1 body, 3:1 large (≥24px)/UI. Never encode meaning in color alone (status gets an icon/label twin). Error text = `--signal-text`.
11. **Pairing formula** — anchor + one warm bright + one cool bright + Flash as seasoning; the two brights need a visible lightness gap.
12. **Cross-palette mixing** — only three mechanisms: shared neutrals (white/`--ink`/`--gray-utility`); one white-keylined sticker per composition; section adjacency separated by ≥64px white gutter or a full-width anchor band. Nothing else.
13. **Print reality** — neons exceed CMYK; for print use spot inks or the mid-tier palettes (Memphis/Windbreaker/Cartoon); always proof Arcade/Splash.

### Hard constraints
- **NEVER** hardcode hex in components — **role tokens only**. `src/styles/tokens.css` is the sole home for hex. (Sole exception: verbatim client-brand documentation shown as data, e.g. a case-study swatch — it is content, not a style token.)
- All body/reading text **MUST** be `--ink` (or white on dark grounds). No themed body text.
- **NO gradients** outside `lisafrank` and `arcade`. Everything else is flat.
- Any two touching brights **MUST** have a 2px+ keyline (anchor or white).
- **MAX 3 brights** per composition (UI: 2; poster: 4).
- Contrast **MUST** meet the doc's Appendix B matrix; only `--wildcard`/deep purples/`--signal-text` are text-grade brights on white.

Consult the full strategy doc (`90s-geometric-color-system-strategy.md`) for
anything not covered here.
