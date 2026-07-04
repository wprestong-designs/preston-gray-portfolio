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
export const STATE_ORDER = [
  'swatches',
  'registration',
  'strip',
  'circles',
  'tiles',
  'quarters',
  'pinwheel',
]

/* Shared motion feel (per-surface cycle speeds live with each surface) */
export const MORPH = { type: 'spring', stiffness: 120, damping: 20 } // ~0.4–0.6s settle
export const STAGGER_MS = 30 // summit→fieldintel ripple

export const STAGGER_ORDER = [
  'summit',
  'ourco',
  'bristol',
  'pinnacle',
  'prosource',
  'fieldintel',
]
/* Paint order: anchor beneath, smallest on top */
export const Z = {
  fieldintel: 1,
  bristol: 2,
  summit: 3,
  ourco: 4,
  pinnacle: 5,
  prosource: 6,
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
 *   4. Gap regimes: GRID states (registration, tiles, quarters, pinwheel)
 *      use exactly 10px, never mixed — rule 2's prosource-overlap (and
 *      pinwheel's center cluster) are the sanctioned exceptions.
 *      CONNECTED states (swatches, circles, strip) must form ONE
 *      connected mass: "touching" means bounding boxes interpenetrate
 *      ≥40px on BOTH axes, and all six shapes sit in a single component.
 *   5. Each state has ONE geometric theme.
 *   6. TAPPABLE MINIMUM: every shape measures ≥110 design px on both
 *      axes in every state (≥44 CSS px at the smallest stage scale ~0.6).
 *
 * Geometry is design px per stage (landscape 1200×600, portrait 600×1040)
 * — packed baselines for tuning in ?compose=1, not final art. Radii are
 * 4-value px strings everywhere so framer can tween them. Colors come
 * from projects.js — never here.
 */
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
  // Theme: printer's test strip — one bar cluster, connected regime,
  // uniform 45px overlaps (anchor included).
  strip: {
    landscape: {
      summit: { x: -20, y: 170, w: 180, h: 390, r: '90px 90px 90px 90px', rot: 0 },
      ourco: { x: 115, y: -30, w: 250, h: 580, r: '125px 125px 125px 125px', rot: 0 },
      bristol: { x: 320, y: 120, w: 220, h: 440, r: '110px 110px 110px 110px', rot: 0 },
      pinnacle: { x: 495, y: 40, w: 190, h: 380, r: '95px 95px 95px 95px', rot: 0 },
      prosource: { x: 640, y: 330, w: 150, h: 230, r: '75px 75px 75px 75px', rot: 0 },
      fieldintel: { x: 745, y: -20, w: 480, h: 580, r: '240px 240px 240px 240px', rot: 0 },
    },
    portrait: {
      summit: { x: -20, y: 40, w: 360, h: 150, r: '75px 75px 75px 75px', rot: 0 },
      ourco: { x: -20, y: 145, w: 500, h: 190, r: '95px 95px 95px 95px', rot: 0 },
      bristol: { x: -20, y: 290, w: 420, h: 170, r: '85px 85px 85px 85px', rot: 0 },
      pinnacle: { x: -20, y: 415, w: 330, h: 150, r: '75px 75px 75px 75px', rot: 0 },
      prosource: { x: -20, y: 520, w: 240, h: 130, r: '65px 65px 65px 65px', rot: 0 },
      fieldintel: { x: -20, y: 605, w: 660, h: 460, r: '230px 230px 230px 230px', rot: 0 },
    },
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
  // Theme (Y1, from Preston's half-circle reference): PINWHEEL — four
  // large petals in a 2×2 field, curves at the outer corners, plus the
  // pinnacle/prosource quarter-round pair clustered on the center seam
  // (the sanctioned overlap). 10px regime at the seams.
  pinwheel: {
    landscape: {
      summit: { x: -40, y: -40, w: 590, h: 340, r: '340px 0px 0px 0px', rot: 0 },
      fieldintel: { x: 560, y: -40, w: 660, h: 340, r: '0px 340px 0px 0px', rot: 0 },
      bristol: { x: -40, y: 310, w: 590, h: 330, r: '0px 0px 0px 330px', rot: 0 },
      ourco: { x: 560, y: 310, w: 660, h: 330, r: '0px 0px 330px 0px', rot: 0 },
      pinnacle: { x: 420, y: 170, w: 250, h: 250, r: '0px 0px 0px 250px', rot: 0 },
      prosource: { x: 540, y: 290, w: 180, h: 180, r: '0px 180px 0px 0px', rot: 0 },
    },
    portrait: {
      summit: { x: -40, y: -20, w: 335, h: 530, r: '335px 0px 0px 0px', rot: 0 },
      fieldintel: { x: 305, y: -40, w: 335, h: 550, r: '0px 335px 0px 0px', rot: 0 },
      bristol: { x: -40, y: 520, w: 335, h: 540, r: '0px 0px 0px 335px', rot: 0 },
      ourco: { x: 305, y: 520, w: 335, h: 540, r: '0px 0px 335px 0px', rot: 0 },
      pinnacle: { x: 180, y: 400, w: 240, h: 240, r: '0px 0px 0px 240px', rot: 0 },
      prosource: { x: 300, y: 430, w: 180, h: 180, r: '0px 180px 0px 0px', rot: 0 },
    },
  },
}

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

/* Grammar validation — rules 1, 2, 6, and the rule-4 connected regime */
export const CONNECTED_STATES = ['swatches', 'circles', 'strip']
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

export function validateGrammar() {
  // Both orientations are always validated, whatever the composer shows
  Object.entries(LAYOUTS).forEach(([state, orientations]) => {
    Object.entries(orientations).forEach(([orientation, layout]) => {
      const tag = `${state}/${orientation}`
      const byArea = Object.entries(layout).sort(
        (a, b) => b[1].w * b[1].h - a[1].w * a[1].h,
      )
      if (byArea[0][0] !== 'fieldintel') {
        console.warn(`[comp grammar] ${tag}: fieldintel is not the largest shape (${byArea[0][0]} is)`)
      }
      if (byArea[byArea.length - 1][0] !== 'prosource') {
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
      Object.entries(layout).forEach(([id, s]) => {
        if (s.w < TAP_MIN || s.h < TAP_MIN) {
          console.warn(`[comp grammar] ${tag}: ${id} under the ${TAP_MIN}px tappable minimum (${s.w}×${s.h})`)
        }
      })
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
