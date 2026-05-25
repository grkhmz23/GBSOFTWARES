import { useMemo, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import {
  STAGES,
  stageWindow,
  useScrollProgress,
  smoothstep,
} from '@/components/core/useScrollProgress'
import Starfield from '@/components/core/Starfield'
import CorePlanet from '@/components/core/CorePlanet'
import OrbitStage from '@/components/core/OrbitStage'
import LabyrinthStage from '@/components/core/LabyrinthStage'
import EngineeringStage from '@/components/core/EngineeringStage'
import LaunchStage from '@/components/core/LaunchStage'
import { scrollToSection } from '@/lib/scroll-to-section'

/**
 * Pinned, scroll-driven cinematic journey.
 *
 * The outer container is intentionally tall (≈500vh) so the inner sticky scene
 * stays pinned while progress drives every layer. Anchor divs scattered through
 * the scroll let the nav jump to specific stages.
 */
export default function CoreJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(containerRef)
  const reducedMotion = useReducedMotion()

  const stageProgress = useMemo(
    () => ({
      surface: stageWindow(progress, STAGES.surface[0], STAGES.surface[1]),
      orbit: stageWindow(progress, STAGES.orbit[0], STAGES.orbit[1]),
      labyrinth: stageWindow(progress, STAGES.labyrinth[0], STAGES.labyrinth[1]),
      engineering: stageWindow(
        progress,
        STAGES.engineering[0],
        STAGES.engineering[1]
      ),
      launch: stageWindow(progress, STAGES.launch[0], STAGES.launch[1]),
    }),
    [progress]
  )

  // Surface intro fades out as we enter orbit
  const surfaceOpacity = 1 - smoothstep(Math.min(1, stageProgress.orbit * 1.8))

  // Stage headline overlay — fades between stages
  const stageTitles = [
    {
      key: 'orbit',
      eyebrow: 'Orbit · 02',
      title: 'What I build.',
      sub: 'Web apps, blockchain systems, mobile, desktop, AI workflows, and MVPs that ship.',
      progress: stageProgress.orbit,
    },
    {
      key: 'labyrinth',
      eyebrow: 'Labyrinth · 03',
      title: 'How I think.',
      sub: 'Strategy → architecture → interface → backend → contracts → testing → deploy → iterate.',
      progress: stageProgress.labyrinth,
    },
    {
      key: 'engineering',
      eyebrow: 'Core · 04',
      title: 'Engineering layers.',
      sub: 'Frontend, backend, blockchain, mobile/desktop, AI — woven into one production stack.',
      progress: stageProgress.engineering,
    },
  ]

  // Static / reduced-motion fallback ----------------------------------------
  if (reducedMotion) {
    return (
      <section className="relative bg-void text-text overflow-hidden" id="core-journey">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.12),rgba(5,5,10,0)_60%)]" />
        </div>
        <div className="relative container-custom py-24 space-y-24">
          <ReducedSurface />
          <ReducedStage
            eyebrow="Orbit"
            title="What I build."
            body="Web apps, blockchain systems, mobile, desktop, AI workflows, and MVPs that ship."
            items={['Web Apps', 'Blockchain', 'Mobile', 'Desktop', 'AI Products', 'MVP → Prod']}
          />
          <ReducedStage
            eyebrow="Labyrinth"
            title="How I think."
            body="A connected process loop — not a checklist."
            items={['Strategy', 'Architecture', 'UI / UX', 'Backend', 'Smart Contracts', 'Testing', 'Deployment', 'Iteration']}
          />
          <ReducedStage
            eyebrow="Core"
            title="Engineering layers."
            body="Frontend, backend, blockchain, mobile, AI — composed into one stack."
            items={['React / Next.js', 'Node / APIs / Postgres', 'Solana · EVM · Anchor', 'iOS · Android · Desktop', 'AI agents · automation']}
          />
          <div className="text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
              Bring the product into reality.
            </h2>
            <p className="text-text-muted mb-6 max-w-xl mx-auto">
              From concept to architecture, interface, backend, blockchain logic and launch.
            </p>
            <button
              onClick={() => scrollToSection('#contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan to-purple text-void font-semibold"
            >
              Contact GB Softwares
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      id="core-journey"
      className="relative w-full"
      style={{ height: '520vh' }}
      aria-label="Into the core — scroll-driven journey through GB Softwares"
    >
      {/* Anchor markers for nav jumps */}
      <div id="build" className="absolute" style={{ top: '20%' }} aria-hidden="true" />
      <div id="process" className="absolute" style={{ top: '45%' }} aria-hidden="true" />
      <div id="capabilities" className="absolute" style={{ top: '70%' }} aria-hidden="true" />

      {/* Pinned cinematic scene */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-void">
        {/* Base gradient — shifts with depth */}
        <div
          className="absolute inset-0 z-[0] transition-colors duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0,240,255,${0.08 + stageProgress.engineering * 0.05}) 0%, rgba(112,0,255,${0.04 + stageProgress.launch * 0.06}) 28%, rgba(5,5,10,1) 75%)`,
          }}
        />

        {/* Starfield (parallax dots) */}
        <Starfield />

        {/* Vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(5,5,10,0) 35%, rgba(5,5,10,0.75) 95%)',
          }}
        />

        {/* Persistent core */}
        <CorePlanet progress={progress} stageProgress={stageProgress} />

        {/* Surface / opening overlay */}
        <div
          className="absolute inset-0 z-[8] grid place-items-center px-6"
          style={{
            opacity: surfaceOpacity,
            pointerEvents: surfaceOpacity > 0.2 ? 'auto' : 'none',
            transform: `translateY(${(1 - surfaceOpacity) * -40}px)`,
          }}
          aria-hidden={surfaceOpacity < 0.05}
        >
          <div className="text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-white/[0.03] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                Into the core
              </span>
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-5 tracking-tight">
              GB <span className="text-gradient">Softwares</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-muted/90 mb-3 max-w-xl mx-auto">
              Web, blockchain, desktop and mobile products built from idea to production.
            </p>
            <p className="text-xs md:text-sm text-text-muted/70 mb-8 max-w-xl mx-auto leading-relaxed">
              I design and build serious software systems: fast MVPs, production web apps,
              crypto infrastructure, mobile apps, desktop tools, and AI-powered products.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => scrollToSection('#contact')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan to-purple text-void font-semibold text-sm shadow-[0_8px_28px_rgba(0,240,255,0.25)] hover:shadow-[0_8px_45px_rgba(0,240,255,0.45)] transition-shadow"
              >
                Start a Project
              </button>
              <button
                onClick={() => scrollToSection('#work')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white text-sm hover:border-cyan/40 hover:text-cyan transition-colors"
              >
                Explore Work
              </button>
            </div>

            {/* Scroll hint */}
            <div className="mt-12 flex flex-col items-center gap-2 text-text-muted/60">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
                Scroll · descend
              </span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Stage layers */}
        <OrbitStage local={stageProgress.orbit} />
        <LabyrinthStage local={stageProgress.labyrinth} />
        <EngineeringStage local={stageProgress.engineering} />
        <LaunchStage local={stageProgress.launch} />

        {/* Stage headline (top-left rail) */}
        <div className="absolute top-24 md:top-28 left-4 md:left-10 z-[9] pointer-events-none max-w-[18rem]">
          {stageTitles.map((s) => {
            const p = s.progress
            // Fade in 0-0.35 and out 0.85-1
            const op = p < 0.05 ? 0 : p > 0.95 ? 0 : Math.min(1, Math.min(p / 0.25, (1 - p) / 0.25))
            if (op < 0.02) return null
            return (
              <div
                key={s.key}
                className="absolute top-0 left-0"
                style={{
                  opacity: op,
                  transform: `translateY(${(1 - op) * 10}px)`,
                  transition: 'opacity 100ms linear',
                }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan mb-2">
                  {s.eyebrow}
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  {s.title}
                </h2>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                  {s.sub}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stage progress rail (right edge) */}
        <StageRail progress={progress} />
      </div>
    </section>
  )
}

/** Vertical rail showing current stage / progress. */
function StageRail({ progress }: { progress: number }) {
  const labels = ['Surface', 'Orbit', 'Labyrinth', 'Core', 'Launch']
  const points = [0.0, 0.18, 0.45, 0.7, 0.92]
  const activeIndex = points.reduce(
    (acc, p, i) => (progress >= p ? i : acc),
    0
  )

  return (
    <div className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-[9] flex-col items-end gap-3 pointer-events-none">
      <div className="relative h-64 w-px bg-white/10">
        <div
          className="absolute top-0 left-0 w-px bg-gradient-to-b from-cyan via-cyan to-purple"
          style={{
            height: `${Math.min(100, progress * 100)}%`,
            boxShadow: '0 0 12px rgba(0,240,255,0.5)',
          }}
        />
      </div>
      <div className="flex flex-col gap-2 -mt-64 pr-3">
        {labels.map((l, i) => (
          <div
            key={l}
            className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${
              i === activeIndex ? 'text-cyan' : 'text-text-muted/50'
            }`}
            style={{ height: '52px' }}
          >
            <span>{l}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex
                  ? 'bg-cyan shadow-[0_0_8px_rgba(0,240,255,0.7)]'
                  : 'bg-white/20'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Reduced-motion fallbacks ---------- */

function ReducedSurface() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-white/[0.03] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
          GB Softwares
        </span>
      </div>
      <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4">
        GB <span className="text-gradient">Softwares</span>
      </h1>
      <p className="text-lg text-text-muted max-w-xl mx-auto">
        Web, blockchain, desktop and mobile products built from idea to production.
      </p>
    </div>
  )
}

function ReducedStage({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow: string
  title: string
  body: string
  items: string[]
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan mb-2">
        {eyebrow}
      </div>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
        {title}
      </h2>
      <p className="text-text-muted mb-6">{body}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="px-3 py-1.5 rounded-full bg-surface border border-cyan/15 text-xs text-cyan/80 font-mono"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}
