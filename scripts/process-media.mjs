/*
 * V2 media processor — raw capture in, panel-ready triplet out.
 *
 *   node scripts/process-media.mjs <input...> [--ss <sec>] [--t <sec>] [--outdir <dir>]
 *
 * Per input emits, into src/assets/media/ by default:
 *   name.mp4         H.264, CRF 28, long edge ≤1920 / short ≤1080, +faststart, no audio
 *   name.webm        VP9 (CRF 36), same scale, no audio
 *   name-poster.jpg  frame at 0.5s (first meaningful frame)
 *
 * Spec guards (projects.js video checklist):
 *   · refuses clips over 12s unless --ss/--t trim the excess
 *   · prints every output size; warns over the 3MB target
 *
 * Raw captures live in gitignored Media/ — only these outputs enter the repo.
 * Requires ffmpeg + ffprobe on PATH (winget install Gyan.FFmpeg).
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const MAX_SECONDS = 12
const TARGET_BYTES = 3 * 1024 * 1024
// long edge ≤1920, short edge ≤1080, even dimensions (encoder requirement)
const SCALE =
  "scale='trunc(iw*min(1,min(1920/iw,1080/ih))/2)*2':'trunc(ih*min(1,min(1920/iw,1080/ih))/2)*2'"

const args = process.argv.slice(2)
const inputs = []
let ss = null
let t = null
let outdir = path.join('src', 'assets', 'media')
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ss') ss = args[++i]
  else if (args[i] === '--t') t = args[++i]
  else if (args[i] === '--outdir') outdir = args[++i]
  else inputs.push(args[i])
}

if (inputs.length === 0) {
  console.error('usage: node scripts/process-media.mjs <input...> [--ss sec] [--t sec] [--outdir dir]')
  process.exit(1)
}

const have = (bin) => spawnSync(bin, ['-version'], { stdio: 'ignore' }).status === 0
if (!have('ffmpeg') || !have('ffprobe')) {
  console.error('ffmpeg/ffprobe not found on PATH. Install with: winget install Gyan.FFmpeg')
  console.error('(then reopen the terminal so PATH refreshes)')
  process.exit(1)
}

fs.mkdirSync(outdir, { recursive: true })

const run = (bin, argv) => {
  const res = spawnSync(bin, argv, { encoding: 'utf8' })
  if (res.status !== 0) {
    console.error(`${bin} failed:\n${res.stderr?.slice(-800)}`)
    process.exit(1)
  }
  return res.stdout
}

const probeSeconds = (file) =>
  parseFloat(
    run('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      file,
    ]),
  )

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2)
const trimArgs = [...(ss ? ['-ss', ss] : []), ...(t ? ['-t', t] : [])]

for (const input of inputs) {
  if (!fs.existsSync(input)) {
    console.error(`missing: ${input}`)
    process.exit(1)
  }
  const base = path
    .basename(input, path.extname(input))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const duration = probeSeconds(input)
  const effective = t ? Math.min(parseFloat(t), duration) : duration - (ss ? parseFloat(ss) : 0)
  console.log(`\n${input} — ${duration.toFixed(1)}s source${trimArgs.length ? `, ${effective.toFixed(1)}s after trim` : ''}`)
  if (effective > MAX_SECONDS + 0.4) {
    console.error(
      `  REFUSED: ${effective.toFixed(1)}s exceeds the ${MAX_SECONDS}s spec — ` +
        'trim to the best ≤12s first (--ss/--t), see the manifest trim list.',
    )
    process.exit(1)
  }

  const outMp4 = path.join(outdir, `${base}.mp4`)
  const outWebm = path.join(outdir, `${base}.webm`)
  const outPoster = path.join(outdir, `${base}-poster.jpg`)

  run('ffmpeg', ['-y', ...trimArgs, '-i', input, '-vf', SCALE, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', '-an', outMp4])
  run('ffmpeg', ['-y', ...trimArgs, '-i', input, '-vf', SCALE, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-an', outWebm])
  run('ffmpeg', ['-y', ...trimArgs, '-i', input, '-ss', '0.5', '-frames:v', '1', '-vf', SCALE, '-q:v', '3', outPoster])

  for (const f of [outMp4, outWebm, outPoster]) {
    const size = fs.statSync(f).size
    const over = size > TARGET_BYTES && !f.endsWith('.jpg')
    console.log(`  ${path.basename(f).padEnd(44)} ${mb(size).padStart(7)} MB${over ? '  ⚠ over the 3MB target — trim tighter or bump CRF' : ''}`)
  }
}

console.log('\nDone. Update the manifest budget section with these sizes before the wiring pass.')
