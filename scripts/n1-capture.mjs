/* N1 verification: armed identity (pinned brand + title) for every project ×
   theme, AA contrast of title-on-brand, and the open-morph continuity. */
import { chromium } from 'playwright'
import { mkdir, writeFile, rm } from 'node:fs/promises'
const BASE = process.env.BASE_URL || 'http://localhost:5199'
const OUT = '/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/n1'
const PROJECTS = ['summit', 'ourco', 'bristol', 'pinnacle', 'prosource', 'fieldintel']
const THEMES = ['memphis', 'arcade', 'splash'] // light + two dark registers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await rm(OUT, { recursive: true, force: true }).catch(() => {})
await mkdir(OUT, { recursive: true })

const b = await chromium.launch()
const page = await b.newPage()
await page.setViewportSize({ width: 1280, height: 720 })
const setTheme = (t) => page.evaluate((x) => window.__comp?.setTheme(x), t)
// Real mouse hover fires a genuine pointerenter (pointerType 'mouse') → the
// shape's enterShape → the armed brand preview. dispatchEvent didn't carry
// pointerType, so the handler's mouse-only guard rejected it.
const hover = (id) => page.hover(`.comp-shape[data-shape="${id}"]`, { force: true })
const leave = () => page.mouse.move(1272, 705) // park in an empty corner

const lum = (c) => { const m = c.match(/[\d.]+/g); const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(+m[0]) + 0.7152 * f(+m[1]) + 0.0722 * f(+m[2]) }
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05) }

// State with all 6 shapes well-separated + large enough to show the title.
await page.goto(`${BASE}/?harness=1&state=registration`, { waitUntil: 'networkidle' })
await page.waitForFunction(() => Boolean(window.__comp))
const comp = await page.waitForSelector('.comp')

const contrast = []
for (const theme of THEMES) {
  await setTheme(theme)
  for (const id of PROJECTS) {
    await hover(id)
    await sleep(450)
    await comp.screenshot({ path: `${OUT}/armed_${theme}_${id}.png` })
    // read the armed shape fill + the title colour actually rendered
    const probe = await page.evaluate((sid) => {
      const el = document.querySelector(`.comp-shape[data-shape="${sid}"]`)
      const title = el?.querySelector('.comp-type')
      return { fill: el && getComputedStyle(el).backgroundColor, titleColor: title && getComputedStyle(title).color }
    }, id)
    if (theme === 'memphis' && probe.fill && probe.titleColor) {
      contrast.push({ id, fill: probe.fill, title: probe.titleColor, ratio: +ratio(probe.fill, probe.titleColor).toFixed(2) })
    }
    await leave()
    await sleep(200)
  }
  process.stdout.write(`  armed set — ${theme}\n`)
}

// AA report (title on brand ground, memphis-independent since brand is pinned)
const fails = contrast.filter((c) => c.ratio < 4.5)
await writeFile(`${OUT}/contrast.json`, JSON.stringify({ contrast, fails }, null, 2))
process.stdout.write('\n  TITLE-ON-BRAND CONTRAST (AA 4.5):\n')
contrast.forEach((c) => process.stdout.write(`    ${c.id.padEnd(11)} ${c.ratio}:1  ${c.ratio >= 4.5 ? 'PASS' : 'FAIL'}  (${c.fill} / ${c.title})\n`))
process.stdout.write(fails.length ? `  !! ${fails.length} FAIL AA\n` : '  all pass AA\n')

// Open-morph continuity: arm → click → capture the growing shared element,
// then the settled overlay statement ground. Compare to the armed brand.
await setTheme('memphis')
for (const id of ['summit', 'fieldintel']) {
  await page.goto(`${BASE}/?harness=1&state=registration`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => Boolean(window.__comp))
  await hover(id)
  await sleep(300)
  await page.click(`.comp-shape[data-shape="${id}"]`)
  for (const [i, t] of [90, 260, 480].entries()) {
    await sleep(i === 0 ? t : t - [90, 260, 480][i - 1])
    await page.screenshot({ path: `${OUT}/open_${id}_f${i}_${t}ms.png` })
  }
  await sleep(700)
  await page.screenshot({ path: `${OUT}/open_${id}_settled.png` })
  // read the overlay statement ground vs the pinned brand
  const grounds = await page.evaluate(() => {
    const ov = document.querySelector('.overlay')
    const panel = document.querySelector('.ov-panel--statement, .overlay__backdrop')
    return { ov: ov && getComputedStyle(ov).getPropertyValue('--ov').trim(), panelBg: panel && getComputedStyle(panel).backgroundColor }
  })
  process.stdout.write(`  open ${id}: --ov=${grounds.ov} panelBg=${grounds.panelBg}\n`)
}
await b.close()
process.stdout.write(`\nDONE → ${OUT}\n`)
