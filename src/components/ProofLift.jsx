/*
 * Sticker micro-interactions (spec §3) — one treatment, applied identically
 * everywhere. No variants.
 *
 * <ProofLift> — the "proof lift": hover / focus-within translates the
 * artifact -2px/-2px and swaps its shadow for a hard 3px offset in the
 * project color (ink for neutral elements). No blur — paper, not glow.
 * Pure CSS state (see .proof-lift rules); 150ms in / 250ms out; under
 * prefers-reduced-motion the shadow still appears but nothing moves.
 *
 * <StampWobble> — rubber-stamp badges get a stiff-spring wobble on hover.
 */
import { motion, useReducedMotion } from 'motion/react'

export function ProofLift({ color = 'var(--ink)', radius, className = '', children }) {
  const style = { '--lift-color': color }
  if (radius) style['--lift-radius'] = radius
  return (
    <div className={`proof-lift ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

export function StampWobble({ className = '', baseRotate = -2, children, ...rest }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.span
      className={className}
      style={{ rotate: baseRotate, display: 'inline-block' }}
      whileHover={reducedMotion ? undefined : { rotate: -3, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      {...rest}
    >
      {children}
    </motion.span>
  )
}
