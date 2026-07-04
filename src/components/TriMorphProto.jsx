/*
 * Phase 2.5b PROTOTYPE — one shape morphing rounded-rect → triangle →
 * rounded-rect via equal-vertex clip-path interpolation.
 *
 * Mechanism proof: both silhouettes are polygons with the SAME point count
 * (k points per corner, 4k total). The rounded rect samples each corner as
 * a quarter-circle arc; the triangle collapses one corner onto its
 * neighbor (bottom-left → bottom-right) and sharpens the other three (k
 * coincident points each). Framer interpolates point-by-point, so the
 * outline deforms continuously — same node, no cover, no visibility gap.
 * The MORPH spring is the poster's exact {stiffness:50, damping:17}.
 *
 * The static swatch on the right is a TRUE border-radius div at the same
 * radius — proof that the k=6 rounded-rect polygon matches border-radius
 * closely enough that dropping the clip at rest (the real integration)
 * won't pop.
 */
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const round = (n) => Math.round(n * 100) / 100
const poly = (pts) => `polygon(${pts.map(([x, y]) => `${round(x)}% ${round(y)}%`).join(', ')})`

/* Rounded rect in a 0–100 box: 4 corner arcs (k pts each), clockwise. */
function roundedRectPoly(r, k) {
  const pts = []
  const arc = (cx, cy, a0) => {
    for (let i = 0; i < k; i += 1) {
      const a = ((a0 + (90 * i) / (k - 1)) * Math.PI) / 180
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  arc(r, r, 180) // TL
  arc(100 - r, r, 270) // TR
  arc(100 - r, 100 - r, 0) // BR
  arc(r, 100 - r, 90) // BL
  return poly(pts)
}

/* Triangle tl-tr-br, matched to 4k points: three sharp corners (k
   coincident pts each) + the bottom-left corner collapsed onto BR. */
function trianglePoly(k) {
  const rep = (x, y) => Array.from({ length: k }, () => [x, y])
  return poly([...rep(0, 0), ...rep(100, 0), ...rep(100, 100), ...rep(100, 100)])
}

const R = 24
const K = 6
const RECT = roundedRectPoly(R, K)
const TRI = trianglePoly(K)
const MORPH = { type: 'spring', stiffness: 50, damping: 17 } // poster's exact feel

export default function TriMorphProto() {
  const [isTri, setIsTri] = useState(false)
  useEffect(() => {
    const t = setInterval(() => setIsTri((v) => !v), 1600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="proto">
      <figure className="proto-cell">
        <motion.div
          className="proto-shape"
          initial={false}
          animate={{ clipPath: isTri ? TRI : RECT }}
          transition={{ clipPath: MORPH }}
        />
        <figcaption>clip-path morph ({4 * K} pts) · loops every 1.6s</figcaption>
      </figure>
      <figure className="proto-cell">
        <div className="proto-shape proto-shape--ref" style={{ borderRadius: `${R}%` }} />
        <figcaption>border-radius {R}% — the at-rest target (no-pop check)</figcaption>
      </figure>
    </div>
  )
}
