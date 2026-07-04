/*
 * Styleguide — dev proof sheet for the 90s Geometric Design System.
 * Renders the whole shape kit and all three pattern densities under every
 * one of the 8 themes. Exclusivity is shown, not triggered: a shape a theme
 * doesn't own draws as a LOCKED tile (never rendered-then-warned), so the
 * console stays clean while the rule stays visible. Phase 4 adds component
 * specimens below the patterns.
 */
import { SHAPES } from './shapes/registry.js'
import {
  THEMES,
  EXCLUSIVE,
  SIGNATURE,
  isShapeAllowed,
  ShapeThemeContext,
} from './shapes/shape-kit.js'
import PatternField from './shapes/PatternField.jsx'

const THEME_LABEL = {
  memphis: 'Memphis Playroom',
  cartoon: 'Saturday Morning Cartoon',
  windbreaker: '90s Windbreaker',
  techlab: 'Retro Tech Lab',
  foodcourt: 'Mall Food Court',
  lisafrank: 'Lisa Frank Lightning',
  arcade: 'Neon Arcade',
  splash: 'Nickelodeon Splash',
}
const TIER = {
  memphis: 'Tier 1 · Core',
  cartoon: 'Tier 2 · Product / UI',
  windbreaker: 'Tier 2 · Editorial',
  techlab: 'Tier 2 · Dark / Technical',
  foodcourt: 'Tier 3 · Campaign',
  lisafrank: 'Tier 3 · Campaign',
  arcade: 'Tier 4 · Gated',
  splash: 'Tier 4 · Gated',
}
const SHAPE_LABEL = {
  squiggle: 'Squiggle',
  triangle: 'Confetti Triangle',
  halfCircle: 'Half-circle',
  zigzag: 'Zigzag',
  checkerboard: 'Checkerboard',
  dotCluster: 'Dot Cluster',
  diagonalSlash: 'Diagonal Slash',
  starburst: 'Starburst',
  sparkle: '4-pt Sparkle',
  rainbowArc: 'Rainbow Arc',
  pixelCluster: 'Pixel Cluster',
  splat: 'Splat',
}
const ROLES = ['anchor', 'lead', 'support', 'flash', 'pop-1', 'pop-2', 'signal', 'wildcard']
const SHAPE_NAMES = Object.keys(SHAPES)

function ShapeCell({ name, theme }) {
  const Shape = SHAPES[name]
  const allowed = isShapeAllowed(name, theme)
  const excl = EXCLUSIVE[name]
  const isSignature = SIGNATURE[theme] === name
  return (
    <figure className={`sg-cell${isSignature ? ' sg-cell--signature' : ''}`}>
      <div className="sg-cell__art">
        {allowed ? (
          <Shape />
        ) : (
          <span className="sg-lock" aria-hidden="true">
            {excl.join(' / ')} only
          </span>
        )}
      </div>
      <figcaption className="sg-cell__cap">
        {SHAPE_LABEL[name]}
        {isSignature && <b className="sg-tagline"> · signature</b>}
        {excl && !isSignature && <span className="sg-tagline sg-tagline--excl"> · exclusive</span>}
      </figcaption>
    </figure>
  )
}

function ThemeSection({ theme }) {
  return (
    <section className="sg-theme" data-theme={theme}>
      <ShapeThemeContext.Provider value={theme}>
        <header className="sg-theme__head">
          <h2 className="sg-theme__name">{THEME_LABEL[theme]}</h2>
          <p className="sg-theme__meta">
            {TIER[theme]} · <code>data-theme=&quot;{theme}&quot;</code> · signature:{' '}
            {SHAPE_LABEL[SIGNATURE[theme]]}
          </p>
        </header>

        <div className="sg-roles">
          {ROLES.map((r) => (
            <div key={r} className="sg-role">
              <span className="sg-role__chip" style={{ background: `var(--${r})` }} />
              <span className="sg-role__name">{r}</span>
            </div>
          ))}
        </div>

        <h3 className="sg-subhead">Shape kit</h3>
        <div className="sg-grid">
          {SHAPE_NAMES.map((name) => (
            <ShapeCell key={name} name={name} theme={theme} />
          ))}
        </div>

        <h3 className="sg-subhead">Pattern densities</h3>
        <div className="sg-patterns">
          {['whisper', 'chatter', 'shout'].map((d) => (
            <div key={d} className="sg-pattern">
              <PatternField theme={theme} density={d} width={360} height={200} seed={11} debug />
            </div>
          ))}
        </div>
      </ShapeThemeContext.Provider>
    </section>
  )
}

export default function Styleguide() {
  return (
    <div className="sg">
      <header className="sg-masthead" data-theme="memphis">
        <p className="sg-kicker">90s Geometric Design System</p>
        <h1 className="sg-title">Styleguide</h1>
        <p className="sg-lede">
          Every shape and density rendered under all eight themes. Structure is constant; color is
          the variable.
        </p>
      </header>
      {THEMES.map((t) => (
        <ThemeSection key={t} theme={t} />
      ))}
    </div>
  )
}
