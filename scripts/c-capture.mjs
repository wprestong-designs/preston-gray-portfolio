/* Workstream C — capture the contact job-ticket states (UI/a11y verify).
   Netlify Forms detection + email + real submission need a deploy; on the dev
   server a POST to '/' returns 200, so the success path renders for capture. */
import { chromium } from 'playwright'
import { mkdir, rm } from 'node:fs/promises'
const BASE = process.env.BASE_URL || 'http://localhost:5199'
const OUT = '/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/c'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
await rm(OUT, { recursive: true, force: true }).catch(() => {})
await mkdir(OUT, { recursive: true })
const b = await chromium.launch()

const openContact = async (page) => {
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#contact-util')
  await page.click('#contact-util')
  await sleep(700)
  const st = await page.evaluate(() => {
    const l = document.querySelector('.contact-layer')
    return { present: Boolean(l), inert: l?.hasAttribute('inert'), vis: l && getComputedStyle(l).visibility }
  })
  console.log('  contact layer:', JSON.stringify(st))
}

// desktop: idle + validation + success
const dt = await b.newPage()
await dt.setViewportSize({ width: 1280, height: 900 })
await openContact(dt)
await dt.screenshot({ path: `${OUT}/desktop_idle.png` })
// validation: submit empty
await dt.click('.ticket-btn--submit')
await sleep(300)
await dt.screenshot({ path: `${OUT}/desktop_validation.png` })
const focused = await dt.evaluate(() => document.activeElement?.name || document.activeElement?.id)
const liveErrs = await dt.evaluate(() => [...document.querySelectorAll('.ticket-err')].map((e) => e.textContent))
console.log('validation → focus:', focused, '| errors:', liveErrs.length)
// fill + success
await dt.fill('.ticket-form input[name="name"]', 'Jane Baker')
await dt.fill('.ticket-form input[name="email"]', 'jane@example.com')
await dt.fill('.ticket-form input[name="business"]', "Baker's Bakery")
await dt.click('.ticket-chip:has-text("Website")')
await dt.click('.ticket-chip:has-text("Print materials")')
await dt.click('.ticket-chip:has-text("This quarter")')
await dt.fill('.ticket-form textarea[name="message"]', 'Need a new site + a menu redesign before the holidays.')
await sleep(200)
await dt.screenshot({ path: `${OUT}/desktop_filled.png` })
// error/fallback: POST fails (natural on Vite; forced here) → mailto preserved
await dt.route('**/*', (r) => (r.request().method() === 'POST' ? r.abort() : r.continue()))
await dt.click('.ticket-btn--submit')
await sleep(700)
await dt.screenshot({ path: `${OUT}/desktop_error.png` })
console.log('error → focus className:', await dt.evaluate(() => document.activeElement?.className))
// success: POST accepted (what real Netlify returns)
await dt.unroute('**/*')
await dt.route('**/*', (r) => (r.request().method() === 'POST' ? r.fulfill({ status: 200, body: 'OK' }) : r.continue()))
await dt.click('.ticket-btn--submit')
await sleep(800)
await dt.screenshot({ path: `${OUT}/desktop_success.png` })
console.log('success → focus className:', await dt.evaluate(() => document.activeElement?.className))

// mobile: idle (chip sizes, input font-size, no 2-col)
const mb = await b.newPage()
await mb.setViewportSize({ width: 390, height: 800 })
await openContact(mb)
await mb.screenshot({ path: `${OUT}/mobile_idle.png`, fullPage: true })
const sizes = await mb.evaluate(() => {
  const chip = document.querySelector('.ticket-chip')
  const input = document.querySelector('.ticket-input')
  return { chipH: chip?.getBoundingClientRect().height, inputFont: getComputedStyle(input).fontSize }
})
console.log('mobile → chip height:', sizes.chipH, '| input font-size:', sizes.inputFont)

await b.close()
console.log('DONE →', OUT)
