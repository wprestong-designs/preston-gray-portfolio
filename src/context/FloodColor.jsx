/*
 * FloodProvider — holds the active proof id and mirrors the active
 * project's color pair onto document-level CSS vars (--flood-current /
 * --flood-current-fg) plus a data-flood attribute, so any surface —
 * hero shapes, index rows, masthead rules, spreads — can consume the
 * flood without prop-drilling.
 *
 * Spreads both DRIVE this context (hover / focus-within / scroll observer
 * on touch) and CONSUME it (`.is-flooded` class), replacing the previous
 * CSS-only :hover mechanism so no second system exists.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FloodContext } from './flood-context.js'
import { getProof } from '../data/projects.js'

export function FloodProvider({ children }) {
  const [activeId, setActiveId] = useState(null)

  const flood = useCallback((id) => setActiveId(id ?? null), [])
  const clearFlood = useCallback((id) => {
    // Only the current owner may clear, so a stale mouseleave can't
    // cancel a newer hover/focus elsewhere.
    setActiveId((prev) => (id === undefined || prev === id ? null : prev))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const proof = activeId ? getProof(activeId) : null
    if (proof) {
      // Governance: the flood tints SITE CHROME (masthead/index labels/hero
      // eyebrows), so it follows the theme via colorDisplay — never the
      // pinned brand (proof.color). The brand appears when the proof opens.
      root.style.setProperty('--flood-current', proof.colorDisplay)
      root.style.setProperty('--flood-current-fg', proof.displayFg)
      root.dataset.flood = proof.id
    } else {
      root.style.removeProperty('--flood-current')
      root.style.removeProperty('--flood-current-fg')
      delete root.dataset.flood
    }
    return () => {
      root.style.removeProperty('--flood-current')
      root.style.removeProperty('--flood-current-fg')
      delete root.dataset.flood
    }
  }, [activeId])

  const value = useMemo(
    () => ({ activeId, activeProof: activeId ? getProof(activeId) : null, flood, clearFlood }),
    [activeId, flood, clearFlood],
  )

  return <FloodContext.Provider value={value}>{children}</FloodContext.Provider>
}
