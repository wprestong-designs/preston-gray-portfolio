/*
 * Re-shoot capture (2026-11-14) — clean stills + frame-by-frame scroll clips.
 *
 *   node scripts/reshoot-capture.mjs [stills|videos|all] [--only name,name]
 *
 * Stills: Playwright viewport crops at deviceScaleFactor 2 (desktop 1440×900,
 * mobile 390×844), no browser chrome or cursor; analytics blocked, reCAPTCHA
 * badge / cookie / chat widgets hidden. Masters land in /Media/reshoot/stills
 * (gitignored) as PNG.
 *
 * Videos: NOT screen recordings. The page is pre-scrolled once (so lazy
 * images and reveal-on-scroll blocks are already in), then stepped through an
 * eased window.scrollTo curve and screenshotted at 30 fps into
 * /Media/reshoot/frames/<name>/. `hero` clips play the page's <video> at 1/16
 * speed and match screenshots to its timestamps (headless Chromium won't
 * repaint a paused video after a seek), so motion plays at real speed. Encode with
 * scripts/reshoot-encode.mjs.
 *
 * ProSource is NOT public: it is captured from the local pharmacy-sites build
 * (`node tooling/serve.mjs --brand prosource --port 8091` in ~/pharmacy-sites).
 * Live sites are only scrolled — no form is ever filled or submitted.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('Media/reshoot')
const PROSOURCE = process.env.PROSOURCE_URL || 'http://localhost:8091'
const FPS = 30

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  },
}

/* The approved shot list (2026-11-14). */
export const STILLS = [
  { name: 'ourco-home-desktop', url: 'https://ourco.net/', vp: 'desktop' },
  { name: 'ourco-home-mobile', url: 'https://ourco.net/', vp: 'mobile' },
  { name: 'ourco-about-desktop', url: 'https://ourco.net/about/', vp: 'desktop' },
  { name: 'ourco-services-desktop', url: 'https://ourco.net/services/', vp: 'desktop' },
  { name: 'ourco-gases-desktop', url: 'https://ourco.net/gases/', vp: 'desktop' },
  { name: 'ourco-brands-desktop', url: 'https://ourco.net/our-brands/', vp: 'desktop' },
  { name: 'summit-refill-desktop', url: 'https://summitpharmacycolorado.com/rx-refill-request', vp: 'desktop' },
  { name: 'summit-womenshealth-desktop', url: 'https://summitpharmacycolorado.com/womens-health', vp: 'desktop' },
  { name: 'summit-ophthalmology-desktop', url: 'https://summitpharmacycolorado.com/ophthalmology', vp: 'desktop' },
  { name: 'summit-reviews-desktop', url: 'https://summitpharmacycolorado.com/', vp: 'desktop', section: '#patient-reviews h2', sectionPad: -30 },
  { name: 'bristol-home-mobile', url: 'https://rxbristolokc.com/', vp: 'mobile' },
  { name: 'pinnacle-home-desktop', url: 'https://pinnacle-rx.com/', vp: 'desktop' },
  { name: 'prosource-home-desktop', url: `${PROSOURCE}/`, vp: 'desktop' },
  { name: 'prosource-home-mobile', url: `${PROSOURCE}/`, vp: 'mobile' },
]

export const VIDEOS = [
  { name: 'ourco-homepage-desktop', url: 'https://ourco.net/', vp: 'desktop', mode: 'hero', seconds: 10 },
  { name: 'summit-homepage-scroll-desktop', url: 'https://summitpharmacycolorado.com/', vp: 'desktop', seconds: 12 },
  { name: 'summit-rxrefillrequest-scroll-mobile', url: 'https://summitpharmacycolorado.com/rx-refill-request', vp: 'mobile', seconds: 10 },
  { name: 'summit-rxsubmission-scroll-desktop', url: 'https://summitpharmacycolorado.com/rx-submission', vp: 'desktop', seconds: 10 },
  { name: 'summit-dermatology-scroll-desktop', url: 'https://summitpharmacycolorado.com/dermatology', vp: 'desktop', seconds: 10 },
  { name: 'bristol-homepage-scroll-desktop', url: 'https://rxbristolokc.com/', vp: 'desktop', seconds: 10 },
  { name: 'bristol-about-scroll-mobile', url: 'https://rxbristolokc.com/about', vp: 'mobile', seconds: 10 },
  { name: 'pinnacle-homepage-scroll-mobile', url: 'https://pinnacle-rx.com/', vp: 'mobile', seconds: 12 },
  { name: 'pinnacle-about-scroll-desktop', url: 'https://pinnacle-rx.com/about', vp: 'desktop', seconds: 9 },
  { name: 'prosource-rxrefill-scroll-desktop', url: `${PROSOURCE}/rx-refill`, vp: 'desktop', seconds: 9 },
]

const BLOCK = /cloudflareinsights|google-analytics|googletagmanager|gtag\/js|doubleclick|facebook\.net|clarity\.ms|hotjar|recaptcha\/api2\/(?:anchor|bframe)/

const CLEAN_CSS = `
  html, body { scroll-behavior: auto !important; }
  .grecaptcha-badge, iframe[src*="recaptcha"],
  [id*="cookie" i][class*="banner" i], [class*="cookie-banner" i], [class*="cookie-consent" i],
  #onetrust-banner-sdk, .cc-window, [id*="intercom" i], [class*="chat-widget" i],
  #hubspot-messages-iframe-container, .tawk-min-container, #crisp-chatbox,
  /* local pharmacy-sites builds show a dev-only "Preview build" notice */
  #preview-banner { display: none !important; }
  * { caret-color: transparent !important; }
`

async function openPage(browser, shot) {
  const ctx = await browser.newContext({ ...VIEWPORTS[shot.vp], reducedMotion: 'no-preference' })
  await ctx.route('**/*', (route) => (BLOCK.test(route.request().url()) ? route.abort() : route.continue()))
  const page = await ctx.newPage()
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 90000 })
  await page.addStyleTag({ content: CLEAN_CSS })
  // ourco.net ships without a body-margin reset (UA 8px → a white hairline
  // frame around every page). Zeroed for the captures; flagged for a site fix.
  if (shot.url.includes('ourco.net')) await page.addStyleTag({ content: 'body { margin: 0 !important; }' })
  await page.evaluate(() => document.fonts.ready)
  // Pre-scroll so lazy images + reveal-on-scroll blocks are in before we shoot.
  await page.evaluate(async () => {
    const step = innerHeight * 0.6
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(1500)
  return { ctx, page }
}

async function still(browser, shot) {
  const { ctx, page } = await openPage(browser, shot)
  if (shot.section) {
    await page.evaluate(([sel, pad]) => {
      const el = document.querySelector(sel)
      const header = document.querySelector('header')
      const offset = header && getComputedStyle(header).position !== 'static' ? header.offsetHeight : 0
      scrollTo(0, el.getBoundingClientRect().top + scrollY - offset - pad)
    }, [shot.section, shot.sectionPad ?? 0])
    await page.waitForTimeout(800)
  }
  const file = path.join(OUT, 'stills', `${shot.name}.png`)
  await page.screenshot({ path: file })
  await ctx.close()
  console.log('still', shot.name)
}

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) // easeInOutCubic

async function video(browser, shot) {
  const { ctx, page } = await openPage(browser, shot)
  const dir = path.join(OUT, 'frames', shot.name)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  const frames = Math.round(shot.seconds * FPS)
  const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const hold = Math.round(0.8 * FPS)
  if (shot.mode === 'hero') {
    // Headless Chromium does not repaint a PAUSED video after a seek, so the
    // hero plays at 1/16 speed instead: screenshot continuously, log each
    // shot's video timestamp, then pick the nearest shot for every output
    // frame (real-speed motion, looping on the video's own loop point).
    const sdir = path.join(dir, '_samples')
    fs.mkdirSync(sdir)
    const dur = await page.evaluate(() => {
      const v = [...document.querySelectorAll('video')].sort((a, b) => b.offsetWidth - a.offsetWidth)[0]
      v.loop = false
      v.currentTime = 0
      v.playbackRate = 0.0625
      v.play()
      return v.duration
    })
    const vt = () => page.evaluate(() => [...document.querySelectorAll('video')].sort((a, b) => b.offsetWidth - a.offsetWidth)[0].currentTime)
    const samples = []
    for (let n = 0; ; n++) {
      const t0 = await vt()
      const file = path.join(sdir, `s${n}.jpg`)
      await page.screenshot({ path: file, type: 'jpeg', quality: 95 })
      const t1 = await vt()
      samples.push({ t: (t0 + t1) / 2, file })
      if (t1 >= dur - 0.02) break
    }
    for (let i = 0; i < frames; i++) {
      const t = (i / FPS) % dur
      const best = samples.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a))
      fs.copyFileSync(best.file, path.join(dir, `f${String(i).padStart(4, '0')}.jpg`))
    }
    fs.rmSync(sdir, { recursive: true })
    await ctx.close()
    console.log('video', shot.name, `${frames} frames from ${samples.length} samples over ${dur}s`)
    return
  }
  for (let i = 0; i < frames; i++) {
    {
      const x = Math.min(1, Math.max(0, (i - hold) / (frames - 2 * hold - 1)))
      await page.evaluate((y) => {
        scrollTo(0, y)
        return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      }, Math.round(ease(x) * maxY))
    }
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 95 })
  }
  await ctx.close()
  console.log('video', shot.name, `${frames} frames, scroll ${maxY}px`)
}

const mode = process.argv[2] || 'all'
const onlyIdx = process.argv.indexOf('--only')
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1].split(',') : null
const pick = (list) => (only ? list.filter((s) => only.includes(s.name)) : list)

fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true })
const browser = await chromium.launch()
if (mode === 'stills' || mode === 'all') for (const s of pick(STILLS)) await still(browser, s)
if (mode === 'videos' || mode === 'all') for (const v of pick(VIDEOS)) await video(browser, v)
await browser.close()
