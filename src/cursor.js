/*
 * Site-wide circle cursor. Desktop (fine pointer) only. A white dot that follows
 * the pointer with mix-blend-mode: difference, so it stays visible over every
 * palette and ground. Squishes on click. Fully self-contained (injects its own
 * styles) so it runs on any entry, including the static /colophon/ page.
 *
 * A11y: the dot is aria-hidden + pointer-events:none and never touches focus,
 * tab order, or the accessibility tree — keyboard/SR users are unaffected.
 * Fallbacks: on coarse pointers (touch) or prefers-reduced-motion it does NOT
 * mount at all, leaving the native cursor in place. #fff is intentional and
 * literal here — mix-blend-difference needs true white to invert cleanly.
 */
export function initCircleCursor() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce) return // fallback: native cursor stays

  const style = document.createElement('style')
  style.textContent = `
    html.has-circle-cursor, html.has-circle-cursor * { cursor: none !important; }
    .circle-cursor {
      position: fixed; top: 0; left: 0; width: 26px; height: 26px;
      margin: -13px 0 0 -13px; border-radius: 50%;
      background: #fff; mix-blend-mode: difference;
      pointer-events: none; z-index: 2147483647;
      transform: translate3d(-100px, -100px, 0); opacity: 0;
      transition: width .12s ease, height .12s ease, margin .12s ease, opacity .18s ease;
      will-change: transform;
    }
    .circle-cursor.is-down { width: 16px; height: 16px; margin: -8px 0 0 -8px; }
  `
  document.head.appendChild(style)
  document.documentElement.classList.add('has-circle-cursor')

  const dot = document.createElement('div')
  dot.className = 'circle-cursor'
  dot.setAttribute('aria-hidden', 'true')
  document.body.appendChild(dot)

  let x = -100
  let y = -100
  let raf = 0
  let seen = false
  const render = () => {
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
    raf = 0
  }
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      if (!seen) {
        seen = true
        dot.style.opacity = '1'
      }
      if (!raf) raf = requestAnimationFrame(render)
    },
    { passive: true },
  )
  window.addEventListener('pointerdown', () => dot.classList.add('is-down'))
  window.addEventListener('pointerup', () => dot.classList.remove('is-down'))
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'
  })
  document.addEventListener('mouseenter', () => {
    if (seen) dot.style.opacity = '1'
  })
}
