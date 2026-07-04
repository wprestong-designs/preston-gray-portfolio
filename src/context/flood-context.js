import { createContext, useContext } from 'react'

export const FloodContext = createContext(null)

/*
 * useFloodColor — the ONE flood system (spec §1, process rule 7).
 * Consumed by hero, index, and spreads; provided by <FloodProvider>.
 */
export function useFloodColor() {
  const ctx = useContext(FloodContext)
  if (!ctx) throw new Error('useFloodColor must be used inside <FloodProvider>')
  return ctx
}
