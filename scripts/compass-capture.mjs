/*
 * Compass (Custom CRM proof) capture — FICTIONAL DEMO ONLY (2026-11-14).
 *
 *   COMPASS_STORE=<demo store dir> node scripts/compass-capture.mjs [--only name,name]
 *
 * Never points at the hosted app. Start Compass's synthetic pilot demo first
 * (from the compass-hosted worktree: `zsh apps/compass/scripts/pilot-demo.sh`):
 * fictional offices ("Directory Office NN", Example Street), fictional
 * prescribers/reps, synthetic visit notes, throwaway temp store. The demo's
 * generated password is read from <store>/credentials.txt and never printed.
 *
 * CRM HARD RULE: every frame carries a visible "DEMO · SAMPLE DATA" badge,
 * injected into the app bar at capture time. Assets still stay
 * crmVerified:false until Preston checks them.
 *
 * Output: stills → /Media/reshoot/stills/*.png, clip frames →
 * /Media/reshoot/frames/<name>/ (encode with scripts/process-media.mjs).
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const ORIGIN = 'http://127.0.0.1:4386'
const STORE = process.env.COMPASS_STORE
if (!STORE) throw Error('Set COMPASS_STORE to the pilot demo store directory')
const PASSWORD = fs.readFileSync(path.join(STORE, 'credentials.txt'), 'utf8').split(': ')[1].trim()
const OUT = path.resolve('Media/reshoot')
const FPS = 30

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}

const SHOTS = [
  { name: 'crm-today-desktop', user: 'taylor', vp: 'desktop', go: 'Home', day: '13', kind: 'still' },
  { name: 'crm-week-mobile', user: 'taylor', vp: 'mobile', go: 'Home', kind: 'days', days: ['9', '10', '11', '12', '13'], hold: 2 },
  { name: 'crm-analytics-scroll-desktop', user: 'manager', vp: 'desktop', go: 'Analytics', kind: 'scroll', seconds: 8 },
  { name: 'crm-reports-desktop', user: 'taylor', vp: 'desktop', go: 'My reports', kind: 'still' },
  { name: 'crm-team-desktop', user: 'manager', vp: 'desktop', go: 'Team', click: 'This week', kind: 'still' },
]

const BADGE_CSS = `
  #pg-demo-badge {
    position: fixed; z-index: 2147483647; top: 9px; left: 50%; transform: translateX(-50%);
    font: 700 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em;
    color: #1d1d1b; background: #ffd666; border: 2px solid #1d1d1b; padding: 6px 10px;
    pointer-events: none; white-space: nowrap;
  }
  @media (max-width: 600px) { #pg-demo-badge { top: 13px; left: 106px; transform: none; font-size: 9px; padding: 5px 6px; } }
  * { caret-color: transparent !important; }
`

const tryClick = async (loc) => {
  try {
    await loc.first().click({ timeout: 3000 })
    return true
  } catch {
    return false
  }
}

async function open(browser, shot) {
  const ctx = await browser.newContext(VIEWPORTS[shot.vp])
  // Belt and braces: this context may only ever reach the local demo.
  await ctx.route('**/*', (r) => (r.request().url().startsWith(ORIGIN) ? r.continue() : r.abort()))
  const page = await ctx.newPage()
  await page.goto(ORIGIN + '/', { waitUntil: 'networkidle' })
  await page.fill('#si-e', `${shot.user}@compass.local`)
  await page.fill('#si-p', PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForSelector('#si-e', { state: 'detached', timeout: 30000 })
  await page.waitForTimeout(2000)
  await tryClick(page.getByRole('button', { name: /close|dismiss|×/i }))
  await tryClick(page.getByRole('button', { name: 'Not now' }))
  if (shot.go !== 'Home') {
    const re = new RegExp('^' + shot.go)
    ;(await tryClick(page.getByRole('link', { name: re }))) ||
      (await tryClick(page.getByRole('button', { name: re }))) ||
      (await tryClick(page.getByText(shot.go, { exact: true })))
  }
  if (shot.day) await tryClick(page.getByText(shot.day, { exact: true }))
  if (shot.click) await tryClick(page.getByRole('button', { name: shot.click }))
  await page.waitForLoadState('networkidle')
  await page.addStyleTag({ content: BADGE_CSS })
  await page.evaluate(() => {
    const b = document.createElement('div')
    b.id = 'pg-demo-badge'
    b.textContent = 'DEMO · SAMPLE DATA'
    document.body.appendChild(b)
  })
  await page.waitForTimeout(1500)
  return { ctx, page }
}

const frameDir = (name) => {
  const dir = path.join(OUT, 'frames', name)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  return dir
}
const frame = (page, dir, i) =>
  page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 95 })
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null
fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true })
const browser = await chromium.launch()
for (const shot of SHOTS.filter((s) => !only || only.includes(s.name))) {
  const { ctx, page } = await open(browser, shot)
  if (shot.kind === 'still') {
    await page.screenshot({ path: path.join(OUT, 'stills', `${shot.name}.png`) })
  } else if (shot.kind === 'scroll') {
    const dir = frameDir(shot.name)
    const frames = shot.seconds * FPS
    const hold = Math.round(0.8 * FPS)
    const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
    for (let i = 0; i < frames; i++) {
      const x = Math.min(1, Math.max(0, (i - hold) / (frames - 2 * hold - 1)))
      await page.evaluate((y) => {
        scrollTo(0, y)
        return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      }, Math.round(ease(x) * maxY))
      await frame(page, dir, i)
    }
  } else if (shot.kind === 'days') {
    // The week, day by day: tap each weekday on the strip, hold it. The UI
    // switches instantly, so one screenshot per day is repeated for the hold.
    const dir = frameDir(shot.name)
    let i = 0
    for (const d of shot.days) {
      await tryClick(page.getByText(d, { exact: true }))
      await page.waitForTimeout(900)
      const first = path.join(dir, `f${String(i).padStart(4, '0')}.jpg`)
      await frame(page, dir, i++)
      for (let k = 1; k < shot.hold * FPS; k++) fs.copyFileSync(first, path.join(dir, `f${String(i++).padStart(4, '0')}.jpg`))
    }
  }
  await ctx.close()
  console.log(shot.kind, shot.name)
}
await browser.close()
