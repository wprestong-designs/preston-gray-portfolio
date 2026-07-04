/*
 * Shared composition geometry + stage plumbing.
 * Consumed by CompositionHero (poster, interactive) and
 * AmbientComposition (/work/ header, decorative). No components here.
 *
 * Y1: single cast re-pack — the about shape retired (About now opens from
 * the wordmark and the Index), network split into bristol / pinnacle /
 * prosource. Six proofs, seven states.
 */
import { useEffect, useRef, useState } from 'react'

/* Two stage geometries, selected by viewport ASPECT (not width):
   ≥4/3 → landscape, below → portrait. */
export const STAGES = {
  landscape: { w: 1200, h: 600 },
  portrait: { w: 600, h: 1040 },
}
export const ORIENTATION_QUERY = '(min-aspect-ratio: 4/3)'
/* F1: strip → columns (renamed/replaced per svg-fidelity-spec.md);
   pillrhythm and triangle join the cycle. Nine states. */
/* Fixed CYCLE order (run-2 §1 — amended novelty rule). Every adjacency differs
   in arrangement; triangle only neighbors rect-family (columns, quarters); the
   known low-motion tiles↔quarters pair is non-adjacent. The cycle advances in
   this order (no more random shuffle) so the choreography is a watched sequence.
   Classification table + reasoning: docs/decision-log-20260704-run2.md §1. */
export const STATE_ORDER = [
  'registration',
  'circles',
  'columns',
  'pillrhythm',
  'quarters',
  'swatches',
  'tiles',
  'pinwheel',
  // T (from Preston's ornament designs) — all border-radius + rotate, no
  // clip-path (the literal-triangle state was retired: its matched-vertex
  // clip-morph self-intersected mid-tween → blank frames, and undershot the
  // border-radius → the "double morph" on arm. Angular energy now comes from
  // rotated squares/diamonds + sharp corners, which morph flawlessly).
  'blocks',
  'proofstrips',
  'vortex',
  'burst',
  'arch',
]

/* Successor in the fixed cycle (wraps). The poster advances with this. */
export function nextCycleState(current) {
  const i = STATE_ORDER.indexOf(current)
  return STATE_ORDER[(i + 1) % STATE_ORDER.length]
}

/* The two states flanking `triangle` in the cycle — the clip-morph endpoints. */
export const TRIANGLE_NEIGHBORS = (() => {
  const i = STATE_ORDER.indexOf('triangle')
  const n = STATE_ORDER.length
  return [STATE_ORDER[(i - 1 + n) % n], STATE_ORDER[(i + 1) % n]]
})()

/* States that participate in the clip-path morph window (triangle + its two
   rect-family neighbors). Outside this set, shapes render true border-radius. */
export const CLIP_STATES = new Set(['triangle', ...TRIANGLE_NEIGHBORS])

/* F1 — fidelity states render Preston's four SVG designs LITERALLY
   (svg-fidelity-spec.md is authoritative; geometry is numerically
   extracted, never re-composed). */
export const FIDELITY_STATES = ['pinwheel', 'triangle', 'pillrhythm', 'columns']
/* T states — direct art-directed cast layouts (not numeric SVG fidelity);
   grammar rules 1/2/6 are waived, their composed mass is the design. */
export const ART_STATES = ['blocks', 'proofstrips', 'vortex', 'burst', 'arch']
/* States that enter/exit via the 150ms crossfade instead of the radius
   tween (the documented polygon-state mechanism). Pinwheel may be added
   here if its %-radius snap offends in the composer. */
export const XFADE_STATES = ['triangle']
/* Ornament ids — composition elements that are NOT project doors:
   aria-hidden, non-interactive, no letterforms/hover/arming. Fills are
   ink or paper(+ink outline). Exempt from project rules; count as mass. */
export const ORNAMENT_IDS = ['orn-a', 'orn-b']
/* Pinwheel corner language: 'elliptical' = spec-literal %-radii (full
   quarter-ellipse under the anisotropic stretch — accepted precedent);
   'circular' = min(w,h) px corners, which tween seamlessly against the
   px radii of neighboring states. Reversal knob per the F1 brief. */
export const PINWHEEL_RADIUS = 'elliptical' // 'elliptical' | 'circular'

/* Shared motion feel (per-surface cycle speeds live with each surface).
   D0 pacing: retuned from {120, 20} (~0.45s settle, ζ≈0.91 with a hint
   of overshoot) to {50, 17} — slightly overdamped (ζ≈1.2), slowest pole
   ≈3.8/s → ≈1.05s settle: a calm glide with no float and no bounce,
   probe-verified single-settle. If Preston wants the old snap back:
   restore {120, 20} and CYCLE_MS 2000 / STAGGER_MS 30 together. */
export const MORPH = { type: 'spring', stiffness: 50, damping: 17 } // ≈1s settle
export const STAGGER_MS = 45 // summit→fieldintel ripple (D0: scaled with MORPH)

export const STAGGER_ORDER = [
  'summit',
  'ourco',
  'bristol',
  'pinnacle',
  'prosource',
  'fieldintel',
  'orn-a',
  'orn-b',
]
/* Paint order: anchor beneath, smallest on top; ornaments ride the small
   tier (spec: pinwheel/triangle smalls sit ABOVE the bigs). */
export const Z = {
  fieldintel: 1,
  bristol: 2,
  summit: 3,
  ourco: 4,
  pinnacle: 5,
  prosource: 6,
  'orn-a': 7,
  'orn-b': 8,
}

/*
 * COMPOSITION GRAMMAR — every state must obey all six rules
 * (rules 1–2, 6, and the connected regime are machine-checked in ?compose=1):
 *   1. fieldintel is the LARGEST shape in every state — the anchor.
 *   2. prosource is the SMALLEST in every state (the in-progress proof
 *      stays modest) and always overlaps at least one neighbor from the
 *      top of the z-order.
 *   3. Every state fills the stage near edge-to-edge — target ~85%
 *      coverage; shapes may BLEED past the stage edges (the container
 *      crops); 2–3 shapes per state touch or cross an edge.
 *   4. Gap regimes: GRID states use exactly 10px — EXCEPT pinwheel,
 *      whose decoded reference geometry is 12px (codified P6); never
 *      mixed within a state. Rule 2's prosource-overlap (and pinwheel's
 *      center cluster) are the sanctioned overlap exceptions.
 *      CONNECTED states (swatches, circles, strip) must form ONE
 *      connected mass: "touching" means bounding boxes interpenetrate
 *      ≥40px on BOTH axes, and all six shapes sit in a single component.
 *      (Gutter widths are hand-audited — a machine gutter check is a
 *      known validator gap, logged on the punch list.)
 *   5. Each state has ONE geometric theme.
 *   6. TAPPABLE MINIMUM: every shape measures ≥110 design px on both
 *      axes in every state (≥44 CSS px at the smallest stage scale ~0.6).
 *
 * F1 AMENDMENTS (svg-fidelity-spec.md):
 *   A. ORNAMENTS — elements with kind:'ornament' are not project doors:
 *      aria-hidden, non-interactive, no letterforms/hover/arming; fills
 *      are ink or paper(+ink outline). Exempt from rules 1/2/6 but count
 *      as connective mass.
 *   B. FIDELITY WAIVER — in FIDELITY_STATES the geometry is numerically
 *      literal from Preston's SVGs: rule 1 is satisfied by assignment
 *      (fieldintel takes the largest/tallest slot) and WAIVED where the
 *      source is equal-mass; rules 2 and 6 are likewise waived (the
 *      source mass distribution governs — pillrhythm's slimmest pill
 *      still renders ≥44 CSS px on desktop; the narrow-pill tap question
 *      on small portrait viewports is on Preston's punch list). These
 *      states are machine-checked by scripts/fidelity-check.mjs (±0.5%)
 *      instead of rules 1/2/6.
 *   C. STAGE MAPPING — fidelity tables are normalized percentages,
 *      ANISOTROPIC by default (elliptical quarter-rounds on 2:1 are the
 *      accepted precedent); the composer offers fit:'square' for
 *      true-circular comparison. Ship 'stretch'.
 *
 * Geometry is design px per stage (landscape 1200×600, portrait 600×1040)
 * — packed baselines for tuning in ?compose=1, not final art. Radii are
 * 4-value px strings everywhere so framer can tween them. Colors come
 * from projects.js — never here.
 */
/* ==================================================================
   F1 — NORMALIZED FIDELITY TABLES (svg-fidelity-spec.md, verbatim).
   Percentages of the stage; ANISOTROPIC by default (x% of width, y% of
   height — quarter-rounds go elliptical on 2:1, accepted precedent).
   buildFidelityLayout() maps them to px per orientation; fit 'square'
   renders in a centered square (side = min(w,h)) for true-circular
   comparison in the composer. Ship 'stretch'.
================================================================== */
const NORM = {
  pinwheel: [
    // Rule (source): 2×2 bigs round ONLY their own outer corner; the
    // smalls are a MINI-PINWHEEL INSIDE the bigs near the cross — each
    // sits on its host petal, rounding the SAME corner as its host.
    { id: 'summit', x: 5.15, y: 5.44, w: 43.68, h: 43.68, corner: 'tl' },
    { id: 'fieldintel', x: 51.16, y: 5.44, w: 43.68, h: 43.68, corner: 'tr' },
    { id: 'bristol', x: 5.15, y: 50.88, w: 43.68, h: 43.68, corner: 'bl' },
    { id: 'ourco', x: 51.16, y: 50.88, w: 43.68, h: 43.68, corner: 'br' },
    { id: 'pinnacle', x: 30.8, y: 31.28, w: 16.01, h: 16.01, corner: 'tl' },
    { id: 'orn-a', x: 52.93, y: 31.28, w: 16.01, h: 16.01, corner: 'tr', kind: 'ornament', fill: 'ink' },
    { id: 'orn-b', x: 30.8, y: 52.81, w: 16.01, h: 16.01, corner: 'bl', kind: 'ornament', fill: 'paper' },
    { id: 'prosource', x: 52.93, y: 52.81, w: 16.01, h: 16.01, corner: 'br' },
  ],
  pillrhythm: [
    // pill_bar_design: pills staggered at BOTH ends, no common baseline
    { id: 'fieldintel', x: 9.68, y: 6.57, w: 8.84, h: 86.87, pill: true },
    { id: 'pinnacle', x: 21.65, y: 50.0, w: 9.19, h: 27.76, pill: true },
    { id: 'bristol', x: 33.96, y: 6.57, w: 9.19, h: 51.13, pill: true },
    { id: 'summit', x: 46.27, y: 31.91, w: 8.76, h: 45.85, pill: true },
    { id: 'prosource', x: 58.13, y: 6.57, w: 8.76, h: 37.73, pill: true },
    { id: 'ourco', x: 70.04, y: 18.69, w: 8.76, h: 62.68, pill: true },
    { id: 'orn-a', x: 81.91, y: 40.64, w: 8.41, h: 52.79, pill: true, kind: 'ornament', fill: 'ink' },
  ],
  columns: [
    // Seven near-uniform rounded columns; carries the 39° hatching as
    // its signature accent (moved here from the old strip)
    { id: 'summit', x: 4.87, y: 13.85, w: 9.89, h: 71.84 },
    { id: 'ourco', x: 18.25, y: 14.25, w: 10.27, h: 71.44 },
    { id: 'orn-a', x: 32.01, y: 14.25, w: 10.27, h: 71.44, kind: 'ornament', fill: 'ink' },
    { id: 'fieldintel', x: 45.77, y: 14.25, w: 9.79, h: 71.44 },
    { id: 'bristol', x: 59.07, y: 13.85, w: 9.79, h: 71.84 },
    { id: 'pinnacle', x: 72.35, y: 13.85, w: 9.79, h: 71.84 },
    { id: 'prosource', x: 85.63, y: 14.25, w: 9.79, h: 71.44 },
  ],
  triangle: [
    // clip-path polygons; the state enters/exits via the 150ms crossfade
    // (XFADE_STATES) — the accepted once-per-cycle break in the
    // continuous-morph language. Gutter 0.63%, knife-thin on purpose.
    { id: 'summit', x: 3.04, y: 4.56, w: 46.61, h: 45.16, tri: 'tl-tr-br' },
    { id: 'fieldintel', x: 50.28, y: 4.56, w: 46.69, h: 45.16, tri: 'tl-tr-bl' },
    { id: 'bristol', x: 3.04, y: 50.28, w: 46.69, h: 45.16, tri: 'tr-br-bl' },
    { id: 'ourco', x: 50.35, y: 50.28, w: 46.61, h: 45.16, tri: 'tl-br-bl' },
    { id: 'pinnacle', x: 31.97, y: 5.85, w: 16.33, h: 17.07, tri: 'tl-tr-br' },
    { id: 'orn-a', x: 51.59, y: 5.85, w: 17.83, h: 17.07, tri: 'tl-tr-bl', kind: 'ornament', fill: 'ink' },
    { id: 'orn-b', x: 29.71, y: 76.41, w: 18.61, h: 17.83, tri: 'tr-br-bl', kind: 'ornament', fill: 'paper' },
    { id: 'prosource', x: 51.97, y: 76.41, w: 17.07, h: 17.83, tri: 'tl-br-bl' },
  ],
}

const TRI_POLY = {
  'tl-tr-br': 'polygon(0% 0%, 100% 0%, 100% 100%)',
  'tl-tr-bl': 'polygon(0% 0%, 100% 0%, 0% 100%)',
  'tr-br-bl': 'polygon(100% 0%, 100% 100%, 0% 100%)',
  'tl-br-bl': 'polygon(0% 0%, 100% 100%, 0% 100%)',
}

const CORNER_R = {
  tl: (v) => `${v} 0px 0px 0px`,
  tr: (v) => `0px ${v} 0px 0px`,
  br: (v) => `0px 0px ${v} 0px`,
  bl: (v) => `0px 0px 0px ${v}`,
}
const CORNER_R_PCT = {
  tl: '100% 0% 0% 0%',
  tr: '0% 100% 0% 0%',
  br: '0% 0% 100% 0%',
  bl: '0% 0% 0% 100%',
}

/* ── Triangle true-morph (run-2 §5) ──────────────────────────────
   Every silhouette becomes a matched-vertex clip-path polygon (K points per
   corner → 4K total) so a triangle interpolates continuously with its
   rect-family neighbour. Used ONLY across the triangle boundary; elsewhere
   shapes render true border-radius (the currently-perfect transitions stay). */
export const CLIP_K = 6

// Triangle variant → the 4 corner groups' targets (clockwise tl,tr,br,bl).
const TRI_CORNERS = {
  'tl-tr-br': { tl: [0, 0], tr: [100, 0], br: [100, 100], bl: [100, 100] },
  'tl-tr-bl': { tl: [0, 0], tr: [100, 0], br: [100, 0], bl: [0, 100] },
  'tr-br-bl': { tl: [100, 0], tr: [100, 0], br: [100, 100], bl: [0, 100] },
  'tl-br-bl': { tl: [0, 0], tr: [100, 100], br: [100, 100], bl: [0, 100] },
}

const clampN = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const fmtPoly = (pts) =>
  `polygon(${pts.map(([x, y]) => `${Math.round(x * 100) / 100}% ${Math.round(y * 100) / 100}%`).join(', ')})`

// One corner arc: k points from a0° sweeping +90°, ellipse centre (cx,cy) radii (fx,fy).
function cornerArc(cx, cy, fx, fy, a0, k) {
  const out = []
  for (let i = 0; i < k; i += 1) {
    const a = ((a0 + (90 * i) / (k - 1)) * Math.PI) / 180
    out.push([cx + fx * Math.cos(a), cy + fy * Math.sin(a)])
  }
  return out
}

// One border-radius token → fraction of the box dim (px caps at 50%, % up to 100).
function radiusFrac(token, dim) {
  const n = parseFloat(token) || 0
  return /px$/.test(token) ? clampN((n / dim) * 100, 0, 50) : clampN(n, 0, 100)
}

// Rounded-rect (any 4 corner radii, px or %) → 4K-point polygon, clockwise tl,tr,br,bl.
export function radiiToClip(rStr, w, h, k = CLIP_K) {
  const p = String(rStr || '0px 0px 0px 0px').trim().split(/\s+/)
  const [tlx, tly] = [radiusFrac(p[0] ?? '0px', w), radiusFrac(p[0] ?? '0px', h)]
  const [trx, try_] = [radiusFrac(p[1] ?? '0px', w), radiusFrac(p[1] ?? '0px', h)]
  const [brx, bry] = [radiusFrac(p[2] ?? '0px', w), radiusFrac(p[2] ?? '0px', h)]
  const [blx, bly] = [radiusFrac(p[3] ?? '0px', w), radiusFrac(p[3] ?? '0px', h)]
  return fmtPoly([
    ...cornerArc(tlx, tly, tlx, tly, 180, k), // (0,tly)→(tlx,0)
    ...cornerArc(100 - trx, try_, trx, try_, 270, k), // (100-trx,0)→(100,try)
    ...cornerArc(100 - brx, 100 - bry, brx, bry, 0, k), // (100,100-bry)→(100-brx,100)
    ...cornerArc(blx, 100 - bly, blx, bly, 90, k), // (blx,100)→(0,100-bly)
  ])
}

// Triangle variant → 4K-point polygon (each corner group = k coincident points).
export function triClip(variant, k = CLIP_K) {
  const c = TRI_CORNERS[variant] || TRI_CORNERS['tl-tr-br']
  const rep = (pt) => Array.from({ length: k }, () => pt)
  return fmtPoly([...rep(c.tl), ...rep(c.tr), ...rep(c.br), ...rep(c.bl)])
}

// A layout entry → its matched-vertex clip polygon (triangle, or rounded-rect).
export function shapeClipPolygon(entry, k = CLIP_K) {
  if (!entry) return null
  return entry.triVariant ? triClip(entry.triVariant, k) : radiiToClip(entry.r, entry.w, entry.h, k)
}

export function buildFidelityLayout(stateName, stage, fit = 'stretch') {
  const rows = NORM[stateName]
  const side = Math.min(stage.w, stage.h)
  const baseW = fit === 'square' ? side : stage.w
  const baseH = fit === 'square' ? side : stage.h
  const offX = fit === 'square' ? (stage.w - side) / 2 : 0
  const offY = fit === 'square' ? (stage.h - side) / 2 : 0
  const layout = {}
  rows.forEach((row) => {
    const w = (row.w / 100) * baseW
    const h = (row.h / 100) * baseH
    const entry = {
      x: Math.round(((row.x / 100) * baseW + offX) * 100) / 100,
      y: Math.round(((row.y / 100) * baseH + offY) * 100) / 100,
      w: Math.round(w * 100) / 100,
      h: Math.round(h * 100) / 100,
      rot: 0,
      r: '0px 0px 0px 0px',
    }
    if (row.corner) {
      entry.r =
        PINWHEEL_RADIUS === 'elliptical'
          ? CORNER_R_PCT[row.corner]
          : CORNER_R[row.corner](`${Math.round(Math.min(w, h))}px`)
    }
    if (row.pill) {
      const cap = `${Math.round((w / 2) * 100) / 100}px`
      entry.r = `${cap} ${cap} ${cap} ${cap}`
    }
    if (stateName === 'columns') {
      entry.r = '10px 10px 10px 10px' // --radius-md scale, per spec
    }
    if (row.tri) {
      entry.clip = TRI_POLY[row.tri]
      entry.triVariant = row.tri
    }
    if (row.kind) {
      entry.kind = row.kind
      entry.fill = row.fill
    }
    layout[row.id] = entry
  })
  return layout
}

export const LAYOUTS = {
  // Theme: loose ink daubs, connected regime; one walkable mass.
  swatches: {
    landscape: {
      summit: { x: -40, y: -30, w: 480, h: 370, r: '200px 240px 260px 180px', rot: -6 },
      ourco: { x: 340, y: 200, w: 360, h: 370, r: '180px 180px 180px 180px', rot: 0 },
      bristol: { x: 640, y: -40, w: 440, h: 340, r: '230px 180px 190px 220px', rot: 4 },
      pinnacle: { x: 180, y: 430, w: 300, h: 230, r: '150px 115px 115px 150px', rot: 5 },
      prosource: { x: 520, y: 480, w: 190, h: 180, r: '95px 95px 95px 95px', rot: -8 },
      fieldintel: { x: 660, y: 240, w: 540, h: 420, r: '220px 260px 230px 210px', rot: -3 },
    },
    portrait: {
      summit: { x: -40, y: -40, w: 400, h: 340, r: '190px 220px 240px 170px', rot: -6 },
      bristol: { x: 290, y: -30, w: 340, h: 280, r: '190px 160px 170px 180px', rot: 4 },
      ourco: { x: 110, y: 240, w: 340, h: 340, r: '170px 170px 170px 170px', rot: 0 },
      pinnacle: { x: 330, y: 430, w: 270, h: 250, r: '135px 125px 125px 135px', rot: 6 },
      prosource: { x: 150, y: 520, w: 190, h: 180, r: '95px 95px 95px 95px', rot: -8 },
      fieldintel: { x: 40, y: 640, w: 530, h: 420, r: '220px 250px 230px 200px', rot: -3 },
    },
  },
  // Theme: locking grid (arches + circle + anchor), 10px regime; outer
  // tiles bleed past the edges; prosource straddles a seam.
  registration: {
    landscape: {
      summit: { x: -20, y: -20, w: 330, h: 340, r: '0px 0px 150px 150px', rot: 0 },
      ourco: { x: 320, y: -20, w: 320, h: 340, r: '160px 160px 160px 160px', rot: 0 },
      bristol: { x: -20, y: 330, w: 440, h: 290, r: '0px 140px 140px 0px', rot: 0 },
      pinnacle: { x: 430, y: 330, w: 210, h: 290, r: '105px 105px 0px 0px', rot: 0 },
      prosource: { x: 560, y: 430, w: 170, h: 170, r: '85px 85px 85px 85px', rot: 0 },
      fieldintel: { x: 650, y: -20, w: 570, h: 640, r: '0px 0px 0px 280px', rot: 0 },
    },
    portrait: {
      summit: { x: -20, y: -20, w: 300, h: 330, r: '0px 0px 150px 150px', rot: 0 },
      ourco: { x: 290, y: -20, w: 330, h: 330, r: '165px 165px 165px 165px', rot: 0 },
      bristol: { x: -20, y: 320, w: 640, h: 180, r: '0px 90px 90px 0px', rot: 0 },
      pinnacle: { x: -20, y: 510, w: 640, h: 200, r: '100px 0px 0px 100px', rot: 0 },
      prosource: { x: 400, y: 430, w: 170, h: 170, r: '85px 85px 85px 85px', rot: 0 },
      fieldintel: { x: -20, y: 720, w: 640, h: 340, r: '0px 0px 0px 280px', rot: 0 },
    },
  },
  /* F1: the old STRIP state is SUPERSEDED by `columns` (the spec's
     uniform seven-column design — the true home of the 39° hatching).
     Old tables preserved per the no-deletion law:
     strip.landscape: summit{-20,170,180,390 r90} ourco{115,-30,250,580
     r125} bristol{320,120,220,440 r110} pinnacle{495,40,190,380 r95}
     prosource{640,330,150,230 r75} fieldintel{745,-20,480,580 r240}
     strip.portrait: summit{-20,40,360,150 r75} ourco{-20,145,500,190
     r95} bristol{-20,290,420,170 r85} pinnacle{-20,415,330,150 r75}
     prosource{-20,520,240,130 r65} fieldintel{-20,605,660,460 r230} */
  columns: {
    landscape: buildFidelityLayout('columns', STAGES.landscape),
    portrait: buildFidelityLayout('columns', STAGES.portrait),
  },
  // F1 NEW: pill_bar_design — both-ends-staggered pills (distinct from
  // the retired strip's common-baseline read)
  pillrhythm: {
    landscape: buildFidelityLayout('pillrhythm', STAGES.landscape),
    portrait: buildFidelityLayout('pillrhythm', STAGES.portrait),
  },
  // F1 NEW: triangle — clip-path polygons, crossfade entry (XFADE_STATES)
  triangle: {
    landscape: buildFidelityLayout('triangle', STAGES.landscape),
    portrait: buildFidelityLayout('triangle', STAGES.portrait),
  },
  // Theme: circles only, connected regime — deep TRUE circle-circle
  // overlaps, verified by center distance in both orientations.
  circles: {
    landscape: {
      summit: { x: 300, y: -60, w: 420, h: 420, r: '210px 210px 210px 210px', rot: 0 },
      ourco: { x: 90, y: 230, w: 380, h: 380, r: '190px 190px 190px 190px', rot: 0 },
      bristol: { x: 480, y: 280, w: 340, h: 340, r: '170px 170px 170px 170px', rot: 0 },
      pinnacle: { x: 850, y: -40, w: 260, h: 260, r: '130px 130px 130px 130px', rot: 0 },
      prosource: { x: 520, y: 430, w: 200, h: 200, r: '100px 100px 100px 100px', rot: 0 },
      fieldintel: { x: 640, y: 40, w: 560, h: 560, r: '280px 280px 280px 280px', rot: 0 },
    },
    portrait: {
      summit: { x: 110, y: -40, w: 380, h: 380, r: '190px 190px 190px 190px', rot: 0 },
      ourco: { x: -40, y: 250, w: 340, h: 340, r: '170px 170px 170px 170px', rot: 0 },
      bristol: { x: 290, y: 250, w: 310, h: 310, r: '155px 155px 155px 155px', rot: 0 },
      pinnacle: { x: 60, y: 530, w: 260, h: 260, r: '130px 130px 130px 130px', rot: 0 },
      prosource: { x: 260, y: 620, w: 200, h: 200, r: '100px 100px 100px 100px', rot: 0 },
      fieldintel: { x: 30, y: 740, w: 540, h: 540, r: '270px 270px 270px 270px', rot: 0 },
    },
  },
  // Theme: app-icon tiles — uniform 48px corners, 10px regime, bleeding
  // edges; prosource straddles a seam.
  tiles: {
    landscape: {
      summit: { x: 610, y: -20, w: 350, h: 300, r: '48px 48px 48px 48px', rot: 0 },
      ourco: { x: 970, y: -20, w: 250, h: 300, r: '48px 48px 48px 48px', rot: 0 },
      bristol: { x: 610, y: 290, w: 370, h: 330, r: '48px 48px 48px 48px', rot: 0 },
      pinnacle: { x: 990, y: 290, w: 230, h: 330, r: '48px 48px 48px 48px', rot: 0 },
      prosource: { x: 540, y: 430, w: 160, h: 160, r: '48px 48px 48px 48px', rot: 0 },
      fieldintel: { x: -20, y: -20, w: 620, h: 640, r: '48px 48px 48px 48px', rot: 0 },
    },
    portrait: {
      fieldintel: { x: -20, y: -20, w: 640, h: 460, r: '48px 48px 48px 48px', rot: 0 },
      summit: { x: -20, y: 450, w: 300, h: 280, r: '48px 48px 48px 48px', rot: 0 },
      ourco: { x: 290, y: 450, w: 330, h: 280, r: '48px 48px 48px 48px', rot: 0 },
      bristol: { x: -20, y: 740, w: 390, h: 320, r: '48px 48px 48px 48px', rot: 0 },
      pinnacle: { x: 380, y: 740, w: 240, h: 320, r: '48px 48px 48px 48px', rot: 0 },
      prosource: { x: 250, y: 660, w: 160, h: 160, r: '48px 48px 48px 48px', rot: 0 },
    },
  },
  // Theme: letterform quarter-rounds — arches + ONE circle (ourco) + the
  // anchor with a single dramatic corner. 10px regime.
  quarters: {
    landscape: {
      summit: { x: 550, y: -20, w: 330, h: 350, r: '165px 165px 0px 0px', rot: 0 },
      ourco: { x: 890, y: -20, w: 330, h: 350, r: '165px 165px 165px 165px', rot: 0 },
      bristol: { x: 550, y: 340, w: 400, h: 280, r: '140px 0px 0px 140px', rot: 0 },
      pinnacle: { x: 960, y: 340, w: 260, h: 280, r: '130px 130px 0px 0px', rot: 0 },
      prosource: { x: 480, y: 450, w: 150, h: 130, r: '75px 75px 0px 0px', rot: 0 },
      fieldintel: { x: -20, y: -20, w: 560, h: 640, r: '0px 0px 280px 0px', rot: 0 },
    },
    portrait: {
      fieldintel: { x: -20, y: -20, w: 640, h: 460, r: '0px 0px 280px 0px', rot: 0 },
      summit: { x: -20, y: 450, w: 300, h: 280, r: '150px 150px 0px 0px', rot: 0 },
      ourco: { x: 290, y: 450, w: 330, h: 280, r: '165px 165px 165px 165px', rot: 0 },
      bristol: { x: -20, y: 740, w: 390, h: 320, r: '160px 0px 0px 160px', rot: 0 },
      pinnacle: { x: 380, y: 740, w: 240, h: 320, r: '120px 120px 0px 0px', rot: 0 },
      prosource: { x: 240, y: 650, w: 170, h: 140, r: '70px 70px 0px 0px', rot: 0 },
    },
  },
  /* F1: pinwheel REPLACED by the spec-literal tables (the real source
     rule: the smalls sit INSIDE their host petals rounding the SAME
     corner — a mini-pinwheel echo, not cross-straddlers). The P1
     adaptation is preserved per the no-deletion law:
     P1 landscape: summit{-30,-30,544,354 r354/tl} fieldintel{526,-30,
     704,354 r354/tr} bristol{-30,336,544,294 r294/bl} ourco{526,336,
     704,294 r294/br} pinnacle{400,210,150,150 r150/tl} prosource{490,
     300,150,150 r150/br}
     P1 portrait (cross 300,470): summit{-30,-30,324,494/tl} ourco{306,
     -30,324,494/tr} bristol{-30,476,324,570/bl} fieldintel{306,476,324,
     594/br} pinnacle{150,380,150,150/tl} prosource{270,455,150,150/br} */
  pinwheel: {
    landscape: buildFidelityLayout('pinwheel', STAGES.landscape),
    portrait: buildFidelityLayout('pinwheel', STAGES.portrait),
  },
  /* ===== T — Preston's ornament designs as cast states (border-radius +
     rotate only; art-directed likeness, expect composer tuning). ===== */
  // blocks → sharp-cornered rect mosaic (tessellating, bleeding edges)
  blocks: {
    landscape: {
      fieldintel: { x: -20, y: -20, w: 600, h: 400, r: '0px 0px 0px 0px', rot: 0 },
      summit: { x: 580, y: -20, w: 640, h: 230, r: '0px 0px 0px 0px', rot: 0 },
      ourco: { x: 580, y: 210, w: 330, h: 410, r: '0px 0px 0px 0px', rot: 0 },
      bristol: { x: 910, y: 210, w: 310, h: 410, r: '0px 0px 0px 0px', rot: 0 },
      pinnacle: { x: -20, y: 380, w: 350, h: 240, r: '0px 0px 0px 0px', rot: 0 },
      prosource: { x: 330, y: 356, w: 250, h: 264, r: '0px 0px 0px 0px', rot: 0 },
    },
    portrait: {
      fieldintel: { x: -20, y: -20, w: 640, h: 380, r: '0px 0px 0px 0px', rot: 0 },
      summit: { x: -20, y: 360, w: 330, h: 340, r: '0px 0px 0px 0px', rot: 0 },
      ourco: { x: 310, y: 360, w: 310, h: 340, r: '0px 0px 0px 0px', rot: 0 },
      bristol: { x: -20, y: 700, w: 640, h: 200, r: '0px 0px 0px 0px', rot: 0 },
      pinnacle: { x: -20, y: 880, w: 380, h: 180, r: '0px 0px 0px 0px', rot: 0 },
      prosource: { x: 360, y: 856, w: 260, h: 204, r: '0px 0px 0px 0px', rot: 0 },
    },
  },
  // proofstrips → horizontal pill strips, stacked (rounded ends, bleed left)
  proofstrips: {
    landscape: {
      fieldintel: { x: -40, y: 8, w: 1060, h: 104, r: '52px 52px 52px 52px', rot: 0 },
      summit: { x: -40, y: 128, w: 880, h: 82, r: '41px 41px 41px 41px', rot: 0 },
      bristol: { x: -40, y: 226, w: 980, h: 92, r: '46px 46px 46px 46px', rot: 0 },
      ourco: { x: -40, y: 334, w: 820, h: 84, r: '42px 42px 42px 42px', rot: 0 },
      pinnacle: { x: -40, y: 434, w: 700, h: 76, r: '38px 38px 38px 38px', rot: 0 },
      prosource: { x: -40, y: 526, w: 540, h: 70, r: '35px 35px 35px 35px', rot: 0 },
    },
    portrait: {
      fieldintel: { x: -40, y: 30, w: 680, h: 150, r: '75px 75px 75px 75px', rot: 0 },
      summit: { x: -40, y: 205, w: 560, h: 120, r: '60px 60px 60px 60px', rot: 0 },
      bristol: { x: -40, y: 350, w: 620, h: 130, r: '65px 65px 65px 65px', rot: 0 },
      ourco: { x: -40, y: 505, w: 540, h: 120, r: '60px 60px 60px 60px', rot: 0 },
      pinnacle: { x: -40, y: 650, w: 470, h: 110, r: '55px 55px 55px 55px', rot: 0 },
      prosource: { x: -40, y: 785, w: 390, h: 100, r: '50px 50px 50px 50px', rot: 0 },
    },
  },
  // vortex → rotated-square (diamond) progression, decreasing along a spiral
  vortex: {
    landscape: {
      fieldintel: { x: 340, y: 80, w: 440, h: 440, r: '0px 0px 0px 0px', rot: 45 },
      summit: { x: 450, y: 90, w: 340, h: 340, r: '0px 0px 0px 0px', rot: 60 },
      bristol: { x: 535, y: 110, w: 260, h: 260, r: '0px 0px 0px 0px', rot: 30 },
      ourco: { x: 597, y: 157, w: 195, h: 195, r: '0px 0px 0px 0px', rot: 15 },
      pinnacle: { x: 645, y: 215, w: 140, h: 140, r: '0px 0px 0px 0px', rot: 45 },
      prosource: { x: 672, y: 267, w: 95, h: 95, r: '0px 0px 0px 0px', rot: 30 },
    },
    portrait: {
      fieldintel: { x: 100, y: 140, w: 400, h: 400, r: '0px 0px 0px 0px', rot: 45 },
      summit: { x: 170, y: 270, w: 320, h: 320, r: '0px 0px 0px 0px', rot: 60 },
      bristol: { x: 175, y: 415, w: 250, h: 250, r: '0px 0px 0px 0px', rot: 30 },
      ourco: { x: 177, y: 537, w: 185, h: 185, r: '0px 0px 0px 0px', rot: 15 },
      pinnacle: { x: 232, y: 642, w: 135, h: 135, r: '0px 0px 0px 0px', rot: 45 },
      prosource: { x: 284, y: 724, w: 92, h: 92, r: '0px 0px 0px 0px', rot: 30 },
    },
  },
  // burst → nested rounded plates, concentric (target/burst). Sizes DECREASE in
  // paint order (Z: fieldintel→bristol→summit→ourco→pinnacle→prosource) so every
  // ring stays visible — a larger shape painted later would swallow a smaller one.
  burst: {
    landscape: {
      fieldintel: { x: 330, y: 30, w: 540, h: 540, r: '110px 110px 110px 110px', rot: 0 },
      bristol: { x: 385, y: 85, w: 430, h: 430, r: '88px 88px 88px 88px', rot: 0 },
      summit: { x: 440, y: 140, w: 320, h: 320, r: '66px 66px 66px 66px', rot: 0 },
      ourco: { x: 492, y: 192, w: 215, h: 215, r: '48px 48px 48px 48px', rot: 0 },
      pinnacle: { x: 530, y: 230, w: 140, h: 140, r: '34px 34px 34px 34px', rot: 0 },
      prosource: { x: 560, y: 260, w: 80, h: 80, r: '22px 22px 22px 22px', rot: 0 },
    },
    portrait: {
      fieldintel: { x: 20, y: 240, w: 560, h: 560, r: '115px 115px 115px 115px', rot: 0 },
      bristol: { x: 85, y: 305, w: 430, h: 430, r: '88px 88px 88px 88px', rot: 0 },
      summit: { x: 140, y: 360, w: 320, h: 320, r: '66px 66px 66px 66px', rot: 0 },
      ourco: { x: 190, y: 410, w: 220, h: 220, r: '48px 48px 48px 48px', rot: 0 },
      pinnacle: { x: 230, y: 450, w: 140, h: 140, r: '34px 34px 34px 34px', rot: 0 },
      prosource: { x: 260, y: 480, w: 80, h: 80, r: '22px 22px 22px 22px', rot: 0 },
    },
  },
  // arch → dome (rounded-top) + diamonds + bars
  arch: {
    landscape: {
      fieldintel: { x: -20, y: -20, w: 540, h: 640, r: '270px 270px 0px 0px', rot: 0 },
      summit: { x: 540, y: -20, w: 680, h: 190, r: '0px 0px 0px 0px', rot: 0 },
      ourco: { x: 650, y: 210, w: 290, h: 290, r: '0px 0px 0px 0px', rot: 45 },
      bristol: { x: 540, y: 430, w: 680, h: 190, r: '0px 0px 0px 0px', rot: 0 },
      pinnacle: { x: 950, y: 210, w: 270, h: 270, r: '135px 135px 0px 0px', rot: 0 },
      prosource: { x: 560, y: 430, w: 150, h: 150, r: '0px 0px 0px 0px', rot: 45 },
    },
    portrait: {
      fieldintel: { x: -20, y: -20, w: 640, h: 480, r: '320px 320px 0px 0px', rot: 0 },
      summit: { x: -20, y: 500, w: 400, h: 150, r: '0px 0px 0px 0px', rot: 0 },
      ourco: { x: 300, y: 640, w: 300, h: 300, r: '0px 0px 0px 0px', rot: 45 },
      bristol: { x: -20, y: 670, w: 340, h: 150, r: '0px 0px 0px 0px', rot: 0 },
      pinnacle: { x: -20, y: 840, w: 280, h: 220, r: '140px 140px 0px 0px', rot: 0 },
      prosource: { x: 20, y: 640, w: 150, h: 150, r: '0px 0px 0px 0px', rot: 45 },
    },
  },
}

/*
 * POLYGON-STATE STUB — EXERCISED BY F1's triangle state. The resolution
 * chosen: NOT a full clip-path migration (rounded corners as many-point
 * polygons remain off the table); instead the triangle state renders
 * polygons directly and enters/exits via a 150ms CROSSFADE (fade out →
 * geometry snaps while invisible → fade/scale back in, staggered) — the
 * accepted once-per-cycle break in the continuous-morph language
 * (XFADE_STATES). No layoutId touches any shape, so the W1a projection
 * interplay cannot re-trigger; the motion-episode probe re-verifies.
 * Triangle echo accents (T2) remain unchanged alongside.
 */

/* Distinct hover silhouette per shape — the "this shape is a door" signal */
export const HOVER_R = {
  summit: '30px 30px 30px 30px',
  ourco: '170px 28px 170px 28px',
  bristol: '28px 170px 28px 170px',
  pinnacle: '130px 130px 24px 24px',
  prosource: '24px 24px 130px 130px',
  fieldintel: '210px 210px 0px 0px',
}

export const CROP_MARKS = {
  landscape: [
    [100, 40],
    [1100, 40],
    [100, 560],
    [1100, 560],
  ],
  portrait: [
    [60, 40],
    [540, 40],
    [60, 1000],
    [540, 1000],
  ],
}

/* Grammar validation — rules 1, 2, 6, and the rule-4 connected regime.
   F1: strip left the roster; columns/pillrhythm are RHYTHM states (their
   uniform x-steps are the design — neither grid-gap nor one-mass). */
export const CONNECTED_STATES = ['swatches', 'circles']
export const TOUCH_MIN = 40 // px of bbox interpenetration required on BOTH axes
export const TAP_MIN = 110 // rule 6: min shape dimension in design px

export function shapesTouch(a, b) {
  const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
  const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
  return overlapX >= TOUCH_MIN && overlapY >= TOUCH_MIN
}

/* Touch-graph edges for a layout: [[idA, idB], ...] */
export function touchEdges(layout) {
  const ids = Object.keys(layout)
  const edges = []
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      if (shapesTouch(layout[ids[i]], layout[ids[j]])) {
        edges.push([ids[i], ids[j]])
      }
    }
  }
  return edges
}

/* True when all shapes form ONE connected component */
export function isOneMass(layout) {
  const ids = Object.keys(layout)
  const edges = touchEdges(layout)
  const seen = new Set([ids[0]])
  const queue = [ids[0]]
  while (queue.length) {
    const cur = queue.pop()
    edges.forEach(([a, b]) => {
      const next = a === cur ? b : b === cur ? a : null
      if (next && !seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    })
  }
  return seen.size === ids.length
}

/* Min-motion validator (run-2 §5 rule B). A cycle transition passes iff at
   least MOTION_MIN of the 6 project shapes each move beyond a meaningful delta
   (centre shift ≥8% of the stage short side, OR area change ≥25%, OR rotation
   ≥15°). Returns the failing adjacent pairs (empty = the whole cycle passes).
   Enforced at mount by CompositionHero (dev warn). */
export const MOTION_MIN = 4
const MOTION_PROOF_IDS = ['summit', 'ourco', 'bristol', 'pinnacle', 'prosource', 'fieldintel']

function shapeMoves(a, b, shortSide) {
  if (!a || !b) return false
  const dist = Math.hypot(b.x + b.w / 2 - (a.x + a.w / 2), b.y + b.h / 2 - (a.y + a.h / 2))
  const areaA = a.w * a.h
  const areaB = b.w * b.h
  const areaRatio = areaA && areaB ? Math.abs(areaB - areaA) / Math.max(areaA, areaB) : 0
  const rot = Math.abs((b.rot || 0) - (a.rot || 0))
  return dist >= 0.08 * shortSide || areaRatio >= 0.25 || rot >= 15
}

export function validateCycleMotion(orientation = 'landscape') {
  const stage = STAGES[orientation]
  const shortSide = Math.min(stage.w, stage.h)
  const fails = []
  for (let i = 0; i < STATE_ORDER.length; i += 1) {
    const from = STATE_ORDER[i]
    const to = STATE_ORDER[(i + 1) % STATE_ORDER.length]
    const la = LAYOUTS[from]?.[orientation]
    const lb = LAYOUTS[to]?.[orientation]
    if (!la || !lb) continue
    const moved = MOTION_PROOF_IDS.filter((id) => shapeMoves(la[id], lb[id], shortSide)).length
    if (moved < MOTION_MIN) fails.push({ from, to, moved })
  }
  return fails
}

/* ── Transition graph (run-2 R2) ─────────────────────────────────
   The random walk may only step along LEGAL edges. An edge A—B is legal iff:
     · arrangement differs (no two same-arrangement states adjacent),
     · triangle only neighbours the rect-family (morph-compat + §1 spec),
     · the pair clears the minimum-motion threshold in BOTH orientations.
   (Fine-family already differs — every state's vocabulary is distinct.)
   Every state is guaranteed ≥2 legal neighbours; buildTransitionGraph warns
   (dev) if any is stranded so it can be recomposed or relaxed with sign-off. */
export const STATE_CLASS = {
  registration: { fine: 'mixed', arr: 'grid' },
  circles: { fine: 'circle', arr: 'scatter' },
  columns: { fine: 'bar', arr: 'row' },
  pillrhythm: { fine: 'pill', arr: 'stagger' },
  quarters: { fine: 'quarter', arr: 'grid' },
  swatches: { fine: 'blob', arr: 'scatter' },
  tiles: { fine: 'tile', arr: 'grid' },
  pinwheel: { fine: 'plate', arr: 'pinwheel' },
  blocks: { fine: 'block', arr: 'mosaic' },
  proofstrips: { fine: 'strip', arr: 'stack' },
  vortex: { fine: 'diamond', arr: 'spiral' },
  burst: { fine: 'ring', arr: 'nested' },
  arch: { fine: 'arch', arr: 'composed' },
}

function pairMotionOK(a, b) {
  return ['landscape', 'portrait'].every((o) => {
    const la = LAYOUTS[a]?.[o]
    const lb = LAYOUTS[b]?.[o]
    if (!la || !lb) return false
    const short = Math.min(STAGES[o].w, STAGES[o].h)
    const moved = MOTION_PROOF_IDS.filter((id) => shapeMoves(la[id], lb[id], short)).length
    return moved >= MOTION_MIN
  })
}

export function legalEdge(a, b) {
  if (a === b) return false
  // Arrangement must differ (no two same-arrangement states adjacent) and the
  // pair must clear the minimum-motion threshold in both orientations. Every
  // silhouette now morphs via border-radius + rotate, so the old triangle↔rect
  // clip-compat constraint is gone.
  if (STATE_CLASS[a].arr === STATE_CLASS[b].arr) return false
  return pairMotionOK(a, b)
}

export function buildTransitionGraph() {
  const graph = {}
  STATE_ORDER.forEach((a) => {
    graph[a] = STATE_ORDER.filter((b) => legalEdge(a, b))
  })
  if (import.meta.env?.DEV) {
    Object.entries(graph).forEach(([s, ns]) => {
      if (ns.length < 2) console.warn(`[comp graph] ${s} stranded — only ${ns.length} legal neighbour(s): ${ns}`)
    })
  }
  return graph
}

/* Contrast-vs-ground (run-2 R2) — permanent paper-on-paper guard. `readColor`
   resolves a CSS var to [r,g,b] under a given theme (injected, so this stays
   DOM-free); `fills` is [[label, cssVar], …] (the poster's ROLE tokens, which
   re-hue per theme); `ground` is the composition's ACTUAL ground [r,g,b] (white
   — the poster keeps the constant white ground regardless of theme). Returns
   every (theme, fill) within FLOOR:1 of ground — the fills that would vanish. */
export const GROUND_CONTRAST_FLOOR = 1.5
function relLum([r, g, b]) {
  const f = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
export function contrastRatio(a, b) {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
export function validateContrastVsGround(readColor, themes, fills, ground) {
  const fails = []
  themes.forEach((theme) => {
    fills.forEach(([label, cssVar]) => {
      const ratio = Math.round(contrastRatio(readColor(theme, cssVar), ground) * 100) / 100
      if (ratio < GROUND_CONTRAST_FLOOR) fails.push({ theme, fill: label, ratio })
    })
  })
  if (import.meta.env?.DEV && fails.length) {
    console.warn('[comp contrast] fills within', GROUND_CONTRAST_FLOOR, ':1 of ground:', fails)
  }
  return fails
}

export function validateGrammar() {
  // Both orientations are always validated, whatever the composer shows
  Object.entries(LAYOUTS).forEach(([state, orientations]) => {
    Object.entries(orientations).forEach(([orientation, layout]) => {
      const tag = `${state}/${orientation}`
      // F1 amendment B: fidelity states are validated by the numeric
      // fidelity checker (±0.5% vs the spec tables) — rules 1/2/6 are
      // waived there (source mass distribution governs). Ornaments are
      // exempt from project rules everywhere (amendment A).
      // Fidelity states AND the T art-directed states (blocks/proofstrips/
      // vortex/burst/arch) are exempt from rules 1/2/6 — their mass
      // distribution is the design (e.g. stacked strips don't overlap).
      const isFidelity = FIDELITY_STATES.includes(state) || ART_STATES.includes(state)
      const projectEntries = Object.entries(layout).filter(
        ([, s]) => s.kind !== 'ornament',
      )
      if (!isFidelity) {
        // P6: extremes are checked by comparison, not sort position — an
        // area TIE must not depend on insertion order surviving refactors.
        const areas = projectEntries.map(([id, s]) => [id, s.w * s.h])
        const fieldArea = areas.find(([id]) => id === 'fieldintel')[1]
        const prosArea = areas.find(([id]) => id === 'prosource')[1]
        if (areas.some(([id, a]) => id !== 'fieldintel' && a > fieldArea)) {
          console.warn(`[comp grammar] ${tag}: fieldintel is not the largest shape`)
        }
        if (areas.some(([id, a]) => id !== 'prosource' && a < prosArea)) {
          console.warn(`[comp grammar] ${tag}: prosource is not the smallest shape`)
        }
        const p = layout.prosource
        const overlapsNeighbor = Object.entries(layout).some(
          ([id, s]) =>
            id !== 'prosource' &&
            p.x < s.x + s.w &&
            s.x < p.x + p.w &&
            p.y < s.y + s.h &&
            s.y < p.y + p.h,
        )
        if (!overlapsNeighbor) {
          console.warn(`[comp grammar] ${tag}: prosource overlaps no neighbor`)
        }
        projectEntries.forEach(([id, s]) => {
          if (s.w < TAP_MIN || s.h < TAP_MIN) {
            console.warn(`[comp grammar] ${tag}: ${id} under the ${TAP_MIN}px tappable minimum (${s.w}×${s.h})`)
          }
        })
      }
      if (CONNECTED_STATES.includes(state) && !isOneMass(layout)) {
        console.warn(`[comp grammar] ${tag}: shapes do not form one connected mass`)
      }
    })
  })
}

/* Orientation from viewport aspect ratio, debounced 150ms */
export function useOrientation() {
  const [orientation, setOrientation] = useState(() =>
    window.matchMedia(ORIENTATION_QUERY).matches ? 'landscape' : 'portrait',
  )
  useEffect(() => {
    const mq = window.matchMedia(ORIENTATION_QUERY)
    let timer
    const onChange = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setOrientation(mq.matches ? 'landscape' : 'portrait')
      }, 150)
    }
    mq.addEventListener('change', onChange)
    return () => {
      clearTimeout(timer)
      mq.removeEventListener('change', onChange)
    }
  }, [])
  return orientation
}

/* Centered contain-fit of a fixed design stage inside its wrapper */
export function useStageFit(stage) {
  const wrapRef = useRef(null)
  const [fit, setFit] = useState({ scale: 1, x: 0, y: 0 })
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const scale = Math.min(width / stage.w, height / stage.h)
      setFit({
        scale,
        x: (width - stage.w * scale) / 2,
        y: (height - stage.h * scale) / 2,
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [stage])
  return [wrapRef, fit]
}

export const stageTransform = (fit) =>
  `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`
