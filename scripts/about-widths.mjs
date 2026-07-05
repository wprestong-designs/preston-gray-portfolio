import { chromium } from 'playwright'; import { readFile } from 'node:fs/promises'
const OUT='/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/about-widths'
import { mkdir, rm } from 'node:fs/promises'; await rm(OUT,{recursive:true,force:true}).catch(()=>{}); await mkdir(OUT,{recursive:true})
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8')
const b=await chromium.launch()
for(const [w,h] of [[1440,900],[1024,768],[768,900],[390,844]]){
  const p=await b.newPage(); await p.setViewportSize({width:w,height:h})
  await p.goto('http://localhost:5199/',{waitUntil:'networkidle'})
  await p.click('.poster__brand'); await new Promise(r=>setTimeout(r,900))
  await p.evaluate(()=>document.querySelector('.about-thread')?.scrollIntoView({block:'center',inline:'center'})); await new Promise(r=>setTimeout(r,400))
  await p.screenshot({path:`${OUT}/about-${w}.png`})
  const info=await p.evaluate(()=>{const t=document.querySelector('.about-thread'); const cs=t&&getComputedStyle(t); const pr=document.querySelector('.about-photo--portrait img')?.getBoundingClientRect(); const mc=document.querySelector('.about-photo--machu img')?.getBoundingClientRect(); return {flexDir:cs?.flexDirection, portraitW:Math.round(pr?.width), machuW:Math.round(mc?.width)}})
  console.log(`${w}:`, JSON.stringify(info))
  if(w===1440){ await p.evaluate(axe); const v=await p.evaluate(async()=>{const r=await window.axe.run(document,{resultTypes:['violations']}); return r.violations.length}); console.log('axe violations:', v) }
  await p.close()
}
await b.close()
