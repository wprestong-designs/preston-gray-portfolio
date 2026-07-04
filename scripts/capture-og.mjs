/*
 * P5 — OG image capture. Screenshots the poster in its reduced-motion
 * frame (static Registration composition, canonical colorway — the brand-
 * stable register) at 1200×630 into public/og.png.
 *
 * Usage: with a dev server running →  node scripts/capture-og.mjs [url]
 * Rerun whenever the Registration comp or canonical palette changes.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9444
const url = process.argv[2] ?? 'http://localhost:5173/'
const OUT = path.join('public', 'og.png')

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'og-capture-'))
const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--headless=new',
    '--window-size=1200,630',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ],
  { stdio: 'ignore' },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* retry */
    }
    await sleep(200)
  }
  throw new Error('no CDP target — is Chrome available?')
}

const ws = new WebSocket(await getWsUrl())
await new Promise((r) => {
  ws.onopen = r
})
let msgId = 0
const pending = new Map()
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++msgId
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: 1200,
  height: 630,
  deviceScaleFactor: 1,
  mobile: false,
})
// Reduced motion pins the static Registration state + canonical colorway
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
})
await send('Page.navigate', { url })
await sleep(3500) // fonts + layout settle

const shot = await send('Page.captureScreenshot', { format: 'png' })
fs.writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'))
const kb = Math.round(fs.statSync(OUT).size / 1024)
console.log(`wrote ${OUT} (${kb} KB, 1200×630, Registration/canonical)`)
chrome.kill()
process.exit(0)
