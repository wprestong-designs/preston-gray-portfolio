/* Generate the OG/social card FROM the poster system (harness), 1200x630. */
import { chromium } from 'playwright'
const BASE = process.env.BASE_URL || 'http://localhost:5199'
const b = await chromium.launch()
const p = await b.newPage()
await p.setViewportSize({ width: 1200, height: 630 })
// candidates: strong composition + legible dark wordmark on light ground
const cands = [['registration','memphis'],['burst','foodcourt'],['arch','cartoon'],['circles','windbreaker']]
for (const [state,theme] of cands) {
  await p.goto(`${BASE}/?harness=1&state=${state}`, { waitUntil: 'networkidle' })
  await p.waitForFunction(() => Boolean(window.__comp))
  await p.evaluate((t)=>window.__comp.setTheme(t), theme)
  await new Promise(r=>setTimeout(r,500))
  await p.screenshot({ path: `/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/og-${state}-${theme}.png` })
}
await b.close()
console.log('OG candidates rendered')
