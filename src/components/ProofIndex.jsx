/*
 * Typographic Index with cursor proof card (spec §2).
 *
 * - Rows drive the shared flood context (hover + keyboard focus).
 * - Fine pointers get the cursor-following proof card: framer useSpring on
 *   motion values — zero React state per mousemove.
 * - Keyboard focus and prefers-reduced-motion pin the card beside the list
 *   (fade only).
 * - Coarse pointers get no cursor card; rows show an inline thumbnail.
 */
import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { projects } from '../data/projects.js'
import { useFloodColor } from '../context/flood-context.js'
import { useProofOverlay } from '../context/overlay-context.js'
import { ProofLift } from './ProofLift.jsx'

const CARD_OFFSET = { x: 22, y: 24 }
const SPRING = { stiffness: 180, damping: 22, mass: 0.6 }

export default function ProofIndex() {
  const { flood, clearFlood } = useFloodColor()
  const { open } = useProofOverlay()
  const reducedMotion = useReducedMotion()
  const finePointer = useMemo(
    () => window.matchMedia('(pointer: fine)').matches,
    [],
  )

  const [hovered, setHovered] = useState(null)
  const [origin, setOrigin] = useState('pointer') // 'pointer' | 'focus'
  const wasHovering = useRef(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const pinned = reducedMotion || origin === 'focus'

  const handleMouseMove = (e) => {
    if (!finePointer || reducedMotion) return
    const targetX = e.clientX + CARD_OFFSET.x
    const targetY = e.clientY + CARD_OFFSET.y
    if (!wasHovering.current) {
      // First entry: jump to the cursor instead of flying in from 0,0
      x.jump(targetX)
      y.jump(targetY)
      wasHovering.current = true
    } else {
      x.set(targetX)
      y.set(targetY)
    }
  }

  const enterRow = (proof) => {
    setOrigin('pointer')
    setHovered(proof)
    flood(proof.id)
  }

  const focusRow = (proof) => {
    setOrigin('focus')
    setHovered(proof)
    flood(proof.id)
  }

  // B1a audit: only true mouse pointers may release, and only if the
  // pointer owns the card — a mouse exiting the list must not clear a
  // card that keyboard focus is currently holding.
  const leaveList = (e) => {
    if (e.pointerType !== 'mouse') return
    wasHovering.current = false
    if (origin === 'focus') return
    setHovered(null)
    clearFlood()
  }

  const blurRow = (proof) => (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    setHovered((prev) => (prev?.id === proof.id ? null : prev))
    clearFlood(proof.id)
  }

  return (
    <section className="proof-index" aria-label="Index of proofs">
      <div className="container proof-index__inner">
        <p className="proof-index__label">Index of Proofs</p>
        <ol
          className="proof-index__list"
          onMouseMove={handleMouseMove}
          onPointerLeave={leaveList}
        >
          {projects.map((proof) => (
            <li key={proof.id}>
              <a
                href={`/#proof-${proof.id}`}
                className="proof-row"
                style={{ '--row-color': proof.color }}
                aria-label={`Proof ${proof.index} — ${proof.name}, ${proof.tag}`}
                // R3 parity with the composition: iOS tap synthesizes
                // mouseenter — only true mouse pointers drive hover.
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') enterRow(proof)
                }}
                // U0c: keyboard only — tap-driven focus must not take the
                // pointer preview (same :focus-visible oracle as the comp)
                onFocus={(e) => {
                  if (!e.currentTarget.matches(':focus-visible')) return
                  focusRow(proof)
                }}
                onBlur={blurRow(proof)}
                onClick={(e) => {
                  e.preventDefault()
                  // U0c: release the preview before the layer goes inert —
                  // its leave event can never arrive under the overlay
                  wasHovering.current = false
                  setHovered(null)
                  clearFlood()
                  open(proof.id, `row:${proof.id}`, e.currentTarget)
                }}
              >
                {/* P7 fix: the morph source is PAINT-FREE like the shape
                    sources (comp-morph-source) — it used to carry the
                    flood color, and a stale projection transform/opacity
                    from motion could paint it over the row text (the
                    solid-color-bars index bug). The overlay backdrop owns
                    every visible pixel of the morph. */}
                <motion.span
                  className="proof-row__field"
                  aria-hidden="true"
                  // V1b: static id (see CompositionHero) — distinct from
                  // the shape's so both origins can stay mounted
                  layoutId={`proof-row-${proof.id}`}
                />
                <span className="proof-row__index">{proof.index}</span>
                <span className="proof-row__name">{proof.name}</span>
                <span className="proof-row__tag">{proof.tag}</span>
                {!finePointer && (
                  <ProofLift className="proof-row__thumb" color={proof.color} radius="4px">
                    <img src={proof.preview} alt="" loading="lazy" />
                  </ProofLift>
                )}
              </a>
            </li>
          ))}
        </ol>

        {finePointer && (
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={pinned ? 'pinned' : 'follow'}
                className={`proof-card${pinned ? ' proof-card--pinned' : ''}`}
                style={
                  pinned
                    ? { borderColor: hovered.color }
                    : { x: springX, y: springY, borderColor: hovered.color }
                }
                initial={pinned ? { opacity: 0 } : { opacity: 0, scale: 0.85, rotate: -2 }}
                animate={pinned ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -2 }}
                exit={pinned ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotate: -2 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                aria-hidden="true"
              >
                <img src={hovered.preview} alt="" />
                <p className="proof-card__caption">Proof {hovered.index}</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
