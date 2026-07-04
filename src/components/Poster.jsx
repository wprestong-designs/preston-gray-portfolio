/*
 * Poster homepage (R1) — the composition IS the page. Full viewport,
 * no page scroll; wordmark and utilities live in the contain-fit
 * letterbox corners. The retired masthead copy survives as sr-only
 * semantics (trims to one sentence once the /work/ subpage carries the
 * discoverability load — S1/R5 adjustment).
 *
 * "Index" opens the permanently-mounted IndexLayer (R4); its open state
 * lives in the overlay context so the composition pauses its cycle.
 */
import { useRef } from 'react'
import { motion } from 'motion/react'
import CompositionHero from './CompositionHero.jsx'
import { useProofOverlay } from '../context/overlay-context.js'

export default function Poster() {
  const { layerOpen, setLayerOpen, open } = useProofOverlay()
  const indexBtnRef = useRef(null)

  return (
    <section className="poster" aria-label="Preston Gray — selected work">
      {/* R5 adjustment: /work/ now carries the discoverability load, so
          the poster keeps just the one-sentence h1 */}
      <h1 className="sr-only">
        I help small businesses look as good as the work they do.
      </h1>

      {/* X4: the wordmark IS the About door — it morphs into the About
          overlay like the shapes do (static morph-source child, same
          pattern as the composition). Real href for AT/new-tab. */}
      <a
        className="poster__brand"
        href="/#proof-about"
        aria-label="About Preston"
        onClick={(e) => {
          e.preventDefault()
          open('about', 'brand:about', e.currentTarget)
        }}
      >
        <motion.span
          className="comp-morph-source"
          aria-hidden="true"
          layoutId="proof-brand-about"
        />
        Preston
        <span className="poster__brand-dot" aria-hidden="true" />
        Gray
      </a>

      <nav className="poster__utils" aria-label="Site utilities">
        <button
          ref={indexBtnRef}
          id="index-util"
          type="button"
          className="poster__util"
          aria-haspopup="dialog"
          aria-expanded={layerOpen}
          aria-controls="index-layer"
          onClick={() => setLayerOpen(true)}
        >
          Index
        </button>
        <a className="poster__util" href="mailto:hello@preston-gray.com">
          Contact
        </a>
      </nav>

      <CompositionHero poster />
    </section>
  )
}
