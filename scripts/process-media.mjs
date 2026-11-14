/*
 * V2 media processor — raw capture in, panel-ready triplet out.
 *
 *   node scripts/process-media.mjs <input...> [--ss <sec>] [--t <sec>] [--outdir <dir>]
 *                                  [--width <px>] [--fps <n>]
 *
 * <input> is a video file OR a directory of frames (f0000.jpg, f0001.jpg, …
 * as written by scripts/reshoot-capture.mjs), read at --fps (default 30).
 *
 * Per input emits, into src/assets/media/ by default:
 *   name.mp4         H.264 (CRF 21 → steps up only if needed), +faststart, no audio
 *   name.webm        VP9 (CRF 30 → steps up only if needed), no audio
 *   name-poster.jpg  frame at 0.5s (first meaningful frame)
 * Scale: --width resizes to that width (lanczos); otherwise long edge ≤1920 /
 * short ≤1080, never upscaled.
 *
 * Spec guards (projects.js video checklist):
 *   · refuses clips over 12s unless --ss/--t trim the excess
 *   · the 3MB budget is enforced: if an encode lands over it, the CRF steps
 *     up one at a time (H.264 ≤28, VP9 ≤36 — the old fixed values) until it
 *     fits; the final CRF is printed
 *
 * Raw captures live in gitignored Media/ — only these outputs enter the repo.
 * Requires ffmpeg + ffprobe on PATH (macOS: `brew install ffmpeg`, or the
 * `ffmpeg-static` npm binary on PATH).
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
let width = null
let fps = 30
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ss') ss = args[++i]
  else if (args[i] === '--t') t = args[++i]
  else if (args[i] === '--outdir') outdir = args[++i]
  else if (args[i] === '--width') width = parseInt(args[++i], 10)
  else if (args[i] === '--fps') fps = parseInt(args[++i], 10)
  else inputs.push(args[i])
}
const H264_CRF = [21, 28]
const VP9_CRF = [30, 36]

if (inputs.length === 0) {
  console.error('usage: node scripts/process-media.mjs <input...> [--ss sec] [--t sec] [--outdir dir]')
  process.exit(1)
}

const have = (bin) => spawnSync(bin, ['-version'], { stdio: 'ignore' }).status === 0
if (!have('ffmpeg') || !have('ffprobe')) {
  console.error('ffmpeg/ffprobe not found on PATH. Install with: brew install ffmpeg')
  console.error('(or put the ffmpeg-static npm binary on PATH)')
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
  const isFrames = fs.statSync(input).isDirectory()
  const base = path
    .basename(input, isFrames ? '' : path.extname(input))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const duration = isFrames
    ? fs.readdirSync(input).filter((f) => /^f\d+\.(jpe?g|png)$/.test(f)).length / fps
    : probeSeconds(input)
  const effective = t ? Math.min(parseFloat(t), duration) : duration - (ss ? parseFloat(ss) : 0)
  console.log(`\n${input} — ${duration.toFixed(1)}s source${trimArgs.length ? `, ${effective.toFixed(1)}s after trim` : ''}`)
  if (effective > MAX_SECONDS + 0.4) {
    console.error(
      `  REFUSED: ${effective.toFixed(1)}s exceeds the ${MAX_SECONDS}s spec — ` +
        'trim to the best ≤12s first (--ss/--t), see the manifest trim list.',
    )
    process.exit(1)
  }

  const ext = isFrames ? path.extname(fs.readdirSync(input).find((f) => /^f\d+\./.test(f))) : ''
  const inArgs = isFrames ? ['-framerate', String(fps), '-i', path.join(input, `f%04d${ext}`)] : ['-i', input]
  const vf = width ? `scale=${width}:-2:flags=lanczos` : SCALE
  const outMp4 = path.join(outdir, `${base}.mp4`)
  const outWebm = path.join(outdir, `${base}.webm`)
  const outPoster = path.join(outdir, `${base}-poster.jpg`)

  const fit = (out, [lo, hi], encode) => {
    for (let crf = lo; crf <= hi; crf++) {
      run('ffmpeg', ['-y', ...trimArgs, ...inArgs, '-vf', vf, '-pix_fmt', 'yuv420p', ...encode(crf), '-an', out])
      if (fs.statSync(out).size <= TARGET_BYTES || crf === hi) return crf
    }
  }
  const crfMp4 = fit(outMp4, H264_CRF, (crf) => ['-c:v', 'libx264', '-crf', String(crf), '-preset', 'slow', '-profile:v', 'high', '-movflags', '+faststart'])
  const crfWebm = fit(outWebm, VP9_CRF, (crf) => ['-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2'])
  run('ffmpeg', ['-y', ...trimArgs, ...inArgs, '-ss', '0.5', '-frames:v', '1', '-vf', vf, '-q:v', '2', outPoster])

  const crfs = { [outMp4]: crfMp4, [outWebm]: crfWebm }
  for (const f of [outMp4, outWebm, outPoster]) {
    const size = fs.statSync(f).size
    const over = size > TARGET_BYTES && !f.endsWith('.jpg')
    const crf = crfs[f] != null ? `  CRF ${crfs[f]}` : ''
    console.log(`  ${path.basename(f).padEnd(44)} ${mb(size).padStart(7)} MB${crf}${over ? '  ⚠ over the 3MB target even at the max CRF — trim tighter' : ''}`)
  }
}

console.log('\nDone. Update the manifest budget section with these sizes before the wiring pass.')
