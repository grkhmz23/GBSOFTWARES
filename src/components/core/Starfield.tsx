import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Lightweight canvas starfield — parallax dots that drift slowly.
 * Uses a single rAF loop, pauses when off-screen.
 */
export default function Starfield({ density = 0.00012 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let visible = true
    let stars: Array<{ x: number; y: number; z: number; r: number; tw: number }> = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.floor(window.innerWidth * window.innerHeight * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: 0.3 + Math.random() * 0.7,
        r: 0.4 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2,
      }))
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const draw = () => {
      if (!visible) {
        raf = requestAnimationFrame(draw)
        return
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const t = performance.now() / 1000

      for (const s of stars) {
        if (!reducedMotion) {
          s.tw += 0.02
          // Slow vertical drift simulating descent
          s.y += 0.04 * s.z
          if (s.y > window.innerHeight + 4) s.y = -4
        }
        const a = 0.4 + 0.4 * Math.sin(s.tw + t * 0.6)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 220, 255, ${a * s.z})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [density, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-[1] opacity-70"
    />
  )
}
