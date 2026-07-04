# Decision log — run 2 (build-and-verify), 2026-07-04

New rule this run: build animation/gesture/media even without a browser; the
localhost pass is the verification. Self-verify everything code-verifiable.

## §0 — ffmpeg
- **No Homebrew on this machine** (no `brew` binary, no shellenv, no PATH entry).
  `brew install` impossible. Installed a working static toolchain instead:
  `npm install --no-save ffmpeg-static ffprobe-static` → **ffmpeg 6.0** + ffprobe.
  Symlinked into a scratch bin and prepended to PATH for `process-media.mjs`
  (which resolves `ffmpeg`/`ffprobe` off PATH). Reverse: `rm` the scratch symlinks;
  the packages are `--no-save` (not in package.json).
- Encoding the 4 blocked clips (pinnacle/prosource homepage-scroll + navigation),
  trimmed `--t 12` (three are 12.04s, prosource-navigation is 17.2s). Outputs →
  `src/assets/media/`. mp4-first applied by measured size after encode (below).

## §1 — Amended novelty rule → final cycle order
Ruling applied: classify by **fine family** (rect/rounded/pill/quarter-round/
quarter-ellipse/triangle/circle/blob/mixed) + **arrangement**; **arrangement MUST
differ** between adjacent; fine family differs where triangle routing allows;
min-motion (rule B) enforced on every pair.

Re-ran the order — the run-1 order failed the amended rule at the wrap
(tiles↔registration, both `grid`). Fixed by moving tiles/pinwheel. **Final order:**

`registration → circles → columns → triangle → pillrhythm → quarters → swatches → tiles → pinwheel →` (wrap)

**Re-route during build (risk reduction):** triangle's after-neighbour is **pillrhythm**
(px pill radii) rather than quarters (% quarter-ellipse) — both triangle neighbours are
now px-radius rect-family, so the morph polygons are exact px arcs (no elliptical
approximation, far lower corner-pop risk). Self-verified in Node: validateCycleMotion
returns **0 fails** in both orientations; triangle/rect polygons match at 24 vertices.

| pos | state | fine family | arrangement |
|---|---|---|---|
| 1 | registration | mixed | grid |
| 2 | circles | circle | scatter |
| 3 | columns | sharp-rect | stack |
| 4 | triangle | triangle | grid |
| 5 | pillrhythm | pill | rows |
| 6 | quarters | quarter-round | radial |
| 7 | swatches | blob | scatter |
| 8 | tiles | rounded-rect | grid |
| 9 | pinwheel | quarter-ellipse | radial |

Verified: **every adjacency differs in arrangement** (incl. wrap pinwheel radial →
registration grid); the 3 grids (reg/tri/tiles) are mutually non-adjacent; the 2
scatters (circles/swatches) and 2 radials (quarters/pinwheel) are non-adjacent;
triangle's neighbours are **columns (sharp-rect, px) + pillrhythm (pill, px)** — both
rect-family, non-grid, px-radius; round-dominant circles/blob non-adjacent; the known low-motion
`tiles↔quarters` pair is NOT adjacent. Min-motion thresholds (from run 1): a pair
passes iff ≥4/6 shapes move ≥8% short-side OR ≥25% area OR ≥15°.

## §0 — encode results
4 clips encoded → src/assets/media/ (mp4/webm/poster). mp4-first by size:
**only `pinnacle-navigation` mp4-first** (340<363KB); the two homepage-scroll clips
+ prosource-navigation are webm-first. Payload note: `prosource-homepage-scroll` mp4
is 1.52MB (largest new file). Pinnacle native portrait `homepage-scroll` REPLACES the
letterboxed `pinnacle-homepage-mobile` (retired in §4 wiring). Wiring → §4.

## §4 — media component (M1) + lightbox (M2)
- **M1:** ProofMedia images render a `<picture>` — a `(max-width:700px)` `<source>`
  serves the approved mobile CROP (real asset + srcset 480w/native), the desktop
  still otherwise. Never a scaled-down desktop file on mobile. Video source order
  already smaller-first (mp4First).
- **M2 lightbox:** `.lb__stage` has `touch-action:none` + pointer-event pinch/pan so
  a pinch can NEVER leak to page-zoom (the CRM-map trap). Visible ≥44px close,
  swipe-down dismiss (>110px), ESC, double-tap reset, `role=dialog`+`aria-modal`,
  focus trap + restore, body scroll lock, mono caption, reduced-motion instant.
  Portaled to body at z-300 (above the z-200 overlay). Pure gesture math extracted
  to `lightbox-context.js` — **unit-tested in Node (6/6 pass)**.
- **Self-verified:** build + lint clean; gesture math unit tests; dialog/focus wiring
  by code review. Gesture FEEL (pinch smoothness, momentum) → watch-list.
- **M3 wiring status:** the component consumes `item.mobile` (crop srcset) + opens any
  image in the lightbox — mechanism complete. Per-proof set wiring below.
