/*
 * Lazy boundary for the /work/ header art (S1 performance covenant):
 * React, framer, and the composition live in THIS chunk, dynamically
 * imported after first paint — the page's static HTML never waits for it.
 */
import { createRoot } from 'react-dom/client'
import AmbientComposition from './components/AmbientComposition.jsx'

export function mountArt(el) {
  createRoot(el).render(<AmbientComposition />)
}
