import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ExternalLink, ChevronUp } from 'lucide-react'
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, rowRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={rowRef}
      className="border-b border-border-color last:border-b-0"
    >
      <button
        onClick={onToggle}
        className={`w-full py-6 flex items-center gap-4 md:gap-8 text-left group transition-all duration-300 ${
          isExpanded ? 'text-cyan' : 'text-text-muted hover:text-white'
        }`}
      >
        <span className="font-mono text-sm w-8 flex-shrink-0 opacity-50">
          {index}
        </span>

        <span className="font-heading text-lg md:text-xl font-semibold flex-grow">
          {title}
        </span>

        <div className="hidden md:flex gap-2 flex-shrink-0">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-surface text-text-muted border-border-color text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <span className="font-mono text-sm hidden sm:block flex-shrink-0 w-16 text-right">
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
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-8 pl-12 md:pl-16 pr-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                {t('work.problem')}
              </h4>
              <p className="text-sm text-text leading-relaxed">{problem}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                {t('work.approach')}
              </h4>
              <p className="text-sm text-text leading-relaxed">{approach}</p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                {t('work.outcome')}
              </h4>
              <p className="text-sm text-text leading-relaxed">{outcome}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border-color flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-surface text-xs text-cyan font-mono"
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
                className="flex items-center gap-2 text-sm text-cyan hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {t('work.viewProject')}
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
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const caseStudies = [
    {
      title: t('work.projects.psol.title'),
      tags: t('work.projects.psol.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.psol.problem'),
      approach: t('work.projects.psol.approach'),
      outcome: t('work.projects.psol.outcome'),
      stack: ['Solana', 'Rust', 'Anchor', 'ZK-Proofs', 'React'],
      link: 'https://psolprotocol.org',
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
      title: t('work.projects.trailblazer.title'),
      tags: t('work.projects.trailblazer.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.trailblazer.problem'),
      approach: t('work.projects.trailblazer.approach'),
      outcome: t('work.projects.trailblazer.outcome'),
      stack: ['Solana', 'Python', 'AI/ML', 'NLP', 'React'],
      link: 'https://trailblazeragent.fun',
    },
    {
      title: t('work.projects.solAudit.title'),
      tags: t('work.projects.solAudit.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.solAudit.problem'),
      approach: t('work.projects.solAudit.approach'),
      outcome: t('work.projects.solAudit.outcome'),
      stack: ['Solana', 'Rust', 'AI/ML', 'GitHub API', 'Next.js'],
      link: 'https://solaudit.fun',
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
      title: t('work.projects.splitguard.title'),
      tags: t('work.projects.splitguard.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.splitguard.problem'),
      approach: t('work.projects.splitguard.approach'),
      outcome: t('work.projects.splitguard.outcome'),
      stack: ['Solana', 'Rust', 'Anchor', 'DeFi', 'React'],
      link: 'https://splitguard.fun',
    },
    {
      title: t('work.projects.liveDrops.title'),
      tags: t('work.projects.liveDrops.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.liveDrops.problem'),
      approach: t('work.projects.liveDrops.approach'),
      outcome: t('work.projects.liveDrops.outcome'),
      stack: ['Solana', 'Rust', 'Anchor', 'WebRTC', 'Next.js'],
      link: 'https://livedrops.fun',
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
      title: t('work.projects.funpumpfun.title'),
      tags: t('work.projects.funpumpfun.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.funpumpfun.problem'),
      approach: t('work.projects.funpumpfun.approach'),
      outcome: t('work.projects.funpumpfun.outcome'),
      stack: ['Solana', 'React', 'Game Design', 'Tailwind', 'TypeScript'],
      link: 'https://funpumpfun.fun',
    },
    {
      title: t('work.projects.noCrying.title'),
      tags: t('work.projects.noCrying.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.noCrying.problem'),
      approach: t('work.projects.noCrying.approach'),
      outcome: t('work.projects.noCrying.outcome'),
      stack: ['Next.js', 'Solana', 'Tailwind', 'API Integration', 'TypeScript'],
      link: 'https://nocrying.fun',
    },
    {
      title: t('work.projects.scratchNSol.title'),
      tags: t('work.projects.scratchNSol.tags', { returnObjects: true }) as string[],
      year: '2024',
      problem: t('work.projects.scratchNSol.problem'),
      approach: t('work.projects.scratchNSol.approach'),
      outcome: t('work.projects.scratchNSol.outcome'),
      stack: ['Solana', 'Rust', 'Anchor', 'VRF', 'React'],
      link: 'https://scratchnsol.fun',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="work"
    >
      <div className="container-custom">
        <div ref={headerRef} className="mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            {t('work.badge')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {t('work.title')}
          </h2>
          <p className="text-text-muted max-w-2xl">
            {t('work.subtitle')}
          </p>
        </div>

        <div className="bg-surface/30 border border-border-color rounded-xl overflow-hidden">
          {caseStudies.map((study, index) => (
            <CaseStudyRow
              key={index}
              index={String(index + 1).padStart(2, '0')}
              {...study}
              isExpanded={expandedIndex === index}
              onToggle={() => toggleExpand(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
