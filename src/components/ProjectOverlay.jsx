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
import Quote from './Quote.jsx'
// N2: Preston's portrait — taped-photo treatment lives in .about-portrait CSS.
import prestonPortrait from '../assets/preston-portrait.jpg'
import prestonPortraitSm from '../assets/preston-portrait-300.jpg'

/* W1b — expand/collapse pacing knob. A deliberate ~500ms ease reads
   calmer than the default spring for a viewport-scale morph; swap in a
   spring by replacing the object (e.g. { type: 'spring', stiffness: 140,
   damping: 26 }). Drives the backdrop's shared-element travel AND its
   border-radius interpolation (same element — spec W1b-3).
   D0 note: deliberately NOT slowed with the composition's 1s pacing —
   opening answers a click and stays snappy. This is the knob if Preston
   disagrees after feeling it. */
const EXPAND_TRANSITION = { type: 'tween', duration: 0.5, ease: [0.32, 0.72, 0, 1] }
/* Content never waits forever if a layout-completion callback is missed
   (belt over braces — e.g. a zero-distance morph). */
const EXPAND_FALLBACK_MS = 900
/* P1.4 (oneshot): triangle deco on the statement panel — the triangle
   vocabulary enters as accents, not a polygon state (see the stub in
   composition-geometry.js). Reversible: set to 'none'. */
const MONUMENT_DECO = 'triangle' // 'triangle' | 'none'

/* U2/P4 — scroll-scrubbed geometric wipes between panels.
   'clip' = clip-path front scrubbed by inter-panel progress (reversible,
   no timed animation). 'fade' = the profiled fallback: same element,
   opacity scrub instead of clip (flip this knob if clip janks on weak
   CPUs — see audit-report for the profile). */
const WIPE_MODE = 'clip' // 'clip' | 'fade'
/* Default seam rotation when a panel doesn't declare `wipe:` in data —
   the three geometries echo the composition vocabulary. */
const WIPE_ROTATION = ['diagonal', 'half-circle', 'quarter-round']
/* How far (in vw) a wipe front sweeps back over the outgoing panel */
const WIPE_BLEED_VW = 40

/* Per-panel surface (P7): the statement keeps the DEEP FLOOD (the brand
   anchor); later panels cycle the project's REAL brand surfaces from
   projects.js palette (each an AA-verified bg/fg pair — see the palette
   block in index.css, incl. the single-fg-polarity wipe law). About has
   no palette → stays cream end to end. */
function computeSurfaces(proof) {
  const steps = proof.palette?.surfaces
  if (!steps?.length) return proof.panels.map(() => null)
  let k = 0
  return proof.panels.map((panel, i) => {
    if (i === 0 || panel.type === 'statement') return null
    const step = steps[k % steps.length]
    const surface = {
      bg: step.bg,
      fg: step.fg,
      wipe: panel.wipe ?? WIPE_ROTATION[k % WIPE_ROTATION.length],
    }
    k += 1
    return surface
  })
}

/* P6 review fix: viewport metrics are CACHED at module scope and updated
   by one resize listener — the per-scroll-frame transforms below were
   reading window.innerWidth/Height (forced-layout list) up to ~16× per
   frame across the wipe layers. */
let VW = typeof window === 'undefined' ? 1200 : window.innerWidth
let VH = typeof window === 'undefined' ? 800 : window.innerHeight
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    VW = window.innerWidth
    VH = window.innerHeight
  })
}

/* The wipe front, as a clip-path string. Element box = one cell plus the
   left bleed; p ∈ [0,1] is the seam's viewport crossing. All arithmetic
   lives here so geometries stay declarative in data. */
function clipFor(geometry, p) {
  const vw = VW
  const vh = VH
  const bleed = (WIPE_BLEED_VW / 100) * vw
  const width = bleed + vw
  const seamPct = (bleed / width) * 100
  const f = seamPct * (1 - p) // front position, % of element
  if (geometry === 'half-circle') {
    const frontX = (f / 100) * width
    const r = vh * 0.28
    const cy = vh / 2
    return `path('M ${frontX} 0 L ${frontX} ${cy - r} A ${r} ${r} 0 0 0 ${frontX} ${cy + r} L ${frontX} ${vh} L ${width} ${vh} L ${width} 0 Z')`
  }
  if (geometry === 'quarter-round') {
    return `inset(0% 0% 0% ${f}% round ${vh * 0.45}px 0 0 0)`
  }
  // diagonal — the 39° print-bar angle family
  return `polygon(${f + 7}% 0%, 100% 0%, 100% 100%, ${f - 7}% 100%)`
}

/* One wipe layer per surfaced cell (a component so the derived motion
   value hook stays out of the render loop). Reads the measured cell
   offset lazily — offsets settle after the track measurement effect. */
function WipeBg({ scrollYProgress, travel, getOffset, surface, mode }) {
  const clipPath = useTransform(scrollYProgress, (v) => {
    if (mode !== 'clip') return 'none'
    const translate = v * travel
    const p = Math.min(1, Math.max(0, (translate - (getOffset() - VW)) / VW))
    return clipFor(surface.wipe, p)
  })
  const opacity = useTransform(scrollYProgress, (v) => {
    if (mode !== 'fade') return 1
    const translate = v * travel
    return Math.min(1, Math.max(0, (translate - (getOffset() - VW)) / VW))
  })
  return (
    <motion.div
      className="ov-wipe"
      aria-hidden="true"
      style={{ background: surface.bg, clipPath, opacity }}
    />
  )
}

export default function ProjectOverlay() {
  const { openId, closingId, originKey, scrollYRef, typeRectRef, close, jumpTo, setContactOpen } =
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
  // Phase A: this overlay is the one closing → content fades out first.
  const isClosing = closingId === displayId
  const proof = isAbout ? aboutOverlay : getProof(displayId)

  const finePointer = useMemo(
    () => window.matchMedia('(pointer: fine)').matches,
    [],
  )
  // P7 fix: pointer type alone chose the layout — a NARROW desktop
  // window got the horizontal track with meta text clipping off-screen.
  // Width gates it now; the overlay remounts per open, so a one-shot
  // read is enough.
  const wideViewport = useMemo(
    () => window.matchMedia('(min-width: 900px)').matches,
    [],
  )
  const horizontal = finePointer && !reducedMotion && wideViewport
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
    // P6 review fix (HIGH): a multi-line monument (SUMMIT / PHARMACY) is
    // two line-boxes tall — scaling the WHOLE block to the one-line
    // fragment height halved the glyph size at the handoff. Measure the
    // FIRST LINE for both the scale denominator and the position delta;
    // single-line monuments have no .ov-monument__line and fall through.
    const lineEl = el.querySelector('.ov-monument__line') ?? el
    const r = lineEl.getBoundingClientRect()
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

  // Phase A: CLOSE = OPEN REVERSED. When this overlay is the one closing, the
  // motion values are imperatively driven BACK to the die-cut `from` (the exit
  // prop can't drive style motion-values reliably), so the title shrinks into
  // the fragment as the panel contracts into the shape. Same values, reversed.
  useEffect(() => {
    if (closingId !== displayId || !flipFrom) return undefined
    const controls = [
      animate(monX, flipFrom.x, EXPAND_TRANSITION),
      animate(monY, flipFrom.y, EXPAND_TRANSITION),
      animate(monScale, flipFrom.scale, EXPAND_TRANSITION),
      animate(monOpacity, 0, { ...EXPAND_TRANSITION, duration: 0.34 }),
    ]
    return () => controls.forEach((c) => c.stop())
  }, [closingId, displayId, flipFrom, monX, monY, monScale, monOpacity])

  // Phase A: the origin-rect measurement + collapse proxy are retired — the
  // shared element's morph-source is visible now, so the layout handoff owns a
  // VISIBLE close (open played backward). No explicit exit rect needed.

  // X1/P7: every cell is one viewport wide now, but the runway/progress
  // math stays MEASURED, not unit-counted (travel = track scrollWidth −
  // viewport; the active panel is whichever cell sits under the viewport
  // center) — so any future cell-width change keeps working.
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
    const center = v * travel + VW / 2
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

  // U2: panel surfaces (bg ramp member + matrix fg + seam geometry).
  // Hook order: must precede the no-proof early return.
  const surfaces = useMemo(() => (proof ? computeSurfaces(proof) : []), [proof])

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
            {/* X1/P7: monument title — poster-scale letterforms FITTED to
                the frame (--mon-chars fit math in App.css). Transform
                rides motion values (jumped to the fragment's delta
                pre-paint, then animated to identity — see the FLIP block
                above for why props can't do this here). */}
            <motion.h2
              ref={monumentRef}
              className={`ov-monument misregister${Array.isArray(proof.monument) ? ' ov-monument--multi' : ''}`}
              aria-label={proof.name}
              style={{
                x: monX,
                y: monY,
                scale: monScale,
                opacity: monOpacity,
                transformOrigin: 'top left',
                visibility: flipFrom === undefined ? 'hidden' : 'visible',
                // P3.4: ghost slides in (~300ms CSS transition on the
                // registered props) once the expansion lands
                '--ghost-dx': expanded ? '6px' : '0px',
                '--ghost-dy': expanded ? '6px' : '0px',
              }}
              exit={
                monumentFlip
                  ? { ...monumentFlip, transition: EXPAND_TRANSITION }
                  : { opacity: 0, transition: { duration: 0.15 } }
              }
            >
              {/* P1.1: monument accepts a string (one line) or an array
                  (staggered lines — SUMMIT / PHARMACY) */}
              {Array.isArray(proof.monument) ? (
                proof.monument.map((line, li) => (
                  <span
                    key={line}
                    aria-hidden="true"
                    className={`ov-monument__line${li > 0 ? ' ov-monument__line--stagger' : ''}`}
                  >
                    {line}
                  </span>
                ))
              ) : (
                <span aria-hidden="true">{proof.monument ?? proof.name}</span>
              )}
            </motion.h2>
            {MONUMENT_DECO === 'triangle' && (
              <span className="ov-tri" aria-hidden="true" />
            )}
            {/* The whisper meta — now in flow BELOW the monument (P7);
                reveals once the expansion lands (W1b) */}
            <motion.div
              className="ov-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: expanded && !isClosing ? 1 : 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: isClosing ? 0.2 : 0.3 }}
            >
              <p className="ov-mono misregister">
                {isAbout ? proof.tag : `Proof ${proof.index} · ${proof.tag}`}
              </p>
              <p className="ov-lede">{panel.statement}</p>
              {/* N2: the taped portrait — About only ("see portrait" in copy). */}
              {isAbout && (
                <figure className="about-portrait">
                  <span className="about-portrait__frame">
                    <span className="about-portrait__tape about-portrait__tape--left" aria-hidden="true" />
                    <span className="about-portrait__tape about-portrait__tape--right" aria-hidden="true" />
                    <img
                      className="about-portrait__photo"
                      src={prestonPortrait}
                      srcSet={`${prestonPortraitSm} 300w, ${prestonPortrait} 600w`}
                      sizes="300px"
                      width="600"
                      height="750"
                      loading="lazy"
                      alt="Preston Gray — the designer and builder behind this studio, in Denver."
                    />
                  </span>
                </figure>
              )}
              {/* §H: per-proof testimonial slot — dormant (renders nothing
                  until a `quote` is wired in projects.js). */}
              {!isAbout && <Quote {...proof.quote} />}
              {/* P7: the live-site door, right where the story starts */}
              {proof.liveUrl && (
                <a
                  className="ov-live"
                  href={proof.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View live site <span aria-hidden="true">&#8599;</span>
                </a>
              )}
            </motion.div>
          </section>
        )
      case 'media':
        return (
          <section
            className="ov-panel ov-panel--media"
            data-count={panel.items.length}
            key={`m-${i}`}
          >
            {panel.items.map((item, j) => (
              <ProofMedia
                key={item.src ?? item.poster ?? j}
                item={item}
                active={i === activePanel}
                near={near}
              />
            ))}
            {/* Y2: the placard — 2–3 sentences in the reading face,
                below the media row. Reading-text rules apply (colorFg on
                the deep flood, AA ≥4.5). */}
            {panel.body && <p className="ov-body">{panel.body}</p>}
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
            {/* Workstream C: route to the one job-ticket path. Close the overlay
                (it exits above the contact layer) then open the ticket. */}
            <a
              className="ov-next"
              href="/#contact"
              onClick={(e) => {
                e.preventDefault()
                setContactOpen(true)
                close()
              }}
            >
              Start a job ticket <span aria-hidden="true">&rarr;</span>
            </a>
            {/* P7: the small-business page is the fuller pitch */}
            <a className="ov-about-link" href="/small-business/">
              What I can do for your business{' '}
              <span aria-hidden="true">&rarr;</span>
            </a>
            {/* §H: colophon — small, About only (print-shop tradition). */}
            {isAbout && (
              <a className="ov-about-link" href="/colophon/">
                Colophon — how this site is made{' '}
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
            {/* X2: same quiet return as the end panel */}
            <button type="button" className="ov-return misregister" onClick={close}>
              <span aria-hidden="true">&larr;&nbsp;</span>Return to the catalog
            </button>
          </section>
        )
      case 'end':
        // X2: quiet return panel — the ring is retired. Same close-morph
        // as the X, same focus/scroll restoration. P7: the live site
        // gets the display-size door here too.
        return (
          <section className="ov-panel ov-panel--end" key={`e-${i}`}>
            {proof.liveUrl && (
              <a
                className="ov-next ov-next--live"
                href={proof.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the live site <span aria-hidden="true">&#8599;</span>
              </a>
            )}
            <button type="button" className="ov-return misregister" onClick={close}>
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

  // P7: the fit math sizes the monument off its longest line
  const monLines = Array.isArray(proof.monument)
    ? proof.monument
    : [proof.monument ?? proof.name]
  const monChars = Math.max(...monLines.map((l) => l.length))

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isAbout ? proof.name : `Proof ${proof.index} — ${proof.name}`}
      style={{
        '--ov': proof.color,
        '--ov-fg': proof.colorFg,
        '--mon-chars': monChars,
        // P3.4/P7: misregistration ghost = the project's PALETTE ghost
        // tone (brand-tuned), falling back to the poster display tone.
        // About has neither → no ghost, by design.
        '--ghost-color': proof.palette?.ghost ?? proof.colorDisplay ?? 'transparent',
      }}
    >
      {morph ? (
        <>
          {/* Phase A: the ONE shared element. The poster shape's morph-source is
              now visible (brand + silhouette), so this backdrop grows FROM a
              rounded brand object on open and — via framer's layout handoff on
              AnimatePresence exit — shrinks back INTO it on close. Close is the
              open played backward, for free: no separate collapse proxy. */}
          <motion.div
            className="overlay__backdrop"
            layoutId={originLayoutId}
            style={{ borderRadius: 0 }}
            transition={EXPAND_TRANSITION}
            onLayoutAnimationComplete={() => setExpanded(true)}
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
          // P6 review fix (HIGH): the chrome floats over whichever panel
          // is active — its fg must follow that panel's surface (white
          // colorFg on a candy-tint panel measured ~1.5:1). CSS color
          // transitions smooth the handoff.
          style={{ '--ov-fg': surfaces[activePanel]?.fg ?? proof.colorFg }}
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
                          className="overlay__cell"
                          key={`${panel.type}-${i}`}
                          // P6 review fix: surfaced cells paint their own
                          // BASE background — the wipe layer only shapes
                          // the seam, so the deep flood can never show
                          // behind panel text (the diagonal's skew wedge
                          // exposed it for the first ~17% of transit).
                          style={
                            surfaces[i]
                              ? { '--ov-fg': surfaces[i].fg, background: surfaces[i].bg }
                              : undefined
                          }
                        >
                          {/* U2: the geometric wipe — next surface sweeps
                              back over the seam, scrubbed by scroll */}
                          {surfaces[i] && (
                            <WipeBg
                              scrollYProgress={scrollYProgress}
                              travel={travel}
                              getOffset={() => cellOffsets.current[i] ?? 0}
                              surface={surfaces[i]}
                              mode={WIPE_MODE}
                            />
                          )}
                          {renderPanel(panel, i)}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="overlay__stack">
                  {/* U2 fallback: touch + reduced-motion stacks take the
                      SOLID surface blocks — no wipes, per spec */}
                  {proof.panels.map((panel, i) => (
                    <div
                      key={`${panel.type}-${i}`}
                      data-panel={i}
                      ref={(el) => {
                        stackRefs.current[i] = el
                      }}
                      style={
                        surfaces[i]
                          ? { background: surfaces[i].bg, '--ov-fg': surfaces[i].fg }
                          : undefined
                      }
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
