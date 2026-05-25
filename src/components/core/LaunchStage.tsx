import { ArrowRight } from 'lucide-react'
import { smoothstep } from './useScrollProgress'
import { scrollToSection } from '@/lib/scroll-to-section'

interface Props {
  local: number
}

export default function LaunchStage({ local }: Props) {
  const entry = smoothstep(Math.min(1, local * 1.6))

  return (
    <div
      className="absolute inset-0 grid place-items-center pointer-events-none z-[7] px-4"
      style={{ opacity: entry }}
      aria-hidden={entry < 0.05}
    >
      <div
        className="relative max-w-2xl text-center pointer-events-auto"
        style={{
          transform: `translateY(${(1 - entry) * 24}px)`,
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-cyan/30 text-cyan text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          Launch
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.05] mb-5">
          Bring the product <br className="hidden sm:block" />
          <span className="text-gradient">into reality.</span>
        </h2>
        <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          From concept to architecture, interface, backend, blockchain logic and launch.
          Tell me what you're building — I'll tell you how I'd ship it.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => scrollToSection('#contact')}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan to-purple text-void font-semibold text-sm shadow-[0_8px_30px_rgba(0,240,255,0.25)] hover:shadow-[0_8px_45px_rgba(0,240,255,0.5)] transition-shadow"
          >
            Contact GB Softwares
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection('#work')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white text-sm hover:border-cyan/40 hover:text-cyan transition-colors"
          >
            See Real Work
          </button>
        </div>
      </div>
    </div>
  )
}
