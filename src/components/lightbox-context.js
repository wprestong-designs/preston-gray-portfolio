/*
 * Lightbox context + pure gesture math (run-2 §4). Split out of Lightbox.jsx so
 * that file exports only components (react-refresh) and so the gesture reducer
 * is unit-testable in Node (a .js file).
 */
import { createContext, useContext } from 'react'

export const LightboxContext = createContext({ open: () => {}, close: () => {} })
export const useLightbox = () => useContext(LightboxContext)

export const MIN_SCALE = 1
export const MAX_SCALE = 4
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
export const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

/* Given a pinch (start distance → base scale, current distance), the next
   clamped scale. Pure — the lightbox and its unit test both call this. */
export function nextPinchScale(baseScale, startDist, curDist) {
  if (!startDist) return baseScale
  return clamp((baseScale * curDist) / startDist, MIN_SCALE, MAX_SCALE)
}
