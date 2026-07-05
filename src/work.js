/*
 * /work/ entry (S1). Tiny by design: styles + a deferred handoff to the
 * art chunk. No React in this file — the page content is static HTML.
 *
 * Reduced-motion visitors never load the art module at all: the static
 * Registration placeholder in the HTML *is* their composition.
 */
import './index.css'
import './work.css'
import { initCircleCursor } from './cursor.js'

// A-pass: site-wide desktop-only circle cursor (no-op on touch / reduced-motion).
initCircleCursor()

const mount = document.getElementById('work-art')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (mount && !reducedMotion) {
  const load = () =>
    import('./work-art.jsx').then((m) => {
      mount.innerHTML = ''
      m.mountArt(mount)
    })
  if ('requestIdleCallback' in window) {
    requestIdleCallback(load, { timeout: 2000 })
  } else {
    setTimeout(load, 300)
  }
}
