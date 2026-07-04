/*
 * shape-kit.js — the shared grammar for the 90s Geometric shape library.
 *
 * Encodes the parts of strategy-doc §5.1 / §5.3 that are LAW, as code the
 * shapes consume — so the grammar is enforced, not just documented:
 *  · stroke weights: 2 / 3 / 4 only (nothing between, nothing outside)
 *  · rotation snaps: ±8° stickers, 15°/45° pattern elements
 *  · density coverage caps: whisper ≤8% · chatter 15–20% · shout ≥35%
 *  · shape exclusivity: splats→Splash, sparkle/arc→Lisa Frank, pixel→
 *    Tech Lab/Arcade (enforced in code via useExclusivityGuard)
 *
 * Colors are NEVER defined here — shapes paint with role tokens only
 * (var(--lead) etc.), so every shape re-themes for free with [data-theme].
 */
import { createContext, useContext, useEffect } from 'react'

/* §5.1 — the only legal stroke weights. */
export const STROKE = { ui: 2, illustration: 3, sticker: 4 }

/* §5.1 — the only legal rotation snaps. snap() clamps any input to the
   nearest legal angle so a caller can't introduce an arbitrary tilt. */
export const STICKER_SNAP = [-8, 8]
export const PATTERN_SNAP = [-45, -15, 15, 45]
export const LEGAL_ANGLES = [-45, -15, -8, 0, 8, 15, 45]
export function snap(deg, set = LEGAL_ANGLES) {
  return set.reduce((a, b) => (Math.abs(b - deg) < Math.abs(a - deg) ? b : a), set[0])
}

/* §3.1 — density is defined by area COVERAGE, not shape count. Targets and
   the per-field shape counts we place to approximate them (PatternField
   sizes shapes to land inside the cap and reports the measured coverage). */
export const DENSITY = {
  whisper: { label: 'Whisper', max: 0.08, count: 5 },
  chatter: { label: 'Chatter', min: 0.15, max: 0.2, count: 12 },
  shout: { label: 'Shout', min: 0.35, count: 26 },
}

/* §5.3 — signature shape locked to each palette (recognizable before a
   single hex registers). Informational; used to label the styleguide. */
export const SIGNATURE = {
  memphis: 'squiggle',
  cartoon: 'starburst',
  windbreaker: 'diagonalSlash',
  techlab: 'pixelCluster',
  lisafrank: 'sparkle',
  arcade: 'pixelCluster',
  foodcourt: 'zigzag',
  splash: 'splat',
}

/* §5.3 — EXCLUSIVES that never travel. A shape absent from this map is a
   universal connector (checkerboard, dots, confetti triangle, rules,
   squiggle, half-circle, zigzag) and is allowed under every theme. */
export const EXCLUSIVE = {
  splat: ['splash'],
  sparkle: ['lisafrank'],
  rainbowArc: ['lisafrank'],
  pixelCluster: ['techlab', 'arcade'],
}

export const THEMES = [
  'memphis',
  'cartoon',
  'windbreaker',
  'techlab',
  'foodcourt',
  'lisafrank',
  'arcade',
  'splash',
]

export function isShapeAllowed(name, theme) {
  const allowed = EXCLUSIVE[name]
  return !allowed || allowed.includes(theme)
}

/* Theme travels via context so a shape can self-enforce exclusivity from
   anywhere in the tree. It MIRRORS the DOM [data-theme] the CSS tokens key
   off — set both together (the styleguide + PatternField do). Default
   'memphis' matches the site default. */
export const ShapeThemeContext = createContext('memphis')
export const useShapeTheme = () => useContext(ShapeThemeContext)

/* Enforcement in code (not convention): an exclusive shape rendered under
   a theme that doesn't own it renders nothing, and says why in dev. */
export function useExclusivityGuard(name) {
  const theme = useShapeTheme()
  const allowed = isShapeAllowed(name, theme)
  useEffect(() => {
    if (!allowed && import.meta.env.DEV) {
      console.warn(
        `[shapes] <${name}> is exclusive to ${EXCLUSIVE[name].join('/')}; ` +
          `not rendered under data-theme="${theme}".`,
      )
    }
  }, [allowed, name, theme])
  return allowed
}

/* Deterministic scatter — a seeded LCG so a PatternField lays out the same
   way every render (no Math.random reflow, no hydration drift). */
export function seeded(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
