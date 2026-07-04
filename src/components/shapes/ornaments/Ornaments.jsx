/*
 * Ornament tiles (Workstream S) — five decorative SVG tiles from Preston's
 * source art, optimized (root width/height stripped, IDs namespaced) and
 * tokenized so every fill is a theme role (S0). Purely decorative:
 * aria-hidden, non-interactive, never focusable, no door semantics.
 *
 * Fills use var(--role), so a tile re-themes with [data-theme] like the rest
 * of the kit. IDs are namespaced by tile at build time AND uniquified per
 * instance here (useId) so multiple inlines of the same tile on one page
 * never collide on url(#id)/href references.
 */
import { useId } from 'react'
import blocks from './blocks.svg?raw'
import vortex from './vortex.svg?raw'
import burst from './burst.svg?raw'
import arch from './arch.svg?raw'
import proofstrips from './proofstrips.svg?raw'

const TILES = { blocks, vortex, burst, arch, proofstrips }

export function Ornament({ tile, size = 200, className, style, ...rest }) {
  const raw = TILES[tile]
  const uid = useId().replace(/:/g, '')
  if (!raw) return null
  // Every id/ref was S0-namespaced as `${tile}-…`; make it instance-unique.
  const svg = raw.replaceAll(`${tile}-`, `${tile}-${uid}-`)
  return (
    <span
      className={['ornament', `ornament--${tile}`, className].filter(Boolean).join(' ')}
      style={{ display: 'inline-block', width: size, height: size, lineHeight: 0, ...style }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
    />
  )
}
