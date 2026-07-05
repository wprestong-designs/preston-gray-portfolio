/* Phase A: capture Ourco arm → open (mid-grow) → open → close (mid-shrink). */
import { chromium } from 'playwright'
import { mkdir, rm } from 'node:fs/promises'
const BASE = process.env.BASE_URL || 'http://localhost:5199'
const OUT = '/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/se'
const sleep = ms => new Promise(r=>setTimeout(r,ms))
await rm(OUT,{recursive:true,force:true}).catch(()=>{}); await mkdir(OUT,{recursive:true})
const b = await chromium.launch(); const p = await b.newPage()
p.on('pageerror', e=>console.log('[pageerror]', e.message))
await p.setViewportSize({width:1280,height:800})
await p.goto(`${BASE}/`,{waitUntil:'networkidle'})
// arm ourco (hover)
await p.hover('.comp-shape[data-shape="ourco"]', {force:true}); await sleep(500)
await p.screenshot({path:`${OUT}/1-armed.png`})
// open (click) — capture the grow
await p.click('.comp-shape[data-shape="ourco"]')
for (const [i,t] of [80,200,360,520].entries()) { await sleep(i===0?t:t-[80,200,360,520][i-1]); await p.screenshot({path:`${OUT}/2-grow-f${i}-${t}ms.png`}) }
await sleep(900); await p.screenshot({path:`${OUT}/3-open.png`})
// close — capture the shrink (Escape)
await p.keyboard.press('Escape')
for (const [i,t] of [80,220,380].entries()) { await sleep(i===0?t:t-[80,220,380][i-1]); await p.screenshot({path:`${OUT}/4-close-f${i}-${t}ms.png`}) }
await sleep(700); await p.screenshot({path:`${OUT}/5-closed.png`})
await b.close(); console.log('DONE', OUT)
