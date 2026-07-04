/*
 * The 90s Geometric shape library (strategy-doc §5).
 *
 * Every shape is a self-contained inline SVG that paints with ROLE TOKENS
 * only (var(--lead) etc.) — so it re-themes for free under any [data-theme]
 * — obeys the legal stroke weights (2/3/4) and rotation snaps from
 * shape-kit.js, and, if exclusive (§5.3), refuses to render outside the
 * palette that owns it.
 *
 * Prop contract (all shapes): size (px width; height follows the viewBox
 * ratio), rotate (snapped to a legal angle), color / a / b (role-token
 * strings), plus any passthrough SVG props. Universal connectors take an
 * optional `outline` to add a 2px anchor keyline (Rule 6) when they sit on
 * a bright.
 */
import { STROKE, snap, useExclusivityGuard } from './shape-kit.js'

/* ---- shared SVG frame -------------------------------------------------- */
function vbSize(vb, size) {
  const [, , w, h] = vb.split(' ').map(Number)
  return { w: size, h: (size * h) / w }
}
function Svg({ size = 48, vb = '0 0 48 48', rotate = 0, name, className, style, ...rest }) {
  const { w, h } = vbSize(vb, size)
  const angle = snap(rotate)
  return (
    <svg
      width={w}
      height={h}
      viewBox={vb}
      fill="none"
      className={['shape', name && `shape--${name}`, className].filter(Boolean).join(' ')}
      style={{ transform: angle ? `rotate(${angle}deg)` : undefined, overflow: 'visible', ...style }}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  )
}

/* ---- stars (computed polygons) ---------------------------------------- */
function starPoints(cx, cy, spikes, outer, inner) {
  const pts = []
  const step = Math.PI / spikes
  let a = -Math.PI / 2
  for (let i = 0; i < spikes; i += 1) {
    pts.push([cx + Math.cos(a) * outer, cy + Math.sin(a) * outer])
    a += step
    pts.push([cx + Math.cos(a) * inner, cy + Math.sin(a) * inner])
    a += step
  }
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
}

/* =======================================================================
   Universal connectors — legal under every theme
   ======================================================================= */

/* Squiggle — Memphis's signature mark; a smooth 3-hump wave. */
export function Squiggle({ size = 64, color = 'var(--lead)', ...p }) {
  return (
    <Svg size={size} vb="0 0 64 24" name="squiggle" {...p}>
      <path
        d="M2 12 Q 12 2 22 12 T 42 12 T 62 12"
        stroke={color}
        strokeWidth={STROKE.illustration}
        strokeLinecap="round"
      />
    </Svg>
  )
}

/* Confetti triangle — the most universal filler in the kit. */
export function ConfettiTriangle({ size = 44, color = 'var(--pop-1)', outline, ...p }) {
  return (
    <Svg size={size} vb="0 0 48 48" name="triangle" {...p}>
      <path
        d="M24 4 L44 42 L4 42 Z"
        fill={color}
        stroke={outline ? 'var(--edge)' : 'none'}
        strokeWidth={outline ? STROKE.ui : 0}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/* Half-circle — the "sunrise" stack unit. */
export function HalfCircle({ size = 48, color = 'var(--support)', outline, ...p }) {
  return (
    <Svg size={size} vb="0 0 48 26" name="halfcircle" {...p}>
      <path
        d="M2 24 A 22 22 0 0 1 46 24 Z"
        fill={color}
        stroke={outline ? 'var(--edge)' : 'none'}
        strokeWidth={outline ? STROKE.ui : 0}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/* Zigzag / rickrack. */
export function Zigzag({ size = 64, color = 'var(--pop-2)', ...p }) {
  return (
    <Svg size={size} vb="0 0 64 24" name="zigzag" {...p}>
      <path
        d="M2 20 L 12 4 L 22 20 L 32 4 L 42 20 L 52 4 L 62 20"
        stroke={color}
        strokeWidth={STROKE.illustration}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/* Two-color checkerboard — TWO colors only, ever (§5.2). */
export function Checkerboard({ size = 48, a = 'var(--edge)', b = 'var(--flash)', cells = 4, ...p }) {
  const s = 48 / cells
  const rects = []
  for (let r = 0; r < cells; r += 1) {
    for (let c = 0; c < cells; c += 1) {
      rects.push(
        <rect key={`${r}-${c}`} x={c * s} y={r * s} width={s} height={s} fill={(r + c) % 2 ? b : a} />,
      )
    }
  }
  return (
    <Svg size={size} vb="0 0 48 48" name="checker" {...p}>
      {rects}
    </Svg>
  )
}

/* Dot cluster — confetti dots in three role hues. */
export function DotCluster({
  size = 48,
  colors = ['var(--lead)', 'var(--support)', 'var(--pop-1)'],
  ...p
}) {
  const dots = [
    [12, 14, 6],
    [34, 10, 4],
    [22, 28, 5],
    [40, 32, 6],
    [10, 38, 4],
    [30, 42, 3],
  ]
  return (
    <Svg size={size} vb="0 0 48 48" name="dots" {...p}>
      {dots.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={colors[i % colors.length]} />
      ))}
    </Svg>
  )
}

/* Diagonal slash set — three 45° pattern rules. */
export function DiagonalSlash({ size = 48, color = 'var(--lead)', ...p }) {
  return (
    <Svg size={size} vb="0 0 48 48" name="slash" {...p}>
      {[-14, 2, 18].map((o, i) => (
        <line
          key={i}
          x1={o}
          y1={48}
          x2={o + 30}
          y2={18}
          stroke={color}
          strokeWidth={STROKE.illustration}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  )
}

/* Starburst — Cartoon's "POW". Filled 12-spike burst, optional keyline. */
export function Starburst({ size = 52, color = 'var(--flash)', outline = true, ...p }) {
  return (
    <Svg size={size} vb="0 0 52 52" name="starburst" {...p}>
      <polygon
        points={starPoints(26, 26, 12, 24, 13)}
        fill={color}
        stroke={outline ? 'var(--edge)' : 'none'}
        strokeWidth={outline ? STROKE.ui : 0}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/* =======================================================================
   Exclusives — refuse to render outside the palette that owns them (§5.3)
   ======================================================================= */

/* 4-point sparkle — Lisa Frank exclusive. */
export function Sparkle({ size = 44, color = 'var(--flash)', ...p }) {
  if (!useExclusivityGuard('sparkle')) return null
  return (
    <Svg size={size} vb="0 0 48 48" name="sparkle" {...p}>
      <path
        d="M24 2 C 26 18 30 22 46 24 C 30 26 26 30 24 46 C 22 30 18 26 2 24 C 18 22 22 18 24 2 Z"
        fill={color}
      />
    </Svg>
  )
}

/* Rainbow arc — Lisa Frank exclusive. Concentric stroked arcs. */
export function RainbowArc({
  size = 56,
  colors = ['var(--lead)', 'var(--support)', 'var(--pop-1)'],
  ...p
}) {
  if (!useExclusivityGuard('rainbowArc')) return null
  return (
    <Svg size={size} vb="0 0 56 32" name="arc" {...p}>
      {colors.map((c, i) => {
        const r = 24 - i * 7
        return (
          <path
            key={i}
            d={`M${28 - r} 30 A ${r} ${r} 0 0 1 ${28 + r} 30`}
            stroke={c}
            strokeWidth={STROKE.illustration}
            strokeLinecap="round"
          />
        )
      })}
    </Svg>
  )
}

/* Pixel cluster — Tech Lab / Arcade exclusive. 8-bit sprite on a 6×6 grid. */
const SPRITE = [
  [2, 0],
  [3, 0],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [0, 2],
  [1, 2],
  [4, 2],
  [5, 2],
  [0, 3],
  [2, 3],
  [3, 3],
  [5, 3],
  [1, 4],
  [4, 4],
  [2, 5],
  [3, 5],
]
export function PixelCluster({ size = 48, color = 'var(--support)', accent = 'var(--flash)', ...p }) {
  if (!useExclusivityGuard('pixelCluster')) return null
  const u = 8
  return (
    <Svg size={size} vb="0 0 48 48" name="pixel" {...p}>
      {SPRITE.map(([c, r], i) => (
        <rect key={i} x={c * u} y={r * u} width={u} height={u} fill={i % 5 === 0 ? accent : color} />
      ))}
    </Svg>
  )
}

/* Splat / drip — Splash exclusive. Irregular blob with two drips. */
export function Splat({ size = 52, color = 'var(--lead)', ...p }) {
  if (!useExclusivityGuard('splat')) return null
  return (
    <Svg size={size} vb="0 0 52 52" name="splat" {...p}>
      <path
        d="M26 3 C 34 3 39 9 40 17 C 48 17 50 27 43 31 C 47 38 40 46 33 42 C 31 50 20 50 18 42
           C 10 45 3 38 8 31 C 1 27 4 16 12 17 C 13 8 18 3 26 3 Z"
        fill={color}
      />
      <circle cx={14} cy={48} r={3.2} fill={color} />
      <circle cx={40} cy={47} r={2.4} fill={color} />
    </Svg>
  )
}
