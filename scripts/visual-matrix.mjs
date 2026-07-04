/*
 * VISUAL MATRIX HARNESS (run-2 R0) — the permanent motion/geometry verifier.
 *
 * Screenshots EVERY geometry state × EVERY palette (the 8 data-themes = the
 * 64-color system), both orientations, from the real poster, plus mid-
 * transition frames and an analytic contrast-vs-ground audit. Output is a
 * state×theme contact grid (index.html) + individual PNGs + audit.json.
 *
 * Needs the DEV server (the ?harness=1 control surface is stripped from prod).
 *   npm run dev -- --port 5199 --strictPort &
 *   BASE_URL=http://localhost:5199 node scripts/visual-matrix.mjs
 *   # PASS=M|T|C subset (default MTC). SEED=n deterministic. OUT=/abs override.
 *
 * Passes:
 *   M  matrix     — live poster, every state × theme × orientation
 *   T  transitions— triangle-boundary morph frames (morph-untouched check)
 *   C  contrast   — analytic fill-vs-ground ratio for every theme×family×step
 */
import { chromium } from 'playwright'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const PASSES = (process.env.PASS || 'MTC').toUpperCase()
const SEED = Number(process.env.SEED || 1) // deterministic transition-theme picks; feeds R2 walk
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT = process.env.OUT || join(ROOT, 'scratchpad', 'visual-matrix')

const STATES = [
  'registration', 'circles', 'columns', 'triangle', 'pillrhythm',
  'quarters', 'swatches', 'tiles', 'pinwheel',
]
const CLIP_STATES = new Set(['columns', 'triangle', 'pillrhythm'])
// the palette axis = the 8 data-themes (the 64-color system)
const THEMES = [
  'memphis', 'cartoon', 'windbreaker', 'techlab',
  'foodcourt', 'lisafrank', 'arcade', 'splash',
]
const FAMILIES = ['green', 'orange', 'sage', 'sky', 'red', 'purple']
const STEPS = ['tint', 'soft', 'vivid', 'deep']
const ORIENTS = {
  landscape: { width: 1280, height: 720 },
  portrait: { width: 480, height: 900 },
}
const clipFor = (s) => (CLIP_STATES.has(s) ? 1 : 0)
const clipForPair = (a, b) => (CLIP_STATES.has(a) && CLIP_STATES.has(b) ? 1 : 0)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// tiny seeded RNG (mulberry32) so transition-theme picks are reproducible
function rng(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}
const setTheme = (page, theme) =>
  page.evaluate((t) => {
    document.documentElement.dataset.theme = t
  }, theme)

async function passM(page) {
  await mkdir(join(OUT, 'matrix'), { recursive: true })
  for (const [orient, vp] of Object.entries(ORIENTS)) {
    await page.setViewportSize(vp)
    for (const state of STATES) {
      await page.goto(`${BASE}/?harness=1&state=${state}&clip=${clipFor(state)}`, {
        waitUntil: 'networkidle',
      })
      const comp = await page.waitForSelector('.comp')
      for (const theme of THEMES) {
        await setTheme(page, theme)
        await sleep(120)
        await comp.screenshot({ path: join(OUT, 'matrix', `${orient}__${theme}__${state}.png`) })
      }
      process.stdout.write(`  M ${orient} ${state}\n`)
    }
  }
}

async function passT(page) {
  // triangle-boundary morph frames — proves the run-2 morph is untouched.
  await mkdir(join(OUT, 'trans'), { recursive: true })
  const SAMPLES = [120, 320, 560, 850]
  const pairs = [
    ['columns', 'triangle'], ['triangle', 'pillrhythm'],
    ['triangle', 'columns'], ['pillrhythm', 'triangle'],
  ]
  const rand = rng(SEED)
  for (const orient of ['landscape', 'portrait']) {
    await page.setViewportSize(ORIENTS[orient])
    await page.goto(`${BASE}/?harness=1`, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => Boolean(window.__comp))
    // deterministic theme for this orientation's transition capture
    const theme = THEMES[Math.floor(rand() * THEMES.length)]
    await setTheme(page, theme)
    const comp = await page.$('.comp')
    for (const [a, b] of pairs) {
      const clip = clipForPair(a, b)
      await page.evaluate(([A, c]) => {
        window.__comp.setClip(Boolean(c))
        window.__comp.setState(A)
      }, [a, clip])
      await sleep(1300)
      await page.evaluate(([B]) => window.__comp.setState(B), [b])
      const t0 = Date.now()
      for (let s = 0; s < SAMPLES.length; s += 1) {
        const wait = SAMPLES[s] - (Date.now() - t0)
        if (wait > 0) await sleep(wait)
        await comp.screenshot({ path: join(OUT, 'trans', `${orient}__${theme}__${a}-${b}__f${s}.png`) })
      }
      process.stdout.write(`  T ${orient} ${theme} ${a}->${b}\n`)
    }
  }
}

async function passC(page) {
  // Analytic contrast-vs-ground: resolve every theme×family×step fill + the
  // ground, compute WCAG ratio. This is the permanent paper-on-paper audit.
  await page.setViewportSize(ORIENTS.landscape)
  await page.goto(`${BASE}/?harness=1&state=registration`, { waitUntil: 'networkidle' })
  const rows = await page.evaluate(
    ({ themes, families, steps }) => {
      const root = document.documentElement
      const probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;left:-9999px;width:10px;height:10px'
      document.body.appendChild(probe)
      const read = (cssVar) => {
        probe.style.background = `var(${cssVar})`
        const c = getComputedStyle(probe).backgroundColor
        const m = c.match(/[\d.]+/g).map(Number)
        return [m[0], m[1], m[2]]
      }
      const lin = (v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
      const ratio = (a, b) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
        return (hi + 0.05) / (lo + 0.05)
      }
      const prevTheme = root.dataset.theme
      const out = []
      for (const theme of themes) {
        root.dataset.theme = theme
        const ground = read('--paper')
        for (const family of families) {
          for (const step of steps) {
            const token =
              step === 'canonical' ? `--display-${family}` : `--ramp-${family}-${step}`
            const fill = read(token)
            out.push({
              theme, family, step,
              fill: `rgb(${fill.join(',')})`,
              ground: `rgb(${ground.join(',')})`,
              ratio: Math.round(ratio(fill, ground) * 100) / 100,
            })
          }
        }
        // canonical (display) too
        for (const family of families) {
          const fill = read(`--display-${family}`)
          out.push({
            theme, family, step: 'canonical',
            fill: `rgb(${fill.join(',')})`,
            ground: `rgb(${ground.join(',')})`,
            ratio: Math.round(ratio(fill, read('--paper')) * 100) / 100,
          })
        }
      }
      root.dataset.theme = prevTheme
      probe.remove()
      return out
    },
    { themes: THEMES, families: FAMILIES, steps: STEPS },
  )
  const FLAG = 1.5 // below this a fill is near-indistinguishable from ground
  const fails = rows.filter((r) => r.ratio < FLAG).sort((a, b) => a.ratio - b.ratio)
  await writeFile(join(OUT, 'audit.json'), JSON.stringify({ FLAG, rows, fails }, null, 2))
  process.stdout.write(`  C contrast audit — ${fails.length}/${rows.length} fills below ${FLAG}:1 vs ground\n`)
  for (const f of fails.slice(0, 40)) {
    process.stdout.write(`     ${f.ratio.toFixed(2)}:1  ${f.theme}/${f.family}/${f.step}  ${f.fill} on ${f.ground}\n`)
  }
}

async function buildIndex() {
  const cell = (src) => `<figure><img loading="lazy" src="${src}"></figure>`
  let html = `<!doctype html><meta charset=utf8><title>visual matrix — state×theme</title>
<style>
  body{background:#111;color:#eee;font:13px system-ui;margin:0;padding:24px}
  h2{margin:28px 0 6px}.sub{color:#888;margin:0 0 12px}
  .grid{display:grid;gap:5px}figure{margin:0}
  figure img{width:100%;display:block;background:#fff;border:1px solid #333}
  .lbl{align-self:center;font-weight:600;text-transform:capitalize}
  .legend{position:sticky;top:0;background:#111;padding:6px 0;z-index:2;font-size:11px}
</style>
<h1>Visual matrix — geometry state × palette (8 data-themes)</h1>
<p class="sub">SEED=${SEED}. Every state rendered from the real poster in all 8 themes, both orientations.</p>`
  for (const orient of Object.keys(ORIENTS)) {
    html += `<h2>${orient}</h2><div class="grid" style="grid-template-columns:110px repeat(${THEMES.length},1fr)">`
    html += `<div></div>` + THEMES.map((t) => `<div class="legend">${t}</div>`).join('')
    for (const state of STATES) {
      html += `<div class="lbl">${state}</div>`
      for (const theme of THEMES) html += cell(`matrix/${orient}__${theme}__${state}.png`)
    }
    html += `</div>`
  }
  await writeFile(join(OUT, 'index.html'), html)
}

async function main() {
  await rm(OUT, { recursive: true, force: true }).catch(() => {})
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  page.on('pageerror', (e) => process.stdout.write(`  [pageerror] ${e.message}\n`))
  try {
    if (PASSES.includes('M')) await passM(page)
    if (PASSES.includes('T')) await passT(page)
    if (PASSES.includes('C')) await passC(page)
    await buildIndex()
  } finally {
    await browser.close()
  }
  process.stdout.write(`\nDONE → ${OUT}\n  open ${join(OUT, 'index.html')}\n`)
}

main().catch((e) => {
  process.stderr.write(String(e?.stack || e) + '\n')
  process.exit(1)
})
