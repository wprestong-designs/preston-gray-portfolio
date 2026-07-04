/*
 * Composition Hero (spec §1 + Appendix A).
 *
 * A fixed cast of five shapes on a 1200×600 design canvas, cycling through
 * three named states (~7s each, 1.2s-feel spring morphs, 60ms ripple
 * stagger). Shapes are links; hover/focus pauses the cycle, dims siblings,
 * sets a mono label, and drives the shared flood context.
 *
 * Geometry notes:
 * - The canvas renders at a fixed 1200×600 and is scaled to fit its wrapper
 *   (aspect-ratio 2/1), so the composition resizes as one piece — no CLS.
 * - x/y/rotate animate as transforms. width/height/border-radius animate
 *   directly — the accepted Appendix A fallback (non-uniform scale distorts
 *   the radius language unacceptably; the hero is a fixed-size layer either
 *   way).
 * - Radii are normalized to 4-value px strings in every state so framer can
 *   tween them (mixed %/px strings don't interpolate).
 *
 * Fallbacks (built here, not later):
 * - prefers-reduced-motion: static Registration; hover/focus still dims
 *   siblings, labels, and floods — opacity/color only, no movement.
 * - Touch / <768px: static Registration banner, shapes are not links
 *   (the Index of Proofs below is the navigation).
 * - ?compose=1: static composer view of all three states, shape ids labeled.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { projects } from '../data/projects.js'
import {
  COLORWAYS,
  COLORWAY_ORDER,
  isValidColorway,
  resolveFill,
} from '../data/colorways.js'
import { useFloodColor } from '../context/flood-context.js'
import { useProofOverlay } from '../context/overlay-context.js'
import {
  CLIP_STATES,
  CONNECTED_STATES,
  CROP_MARKS,
  FIDELITY_STATES,
  HOVER_R,
  LAYOUTS,
  MORPH,
  ORIENTATION_QUERY,
  ORNAMENT_IDS,
  STAGES,
  STAGGER_MS,
  STAGGER_ORDER,
  STATE_ORDER,
  TRIANGLE_NEIGHBORS,
  Z,
  buildFidelityLayout,
  isOneMass,
  nextCycleState,
  shapeClipPolygon,
  stageTransform,
  touchEdges,
  useOrientation,
  useStageFit,
  validateCycleMotion,
  validateGrammar,
} from './composition-geometry.js'

/* --- Poster tuning knobs (art-direct by feel) ------------------------- */
/* D0 pacing: 3000ms per state against the ≈1s MORPH settle keeps
   dwell:motion ≈ 2:1 (2s at rest, 1s in motion). Retune BOTH knobs
   together — the ratio is the design. Guardrail: never chase the
   reference toward a literal 1s cycle. */
const CYCLE_MS = 3000
const HOVER_MORPH = { type: 'spring', stiffness: 300, damping: 24 } // hover radius/scale
/* Sibling dim (F4 A/B, resolved by Z1b): STANDING RULE — composition
   shape fills are OPAQUE in every state and colorway; overlap reads as
   layered paper, never stained glass. The 'opacity' dim variant violates
   that wherever shapes overlap (colors blend through), so 'filter'
   (full-opacity desaturate) is the shipped mode. ?dim=opacity remains
   ONLY as a composer-era comparison override and must not ship enabled. */
const DIM_MODE = 'filter'
const DIM_OPACITY = 0.68
const DIM_FILTER = 'saturate(0.55) brightness(1.05)'

/* T1 — baked letterform layer. Art-direction knobs, exposed like the
   geometry: per-shape fragment text, type scale (× current shape height,
   so the crop survives every state morph), and x/y offsets as fractions
   of the shape's box (which fragment of the word shows through the clip).
   U0a: knobs are PER-ORIENTATION — portrait boxes crop differently, so
   each orientation gets its own fragment art direction (edit both via
   the composer's orientation toggle).
   AT_REST_MODE: which shapes wear type with no interaction —
   'none' | 'anchor' | 'all'. V1a decision: NONE ships — no at-rest
   letterforms in either orientation; type is reveal-only (hover, keyboard
   focus, T2 arming). The composer toggle and ?type= override stay for
   future comparison. */
const AT_REST_MODE = 'none'
const TYPE_MODES = ['none', 'anchor', 'all']
const TYPE_REVEAL_MS = 250
/* U0b: at-rest type hides while the composition is mid-morph (huge type
   smears into a white gash otherwise). Fade out/in duration, and how long
   after a layout change the comp counts as morphing — sized to outlast
   the MORPH spring plus the full ripple stagger (D0: ≈1.05s settle +
   8×45ms stagger → 1500). */
const TYPE_MORPH_FADE_MS = 150
const TYPE_SETTLE_MS = 1500
/* P1.6 (oneshot): decisive uppercase crops — best-effort art direction
   targeting 30–50% letterform mass visible per shape; every value stays
   composer-editable for Preston's pass. */
const LETTERFORMS = {
  summit: {
    landscape: { text: 'Summit', scale: 2.6, dx: -0.06, dy: 0.02 },
    portrait: { text: 'Summit', scale: 2.4, dx: -0.04, dy: 0 },
  },
  ourco: {
    landscape: { text: 'Ourco', scale: 2.8, dx: 0.05, dy: -0.04 },
    portrait: { text: 'Ourco', scale: 2.6, dx: 0.03, dy: -0.02 },
  },
  bristol: {
    landscape: { text: 'Bristol', scale: 2.4, dx: -0.1, dy: 0.05 },
    portrait: { text: 'Bristol', scale: 2.3, dx: -0.08, dy: 0.03 },
  },
  pinnacle: {
    landscape: { text: 'Pinnacle', scale: 2.7, dx: 0.08, dy: 0.06 },
    portrait: { text: 'Pinnacle', scale: 2.5, dx: 0.05, dy: 0.04 },
  },
  prosource: {
    landscape: { text: 'Prosource', scale: 2.3, dx: -0.05, dy: -0.06 },
    portrait: { text: 'Prosource', scale: 2.2, dx: -0.04, dy: -0.04 },
  },
  fieldintel: {
    landscape: { text: 'Field Intel', scale: 3.0, dx: -0.12, dy: 0.04 },
    portrait: { text: 'Field Intel', scale: 2.8, dx: -0.1, dy: 0.02 },
  },
}
const showsTypeAtRest = (shapeId, mode) =>
  mode === 'all' || (mode === 'anchor' && shapeId === 'fieldintel')

/* T2 — two-tap arming (coarse pointers only). Tap 1 arms: ink-in + type
   reveal + echo accent; tap 2 opens. Tapping another shape re-arms,
   tapping empty stage disarms, idle auto-disarms. */
const ARM_DISARM_MS = 4000
/* P1.4 (oneshot): the TRIANGLE vocabulary lands here — echo accents are
   triangles in four rotations (clip-path is safe on echoes: they only
   appear/disappear, never tween-morph — see the polygon-state stub in
   composition-geometry.js). Fill is the project's DEEP FLOOD color.
   Reversible: previous silhouettes were
   { summit: 'circle', ourco: 'quarter', bristol: 'pill',
     pinnacle: 'quarter', prosource: 'circle', fieldintel: 'quarter' }
   and those CSS classes still exist. */
const ECHO = {
  summit: 'tri-bl',
  ourco: 'tri-tr',
  bristol: 'tri-br',
  pinnacle: 'tri-tl',
  prosource: 'tri-bl',
  fieldintel: 'tri-tr',
}
/* P1.5/F1: 39° hatching is the COLUMNS state's signature accent per the
   fidelity spec (moved from the retired strip). Per-state flag so it can
   be reassigned or multiplied without touching render code. */
const HATCH_STATES = ['columns']
/* run-2 §5: the triangle clip-morph window arms/disarms this long after the
   pre/post-triangle neighbour settles — past the ≈1s MORPH settle, before the
   next 3s tick, so the border-radius↔polygon swap always happens at rest
   (imperceptible; the polygon is generated from the shape's own radius). */
const CLIP_ARM_MS = 1400
/* F1 spec: baked fragments stay OFF the small triangles */
const TRIANGLE_NO_TYPE = ['pinnacle', 'prosource']
/* --------------------------------------------------------------------- */
function useCast() {
  return useMemo(
    () => [
      ...projects.map((p) => ({
        id: p.id,
        // Shapes wear the poster register; floods/overlays keep the deep one.
        color: p.colorDisplay ?? p.color,
        colorHover: p.colorHover,
        displayFg: p.displayFg,
        // Poster is site-owned → themed. The echo uses the themed display
        // color, not the pinned brand (p.color), so no brand leaks onto the
        // composition. Brand appears only when the proof opens.
        echoColor: p.colorDisplay ?? p.color,
        outline: null,
        // B1b: real URLs — the S1 deep-link format, so middle-click /
        // copy-link / AT link lists resolve. Click still preventDefaults
        // into the overlay morph.
        href: `/#proof-${p.id}`,
        proofId: p.id,
        overlayId: p.id,
        label: `PROOF ${p.index} — ${p.name.toUpperCase()}`,
        aria: `Proof ${p.index} — ${p.name}, ${p.tag}`,
      })),
      // Y1: the about shape is retired — About opens from the wordmark
      // and the Index row. The cast is the six proofs.
    ],
    [],
  )
}

function Stage({ wrapRef, fit, stage, aspect = true, children }) {
  return (
    <div
      className="comp__stage-wrap"
      ref={wrapRef}
      style={aspect ? { aspectRatio: `${stage.w} / ${stage.h}` } : undefined}
    >
      <div
        className="comp__stage"
        style={{ width: stage.w, height: stage.h, transform: stageTransform(fit) }}
      >
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   ?compose=1 — static art-direction view of all six states, with an
   orientation toggle (also honors ?orient=portrait for deep links)
------------------------------------------------------------------- */
function ComposerStage({ stateName, cast, orientation, typeMode, scrim, hatch, colorway, fitMode }) {
  const stage = STAGES[orientation]
  const [wrapRef, fit] = useStageFit(stage)
  // F1: fidelity states honor the fit toggle — 'square' recomputes the
  // spec tables in a centered square for true-circular comparison.
  const layout =
    FIDELITY_STATES.includes(stateName) && fitMode === 'square'
      ? buildFidelityLayout(stateName, stage, 'square')
      : LAYOUTS[stateName][orientation]
  const edges = touchEdges(layout)
  const center = (s) => [s.x + s.w / 2, s.y + s.h / 2]
  return (
    <div className={`composer__block composer__block--${orientation}`}>
      <p className="composer__title">
        {stateName}
        <span className="composer__meta">
          {CONNECTED_STATES.includes(stateName)
            ? isOneMass(layout)
              ? ' · connected ✓'
              : ' · NOT CONNECTED'
            : ' · grid regime'}
        </span>
      </p>
      <Stage wrapRef={wrapRef} fit={fit} stage={stage}>
        {/* F1: ornaments render statically in the composer */}
        {ORNAMENT_IDS.map((oid) => {
          const o = layout[oid]
          if (!o) return null
          return (
            <div
              key={oid}
              className={`comp-ornament${o.fill === 'paper' ? ' comp-ornament--paper' : ''}`}
              aria-hidden="true"
              style={{
                zIndex: Z[oid],
                transform: `translate(${o.x}px, ${o.y}px)`,
                width: o.w,
                height: o.h,
                borderRadius: o.r,
                clipPath: o.clip ?? 'none',
              }}
            >
              {hatch && HATCH_STATES.includes(stateName) && (
                <span className="comp-hatch" aria-hidden="true" />
              )}
            </div>
          )
        })}
        {cast.map((shape) => {
          const l = layout[shape.id]
          const lf = LETTERFORMS[shape.id]?.[orientation]
          return (
            <div
              key={shape.id}
              className="comp-shape comp-shape--static"
              style={{
                zIndex: Z[shape.id],
                background: resolveFill(colorway, shape.id),
                border: shape.outline ?? undefined,
                transform: `translate(${l.x}px, ${l.y}px) rotate(${l.rot}deg)`,
                width: l.w,
                height: l.h,
                borderRadius: l.r,
                clipPath: l.clip ?? 'none',
              }}
            >
              {/* P1.5: hatching preview — governed by the same HATCH_STATES
                  flag as the live layer; the composer toggle just hides it */}
              {hatch && HATCH_STATES.includes(stateName) && (
                <span className="comp-hatch" aria-hidden="true" />
              )}
              {/* T1: at-rest letterform per the composer's mode toggle —
                  same knobs as the live layer, statically rendered */}
              {lf && showsTypeAtRest(shape.id, typeMode) && (
                <span
                  className="comp-type"
                  aria-hidden="true"
                  style={{
                    color: shape.displayFg,
                    fontSize: l.h * lf.scale,
                    transform: `translate(${lf.dx * l.w}px, ${lf.dy * l.h}px)`,
                  }}
                >
                  {lf.text}
                </span>
              )}
              <span
                className="composer__id"
                style={{ color: shape.outline ? 'var(--ink)' : 'var(--paper)' }}
              >
                {shape.id}
              </span>
            </div>
          )
        })}

        {/* Debug touch-graph: thin lines between connected shape centers.
            T4: the scrim knocks the letterform texture back so the graph
            stays legible over at-rest type. */}
        <svg className="composer__graph" viewBox={`0 0 ${stage.w} ${stage.h}`}>
          {scrim && (
            <rect
              className="composer__graph-scrim"
              x="0"
              y="0"
              width={stage.w}
              height={stage.h}
            />
          )}
          {edges.map(([a, b]) => {
            const [ax, ay] = center(layout[a])
            const [bx, by] = center(layout[b])
            return <line key={`${a}-${b}`} x1={ax} y1={ay} x2={bx} y2={by} />
          })}
          {Object.values(layout).map((s) => {
            const [cx, cy] = center(s)
            return <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
          })}
        </svg>
      </Stage>
    </div>
  )
}

function ComposerView({ cast }) {
  const [orientation, setOrientation] = useState(() => {
    const forced = new URLSearchParams(window.location.search).get('orient')
    if (forced === 'portrait' || forced === 'landscape') return forced
    return window.matchMedia(ORIENTATION_QUERY).matches ? 'landscape' : 'portrait'
  })
  // T1 comparison toggle (?type= sets the starting mode, like ?orient=)
  const [typeMode, setTypeMode] = useState(() => {
    const forced = new URLSearchParams(window.location.search).get('type')
    return TYPE_MODES.includes(forced) ? forced : AT_REST_MODE
  })
  // T4: scrim behind the debug graph for legibility over letterforms
  const [scrim, setScrim] = useState(false)
  // Y1 proposal mock: 39° hatching on the strip state (composer-only)
  const [hatch, setHatch] = useState(true)
  // U1: preview any colorway across all states (?colorway= sets the start)
  const [colorway, setColorway] = useState(() => {
    const forced = new URLSearchParams(window.location.search).get('colorway')
    return isValidColorway(forced) ? forced : 'canonical'
  })
  // F1: fidelity fit — anisotropic 'stretch' ships; 'square' previews the
  // spec tables true-circular in a centered square
  const [fitMode, setFitMode] = useState('stretch')
  return (
    <div className="composer">
      <div className="composer__bar">
        <div className="composer__toggle" role="group" aria-label="Composer orientation">
          {['landscape', 'portrait'].map((o) => (
            <button
              key={o}
              type="button"
              className={o === orientation ? 'is-active' : ''}
              onClick={() => setOrientation(o)}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="composer__toggle" role="group" aria-label="At-rest letterforms">
          {TYPE_MODES.map((m) => (
            <button
              key={m}
              type="button"
              className={m === typeMode ? 'is-active' : ''}
              onClick={() => setTypeMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="composer__toggle" role="group" aria-label="Debug layer">
          <button
            type="button"
            className={scrim ? 'is-active' : ''}
            onClick={() => setScrim((s) => !s)}
          >
            scrim
          </button>
          <button
            type="button"
            className={hatch ? 'is-active' : ''}
            onClick={() => setHatch((h) => !h)}
          >
            hatch
          </button>
        </div>
        <div className="composer__toggle" role="group" aria-label="Fidelity fit">
          {['stretch', 'square'].map((f) => (
            <button
              key={f}
              type="button"
              className={f === fitMode ? 'is-active' : ''}
              onClick={() => setFitMode(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="composer__toggle" role="group" aria-label="Colorway">
          {Object.entries(COLORWAYS).map(([key, cw]) => (
            <button
              key={key}
              type="button"
              className={key === colorway ? 'is-active' : ''}
              onClick={() => setColorway(key)}
            >
              {cw.label}
            </button>
          ))}
        </div>
      </div>
      {STATE_ORDER.map((name) => (
        <ComposerStage
          key={name}
          stateName={name}
          cast={cast}
          orientation={orientation}
          typeMode={typeMode}
          scrim={scrim}
          hatch={hatch}
          colorway={colorway}
          fitMode={fitMode}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------
   The live composition
------------------------------------------------------------------- */
export default function CompositionHero({ poster = false }) {
  const cast = useCast()
  const reducedMotion = useReducedMotion()
  const { flood, clearFlood } = useFloodColor()
  const { open, openId } = useProofOverlay()

  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const composer = params.get('compose') === '1'
  // F4 A/B: ?dim=filter or ?dim=opacity overrides the DIM_MODE constant
  const dimMode = params.get('dim') ?? DIM_MODE
  // T1 A/B/C: ?type=none|anchor|all overrides AT_REST_MODE for live comparison
  const typeMode = TYPE_MODES.includes(params.get('type'))
    ? params.get('type')
    : AT_REST_MODE
  // U1: ?colorway= pins one colorway (geometry keeps cycling)
  const pinnedColorway = isValidColorway(params.get('colorway'))
    ? params.get('colorway')
    : null
  // R0 VISUAL HARNESS (dev only). ?harness=1 freezes the auto-cycle and the
  // clip arm/disarm timers, and exposes window.__comp so scripts/visual-
  // matrix.mjs can force any (state, colorway, clip) — the permanent
  // motion-verification surface. ?state=/?clip= seed the FIRST paint, so a
  // per-frame reload renders the target statically (initial={false} → no
  // intro morph) for the state×palette matrix. Stripped from prod builds.
  const harness = import.meta.env.DEV && params.get('harness') === '1'
  const forcedState =
    harness && STATE_ORDER.includes(params.get('state')) ? params.get('state') : null
  const forcedClip = harness && params.get('clip') === '1'
  // R3: touch is first-class — the cycle runs and shapes are live links
  // everywhere. Only reduced motion pins the static Registration state
  // (shapes stay tappable).
  const staticLayout = reducedMotion

  const orientation = useOrientation()
  const stage = STAGES[orientation]
  const [wrapRef, fit] = useStageFit(stage)
  const [stateName, setStateName] = useState(forcedState ?? 'registration')
  // stateRef mirrors stateName for the interval's fixed-cycle successor
  // (no side effects inside setState updaters).
  const stateRef = useRef(forcedState ?? 'registration')
  // Triangle clip-morph window (run-2 §5): clipArmed is the timed flag (set
  // at the neighbours' REST by the effect below); clipActive derives it off
  // the static/reduced case, so shapes only ever clip while the cycle is live.
  const [clipArmed, setClipArmed] = useState(forcedClip)
  // U1: the colorway axis. First paint is CANONICAL (brand-stable); the
  // cycle then moves through the eight named colorways, shuffled without
  // repeat and COUPLED to the geometry morph — a shape re-inks only as it
  // changes silhouette, never at rest. Reduced motion pins canonical;
  // ?colorway= pins any.
  const [colorwayName, setColorwayName] = useState('canonical')
  // B1a: hover is SINGLE-OWNER, flood-context semantics. hoveredId is the
  // one source of truth for label, sibling dim, ink-in fill, and (when T1
  // lands) the type-reveal. The ref mirrors it for event-time ownership
  // checks: leave side effects (flood clear, resume timer) run outside the
  // state updater, so the updater's own guard can't protect them.
  const [hoveredId, setHoveredId] = useState(null)
  const hoveredRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const resumeTimer = useRef(null)
  // T2: armed state is the touch twin of hoveredId — same single-owner
  // semantics, separate owner (hybrid devices can hold both; the visual
  // pipeline unions them per shape). suppressClick marks the shape whose
  // NEXT click was generated by its own arming tap and must be swallowed.
  const [armedId, setArmedId] = useState(null)
  const armedRef = useRef(null)
  const armTimer = useRef(null)
  const suppressClick = useRef(null)

  // Orientation flip: drop any active hover label so it can't strand
  // mid-tween (render-phase adjust pattern). hoveredRef intentionally
  // keeps its claim — refs can't be written in render, and the stale claim
  // only means the eventual pointer-leave still runs its owner cleanup
  // (flood clear + resume schedule), which is exactly what we want.
  const [lastOrientation, setLastOrientation] = useState(orientation)
  if (lastOrientation !== orientation) {
    setLastOrientation(orientation)
    setHoveredId(null)
  }

  const displayState = staticLayout ? 'registration' : stateName
  // Clip only while the cycle is live (never static/reduced).
  const clipActive = clipArmed && !staticLayout
  const layout = LAYOUTS[displayState][orientation]
  // U1: resolved colorway — reduced-motion statics wear canonical UNLESS
  // a ?colorway= pin is present (a static pin adds zero motion — P6
  // parity fix); a pin also wins over the live cycle.
  const displayColorway = staticLayout
    ? pinnedColorway ?? 'canonical'
    : pinnedColorway ?? colorwayName

  // U0b: at-rest letterforms hide while the comp is morphing. The flag
  // drops in the same render the layout target changes (state cycle OR
  // orientation flip — render-phase adjust) and restores TYPE_SETTLE_MS
  // later via the effect below. Hover/arm reveals ignore it: those are
  // deliberate, and the cycle pauses under them anyway.
  const layoutKey = `${displayState}|${orientation}`
  const [typeSettled, setTypeSettled] = useState(true)
  const [lastLayoutKey, setLastLayoutKey] = useState(layoutKey)
  if (lastLayoutKey !== layoutKey) {
    setLastLayoutKey(layoutKey)
    setTypeSettled(false)
  }

  // Cycle: shuffled-without-repeat — any state except the current one.
  // Paused on hover/focus, and while any overlay/layer is open (R3);
  // resumes 1.5s after leave / on overlay close.
  const overlayOpen = openId !== null
  useEffect(() => {
    if (composer || staticLayout || paused || overlayOpen || harness) return undefined
    const t = setInterval(() => {
      // Fixed cycle (run-2 §5): advance in STATE_ORDER — no shuffle. The
      // choreography is a designed, watched sequence (arrangement differs
      // every step; triangle only touches rect-family neighbours). The
      // colorway re-ink stays COUPLED to the geometry morph — a shape
      // re-inks only as it changes silhouette, one gesture. The triangle
      // boundary is a true clip-path morph now (no blackout, no wipe).
      const next = nextCycleState(stateRef.current)
      stateRef.current = next
      setStateName(next)
      setColorwayName((c) => {
        const pool = COLORWAY_ORDER.filter((x) => x !== c)
        return pool[Math.floor(Math.random() * pool.length)]
      })
    }, CYCLE_MS)
    return () => clearInterval(t)
  }, [composer, staticLayout, paused, overlayOpen, harness])

  // Triangle clip-morph arm/disarm (run-2 §5). ARM at the pre-triangle
  // neighbour's REST (border-radius → matching polygon, imperceptible because
  // the polygon is generated FROM that radius and the shape isn't moving),
  // DISARM at the post-triangle neighbour's REST. Keyed off stateName (not
  // free timers), so hover-pause and reduced motion can never misfire the
  // window. CLIP_ARM_MS sits after the morph settles, before the next tick.
  useEffect(() => {
    if (staticLayout || harness) return undefined // harness drives clip explicitly
    const [pre, post] = TRIANGLE_NEIGHBORS
    if (stateName === pre) {
      const t = setTimeout(() => setClipArmed(true), CLIP_ARM_MS)
      return () => clearTimeout(t)
    }
    if (stateName === post) {
      const t = setTimeout(() => setClipArmed(false), CLIP_ARM_MS)
      return () => clearTimeout(t)
    }
    return undefined
  }, [stateName, staticLayout, harness])

  // Grammar check while art-directing + cycle-motion validator (dev warn if
  // any adjacent pair fails the §5 minimum-motion threshold).
  useEffect(() => {
    if (composer) validateGrammar()
    if (import.meta.env.DEV) {
      const fails = [
        ...validateCycleMotion('landscape'),
        ...validateCycleMotion('portrait'),
      ]
      if (fails.length) {
        console.warn('[composition] cycle min-motion FAIL:', fails)
      }
    }
  }, [composer])

  // U0b settle timer — the async callback flips the flag back once the
  // spring + stagger have landed
  useEffect(() => {
    if (typeSettled) return undefined
    const t = setTimeout(() => setTypeSettled(true), TYPE_SETTLE_MS)
    return () => clearTimeout(t)
  }, [typeSettled])

  useEffect(
    () => () => {
      clearTimeout(resumeTimer.current)
      clearTimeout(armTimer.current)
    },
    [],
  )

  // R0 harness control surface — dev only, torn down on unmount. Lets
  // scripts/visual-matrix.mjs drive live transitions (setState → real
  // framer morph) and clip arming without a page reload.
  useEffect(() => {
    if (!harness) return undefined
    window.__comp = {
      states: STATE_ORDER,
      colorways: ['canonical', ...COLORWAY_ORDER],
      clipStates: [...CLIP_STATES],
      setState: (n) => {
        stateRef.current = n
        setStateName(n)
      },
      setColorway: (c) => setColorwayName(c),
      setClip: (v) => setClipArmed(Boolean(v)),
      getState: () => stateRef.current,
    }
    return () => {
      delete window.__comp
    }
  }, [harness])

  if (composer) return <ComposerView cast={cast} />

  // Entering always TAKES the hover, replacing any previous shape's claim
  // — shared by pointer-enter and keyboard focus so the two can't stack.
  const enterShape = (shape) => {
    clearTimeout(resumeTimer.current)
    hoveredRef.current = shape.id
    setPaused(true)
    setHoveredId(shape.id)
    if (shape.proofId) flood(shape.proofId)
    else clearFlood()
  }

  // Leaving is a full no-op unless this shape still OWNS the hover. A
  // stale pointer-leave (or a blur racing a newer focus during rapid Tab)
  // must not clear another shape's label/dim, kill its flood, or schedule
  // a cycle resume underneath an active hover — the resume-timer leak was
  // the fan-out in the live screenshot.
  const leaveShape = (shape) => {
    if (hoveredRef.current !== shape.id) return
    hoveredRef.current = null
    setHoveredId(null)
    if (shape.proofId) clearFlood(shape.proofId)
    resumeTimer.current = setTimeout(() => setPaused(false), 1500)
  }

  /* T2 state machine — arming is the coarse-pointer hover-preview:
     ink-in + type reveal + echo + flood + cycle pause. */
  const disarm = () => {
    clearTimeout(armTimer.current)
    if (armedRef.current === null) return
    armedRef.current = null
    setArmedId(null)
    clearFlood()
    resumeTimer.current = setTimeout(() => setPaused(false), 1500)
  }

  const arm = (shape) => {
    clearTimeout(armTimer.current)
    clearTimeout(resumeTimer.current)
    armedRef.current = shape.id
    setArmedId(shape.id)
    setPaused(true)
    if (shape.proofId) flood(shape.proofId)
    else clearFlood()
    armTimer.current = setTimeout(disarm, ARM_DISARM_MS)
  }

  // Tap 1 on an unarmed shape: arm it and mark its imminent click as
  // "consumed by arming". Tap on an already-armed shape: do nothing here —
  // the click that follows opens. SR safety: VoiceOver/TalkBack activation
  // dispatches a simulated CLICK (mouse sequence at the a11y layer), not a
  // trusted touch pointerup, so it never enters this handler — assistive
  // tech and keyboards open on FIRST activation, per the anchor semantics.
  const shapePointerUp = (shape) => (e) => {
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return
    if (armedRef.current === shape.id) return
    arm(shape)
    // Expiring marker: if the tap's own click never arrives (canceled
    // touch), a stale marker must not eat a later keyboard/SR activation.
    suppressClick.current = { id: shape.id, at: performance.now() }
  }

  const shapeClick = (shape) => (e) => {
    e.preventDefault()
    const consumed = suppressClick.current
    suppressClick.current = null
    if (
      consumed &&
      consumed.id === shape.id &&
      performance.now() - consumed.at < 700
    ) {
      return
    }
    // Opening: clear the armed preview without scheduling a resume — the
    // overlay's own open state pauses the cycle from here.
    clearTimeout(armTimer.current)
    armedRef.current = null
    setArmedId(null)
    // U0c: release any hover claim silently too. Once #root goes inert
    // the pointer's leave event can never arrive, which left a ghost
    // label/dim waiting behind the closed overlay.
    if (hoveredRef.current !== null) {
      hoveredRef.current = null
      setHoveredId(null)
      if (shape.proofId) clearFlood(shape.proofId)
      else clearFlood()
    }
    clearTimeout(resumeTimer.current)
    open(shape.overlayId, `shape:${shape.overlayId}`, e.currentTarget)
  }

  // Tapping empty stage disarms (coarse pointers only)
  const framePointerUp = (e) => {
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return
    if (e.target.closest('.comp-shape')) return
    disarm()
  }

  // Dim keys off the VALIDATED hovered shape, so siblings can only dim
  // while a shape is actually rendering at full strength.
  const hoveredShape = hoveredId ? cast.find((s) => s.id === hoveredId) ?? null : null
  const hoveredLayout = hoveredShape ? layout[hoveredShape.id] : null

  // Edge-aware label placement (F2): prefer right of the shape, flip left
  // when cramped, and hard-clamp inside the stage on both axes so no
  // label is ever clipped — including for bleeding shapes.
  const LABEL_W = 280
  const LABEL_H = 44
  const PAD = 8
  let labelX = 0
  let labelY = 0
  let labelFlips = false
  if (hoveredLayout) {
    labelX = hoveredLayout.x + hoveredLayout.w + 16
    if (labelX + LABEL_W > stage.w - PAD) {
      labelFlips = true
      labelX = hoveredLayout.x - 16
      if (labelX - LABEL_W < PAD) {
        labelFlips = false
        labelX = Math.max(PAD, Math.min(hoveredLayout.x + hoveredLayout.w + 16, stage.w - LABEL_W - PAD))
      }
    }
    labelY = Math.max(PAD, Math.min(hoveredLayout.y + 8, stage.h - LABEL_H - PAD))
  }

  return (
    <div
      className={`comp${poster ? ' comp--poster' : ''}`}
      aria-label="Project composition — each shape opens its proof"
    >
      {/* T2: taps that land outside every shape disarm */}
      <div className="comp__frame" onPointerUp={framePointerUp}>
        <Stage wrapRef={wrapRef} fit={fit} stage={stage} aspect={!poster}>
        {cast.map((shape) => {
          const l = layout[shape.id]
          const lf = LETTERFORMS[shape.id]?.[orientation]
          // U1: the at-rest fill comes from the current colorway's ramp
          // member for this project's family; ink-in still lands on the
          // DEEP FLOOD (identity anchor — never colorway-driven).
          const fill = resolveFill(displayColorway, shape.id)
          const isHovered = hoveredShape?.id === shape.id
          const isArmed = armedId === shape.id
          // isActive unions the two preview owners (mouse hover / touch
          // arm) — ink-in and type reveal key off this ONE derivation, so
          // the two can never disagree per shape. Dim stays hover-only:
          // arming's enumerated affordances are ink-in + type + echo.
          const isActive = isHovered || isArmed
          const isDimmed = hoveredShape !== null && !isHovered
          // V1a: the settle gate now covers REVEALED type too — with
          // at-rest letterforms off, hover/arm early in a state morph was
          // the remaining smear path; the reveal simply waits out the tween.
          // F1: fragments stay OFF the small triangles (spec note).
          const typeVisible =
            (isActive || showsTypeAtRest(shape.id, typeMode)) &&
            typeSettled &&
            !(displayState === 'triangle' && TRIANGLE_NO_TYPE.includes(shape.id))
          const staggerDelay = staticLayout
            ? 0
            : (STAGGER_ORDER.indexOf(shape.id) * STAGGER_MS) / 1000
          // R3+R5: every shape is a live link on every input class —
          // proofs open their project overlay, about opens the About overlay.
          const Shape = motion.a
          return (
            <Shape
              key={shape.id}
              href={shape.href}
              aria-label={shape.aria}
              onClick={shapeClick(shape)}
              className="comp-shape"
              style={{
                zIndex: Z[shape.id],
                // Active fill is a CSS transition (framer can't tween var()
                // strings); reduced motion keeps the color change (spec §B).
                background: isActive ? shape.colorHover ?? fill : fill,
                // G1: the cycle re-ink rides THIS shape's own morph — same
                // stagger delay as its geometry, duration matched to the
                // spring's main travel — so a repaint can never land on a
                // resting shape ahead of its movement (the "second color
                // mid-step" glitch, G0-measured). Hover/arm ink-in stays
                // snappy and undelayed, and because it re-renders with a
                // zero-delay transition it always beats an in-flight cycle
                // repaint on an armed shape.
                transition: isActive
                  ? 'background-color 0.25s var(--ease)'
                  : `background-color 0.5s var(--ease) ${staggerDelay}s`,
                border: shape.outline ?? undefined,
                '--shape-color': shape.outline ? 'var(--ink)' : fill,
              }}
              initial={false}
              animate={{
                x: l.x,
                y: l.y,
                rotate: l.rot,
                width: l.w,
                height: l.h,
                // Hover morphs to the shape's alternate silhouette —
                // color-only under reduced motion.
                borderRadius:
                  isHovered && !reducedMotion ? HOVER_R[shape.id] : l.r,
                // run-2 §5: across the triangle window the silhouette is a
                // matched-vertex clip polygon (columns→triangle→pillrhythm
                // interpolate continuously); elsewhere clip is off and
                // border-radius governs. The none↔polygon flips happen only
                // at the armed/disarmed REST edges (imperceptible). clip-path
                // clips the shape AND its children (letterform, echo).
                clipPath: clipActive ? shapeClipPolygon(l) : 'none',
                scale: isHovered && !reducedMotion ? 1.04 : 1,
                opacity: isDimmed && dimMode === 'opacity' ? DIM_OPACITY : 1,
                filter: isDimmed && dimMode === 'filter' ? DIM_FILTER : 'saturate(1) brightness(1)',
              }}
              transition={{
                ...MORPH,
                delay: staggerDelay,
                // clip morph rides the same spring + ripple as geometry; the
                // none↔polygon arm/disarm flips are non-interpolable so framer
                // snaps them, but only ever at rest, so they read as nothing.
                clipPath: { ...MORPH, delay: staggerDelay },
                ...(isHovered ? { borderRadius: { ...HOVER_MORPH, delay: 0 } } : {}),
                scale: { ...HOVER_MORPH, delay: 0 },
                opacity: { duration: 0.25, delay: 0 },
                filter: { duration: 0.25, delay: 0 },
              }}
              // Pointer events with an explicit type check (R3): iOS tap
              // synthesizes mouseenter, which would strand a sticky hover —
              // only true mouse pointers drive the hover preview.
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') enterShape(shape)
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === 'mouse') leaveShape(shape)
              }}
              onPointerUp={shapePointerUp(shape)}
              // U0c: keyboard only — a tap/click also FOCUSES the anchor,
              // and that focus was taking the hover on touch (type + label
              // ghosting outside the arming machine). :focus-visible is
              // the input-class oracle: true for keyboard focus, false for
              // pointer-driven focus.
              onFocus={(e) => {
                if (!e.currentTarget.matches(':focus-visible')) return
                enterShape(shape)
              }}
              onBlur={() => leaveShape(shape)}
            >
              {/* W1a: the overlay's morph SOURCE. The layoutId must not
                  live on the shape itself — layout projection re-measures
                  on every commit, and since the shape's geometry moves via
                  the animate pipeline BETWEEN commits, any re-render near
                  settle (the type-settle flip) saw a stale-snapshot delta
                  and re-animated it: the double-settle. This child is
                  transparent, value-static, inset:0 — its bounds always
                  equal the shape's visual box, spurious projection
                  corrections on it are invisible, and it keeps the
                  letterform OUTSIDE the shared element (W1b). Ids stay
                  static and distinct (V1b): proof-shape-* / proof-row-*. */}
              <motion.span
                className="comp-morph-source"
                aria-hidden="true"
                layoutId={`proof-shape-${shape.overlayId}`}
              />
              {/* P1.5: strip-state hatching — the state's signature print
                  texture, opacity-gated like Registration's crop marks */}
              <motion.span
                className="comp-hatch"
                aria-hidden="true"
                initial={false}
                animate={{ opacity: HATCH_STATES.includes(displayState) ? 1 : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.4 }}
              />
              {/* T1: baked letterform, clipped by the shape's own
                  border-box (overflow:hidden survives the radius morphs —
                  CSS clips to the animated rounded box every frame).
                  Geometry tweens ride the same spring + stagger as the
                  shape so the crop never lags its window. Reveal is fade +
                  slight scale settle; reduced motion pins scale (fade only). */}
              {lf && (
                <motion.span
                  className="comp-type"
                  aria-hidden="true"
                  style={{ color: shape.displayFg }}
                  initial={false}
                  animate={{
                    fontSize: l.h * lf.scale,
                    x: lf.dx * l.w,
                    y: lf.dy * l.h,
                    opacity: typeVisible ? 1 : 0,
                    scale: typeVisible || reducedMotion ? 1 : 1.06,
                  }}
                  transition={{
                    fontSize: { ...MORPH, delay: staggerDelay },
                    x: { ...MORPH, delay: staggerDelay },
                    y: { ...MORPH, delay: staggerDelay },
                    // Hover/arm reveal keeps the 250ms settle; at-rest
                    // morph-hide/show uses the quicker U0b fade
                    opacity: {
                      duration:
                        (isActive ? TYPE_REVEAL_MS : TYPE_MORPH_FADE_MS) / 1000,
                      delay: 0,
                    },
                    scale: {
                      duration: reducedMotion ? 0 : TYPE_REVEAL_MS / 1000,
                      delay: 0,
                    },
                  }}
                >
                  {lf.text}
                </motion.span>
              )}

              {/* T2: echo accent while armed — deep flood register.
                  Reduced motion: fade only, no scale animation. */}
              <AnimatePresence>
                {isArmed && (
                  <motion.i
                    className={`comp-echo comp-echo--${ECHO[shape.id]}`}
                    style={{ background: shape.echoColor }}
                    initial={reducedMotion ? { opacity: 0, scale: 1 } : { opacity: 1, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={reducedMotion ? { duration: 0.15 } : { ...HOVER_MORPH }}
                  />
                )}
              </AnimatePresence>
            </Shape>
          )
        })}

        {/* F1 — ORNAMENTS: composition elements that are not project
            doors (aria-hidden, non-interactive). They tween between
            fidelity states that share them and fade at the edges of
            their existence; fills are ink or paper(+ink outline), never
            colorway-driven. */}
        {ORNAMENT_IDS.map((oid) => {
          const o = layout[oid]
          const staggerDelay = staticLayout
            ? 0
            : (Math.max(0, STAGGER_ORDER.indexOf(oid)) * STAGGER_MS) / 1000
          return (
            <AnimatePresence key={oid}>
              {o && (
                <motion.div
                  className={`comp-ornament${o.fill === 'paper' ? ' comp-ornament--paper' : ''}`}
                  aria-hidden="true"
                  style={{ zIndex: Z[oid] }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  animate={{
                    opacity: 1,
                    x: o.x,
                    y: o.y,
                    width: o.w,
                    height: o.h,
                    borderRadius: o.r,
                    // §5: ornaments clip-morph with the shapes across the window
                    clipPath: clipActive ? shapeClipPolygon(o) : 'none',
                  }}
                  transition={{
                    ...MORPH,
                    delay: staggerDelay,
                    clipPath: { ...MORPH, delay: staggerDelay },
                    opacity: { duration: 0.2, delay: 0 },
                  }}
                >
                  {/* Ornaments carry the columns hatching too */}
                  <motion.span
                    className="comp-hatch"
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: HATCH_STATES.includes(displayState) ? 1 : 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.4 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}

        {/* Crop marks — Registration state only */}
        <motion.svg
          className="comp-marks"
          viewBox={`0 0 ${stage.w} ${stage.h}`}
          aria-hidden="true"
          initial={false}
          animate={{ opacity: displayState === 'registration' ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          {CROP_MARKS[orientation].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} />
              <line x1={cx} y1={cy - 16} x2={cx} y2={cy + 16} />
            </g>
          ))}
        </motion.svg>

        </Stage>

        {/* Label over-layer (F2) — same coordinate transform as the stage,
            but OUTSIDE the cropped wrapper so labels never clip */}
        <div
          className="comp__stage comp__stage--over"
          style={{ width: stage.w, height: stage.h, transform: stageTransform(fit) }}
          aria-hidden="true"
        >
          {/* Constant key (B1a): ONE persistent label element. A shape-to-
              shape handoff swaps text/position in place — per-shape keys
              made AnimatePresence crossfade the outgoing and incoming
              labels, the two-labels-at-once failure in the screenshot.
              Enter/exit fades only run at the edges of a hover session. */}
          <AnimatePresence>
            {hoveredShape && (
              <motion.div
                key="hover-label"
                className={`comp-label${labelFlips ? ' comp-label--flip' : ''}`}
                style={{ left: labelX, top: labelY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <span className="comp-label__text">{hoveredShape.label}</span>
                <motion.i
                  className="comp-label__rule"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
