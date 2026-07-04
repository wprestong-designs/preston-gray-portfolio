# SVG Fidelity Spec — Preston's Four Designs, Exact Geometry

Source of truth: numerically extracted from the four uploaded SVGs (750×750
canvas), normalized to percentages. GEOMETRY IS LITERAL — do not re-compose,
re-space, or "improve." Only the INK changes: elements are re-colored to the
project cast + ornaments per the maps below. Positions/sizes plug in as
percentages of the stage.

## New system concept: ORNAMENTS
An ornament is a composition element that is NOT a project door: aria-hidden,
non-interactive, no letterforms, no hover/arming. Fills: ink, paper
(ink-outlined), or a ramp member of an already-present family. Ornaments let
us reproduce 7–8 element designs exactly with 6 project shapes.
Validator: ornaments are exempt from project rules (largest/tappable) but
count as connective mass. Add `kind: 'ornament'` to the layout schema.

## Grammar amendments (document in the grammar block)
1. Ornament class as above.
2. Fidelity-state waiver: in states marked `fidelity: true` (pinwheel,
   triangle, pillrhythm, columns), the fieldintel-largest rule is satisfied
   by assignment (fieldintel takes the largest/tallest slot) and WAIVED where
   the source design is equal-mass (pinwheel bigs, triangle bigs) — note in
   the comment.
3. Stage mapping: default ANISOTROPIC — x% of stage width, y% of stage
   height (quarter-rounds go elliptical on 2:1; accepted precedent). Add a
   per-state composer toggle `fit: 'stretch' | 'square'` where 'square'
   renders the comp in a centered square (side = min(stageW, stageH)) with
   paper margins for true-circular fidelity. Ship 'stretch'; Preston decides
   per state in the composer.

---

## STATE: pinwheel (REPLACES the current pinwheel layout entirely)
Rule (from source): 2×2 big quarter-rounds, each rounding ONLY its own
outer corner. A mini-pinwheel of smalls (36.7% scale) sits INSIDE the big
pieces near the cross: each small sits on its host petal inset ~2% from the
host's inner corner, rounding the SAME corner as its host. Gutter 2.33%,
outer margin 5.15%. Smalls z-order above bigs.

| slot | x% | y% | w% | h% | radius | cast |
|---|---|---|---|---|---|---|
| big TL (rounds TL) | 5.15 | 5.44 | 43.68 | 43.68 | 100% 0 0 0 | summit |
| big TR (rounds TR) | 51.16 | 5.44 | 43.68 | 43.68 | 0 100% 0 0 | fieldintel |
| big BL (rounds BL) | 5.15 | 50.88 | 43.68 | 43.68 | 0 0 0 100% | bristol |
| big BR (rounds BR) | 51.16 | 50.88 | 43.68 | 43.68 | 0 0 100% 0 | ourco |
| small on TL host (rounds TL) | 30.80 | 31.28 | 16.01 | 16.01 | 100% 0 0 0 | pinnacle |
| small on TR host (rounds TR) | 52.93 | 31.28 | 16.01 | 16.01 | 0 100% 0 0 | ornament: ink |
| small on BL host (rounds BL) | 30.80 | 52.81 | 16.01 | 16.01 | 0 0 0 100% | ornament: paper + ink outline |
| small on BR host (rounds BR) | 52.93 | 52.81 | 16.01 | 16.01 | 0 0 100% 0 | prosource |

## STATE: pillrhythm (NEW — from pill_bar_design; distinct from strip:
staggered at BOTH ends, no common baseline)
Pills fully rounded (radius = 50% of width). x-step 11.97%, gap 3.13%.

| pill | x% | y% | w% | h% | cast |
|---|---|---|---|---|---|
| 1 | 9.68 | 6.57 | 8.84 | 86.87 | fieldintel (tallest) |
| 2 | 21.65 | 50.00 | 9.19 | 27.76 | pinnacle |
| 3 | 33.96 | 6.57 | 9.19 | 51.13 | bristol |
| 4 | 46.27 | 31.91 | 8.76 | 45.85 | summit |
| 5 | 58.13 | 6.57 | 8.76 | 37.73 | prosource |
| 6 | 70.04 | 18.69 | 8.76 | 62.68 | ourco |
| 7 | 81.91 | 40.64 | 8.41 | 52.79 | ornament: ink |

Tappable check: min rendered pill width ≈ 8.4% of 600px portrait = 50px ≥ 44. Pass.

## STATE: columns (REPLACES/renames the uniform strip variant; carries the
39° hatching as its signature accent — hatching moves HERE from strip)
Seven near-uniform rounded columns, radius ~12px-equivalent (small, from
source: sub-2% — use var(--radius-md) class scale), even x-step 13.3%.

| col | x% | y% | w% | h% | cast |
|---|---|---|---|---|---|
| 1 | 4.87 | 13.85 | 9.89 | 71.84 | summit |
| 2 | 18.25 | 14.25 | 10.27 | 71.44 | ourco |
| 3 | 32.01 | 14.25 | 10.27 | 71.44 | ornament: ink |
| 4 | 45.77 | 14.25 | 9.79 | 71.44 | fieldintel |
| 5 | 59.07 | 13.85 | 9.79 | 71.84 | bristol |
| 6 | 72.35 | 13.85 | 9.79 | 71.84 | pinnacle |
| 7 | 85.63 | 14.25 | 9.79 | 71.44 | prosource |

Hatching layer: white bars at 39°, bar width ≈ 4.5% canvas, spacing ≈ 9%,
clipped to the columns' union, above fills, below type/labels; behind the
existing per-state flag.

## STATE: triangle (upgrade from accents-default → real state; the
"reversal knob" case)
Mechanism: this state's shapes render as clip-path polygons. Enter/exit via
a 150ms crossfade (scale 0.96→1 opacity 0→1 per shape, standard stagger)
instead of radius tween — uses the documented polygon-state stub; the
crossfade is the accepted break in the continuous-morph language, once per
cycle at most. All other states unchanged.
Big triangles (2×2, gutter 0.63% — deliberately knife-thin):

| slot | x% | y% | w% | h% | vertices (of own box) | cast |
|---|---|---|---|---|---|---|
| TL | 3.04 | 4.56 | 46.61 | 45.16 | TL, TR, BR | summit |
| TR | 50.28 | 4.56 | 46.69 | 45.16 | TL, TR, BL | fieldintel |
| BL | 3.04 | 50.28 | 46.69 | 45.16 | TR, BR, BL | bristol |
| BR | 50.35 | 50.28 | 46.61 | 45.16 | TL, BR, BL | ourco |

Small triangles (tucked in the hypotenuse voids, top-center and
bottom-center):

| slot | x% | y% | w% | h% | vertices | cast |
|---|---|---|---|---|---|---|
| top-left small | 31.97 | 5.85 | 16.33 | 17.07 | TL, TR, BR | pinnacle |
| top-right small | 51.59 | 5.85 | 17.83 | 17.07 | TL, TR, BL | ornament: ink |
| bottom-left small | 29.71 | 76.41 | 18.61 | 17.83 | TR, BR, BL | ornament: paper + ink outline |
| bottom-right small | 51.97 | 76.41 | 17.07 | 17.83 | TL, BR, BL | prosource |

Letterform note: baked fragments inside triangles clip via the same
polygon; keep fragments off the small triangles.

## Acceptance (numeric, not visual)
For each state × orientation: computed positions/sizes of every element
must match these tables within ±0.5% of stage dimensions; corner/vertex
orientation per table; z-order smalls>bigs (pinwheel), hatching layer order
(columns). Log the check in the probe. Then hand ALL states to
?compose=1 — Preston fine-tunes from an exact baseline, not an
approximation.
