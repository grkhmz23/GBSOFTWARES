import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ChevronUp, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

gsap.registerPlugin(ScrollTrigger)

interface CaseStudyProps {
  index: string
  title: string
  tags: string[]
  year: string
  problem: string
  approach: string
  outcome: string
  stack: string[]
  link?: string | null
  isExpanded: boolean
  onToggle: () => void
}

function CaseStudyRow({
  index,
  title,
  tags,
  year,
  problem,
  approach,
  outcome,
  stack,
  link,
  isExpanded,
  onToggle,
}: CaseStudyProps) {
  const { t } = useTranslation()
  const rowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, rowRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rowRef} className="border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`case-study-content-${index}`}
        className={`w-full py-6 flex items-center gap-4 md:gap-8 text-left group transition-colors duration-300 ${
          isExpanded ? 'text-cyan' : 'text-text-muted hover:text-white'
        }`}
      >
        <span className="font-mono text-sm w-8 flex-shrink-0 opacity-50">{index}</span>

        <span className="font-heading text-base sm:text-lg md:text-xl font-semibold flex-grow min-w-0 truncate">
          {title}
        </span>

        <div className="hidden md:flex gap-2 flex-shrink-0">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-white/[0.03] text-text-muted border-white/10 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <span className="font-mono text-sm hidden sm:block flex-shrink-0 w-16 text-right opacity-60">
          {year}
        </span>

        <span className="flex-shrink-0 w-8 flex justify-end">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
        </span>
      </button>

      <div
        id={`case-study-content-${index}`}
        ref={contentRef}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-8 pl-10 sm:pl-12 md:pl-16 pr-4">
          <div className="flex flex-wrap gap-2 md:hidden mb-4">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-white/[0.03] text-text-muted border-white/10 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan/70 mb-2">
                {t('work.problem', 'Problem')}
              </h4>
              <p className="text-sm text-text leading-relaxed">{problem}</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan/70 mb-2">
                {t('work.approach', 'Approach')}
              </h4>
              <p className="text-sm text-text leading-relaxed">{approach}</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan/70 mb-2">
                {t('work.outcome', 'Outcome')}
              </h4>
              <p className="text-sm text-text leading-relaxed">{outcome}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-white/[0.03] text-xs text-cyan font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${title} (opens in new tab)`}
                className="flex items-center gap-2 text-sm text-cyan hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View Project
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const toggle = (i: number) => setExpandedIndex(expandedIndex === i ? null : i)

  const caseStudies = [
    {
      title: t('work.projects.whiteProtocol.title'),
      tags: t('work.projects.whiteProtocol.tags', { returnObjects: true }) as string[],
      year: '2025',
      problem: t('work.projects.whiteProtocol.problem'),
      approach: t('work.projects.whiteProtocol.approach'),
      outcome: t('work.projects.whiteProtocol.outcome'),
      stack: ['Solana', 'Rust', 'Solidity', 'ZK-Proofs', 'EVM', 'React'],
      link: 'https://www.thewhiteprotocol.com/',
    },
    {
      title: t('work.projects.founderArena.title'),
      tags: t('work.projects.founderArena.tags', { returnObjects: true }) as string[],
      year: '2025',
      problem: t('work.projects.founderArena.problem'),
      approach: t('work.projects.founderArena.approach'),
      outcome: t('work.projects.founderArena.outcome'),
      stack: ['Next.js', 'TypeScript', 'AI/ML', 'React', 'Tailwind'],
      link: 'https://www.founderarena.xyz',
    },
    {
      title: t('work.projects.swarpPay.title'),
      tags: t('work.projects.swarpPay.tags', { returnObjects: true }) as string[],
      year: '2025',
      problem: t('work.projects.swarpPay.problem'),
      approach: t('work.projects.swarpPay.approach'),
      outcome: t('work.projects.swarpPay.outcome'),
      stack: ['Next.js', 'Tailwind', 'Framer Motion', 'TypeScript'],
      link: 'https://swarppay.com',
    },
    {
      title: t('work.projects.humanRail.title'),
      tags: t('work.projects.humanRail.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.humanRail.problem'),
      approach: t('work.projects.humanRail.approach'),
      outcome: t('work.projects.humanRail.outcome'),
      stack: ['Solana', 'Rust', 'Anchor', 'SBT', 'Next.js'],
      link: 'https://humanrail.org',
    },
    {
      title: t('work.projects.maniaAtelier.title'),
      tags: t('work.projects.maniaAtelier.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.maniaAtelier.problem'),
      approach: t('work.projects.maniaAtelier.approach'),
      outcome: t('work.projects.maniaAtelier.outcome'),
      stack: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind', 'PostgreSQL'],
      link: 'https://maniaratelier.com',
    },
    {
      title: t('work.projects.swarpFoundation.title'),
      tags: t('work.projects.swarpFoundation.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.swarpFoundation.problem'),
      approach: t('work.projects.swarpFoundation.approach'),
      outcome: t('work.projects.swarpFoundation.outcome'),
      stack: ['Next.js', 'TypeScript', 'Tailwind', 'CMS', 'Web3'],
      link: 'https://swarpfoundation.com',
    },
    {
      title: t('work.projects.simfi.title'),
      tags: t('work.projects.simfi.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.simfi.problem'),
      approach: t('work.projects.simfi.approach'),
      outcome: t('work.projects.simfi.outcome'),
      stack: ['Solana', 'React', 'WebSocket', 'Trading Engine', 'TypeScript'],
      link: 'https://simfi.fun',
    },
    {
      title: t('work.projects.desertRoseGin.title'),
      tags: t('work.projects.desertRoseGin.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.desertRoseGin.problem'),
      approach: t('work.projects.desertRoseGin.approach'),
      outcome: t('work.projects.desertRoseGin.outcome'),
      stack: ['Next.js', 'Shopify', 'Framer Motion', 'Tailwind', 'CMS'],
      link: 'https://www.thedesertrosegin.com/',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-24 md:py-32 overflow-hidden scroll-mt-24"
    >
      {/* Atmospheric backdrop continuing the cosmic theme */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.05),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div ref={headerRef} className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-white/[0.03] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
              Real artifacts · 05
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Selected work, <span className="text-gradient">shipped to production.</span>
          </h2>
          <p className="text-text-muted">
            Eight real systems — privacy protocols, simulation games, fintech, identity,
            commerce, trading. Tap any row to open the build notes.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-xl overflow-hidden">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,240,255,0.15), transparent 25%, transparent 75%, rgba(112,0,255,0.15))',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              padding: '1px',
              borderRadius: 'inherit',
            }}
          />
          {caseStudies.map((study, i) => (
            <CaseStudyRow
              key={i}
              index={String(i + 1).padStart(2, '0')}
              {...study}
              isExpanded={expandedIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
