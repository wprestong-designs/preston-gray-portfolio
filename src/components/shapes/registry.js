/*
 * registry.js — name → component map + the universal-connector list.
 * Kept separate from index.jsx so that file exports only components
 * (react-refresh) and so PatternField / the styleguide can iterate shapes
 * by name.
 */
import {
  Squiggle,
  ConfettiTriangle,
  HalfCircle,
  Zigzag,
  Checkerboard,
  DotCluster,
  DiagonalSlash,
  Starburst,
  Sparkle,
  RainbowArc,
  PixelCluster,
  Splat,
} from './index.jsx'

export const SHAPES = {
  squiggle: Squiggle,
  triangle: ConfettiTriangle,
  halfCircle: HalfCircle,
  zigzag: Zigzag,
  checkerboard: Checkerboard,
  dotCluster: DotCluster,
  diagonalSlash: DiagonalSlash,
  starburst: Starburst,
  sparkle: Sparkle,
  rainbowArc: RainbowArc,
  pixelCluster: PixelCluster,
  splat: Splat,
}

/* The connectors every theme may use (§5.3), in a stable display order. */
export const CONNECTORS = [
  'squiggle',
  'triangle',
  'halfCircle',
  'zigzag',
  'checkerboard',
  'dotCluster',
  'diagonalSlash',
  'starburst',
]
