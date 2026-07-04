/*
 * AmbientComposition (S1 amendment) — the /work/ header art.
 *
 * Same six states and geometry as the poster, ambient register:
 * - own cycle knob (slower than the poster), shuffled-without-repeat
 * - NON-interactive: no links, no hover, no arming, no flood; aria-hidden
 * - pauses when scrolled out of view (IntersectionObserver)
 * - settles to Registration after AMBIENT_SETTLE_CHANGES state changes
 *   while the visitor reads; leaving the viewport re-arms the show, so a
 *   returning glance earns a fresh run (proposed resume behavior)
 * - reduced motion: static Registration (and the page skips loading this
 *   module entirely — the static placeholder stays)
 * - banner-scale landscape stage only
 */
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { projects } from '../data/projects.js'
import { CALM_COLORWAYS, resolveFill } from '../data/colorways.js'
import {
  CROP_MARKS,
  LAYOUTS,
  MORPH,
  ORNAMENT_IDS,
  STAGES,
  STAGGER_MS,
  STAGGER_ORDER,
  STATE_ORDER,
  Z,
  stageTransform,
  useStageFit,
} from './composition-geometry.js'

/* --- Ambient tuning knobs --------------------------------------------- */
const AMBIENT_CYCLE_MS = 5500 // slower than the poster, on purpose
const AMBIENT_SETTLE_CHANGES = 32 // ≈ 4 passes through the ambient pool
/* F1 addendum: the ambient's state ALLOWLIST — everything except
   triangle (its crossfade entry breaks the ambient's continuous-morph
   calm). pillrhythm + columns included; hatching permitted. */
const AMBIENT_STATES = STATE_ORDER.filter((s) => s !== 'triangle')
/* Hatching parity with the poster (columns' signature accent) */
const AMBIENT_HATCH_STATES = ['columns']
/* ----------------------------------------------------------------------- */

const STAGE = STAGES.landscape

/* Y1: six-proof cast — the about shape is retired */
const cast = projects.map((p) => ({
  id: p.id,
  color: p.colorDisplay ?? p.color,
  outline: null,
}))

export default function AmbientComposition() {
  const reducedMotion = useReducedMotion()
  const [wrapRef, fit] = useStageFit(STAGE)
  const [stateName, setStateName] = useState('registration')
  // U1 scope bound: /work/ whispers — the ambient art cycles through only
  // the three calmest colorways. First paint stays canonical to match the
  // static pre-hydration placeholder exactly.
  const [colorwayName, setColorwayName] = useState('canonical')
  const [visible, setVisible] = useState(false)
  const [settled, setSettled] = useState(false)
  const changesRef = useRef(0)

  // Pause off-screen; leaving the viewport re-arms a settled composition
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
          setSettled(false)
          changesRef.current = 0
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [wrapRef])

  useEffect(() => {
    if (reducedMotion || !visible || settled) return undefined
    const t = setInterval(() => {
      changesRef.current += 1
      if (changesRef.current >= AMBIENT_SETTLE_CHANGES) {
        setSettled(true)
        setStateName('registration')
        setColorwayName('canonical') // settle back to the placeholder look
        return
      }
      setStateName((current) => {
        const others = AMBIENT_STATES.filter((s) => s !== current)
        return others[Math.floor(Math.random() * others.length)]
      })
      setColorwayName((current) => {
        const others = CALM_COLORWAYS.filter((c) => c !== current)
        return others[Math.floor(Math.random() * others.length)]
      })
    }, AMBIENT_CYCLE_MS)
    return () => clearInterval(t)
  }, [reducedMotion, visible, settled])

  const displayState = reducedMotion ? 'registration' : stateName
  const displayColorway = reducedMotion || settled ? 'canonical' : colorwayName
  const layout = LAYOUTS[displayState].landscape

  return (
    <div className="ambient" aria-hidden="true" ref={wrapRef}>
      <div
        className="comp__stage"
        style={{ width: STAGE.w, height: STAGE.h, transform: stageTransform(fit) }}
      >
        {cast.map((shape) => {
          const l = layout[shape.id]
          // G1 (shared with the poster): the ambient re-ink rides each
          // shape's own morph stagger instead of repainting at rest
          const inkDelay = (STAGGER_ORDER.indexOf(shape.id) * STAGGER_MS) / 1000
          return (
            <motion.div
              key={shape.id}
              className="comp-shape comp-shape--static"
              style={{
                zIndex: Z[shape.id],
                background: resolveFill(displayColorway, shape.id),
                transition: `background-color 0.5s var(--ease) ${inkDelay}s`,
                border: shape.outline ?? undefined,
                clipPath: l.clip ?? 'none',
              }}
              initial={false}
              animate={{
                x: l.x,
                y: l.y,
                rotate: l.rot,
                width: l.w,
                height: l.h,
                borderRadius: l.r,
              }}
              transition={{
                ...MORPH,
                delay: (STAGGER_ORDER.indexOf(shape.id) * STAGGER_MS) / 1000,
              }}
            >
              {/* F1: columns hatching, ambient parity */}
              <motion.span
                className="comp-hatch"
                aria-hidden="true"
                initial={false}
                animate={{ opacity: AMBIENT_HATCH_STATES.includes(displayState) ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          )
        })}

        {/* F1: ornaments in the ambient — same ink/paper fills, fading
            at the edges of their existence */}
        {ORNAMENT_IDS.map((oid) => {
          const o = layout[oid]
          return (
            <AnimatePresence key={oid}>
              {o && (
                <motion.div
                  className={`comp-ornament${o.fill === 'paper' ? ' comp-ornament--paper' : ''}`}
                  aria-hidden="true"
                  style={{ zIndex: Z[oid], clipPath: o.clip ?? 'none' }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  animate={{
                    opacity: 1,
                    x: o.x,
                    y: o.y,
                    width: o.w,
                    height: o.h,
                    borderRadius: o.r,
                  }}
                  transition={{
                    ...MORPH,
                    delay: (Math.max(0, STAGGER_ORDER.indexOf(oid)) * STAGGER_MS) / 1000,
                    opacity: { duration: 0.25, delay: 0 },
                  }}
                >
                  <motion.span
                    className="comp-hatch"
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: AMBIENT_HATCH_STATES.includes(displayState) ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )
        })}

        <motion.svg
          className="comp-marks"
          viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
          initial={false}
          animate={{ opacity: displayState === 'registration' ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {CROP_MARKS.landscape.map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} />
              <line x1={cx} y1={cy - 16} x2={cx} y2={cy + 16} />
            </g>
          ))}
        </motion.svg>
      </div>
    </div>
  )
}
