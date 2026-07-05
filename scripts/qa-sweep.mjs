/* §F QA sweep: console-error + axe-core a11y across routes/overlays. */
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
const BASE = process.env.BASE_URL || 'http://localhost:5199'
const axe = await readFile('node_modules/axe-core/axe.min.js', 'utf8')
const b = await chromium.launch()
const results = []
const run = async (label, setup) => {
  const p = await b.newPage()
  const errs = []
  p.on('console', m => m.type()==='error' && errs.push(m.text().slice(0,120)))
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.slice(0,120)))
  await p.setViewportSize({ width: 1280, height: 900 })
  await setup(p)
  await new Promise(r=>setTimeout(r,600))
  await p.evaluate(axe)
  const a = await p.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'] })
    return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length }))
  })
  results.push({ label, consoleErrors: errs, violations: a })
  await p.close()
}
await run('/', p => p.goto(`${BASE}/`, {waitUntil:'networkidle'}))
await run('/work/', p => p.goto(`${BASE}/work/`, {waitUntil:'networkidle'}))
await run('/small-business/', p => p.goto(`${BASE}/small-business/`, {waitUntil:'networkidle'}))
await run('about', async p => { await p.goto(`${BASE}/`, {waitUntil:'networkidle'}); await p.click('.poster__brand'); await new Promise(r=>setTimeout(r,900)) })
await run('contact', async p => { await p.goto(`${BASE}/`, {waitUntil:'networkidle'}); await p.click('#contact-util'); await new Promise(r=>setTimeout(r,700)) })
await run('proof-overlay', async p => { await p.goto(`${BASE}/#proof-summit`, {waitUntil:'networkidle'}); await new Promise(r=>setTimeout(r,900)) })
await b.close()
for (const r of results) {
  const vio = r.violations.filter(v=>['serious','critical'].includes(v.impact))
  console.log(`\n[${r.label}]  console-errors: ${r.consoleErrors.length}  a11y-violations: ${r.violations.length} (serious/critical: ${vio.length})`)
  r.consoleErrors.slice(0,4).forEach(e=>console.log('   ERR', e))
  r.violations.forEach(v=>console.log(`   a11y ${v.impact} · ${v.id} ×${v.n}`))
}
