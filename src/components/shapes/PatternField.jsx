/*
 * PatternField — assembles a geometric background from the shape library
 * at one of the three §3.1 densities, honoring the coverage caps as code:
 *   whisper ≤8% · chatter 15–20% · shout ≥35%.
 *
 * Discipline baked in:
 *  · Palette budget (§3.1 / Rule 2): a field paints in exactly Lead +
 *    Support + one Pop, outlines in Anchor — three brights, never more.
 *  · Exclusivity (§5.3): the shape pool is the universal connectors plus
 *    only the exclusives this theme owns (splat→splash, sparkle/arc→
 *    lisafrank, pixel→techlab/arcade). Enforced by filtering the pool AND
 *    by each exclusive shape's own guard.
 *  · Deterministic layout (seeded) so the field never reflows on re-render.
 *
 * Sets data-theme on its wrapper (so the role tokens cascade) and provides
 * the same value to ShapeThemeContext (so nested shapes self-enforce).
 */
import { SHAPES, CONNECTORS } from './registry.js'
import {
  DENSITY,
  EXCLUSIVE,
  PATTERN_SNAP,
  ShapeThemeContext,
  isShapeAllowed,
  seeded,
} from './shape-kit.js'

const PALETTE = ['var(--lead)', 'var(--support)', 'var(--pop-1)'] // Lead + Support + one Pop
const ROTATIONS = [0, ...PATTERN_SNAP] // 0 / ±15 / ±45 (pattern snaps)
const AVG_FILL = 0.5 // mean painted fraction of a shape's box (coverage estimate)

/* Per-shape prop shim: most shapes take `color`; a few have their own APIs. */
function shapeProps(name, color) {
  switch (name) {
    case 'dotCluster':
    case 'rainbowArc':
      return { colors: PALETTE }
    case 'checkerboard':
      return { b: color } // `a` stays --anchor
    case 'pixelCluster':
      return { color, accent: PALETTE[2] }
    default:
      return { color }
  }
}

export default function PatternField({
  density = 'whisper',
  theme = 'memphis',
  width = 520,
  height = 260,
  seed = 7,
  debug = false,
  className,
  style,
}) {
  const spec = DENSITY[density] ?? DENSITY.whisper
  // Pool = connectors + only the exclusives this theme is allowed.
  const pool = [
    ...CONNECTORS,
    ...Object.keys(EXCLUSIVE).filter((n) => isShapeAllowed(n, theme)),
  ]

  // Size shapes so measured coverage lands inside the cap. target is the
  // cap's midpoint (whisper aims low, under its 8% ceiling).
  const target = spec.min ? (spec.min + (spec.max ?? spec.min + 0.05)) / 2 : (spec.max ?? 0.07) * 0.85
  const area = width * height
  const base = Math.sqrt((target * area) / (spec.count * AVG_FILL))

  const rand = seeded(seed * 101 + density.length)
  const placed = Array.from({ length: spec.count }, (_, i) => {
    const name = pool[Math.floor(rand() * pool.length)]
    const s = Math.max(16, Math.round(base * (0.8 + rand() * 0.5)))
    const x = Math.round(rand() * (width - s * 0.6))
    const y = Math.round(rand() * (height - s * 0.6))
    const rotate = ROTATIONS[Math.floor(rand() * ROTATIONS.length)]
    const color = PALETTE[Math.floor(rand() * PALETTE.length)]
    return { name, s, x, y, rotate, color, key: i }
  })
  const coverage = Math.round(
    (placed.reduce((sum, p) => sum + p.s * p.s * AVG_FILL, 0) / area) * 100,
  )

  return (
    <ShapeThemeContext.Provider value={theme}>
      <div
        data-theme={theme}
        className={['pattern-field', className].filter(Boolean).join(' ')}
        style={{
          position: 'relative',
          width,
          height,
          overflow: 'hidden',
          background: density === 'shout' ? 'var(--ground-tint)' : 'var(--paper)',
          ...style,
        }}
        aria-hidden="true"
      >
        {placed.map(({ name, s, x, y, rotate, color, key }) => {
          const Shape = SHAPES[name]
          if (!Shape) return null
          return (
            <div key={key} style={{ position: 'absolute', left: x, top: y }}>
              <Shape size={s} rotate={rotate} {...shapeProps(name, color)} />
            </div>
          )
        })}
        {debug && (
          <span
            style={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              font: '600 11px/1 var(--font-mono, monospace)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              background: 'var(--paper)',
              border: '2px solid var(--edge)',
              padding: '3px 7px',
            }}
          >
            {spec.label} · ≈{coverage}%
          </span>
        )}
      </div>
    </ShapeThemeContext.Provider>
  )
}
