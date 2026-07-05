/*
 * MotionTunePanel (§2) — dev-only close-feel tuner behind ?tune=1. Drives the
 * REAL overlay close via the motion-tune store. Arm a shape → open → close to
 * feel each change. Open is fixed at the 0.5s DELIBERATE register — this tunes
 * the RETURN only. Copy the values and reply; they get baked into the motion
 * scale (CLAUDE.md + motion-tune defaults). Stripped from prod (DEV-gated mount).
 */
import { useState } from 'react'
import { motionTune, setTune, CLOSE_EASE_PRESETS } from './motion-tune.js'

export default function MotionTunePanel() {
  const [, tick] = useState(0)
  const set = (patch) => {
    setTune(patch)
    tick((n) => n + 1)
  }
  const t = motionTune
  const values = JSON.stringify(
    {
      closeDuration: t.closeDuration,
      closeEase: t.closeEaseName,
      contentFadeOut: t.contentFadeOut,
      geometryDelay: t.geometryDelay,
      resumeHold: t.resumeHold,
    },
    null,
    2,
  )
  return (
    <aside className="tune" aria-label="Close-feel tuning (dev)">
      <p className="tune__title">Close feel · dev tuner</p>

      <label className="tune__row">
        <span>closeDuration <b>{t.closeDuration.toFixed(2)}s</b></span>
        <input type="range" min="0.4" max="1" step="0.05" value={t.closeDuration}
          onChange={(e) => set({ closeDuration: +e.target.value })} />
      </label>

      <label className="tune__row">
        <span>closeEase</span>
        <select value={t.closeEaseName} onChange={(e) => set({ closeEaseName: e.target.value })}>
          {Object.keys(CLOSE_EASE_PRESETS).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </label>

      <label className="tune__row">
        <span>contentFadeOut <b>{t.contentFadeOut.toFixed(2)}s</b></span>
        <input type="range" min="0.1" max="0.5" step="0.02" value={t.contentFadeOut}
          onChange={(e) => set({ contentFadeOut: +e.target.value })} />
      </label>

      <label className="tune__row">
        <span>overlap · geometryDelay <b>{t.geometryDelay}ms</b></span>
        <input type="range" min="0" max="400" step="20" value={t.geometryDelay}
          onChange={(e) => set({ geometryDelay: +e.target.value })} />
      </label>

      <label className="tune__row">
        <span>resumeHold <b>{t.resumeHold}ms</b></span>
        <input type="range" min="0" max="400" step="20" value={t.resumeHold}
          onChange={(e) => set({ resumeHold: +e.target.value })} />
      </label>

      <p className="tune__note">Open fixed at 0.5s. Arm a shape → tap to open → close to feel it.</p>
      <pre className="tune__values">{values}</pre>
      <button type="button" className="tune__copy"
        onClick={() => navigator.clipboard?.writeText(values)}>Copy values</button>
    </aside>
  )
}
