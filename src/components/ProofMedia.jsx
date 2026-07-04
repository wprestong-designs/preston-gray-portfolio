/*
 * ProofMedia (G1) — one overlay media item in a print-shop CSS frame
 * ('browser' | 'phone' | 'plain' — never skeuomorphic device images).
 *
 * Videos: muted, looping, playsinline, no controls. The <video> element
 * mounts only when its panel is NEAR the viewport (driven by the overlay's
 * scroll progress — native lazy is unreliable under the horizontal
 * transform) and plays only while its panel is ACTIVE. Reduced motion:
 * the poster renders instead, with a subtle play-on-tap affordance —
 * autoplay never happens.
 *
 * A video item with no sources yet (srcMp4/srcWebm null) renders its
 * poster with a CLIP PENDING mark — the pre-capture placeholder state.
 * A `pendingNote` overrides that mark's wording per item.
 *
 * P2 HARD BLOCK: `crmVerified: false` renders POSTER-ONLY — the <video>
 * element is never emitted until Preston flips the flag in projects.js
 * (synthetic-demo verification, see media-manifest.md checkboxes).
 */
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

export default function ProofMedia({ item, active = false, near = false }) {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef(null)
  const [tapPlay, setTapPlay] = useState(false)
  const [mounted, setMounted] = useState(false)

  const gated = item.crmVerified === false
  const hasVideo =
    item.kind === 'video' && !gated && (item.srcMp4 || item.srcWebm)
  const wantsVideo = hasVideo && (reducedMotion ? tapPlay : near)
  const shouldPlay = hasVideo && (reducedMotion ? tapPlay : active)

  // Render-phase latch: once wanted, keep the element mounted so loops
  // don't restart on panel exit/enter — we only pause it.
  if (wantsVideo && !mounted) setMounted(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (shouldPlay) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [shouldPlay, mounted])

  const frame = item.frame ?? 'plain'

  return (
    <figure className={`pm pm--${frame}`}>
      <div className="pm__frame">
        {frame === 'browser' && (
          <div className="pm__chrome">
            <span className="pm__dots">
              <i />
              <i />
              <i />
            </span>
            {item.caption && <span className="pm__url">{item.caption}</span>}
          </div>
        )}

        {item.kind === 'image' && (
          <img src={item.src} alt={item.alt ?? item.caption ?? ''} loading="lazy" />
        )}

        {item.kind === 'video' && !hasVideo && (
          <div className="pm__pending-wrap">
            <img src={item.poster} alt={item.alt ?? item.caption ?? ''} loading="lazy" />
            <span className="pm__pending">
              {gated ? 'Pending verification' : item.pendingNote ?? 'Clip pending'}
            </span>
          </div>
        )}

        {hasVideo && !mounted && (
          <div className="pm__pending-wrap">
            <img src={item.poster} alt={item.alt ?? item.caption ?? ''} loading="lazy" />
            {reducedMotion && (
              <button
                type="button"
                className="pm__play"
                aria-label={`Play clip: ${item.caption ?? 'project video'}`}
                onClick={() => setTapPlay(true)}
              >
                &#9654;
              </button>
            )}
          </div>
        )}

        {hasVideo && mounted && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={item.poster}
            onClick={reducedMotion ? () => setTapPlay((p) => !p) : undefined}
          >
            {/* Source order = smaller encode first so the browser picks the
                lighter file. Default webm-first; item.mp4First flips it for
                the clips whose mp4 encoded smaller than the webm (measured). */}
            {item.mp4First ? (
              <>
                {item.srcMp4 && <source src={item.srcMp4} type="video/mp4" />}
                {item.srcWebm && <source src={item.srcWebm} type="video/webm" />}
              </>
            ) : (
              <>
                {item.srcWebm && <source src={item.srcWebm} type="video/webm" />}
                {item.srcMp4 && <source src={item.srcMp4} type="video/mp4" />}
              </>
            )}
          </video>
        )}
      </div>
      {item.caption && frame !== 'browser' && (
        <figcaption className="pm__caption">{item.caption}</figcaption>
      )}
    </figure>
  )
}
