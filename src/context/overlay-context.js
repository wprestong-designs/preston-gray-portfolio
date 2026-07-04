import { createContext, useContext } from 'react'

export const OverlayContext = createContext(null)

/*
 * useProofOverlay — the project overlay layer (spec §C).
 * open(id, originKey, el): originKey is 'shape:<id>' | 'row:<id>'; the
 * origin element receives the shared layoutId one frame before the overlay
 * mounts so framer has a measured morph source.
 */
export function useProofOverlay() {
  const ctx = useContext(OverlayContext)
  if (!ctx) throw new Error('useProofOverlay must be used inside <OverlayProvider>')
  return ctx
}
