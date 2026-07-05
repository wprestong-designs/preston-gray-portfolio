import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup } from 'motion/react'
import { getProof } from './data/projects.js'
import Poster from './components/Poster.jsx'
import IndexLayer from './components/IndexLayer.jsx'
import ContactLayer from './components/ContactLayer.jsx'
import ProjectOverlay from './components/ProjectOverlay.jsx'
import { FloodProvider } from './context/FloodColor.jsx'
import { OverlayProvider } from './context/OverlayProvider.jsx'
import { useProofOverlay } from './context/overlay-context.js'
import { LightboxProvider } from './components/Lightbox.jsx'
import './App.css'

/*
 * R1: the homepage is the poster — the former sections (Navbar, ProofIndex,
 * FeaturedWork, Services, About, ContactCTA) are UNMOUNTED, not deleted;
 * their content feeds the overlays, the IndexLayer, and the coming /work/
 * subpage (S1). ProofIndex itself lives on inside the IndexLayer.
 *
 * Layering: main (poster) is inert while the IndexLayer (z-100, inside
 * #root) is open; the project overlay (z-200, portaled to body) inerts all
 * of #root — including the layer — so a row-opened overlay closes back to
 * a still-open index with focus restored to the row.
 */
function OverlayRoot() {
  const { openId, finalizeClose } = useProofOverlay()
  return createPortal(
    <AnimatePresence onExitComplete={finalizeClose}>
      {openId && <ProjectOverlay key="project-overlay" />}
    </AnimatePresence>,
    document.body,
  )
}

function PageChrome() {
  const { layerOpen, setLayerOpen, contactOpen, setContactOpen, open } = useProofOverlay()

  // S1 deep links: /#proof-<id> from the /work/ subpage auto-opens the
  // overlay via the no-origin fade branch, then strips the hash so the
  // back button returns to /work/ cleanly. Y1: legacy ids map forward —
  // 'network' split into three proofs; old links land on bristol.
  // Workstream C: /#contact auto-opens the job-ticket layer (the cross-page
  // contact affordances from /work/ and /small-business/ point here).
  useEffect(() => {
    if (window.location.hash === '#contact') {
      setContactOpen(true)
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }
    const LEGACY = { network: 'bristol' }
    const match = window.location.hash.match(/^#proof-([a-z]+)$/)
    if (!match) return
    const id = LEGACY[match[1]] ?? match[1]
    if (LEGACY[match[1]]) {
      console.warn(`[proof-catalog] legacy deep link #proof-${match[1]} → #proof-${id}`)
    }
    if (id === 'about' || getProof(id)) {
      open(id, null, null)
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [open, setContactOpen])

  return (
    <>
      <main inert={layerOpen || contactOpen}>
        <Poster />
      </main>
      <IndexLayer
        open={layerOpen}
        onClose={() => {
          setLayerOpen(false)
          document.getElementById('index-util')?.focus()
        }}
      />
      <ContactLayer
        open={contactOpen}
        onClose={() => {
          setContactOpen(false)
          document.getElementById('contact-util')?.focus()
        }}
      />
      <OverlayRoot />
    </>
  )
}

function App() {
  return (
    <LayoutGroup>
      <FloodProvider>
        <OverlayProvider>
          <LightboxProvider>
            <PageChrome />
          </LightboxProvider>
        </OverlayProvider>
      </FloodProvider>
    </LayoutGroup>
  )
}

export default App
