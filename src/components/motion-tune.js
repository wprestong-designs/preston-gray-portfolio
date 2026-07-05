/*
 * Dev-only close-feel tuning store (?tune=1). The MotionTunePanel mutates this;
 * the overlay reads it LIVE when a close fires (imperative animate + exit
 * transition), so no re-render plumbing is needed. Ships behind the flag; the
 * defaults ARE the current shipped values (see CLAUDE.md motion scale). The OPEN
 * stays fixed at the 0.5s DELIBERATE register — this only tunes the RETURN.
 */
export const CLOSE_EASE_PRESETS = {
  'strong-decel': [0.2, 0, 0.1, 1], // default — a decisive settle
  'expand (open curve)': [0.32, 0.72, 0, 1],
  'ease-out': [0, 0, 0.2, 1],
  'ease-in-out': [0.4, 0, 0.2, 1],
  linear: [0, 0, 1, 1],
}

export const motionTune = {
  closeDuration: 0.7, // s (0.4–1.0)
  closeEaseName: 'strong-decel',
  contentFadeOut: 0.2, // s — meta/ghost fade
  geometryDelay: 0, // ms — overlap: geometry waits this long while content fades
  resumeHold: 200, // ms — pause after the shape lands before colour releases + cycle resumes
}

const subs = new Set()
export const onTuneChange = (fn) => {
  subs.add(fn)
  return () => subs.delete(fn)
}
export const setTune = (patch) => {
  Object.assign(motionTune, patch)
  subs.forEach((f) => f())
}

export const closeEase = () =>
  CLOSE_EASE_PRESETS[motionTune.closeEaseName] ?? CLOSE_EASE_PRESETS['strong-decel']
// Transition for the close geometry (backdrop shrink + title reverse).
export const closeTransition = () => ({
  duration: motionTune.closeDuration,
  ease: closeEase(),
  delay: motionTune.geometryDelay / 1000,
})
