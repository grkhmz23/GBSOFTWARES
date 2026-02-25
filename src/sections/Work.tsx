import { useEffect, useRef, useState } from 'react'
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
      {/* Main row */}
      <button
        onClick={onToggle}
        className={`w-full py-6 flex items-center gap-4 md:gap-8 text-left group transition-all duration-300 ${
          isExpanded ? 'text-cyan' : 'text-text-muted hover:text-white'
        }`}
      >
        {/* Index */}
        <span className="font-mono text-sm w-8 flex-shrink-0 opacity-50">
          {index}
        </span>

        {/* Title */}
        <span className="font-heading text-lg md:text-xl font-semibold flex-grow">
          {title}
        </span>

        {/* Tags (hidden on mobile) */}
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

        {/* Year */}
        <span className="font-mono text-sm hidden sm:block flex-shrink-0 w-16 text-right">
          {year}
        </span>

        {/* Arrow / Toggle */}
        <span className="flex-shrink-0 w-8 flex justify-end">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
        </span>
      </button>

      {/* Expanded content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-8 pl-12 md:pl-16 pr-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Problem */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                Problem
              </h4>
              <p className="text-sm text-text leading-relaxed">{problem}</p>
            </div>

            {/* Approach */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                Approach
              </h4>
              <p className="text-sm text-text leading-relaxed">{approach}</p>
            </div>

            {/* Outcome */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                Outcome
              </h4>
              <p className="text-sm text-text leading-relaxed">{outcome}</p>
            </div>
          </div>

          {/* Stack & Link */}
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

const caseStudies = [
  {
    title: 'PSOL Protocol',
    tags: ['Solana', 'Privacy', 'DeFi'],
    year: '2024',
    problem: 'Users needed a privacy layer for Solana transactions without compromising on speed or security.',
    approach: 'Developed a zero-knowledge privacy protocol enabling anonymous transactions on Solana with minimal latency.',
    outcome: 'Launched as the leading privacy protocol on Solana with thousands of private transactions processed.',
    stack: ['Solana', 'Rust', 'Anchor', 'ZK-Proofs', 'React'],
    link: 'https://psolprotocol.org',
  },
  {
    title: 'Human Rail',
    tags: ['Solana', 'Identity', 'Web3'],
    year: '2024',
    problem: 'Web3 lacked a decentralized identity solution that could verify real humans while preserving privacy.',
    approach: 'Built an on-chain identity protocol using Soulbound tokens and verifiable credentials on Solana.',
    outcome: 'Successfully deployed identity verification system used by multiple dApps for sybil resistance.',
    stack: ['Solana', 'Rust', 'Anchor', 'SBT', 'Next.js'],
    link: 'https://humanrail.org',
  },
  {
    title: 'Mania Atelier',
    tags: ['E-commerce', 'Fashion', 'Fullstack'],
    year: '2024',
    problem: 'Fashion brand needed a modern, high-performance online store for men and women clothing.',
    approach: 'Designed a sleek e-commerce platform with seamless checkout, inventory management, and mobile-first UX.',
    outcome: 'Increased online sales by 150% and achieved sub-2-second page load times across all devices.',
    stack: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind', 'PostgreSQL'],
    link: 'https://maniaratelier.com',
  },
  {
    title: 'Trailblazer Agent',
    tags: ['Solana', 'AI Agent', 'Narrative'],
    year: '2024',
    problem: 'Crypto community needed an AI agent to track and analyze emerging narratives on Solana.',
    approach: 'Created an autonomous AI agent that scans social media, forums, and on-chain data to identify trends.',
    outcome: 'Became a go-to narrative hunter for Solana traders, identifying trends before they went viral.',
    stack: ['Solana', 'Python', 'AI/ML', 'NLP', 'React'],
    link: 'https://trailblazeragent.fun',
  },
  {
    title: 'SOL Audit',
    tags: ['Solana', 'AI Agent', 'Security'],
    year: '2024',
    problem: 'Developers needed automated security analysis and fix proposals for Solana GitHub repositories.',
    approach: 'Built an AI agent that scans Solana-native GitHub repos, identifies vulnerabilities, proposes fixes, and auto-forks with improvements.',
    outcome: 'Analyzed 500+ repositories, proposed 2000+ security fixes, and auto-forked critical projects with enhanced security.',
    stack: ['Solana', 'Rust', 'AI/ML', 'GitHub API', 'Next.js'],
    link: 'https://solaudit.fun',
  },
  {
    title: 'Swarp Foundation',
    tags: ['Foundation', 'Web3', 'Official'],
    year: '2024',
    problem: 'Swarp Foundation needed an official web presence to showcase their mission and ecosystem initiatives.',
    approach: 'Designed and developed a professional, accessible website with governance features and documentation.',
    outcome: 'Established the foundation\'s digital identity with integrated governance and community engagement tools.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'CMS', 'Web3'],
    link: 'https://swarpfoundation.com',
  },
  {
    title: 'SplitGuard',
    tags: ['Solana', 'Fee Sharing', 'DeFi'],
    year: '2024',
    problem: 'Solana projects needed a native solution for transparent and automated fee sharing among stakeholders.',
    approach: 'Developed a smart contract platform enabling programmable fee distribution with customizable splits.',
    outcome: 'Enabled multiple projects to distribute over $1M in shared fees transparently and efficiently.',
    stack: ['Solana', 'Rust', 'Anchor', 'DeFi', 'React'],
    link: 'https://splitguard.fun',
  },
  {
    title: 'Live Drops',
    tags: ['Solana', 'Launchpad', 'Streaming'],
    year: '2024',
    problem: 'Creators needed a platform to launch tokens and NFTs with live streaming capabilities for engagement.',
    approach: 'Built a stream launch platform integrating real-time video with token launches and live minting.',
    outcome: 'Hosted 100+ successful launches with live community engagement and instant liquidity provision.',
    stack: ['Solana', 'Rust', 'Anchor', 'WebRTC', 'Next.js'],
    link: 'https://livedrops.fun',
  },
  {
    title: 'SimFi',
    tags: ['Solana', 'Memecoins', 'Trading'],
    year: '2024',
    problem: 'Traders wanted to practice memecoin trading strategies without risking real capital.',
    approach: 'Created a paper trading platform with real-time Solana memecoin prices and simulated portfolios.',
    outcome: 'Attracted thousands of users practicing strategies before deploying real capital to live markets.',
    stack: ['Solana', 'React', 'WebSocket', 'Trading Engine', 'TypeScript'],
    link: 'https://simfi.fun',
  },
  {
    title: 'FunPumpFun',
    tags: ['Solana', 'Gaming', 'Simulation'],
    year: '2024',
    problem: 'Users wanted a gamified way to learn about token launches without financial risk.',
    approach: 'Built an engaging simulation game replicating the Pump.fun experience with virtual currency.',
    outcome: 'Became a popular educational tool and game, with users spending hours mastering launch mechanics.',
    stack: ['Solana', 'React', 'Game Design', 'Tailwind', 'TypeScript'],
    link: 'https://funpumpfun.fun',
  },
  {
    title: 'No Crying',
    tags: ['Solana', 'Memecoin', 'Community'],
    year: '2024',
    problem: 'A growing memecoin community needed a dedicated fan page with real-time updates and engagement tools.',
    approach: 'Created a vibrant community hub with price tracking, meme gallery, and social features.',
    outcome: 'Built a thriving community hub with thousands of daily active users and viral content sharing.',
    stack: ['Next.js', 'Solana', 'Tailwind', 'API Integration', 'TypeScript'],
    link: 'https://nocrying.fun',
  },
  {
    title: 'Scratch n SOL',
    tags: ['Solana', 'Gaming', 'Lottery'],
    year: '2024',
    problem: 'Solana users wanted a fun, on-chain scratch card game with instant prizes and provable fairness.',
    approach: 'Developed a blockchain-based scratch and win game with verifiable randomness and instant payouts.',
    outcome: 'Processed thousands of games daily with instant SOL payouts and provably fair outcomes.',
    stack: ['Solana', 'Rust', 'Anchor', 'VRF', 'React'],
    link: 'https://scratchnsol.fun',
  },
]

export default function Work() {
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

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="work"
    >
      <div className="container-custom">
        <div ref={headerRef} className="mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            Selected Work
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Case Studies
          </h2>
          <p className="text-text-muted max-w-2xl">
            Deep dives into real projects—problems, approaches, and outcomes.
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
