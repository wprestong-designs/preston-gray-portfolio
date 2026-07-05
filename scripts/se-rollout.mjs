import { chromium } from 'playwright'
import { mkdir, rm } from 'node:fs/promises'
const BASE='http://localhost:5199', OUT='/Users/prestongray/Projects/preston-gray-portfolio/scratchpad/se-rollout'
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
await rm(OUT,{recursive:true,force:true}).catch(()=>{}); await mkdir(OUT,{recursive:true})
const b=await chromium.launch(); const p=await b.newPage(); await p.setViewportSize({width:1280,height:800})
// blank check across a live cycle (morph-source change must not break rendering)
await p.goto(`${BASE}/`,{waitUntil:'networkidle'})
let blanks=0, frames=30
for(let i=0;i<frames;i++){ const v=await p.evaluate(()=>{const s=document.querySelector('.comp__stage'); if(!s)return 6; let n=0; s.querySelectorAll('.comp-shape').forEach(el=>{const r=el.getBoundingClientRect(); if(r.width>4&&r.height>4)n++}); return n}); if(v<6)blanks++; await sleep(300) }
console.log('cycle blank frames (<6 shapes):', blanks, '/', frames)
// arm + open each project, capture open + read brand fill + title colour
for(const id of ['summit','bristol','pinnacle','prosource','fieldintel']){
  await p.goto(`${BASE}/`,{waitUntil:'networkidle'})
  await p.hover(`.comp-shape[data-shape="${id}"]`,{force:true}); await sleep(400)
  await p.click(`.comp-shape[data-shape="${id}"]`); await sleep(1000)
  await p.screenshot({path:`${OUT}/open-${id}.png`})
  const info=await p.evaluate(()=>{const o=document.querySelector('.overlay'); const m=document.querySelector('.ov-monument'); return {ov:o&&getComputedStyle(o).getPropertyValue('--ov').trim(), title:m&&getComputedStyle(m).color}})
  console.log(id, JSON.stringify(info))
  await p.keyboard.press('Escape'); await sleep(700)
}
await b.close(); console.log('DONE')
