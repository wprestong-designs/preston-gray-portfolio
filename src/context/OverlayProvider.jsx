/*
 * OverlayProvider — state for the full-viewport project overlay.
 *
 * Origins carry STATIC layoutIds (V1b: proof-shape-<id> / proof-row-<id>);
 * originKey just tells the overlay which partner to morph from, so open
 * is a single commit — no two-step rAF dance (motion binds layoutId at
 * mount, so conditionally flipping an id on never registered). Close keeps
 * originKey alive through the exit morph; finalizeClose (fired by
 * AnimatePresence onExitComplete) clears it, restores scroll, and returns
 * focus to the origin — the ORIGINAL origin even after next-proof hops.
 */
import { useCallback, useMemo, useRef, useState } from 'react'
import { OverlayContext } from './overlay-context.js'

export function OverlayProvider({ children }) {
  const [openId, setOpenId] = useState(null)
  const [originKey, setOriginKey] = useState(null)
  // R4: the index layer's open state lives here so the composition can
  // pause its cycle while ANY layer is up
  const [layerOpen, setLayerOpen] = useState(false)
  const originElRef = useRef(null)
  const scrollYRef = useRef(0)
  // X1/T3: the origin's baked-letterform rect, measured at open — the
  // overlay's monument title FLIPs from it. Null when the origin has no
  // .comp-type (rows, wordmark) or on hash arrivals → title fades instead.
  const typeRectRef = useRef(null)

  const open = useCallback((id, key, el) => {
    originElRef.current = el ?? null
    scrollYRef.current = window.scrollY
    typeRectRef.current =
      el?.querySelector?.('.comp-type')?.getBoundingClientRect() ?? null
    setOriginKey(key)
    setOpenId(id)
  }, [])

  const jumpTo = useCallback((id) => setOpenId(id), [])

  const close = useCallback(() => setOpenId(null), [])

  const finalizeClose = useCallback(() => {
    setOriginKey(null)
    window.scrollTo(0, scrollYRef.current)
    // B1c: hash-arrival overlays have no origin element — land focus on
    // the Index utility, the poster's "you are here" landmark, instead of
    // letting it fall to body. Deferred one frame: onExitComplete can fire
    // while #root is still inert (inert elements silently refuse focus —
    // probe caught focus landing on body).
    const originEl = originElRef.current
    originElRef.current = null
    typeRectRef.current = null
    requestAnimationFrame(() => {
      if (originEl?.isConnected) originEl.focus?.()
      else document.getElementById('index-util')?.focus()
    })
  }, [])

  const value = useMemo(
    () => ({
      openId,
      originKey,
      scrollYRef,
      typeRectRef,
      originElRef,
      open,
      jumpTo,
      close,
      finalizeClose,
      layerOpen,
      setLayerOpen,
    }),
    [openId, originKey, open, jumpTo, close, finalizeClose, layerOpen],
  )

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
}
