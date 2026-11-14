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
  // Complete-proofs pass (2026-11-14): stills framed on each page's most
  // telling section, not just the top.
  { name: 'ourco-aboutstory-desktop', url: 'https://ourco.net/about/', vp: 'desktop', section: '.about-story', sectionPad: 0 },
  { name: 'ourco-gallery-desktop', url: 'https://ourco.net/about/', vp: 'desktop', section: '.about-gallery', sectionPad: 0 },
  { name: 'ourco-branddirectory-desktop', url: 'https://ourco.net/our-brands/', vp: 'desktop', section: '#brand-directory', sectionPad: 0 },
  { name: 'bristol-refill-desktop', url: 'https://rxbristolokc.com/rx-refill', vp: 'desktop', section: 'form#refill-form', sectionPad: 120 },
  { name: 'bristol-faq-desktop', url: 'https://rxbristolokc.com/faq', vp: 'desktop' },
  { name: 'pinnacle-womenshealth-desktop', url: 'https://pinnacle-rx.com/womens-health', vp: 'desktop' },
  { name: 'pinnacle-refill-mobile', url: 'https://pinnacle-rx.com/rx-refill', vp: 'mobile', section: 'form#refill-form', sectionPad: 90 },
  { name: 'prosource-about-desktop', url: `${PROSOURCE}/about`, vp: 'desktop', section: 'main section.section', sectionPad: 0 },
  { name: 'prosource-dermatology-desktop', url: `${PROSOURCE}/dermatology`, vp: 'desktop' },
  { name: 'prosource-faq-desktop', url: `${PROSOURCE}/faq`, vp: 'desktop' },
  { name: 'prosource-refill-mobile', url: `${PROSOURCE}/rx-refill`, vp: 'mobile', section: 'form#refill-form', sectionPad: 150 },
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
  // Complete-proofs pass (2026-11-14)
  // Painted art is heavy to encode: scrollMax caps the travel so the MP4
  // fits the 3 MiB budget (the full-page passes came out at 8.5 / 6.3 MB).
  { name: 'ourco-about-scroll-desktop', url: 'https://ourco.net/about/', vp: 'desktop', seconds: 10, scrollMax: 1900 },
  { name: 'ourco-services-scroll-desktop', url: 'https://ourco.net/services/', vp: 'desktop', seconds: 9, scrollMax: 1700 },
  {
    // Tap three gases on a phone: tiles select and the fixed quote bar
    // slides up. Nothing is submitted.
    name: 'ourco-gases-quote-mobile', url: 'https://ourco.net/gases/', vp: 'mobile', mode: 'taps',
    scrollTo: '.gas-tile--acetylene', scrollPad: 150, scrollSeconds: 2.4,
    taps: [['.gas-tile--acetylene', 1.6], ['.gas-tile--oxygen', 1.4], ['.gas-tile--argon', 1.4]],
    endHold: 1.6,
  },
  { name: 'bristol-dermatology-scroll-desktop', url: 'https://rxbristolokc.com/dermatology', vp: 'desktop', seconds: 10 },
  { name: 'pinnacle-rxsubmission-scroll-desktop', url: 'https://pinnacle-rx.com/rx-submission', vp: 'desktop', seconds: 9 },
  { name: 'prosource-homepage-scroll-mobile', url: `${PROSOURCE}/`, vp: 'mobile', seconds: 12 },
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
  const fullY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const maxY = shot.scrollMax ? Math.min(shot.scrollMax, fullY) : fullY
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
  if (shot.mode === 'taps') {
    await captureTaps(page, shot, dir)
    await ctx.close()
    console.log('video', shot.name, 'taps')
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

/* Tap clips: an eased scroll to the target, then each tap is filmed with
   CSS/Web Animations slowed to 1/10 through CDP, sampling screenshots
   against PAGE time so transitions play smoothly at real speed in the
   encoded clip. JS-timed motion (rAF) is not slowed. */
async function captureTaps(page, shot, dir) {
  const RATE = 0.1
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Animation.enable')
  let i = 0
  const name = () => path.join(dir, `f${String(i++).padStart(4, '0')}.jpg`)
  const shoot = () => page.screenshot({ path: name(), type: 'jpeg', quality: 95 })
  const hold = (sec) => {
    const last = path.join(dir, `f${String(i - 1).padStart(4, '0')}.jpg`)
    for (let k = 0; k < Math.round(sec * FPS); k++) fs.copyFileSync(last, name())
  }
  // 1) eased scroll to the target
  const targetY = await page.evaluate(([sel, pad]) => {
    const el = document.querySelector(sel)
    return Math.max(0, Math.round(el.getBoundingClientRect().top + scrollY - pad))
  }, [shot.scrollTo, shot.scrollPad ?? 0])
  const hold0 = Math.round(0.5 * FPS)
  const nScroll = Math.round(shot.scrollSeconds * FPS)
  for (let k = 0; k < hold0 + nScroll; k++) {
    const x = Math.min(1, Math.max(0, (k - hold0) / (nScroll - 1)))
    await page.evaluate((y) => {
      scrollTo(0, y)
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    }, Math.round(ease(x) * targetY))
    await shoot()
  }
  // 2) each tap, filmed in slowed page time
  const sdir = path.join(dir, '_samples')
  for (const [sel, seconds] of shot.taps) {
    await cdp.send('Animation.setPlaybackRate', { playbackRate: RATE })
    fs.rmSync(sdir, { recursive: true, force: true })
    fs.mkdirSync(sdir)
    const samples = []
    const t0 = Date.now()
    await page.tap(sel)
    for (let n = 0; ; n++) {
      const pageT = ((Date.now() - t0) / 1000) * RATE
      const file = path.join(sdir, `s${n}.jpg`)
      await page.screenshot({ path: file, type: 'jpeg', quality: 95 })
      samples.push({ t: pageT, file })
      if (pageT >= seconds) break
    }
    for (let k = 0; k < Math.round(seconds * FPS); k++) {
      const t = k / FPS
      const best = samples.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a))
      fs.copyFileSync(best.file, name())
    }
    await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 })
  }
  fs.rmSync(sdir, { recursive: true, force: true })
  hold(shot.endHold ?? 1)
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
