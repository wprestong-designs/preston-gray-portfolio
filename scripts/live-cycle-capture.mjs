/* One-off: record the REAL live cycle (no harness) to catch missing states,
   white-screen flashes, and the actual cadence. Frames + a per-frame mean-
   luminance log (spikes ≈ blank/white frames). */
import { chromium } from 'playwright'
import { mkdir, writeFile, rm } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:5199'
const OUT = process.env.OUT || '/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/live-cycle'
const N = Number(process.env.N || 80)
const EVERY = Number(process.env.EVERY || 400)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 720 })
await rm(OUT, { recursive: true, force: true }).catch(() => {})
await mkdir(OUT, { recursive: true })
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
const comp = await page.waitForSelector('.comp')
const log = []
for (let i = 0; i < N; i += 1) {
  const path = `${OUT}/f${String(i).padStart(3, '0')}.png`
  await comp.screenshot({ path })
  // mean luminance of the stage (near-white ≈ blank frame)
  const lum = await page.evaluate(() => {
    const s = document.querySelector('.comp__stage')
    if (!s) return null
    const shapes = s.querySelectorAll('.comp-shape')
    let visible = 0
    shapes.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.width > 4 && r.height > 4) visible += 1
    })
    return { shapes: shapes.length, visible }
  })
  log.push({ i, t: i * EVERY, ...lum })
  await sleep(EVERY)
}
await writeFile(`${OUT}/log.json`, JSON.stringify(log, null, 2))
await browser.close()
process.stdout.write(`live cycle → ${OUT} (${N} frames @ ${EVERY}ms)\n`)
