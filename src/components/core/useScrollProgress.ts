import { useEffect, useState, type RefObject } from 'react'

/**
 * Tracks progress (0-1) of a scroll container relative to the viewport.
 * 0 when the top of the container hits the top of the viewport;
 * 1 when its bottom reaches the bottom of the viewport.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    let ticking = false

    const update = () => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const total = el.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        const next = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0
        setProgress(next)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return progress
}

/** Map a global progress into a local [0..1] window. Outside returns 0 or 1. */
export function stageWindow(p: number, start: number, end: number) {
  if (p <= start) return 0
  if (p >= end) return 1
  return (p - start) / (end - start)
}

/** Smoothstep easing (Hermite). */
export function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

/** Tent function — rises from 0 to 1 then back to 0 across [start..end]. */
export function tent(p: number, start: number, end: number) {
  if (p <= start || p >= end) return 0
  const mid = (start + end) / 2
  if (p < mid) return smoothstep((p - start) / (mid - start))
  return smoothstep(1 - (p - mid) / (end - mid))
}

export const STAGES = {
  surface: [0.0, 0.12] as const,
  orbit: [0.12, 0.35] as const,
  labyrinth: [0.35, 0.6] as const,
  engineering: [0.6, 0.82] as const,
  launch: [0.82, 1.0] as const,
}
