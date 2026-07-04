/*
 * Lightbox (run-2 §4 / M2). Full-screen media viewer with pinch-zoom that
 * OWNS its gestures — `touch-action: none` on the stage + pointer-event
 * handling, so a pinch NEVER leaks to browser page-zoom (the trap that
 * stranded users in the CRM territory map). Spec: visible close, swipe-down
 * dismiss, ESC, double-tap reset, dialog semantics with focus trap + restore,
 * mono caption, reduced-motion instant. Portaled to body (above the overlay).
 *
 * Pure gesture math + the context/hook live in ./lightbox-context.js.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'motion/react'
import { LightboxContext, dist, nextPinchScale } from './lightbox-context.js'

export function LightboxProvider({ children }) {
  const [state, setState] = useState({ item: null, from: null })
  const open = useCallback((item, from) => setState({ item, from: from ?? null }), [])
  const close = useCallback(() => setState({ item: null, from: null }), [])
  const value = useMemo(() => ({ open, close }), [open, close])
  return (
    <LightboxContext.Provider value={value}>
      {children}
      {state.item &&
        createPortal(
          <Lightbox item={state.item} onClose={close} restoreTo={state.from} />,
          document.body,
        )}
    </LightboxContext.Provider>
  )
}

function Lightbox({ item, onClose, restoreTo }) {
  const reducedMotion = useReducedMotion()
  const closeRef = useRef(null)
  const pointers = useRef(new Map())
  const gesture = useRef({ startDist: 0, baseScale: 1, panStart: null, lastTap: 0 })
  const [t, setT] = useState({ scale: 1, x: 0, y: 0 })
  const [interacting, setInteracting] = useState(false)

  // Focus trap + restore, ESC, body scroll lock (dialog semantics).
  useEffect(() => {
    const prevActive = restoreTo ?? document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        e.preventDefault() // one focusable (close) — keep focus inside
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (prevActive && prevActive.focus) prevActive.focus()
    }
  }, [onClose, restoreTo])

  const reset = useCallback(() => setT({ scale: 1, x: 0, y: 0 }), [])

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    setInteracting(true)
    const pts = [...pointers.current.values()]
    if (pts.length === 2) {
      gesture.current.startDist = dist(pts[0], pts[1])
      gesture.current.baseScale = t.scale
    } else if (pts.length === 1) {
      if (e.timeStamp - gesture.current.lastTap < 300) {
        reset() // double-tap → reset zoom
        gesture.current.lastTap = 0
      } else {
        gesture.current.lastTap = e.timeStamp
      }
      gesture.current.panStart = { x: e.clientX - t.x, y: e.clientY - t.y, oy: e.clientY }
    }
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    if (pts.length === 2) {
      const scale = nextPinchScale(gesture.current.baseScale, gesture.current.startDist, dist(pts[0], pts[1]))
      setT((prev) => ({ ...prev, scale }))
    } else if (pts.length === 1 && gesture.current.panStart) {
      const p = gesture.current.panStart
      if (t.scale > 1) {
        setT((prev) => ({ ...prev, x: e.clientX - p.x, y: e.clientY - p.y })) // pan when zoomed
      } else {
        setT((prev) => ({ ...prev, y: Math.max(0, e.clientY - p.oy) })) // swipe-down when not zoomed
      }
    }
  }

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId)
    if (t.scale <= 1) {
      if (t.y > 110) onClose() // dismissed by swipe-down
      else setT((prev) => ({ ...prev, y: 0 })) // snap back
    }
    if (pointers.current.size === 0) {
      gesture.current.panStart = null
      setInteracting(false)
    }
  }

  const isVideo = item.kind === 'video' && (item.srcMp4 || item.srcWebm)
  const src = item.lightboxSrc ?? item.src ?? item.poster

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={item.alt ?? item.caption ?? 'Media viewer'}>
      <button ref={closeRef} type="button" className="lb__close" aria-label="Close" onClick={onClose}>
        &#10005;
      </button>
      <div
        className="lb__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="lb__tile"
          style={{
            transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})`,
            transition: reducedMotion || interacting ? 'none' : 'transform 0.18s ease-out',
          }}
        >
          {isVideo ? (
            <video src={item.srcMp4 ?? item.srcWebm} poster={item.poster} controls playsInline muted loop />
          ) : (
            <img src={src} alt={item.alt ?? item.caption ?? ''} draggable="false" />
          )}
        </div>
      </div>
      {item.caption && <p className="lb__caption">{item.caption}</p>}
    </div>
  )
}
