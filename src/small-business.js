/*
 * /small-business/ entry (P7). Static HTML + styles only — same
 * performance covenant as /work/: the page never waits for JavaScript.
 * Reuses the wk-* chrome from work.css; sb-* styles layer on top.
 */
import './index.css'
import './work.css'
import './small-business.css'
import { initCircleCursor } from './cursor.js'

// A-pass: site-wide desktop-only circle cursor (no-op on touch / reduced-motion).
initCircleCursor()
