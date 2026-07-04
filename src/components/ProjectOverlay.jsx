/*
 * Project overlay (spec §C + G1) — a layer, not a route.
 *
 * - The BACKDROP is the morph element: it shares layoutId with the origin
 *   shape/row and grows into the viewport; content fades in after.
 * - Panels are data-driven from projects.js (typed array, 4–6 per proof).
 * - Vertical scroll drives a horizontal track (useScroll → translateX on a
 *   sticky viewport). Not wheel-hijacking: wheel/arrows/PageDown drive the
 *   native vertical scroll of the focusable container.
 * - Media/video activation is derived from scroll progress in horizontal
 *   mode (native lazy is unreliable under the transform) and from an
 *   IntersectionObserver in the vertical stack.
 * - Reduced motion: fade open/close, vertical stack, no autoplay.
 * - role="dialog" aria-modal, page behind is inert, ESC + X close, focus
 *   returns to the origin via OverlayProvider.finalizeClose.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { aboutOverlay, getProof } from '../data/projects.js'
import { useProofOverlay } from '../context/overlay-context.js'
import ProofMedia from './ProofMedia.jsx'

/* W1b — expand/collapse pacing knob. A deliberate ~500ms ease reads
   calmer than the default spring for a viewport-scale morph; swap in a
   spring by replacing the object (e.g. { type: 'spring', stiffness: 140,
   damping: 26 }). Drives the backdrop's shared-element travel AND its
   border-radius interpolation (same element — spec W1b-3). */
const EXPAND_TRANSITION = { type: 'tween', duration: 0.5, ease: [0.32, 0.72, 0, 1] }
/* Content never waits forever if a layout-completion callback is missed
   (belt over braces — e.g. a zero-distance morph). */
const EXPAND_FALLBACK_MS = 900

export default function ProjectOverlay() {
  const { openId, originKey, scrollYRef, typeRectRef, originElRef, close, jumpTo } =
    useProofOverlay()
  const reducedMotion = useReducedMotion()
  // X-pass fix: keep rendering the LAST proof while openId goes null —
  // AnimatePresence preserves this component for its exit, but a null
  // openId made `proof` null and the render returned null, vaporizing the
  // tree before any exit animation could run (close was a hard cut,
  // probe-verified). displayId survives the close.
  const [displayId, setDisplayId] = useState(openId)
  if (openId !== null && openId !== displayId) setDisplayId(openId)
  const isAbout = displayId === 'about'
  const proof = isAbout ? aboutOverlay : getProof(displayId)

  const finePointer = useMemo(
    () => window.matchMedia('(pointer: fine)').matches,
    [],
  )
  const horizontal = finePointer && !reducedMotion
  const morph = !reducedMotion && !!originKey
  // V1b: origin identities are static and distinct — "shape:summit" →
  // the shape's permanent layoutId "proof-shape-summit", "row:summit" →
  // the row field's "proof-row-summit". The backdrop picks its partner
  // here; layoutId is never assigned conditionally to a mounted element
  // (motion binds layoutId at mount — a flipped-on id never registers).
  const originLayoutId = originKey ? `proof-${originKey.replace(':', '-')}` : null

  const panelCount = proof ? proof.panels.length : 1

  const scrollerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const stackRefs = useRef([])
  const [activePanel, setActivePanel] = useState(0)

  // W1b: the morphing backdrop stays content-free — panel content mounts
  // when the layout animation ACTUALLY completes (callback below), not on
  // a guessed timer. Fallback keeps hash/fade arrivals and edge cases
  // from waiting forever. State survives next-proof hops (overlay doesn't
  // remount), so hops don't re-hide content.
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setExpanded(true), morph ? EXPAND_FALLBACK_MS : 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // X1/T3 — monument title continuity, measured FLIP (chosen over a
  // shared layoutId so the backdrop keeps sole ownership of the projection
  // channel — W1a proved projection fights value-animated elements).
  // Driven by MOTION VALUES jumped pre-paint + an imperative animate():
  // the monument sits inside the panel-swap AnimatePresence whose
  // initial={false} suppresses declarative `initial` on children, so the
  // prop-based FLIP silently no-ops (probe-verified). Motion values are
  // immune to presence semantics. No fragment (rows, wordmark, hash) or
  // reduced motion → fade in place, no travel.
  const monumentRef = useRef(null)
  // Render-safe "captured at mount" value (refs can't be read in render)
  const [initialOpenId] = useState(openId)
  const [flipFrom, setFlipFrom] = useState(undefined) // undefined=measuring
  const monX = useMotionValue(0)
  const monY = useMotionValue(0)
  const monScale = useMotionValue(1)
  const monOpacity = useMotionValue(1)
  useLayoutEffect(() => {
    if (flipFrom !== undefined) return
    const frag = typeRectRef.current
    const el = monumentRef.current
    if (!frag || !el || reducedMotion) {
      monOpacity.jump(0) // fade branch: reveal in place
      setFlipFrom(null)
      return
    }
    const r = el.getBoundingClientRect()
    const from = {
      x: frag.x - r.x,
      y: frag.y - r.y,
      scale: frag.height / r.height,
    }
    monX.jump(from.x)
    monY.jump(from.y)
    monScale.jump(from.scale)
    setFlipFrom(from)
  }, [flipFrom, reducedMotion, typeRectRef, monX, monY, monScale, monOpacity])

  useEffect(() => {
    if (flipFrom === undefined) return undefined
    const controls = flipFrom
      ? [
          animate(monX, 0, EXPAND_TRANSITION),
          animate(monY, 0, EXPAND_TRANSITION),
          animate(monScale, 1, EXPAND_TRANSITION),
        ]
      : [animate(monOpacity, 1, { duration: 0.25 })]
    return () => controls.forEach((c) => c.stop())
  }, [flipFrom, monX, monY, monScale, monOpacity])

  // X-pass close: the visible collapse must run on the BACKDROP — on exit
  // framer promotes the surviving morph-source, which is transparent and
  // clipped inside its shape, so the shared-element reverse is invisible
  // (probe-verified). The backdrop instead exits onto the origin's
  // measured rect explicitly.
  const [originRect, setOriginRect] = useState(null)
  useLayoutEffect(() => {
    const el = originElRef?.current
    if (el && morph) setOriginRect(el.getBoundingClientRect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // X1: panels now have differing widths (the monument statement cell is
  // content-sized, ~1.5–2.5 viewports; everything else is 100vw), so the
  // runway/progress math is MEASURED, not unit-counted: travel = track
  // scrollWidth − viewport, runway height scales with total width, and
  // the active panel is whichever cell sits under the viewport center.
  const trackRef = useRef(null)
  const [travel, setTravel] = useState(0)
  const cellOffsets = useRef([])
  useLayoutEffect(() => {
    if (!horizontal) return undefined
    const track = trackRef.current
    if (!track) return undefined
    const measure = () => {
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth))
      cellOffsets.current = Array.from(track.children).map((c) => c.offsetLeft)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    Array.from(track.children).forEach((c) => ro.observe(c))
    return () => ro.disconnect()
  }, [horizontal, displayId])

  const { scrollYProgress } = useScroll({ container: scrollerRef })
  const trackX = useTransform(scrollYProgress, [0, 1], [0, -travel])

  // Horizontal mode: active panel = the cell under the viewport center
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!horizontal) return
    const center = v * travel + window.innerWidth / 2
    const offsets = cellOffsets.current
    let idx = 0
    for (let i = 0; i < offsets.length; i++) {
      if (offsets[i] <= center) idx = i
    }
    setActivePanel((prev) => (prev === idx ? prev : idx))
  })

  // Vertical stack: active panel via IntersectionObserver
  useEffect(() => {
    if (horizontal) return undefined
    const scroller = scrollerRef.current
    if (!scroller) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePanel(Number(entry.target.dataset.panel))
          }
        })
      },
      { root: scroller, threshold: 0.45 },
    )
    stackRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [horizontal, displayId, panelCount])

  // Lock page scroll, inert the page, focus the dialog, listen for ESC
  useEffect(() => {
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const { style } = document.body
    const prev = { position: style.position, top: style.top, width: style.width }
    style.position = 'fixed'
    style.top = `-${scrollYRef.current}px`
    style.width = '100%'
    closeBtnRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root?.removeAttribute('inert')
      style.position = prev.position
      style.top = prev.top
      style.width = prev.width
    }
  }, [close, scrollYRef])

  // Next-proof hop: reset the active panel via the documented
  // "adjust state when props change" render-phase pattern.
  const [lastOpenId, setLastOpenId] = useState(displayId)
  if (lastOpenId !== displayId) {
    setLastOpenId(displayId)
    setActivePanel(0)
  }

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0
  }, [displayId])

  if (!proof) return null

  // The FLIP applies only to the origin proof's monument; hopped-to
  // monuments (About via PG-04) enter with the plain fade.
  const monumentFlip = displayId === initialOpenId ? flipFrom : null

  const renderPanel = (panel, i) => {
    const near = Math.abs(i - activePanel) <= 1
    switch (panel.type) {
      case 'statement':
        return (
          <section className="ov-panel ov-panel--statement" key={`s-${i}`}>
            {/* X1: monument title — cropped letterforms at viewport scale;
                the cell is content-sized so the word defines the travel.
                Transform rides motion values (jumped to the fragment's
                delta pre-paint, then animated to identity — see the FLIP
                block above for why props can't do this here). */}
            <motion.h2
              ref={monumentRef}
              className="ov-monument"
              aria-label={proof.name}
              style={{
                x: monX,
                y: monY,
                scale: monScale,
                opacity: monOpacity,
                transformOrigin: 'top left',
                visibility: flipFrom === undefined ? 'hidden' : 'visible',
              }}
              exit={
                monumentFlip
                  ? { ...monumentFlip, transition: EXPAND_TRANSITION }
                  : { opacity: 0, transition: { duration: 0.15 } }
              }
            >
              <span aria-hidden="true">{proof.monument ?? proof.name}</span>
            </motion.h2>
            {/* The whisper meta — monument vs. small mono IS the
                composition; reveals once the expansion lands (W1b) */}
            <motion.div
              className="ov-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: expanded ? 1 : 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3 }}
            >
              <p className="ov-mono">
                {isAbout ? proof.tag : `Proof ${proof.index} · ${proof.tag}`}
              </p>
              <p className="ov-lede">{panel.statement}</p>
            </motion.div>
          </section>
        )
      case 'media':
        return (
          <section className="ov-panel ov-panel--media" key={`m-${i}`}>
            {panel.items.map((item, j) => (
              <ProofMedia
                key={item.src ?? item.poster ?? j}
                item={item}
                active={i === activePanel}
                near={near}
              />
            ))}
          </section>
        )
      case 'points':
        return (
          <section className="ov-panel ov-panel--points" key={`p-${i}`}>
            <p className="ov-mono">{panel.label ?? 'What carried the proof'}</p>
            <ul className="ov-points">
              {panel.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        )
      case 'contact':
        return (
          <section className="ov-panel ov-panel--end" key={`c-${i}`}>
            <p className="ov-mono">Contact</p>
            <p className="ov-statement">{panel.statement}</p>
            <a className="ov-next" href="mailto:hello@preston-gray.com">
              hello@preston-gray.com <span aria-hidden="true">&rarr;</span>
            </a>
            {/* X2: same quiet return as the end panel */}
            <button type="button" className="ov-return" onClick={close}>
              <span aria-hidden="true">&larr;&nbsp;</span>Return to the catalog
            </button>
          </section>
        )
      case 'end':
        // X2: quiet return panel — the ring is retired. Same close-morph
        // as the X, same focus/scroll restoration.
        return (
          <section className="ov-panel ov-panel--end" key={`e-${i}`}>
            <button type="button" className="ov-return" onClick={close}>
              <span aria-hidden="true">&larr;&nbsp;</span>Return to the catalog
            </button>
            {proof.id === 'fieldintel' && (
              <button type="button" className="ov-about-link" onClick={() => jumpTo('about')}>
                About Preston <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isAbout ? proof.name : `Proof ${proof.index} — ${proof.name}`}
      style={{ '--ov': proof.color, '--ov-fg': proof.colorFg }}
    >
      {morph ? (
        <>
          <motion.div
            className="overlay__backdrop"
            layoutId={originLayoutId}
            style={{ borderRadius: 0 }}
            transition={EXPAND_TRANSITION}
            onLayoutAnimationComplete={() => setExpanded(true)}
          />
          {/* The visible collapse. Shared-layoutId elements IGNORE exit
              props (the handoff owns their exit, and it animates the
              transparent morph-source — invisible, probe-verified). This
              proxy lies dormant at opacity 0 and only acts on exit:
              snapping visible and contracting onto the origin's measured
              rect while the layoutId backdrop hands off silently. */}
          <motion.div
            className="overlay__backdrop overlay__backdrop--collapse"
            aria-hidden="true"
            style={{ transformOrigin: 'top left', pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={
              originRect
                ? {
                    opacity: 1,
                    x: originRect.x,
                    y: originRect.y,
                    scaleX: originRect.width / Math.max(1, window.innerWidth),
                    scaleY: originRect.height / Math.max(1, window.innerHeight),
                    transition: { ...EXPAND_TRANSITION, opacity: { duration: 0.01 } },
                  }
                : { opacity: 0 }
            }
          />
        </>
      ) : (
        <motion.div
          className="overlay__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => setExpanded(true)}
        />
      )}

      {/* W1b/X1: the wrapper itself never fades — the monument must stay
          visible through the expand and collapse travel. Chrome and meta
          carry their own expanded-gated fades. */}
      <div className="overlay__content">
        <motion.div
          className="overlay__chrome"
          initial={{ opacity: 0 }}
          animate={{ opacity: expanded ? 1 : 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25 }}
        >
          <span className="ov-mono">{isAbout ? 'About' : `Proof ${proof.index}`}</span>
          <button
            ref={closeBtnRef}
            type="button"
            className="overlay__close"
            aria-label="Close project overlay"
            onClick={close}
          >
            &times;
          </button>
        </motion.div>

        <div className="overlay__scroller" ref={scrollerRef} tabIndex={0}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={proof.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // Slow exit: on close this is the monument's stage — it must
              // survive most of the 500ms collapse travel. Hops share the
              // same crossfade pace.
              exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeIn' } }}
              transition={{ duration: 0.2 }}
            >
              {horizontal ? (
                <div
                  className="overlay__runway"
                  style={{
                    height: `${100 + (travel / Math.max(1, window.innerWidth)) * 100}vh`,
                  }}
                >
                  <div className="overlay__sticky">
                    <motion.div
                      ref={trackRef}
                      className="overlay__track"
                      style={{ x: trackX }}
                    >
                      {proof.panels.map((panel, i) => (
                        <div
                          className={`overlay__cell${
                            panel.type === 'statement' ? ' overlay__cell--statement' : ''
                          }`}
                          key={`${panel.type}-${i}`}
                        >
                          {renderPanel(panel, i)}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="overlay__stack">
                  {proof.panels.map((panel, i) => (
                    <div
                      key={`${panel.type}-${i}`}
                      data-panel={i}
                      ref={(el) => {
                        stackRefs.current[i] = el
                      }}
                    >
                      {renderPanel(panel, i)}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
