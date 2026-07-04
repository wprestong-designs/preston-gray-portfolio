/*
 * IndexLayer (R4) — the typographic index as a layer over the poster.
 *
 * PERMANENTLY MOUNTED for SEO/a11y: the link list is always in the DOM.
 * Closed state is visibility:hidden (never display:none — lazy thumbnails
 * still take layout, intersect, and load at idle, so first open has no
 * blank flash) + inert (out of the a11y tree and tab order). The inert
 * prop and visibility flip in the same commit the open animation starts.
 *
 * Sits at z-index 100 INSIDE #root: the project overlay (z-200, portaled
 * to body) covers it and its existing #root-inert takes care of trapping,
 * so a row-opened overlay closes back to a still-open index with focus
 * returning to the row.
 *
 * ESC closes the layer only when no project overlay is open (the overlay
 * has its own ESC handling).
 */
import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import ProofIndex from './ProofIndex.jsx'
import { aboutOverlay } from '../data/projects.js'
import { useProofOverlay } from '../context/overlay-context.js'

export default function IndexLayer({ open, onClose }) {
  const reducedMotion = useReducedMotion()
  const { openId, open: openOverlay } = useProofOverlay()
  const closeRef = useRef(null)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && openId === null) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, openId, onClose])

  const variants = reducedMotion
    ? {
        open: { opacity: 1, visibility: 'visible' },
        closed: { opacity: 0, transitionEnd: { visibility: 'hidden' } },
      }
    : {
        open: { y: 0, visibility: 'visible' },
        closed: { y: '-100%', transitionEnd: { visibility: 'hidden' } },
      }

  return (
    <motion.div
      id="index-layer"
      className="index-layer"
      role="dialog"
      aria-modal="true"
      aria-label="Index of proofs"
      inert={!open}
      initial={false}
      animate={open ? 'open' : 'closed'}
      variants={variants}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : { type: 'spring', stiffness: 220, damping: 28 }
      }
    >
      <div className="index-layer__chrome">
        <span className="index-layer__mark">Index</span>
        <button
          ref={closeRef}
          type="button"
          className="index-layer__close"
          aria-label="Close index"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="index-layer__body">
        <ProofIndex />

        <div className="index-layer__extra">
          {/* B1b: a real link like the proof rows — copy-link / new-tab /
              AT link lists resolve; click still morphs in place. */}
          <a
            className="index-extra__row"
            href="/#proof-about"
            onClick={(e) => {
              e.preventDefault()
              openOverlay('about', null, e.currentTarget)
            }}
          >
            <span className="index-extra__index">A</span>
            {aboutOverlay.name}
            <span className="index-extra__tag">{aboutOverlay.tag}</span>
          </a>
          <a className="index-extra__row" href="mailto:hello@preston-gray.com">
            <span className="index-extra__index">C</span>
            Contact
            <span className="index-extra__tag">hello@preston-gray.com</span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}
