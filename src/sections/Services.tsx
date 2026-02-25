import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  FileCode, 
  Layers, 
  Shield, 
  MessageSquare,
  ArrowRight,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

gsap.registerPlugin(ScrollTrigger)

import type { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  whoFor: string
  timeline: string
  cta: string
  index: number
  onBookCall: () => void
}

function ServiceCard({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  whoFor, 
  timeline, 
  cta,
  index,
  onBookCall
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 100, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      className="relative group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full p-6 md:p-8 rounded-xl bg-surface border border-border-color overflow-hidden transition-all duration-300 hover:border-cyan/30">
        {/* Spotlight effect */}
        {isHovered && (
          <div
            className="absolute pointer-events-none transition-opacity duration-200"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              width: 200,
              height: 200,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Border glow on hover */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 240, 255, 0.2) 0%, transparent 50%)`,
          }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition-colors">
            <Icon className="w-6 h-6 text-cyan" />
          </div>

          {/* Title */}
          <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
            {title}
          </h3>

          {/* Description */}
          <p className="text-text-muted mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text">
                <CheckCircle className="w-4 h-4 text-cyan mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {whoFor}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeline}
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="outline"
            className="w-full border-cyan text-cyan hover:bg-cyan hover:text-void group/btn"
            onClick={onBookCall}
          >
            {cta}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    icon: FileCode,
    title: 'MVP Sprint',
    description: 'Full-stack application built and deployed in weeks, not months.',
    features: [
      'React/Next.js frontend with modern UI',
      'Backend API with authentication',
      'Wallet integration & Web3 flows',
      'CI/CD pipeline & deployment',
      'Monitoring & alerting setup',
    ],
    whoFor: 'Startups & Founders',
    timeline: '4-8 weeks',
    cta: 'Get Estimate',
  },
  {
    icon: Layers,
    title: 'Protocol Engineering',
    description: 'Smart contract development with security at the foundation.',
    features: [
      'Program design & architecture',
      'Comprehensive test coverage',
      'Security review & hardening',
      'Upgrade & migration strategy',
      'Documentation & runbooks',
    ],
    whoFor: 'DeFi & Web3 Teams',
    timeline: '6-12 weeks',
    cta: 'Book Call',
  },
  {
    icon: Shield,
    title: 'Security & Hardening',
    description: 'Threat modeling, audits, and fixes for existing systems.',
    features: [
      'Threat model & risk assessment',
      'Code review & vulnerability findings',
      'Patch PRs with fixes',
      'Retest & validation',
      'Security report & recommendations',
    ],
    whoFor: 'Live Projects',
    timeline: '2-4 weeks',
    cta: 'Request Audit',
  },
  {
    icon: MessageSquare,
    title: 'Custom Engagement',
    description: 'Ongoing support for teams needing dedicated engineering.',
    features: [
      'Dedicated engineering hours',
      'Priority support & response',
      'Architecture consulting',
      'Team training & mentorship',
      'Flexible scope & timeline',
    ],
    whoFor: 'Enterprise Teams',
    timeline: 'Monthly retainer',
    cta: 'Discuss Needs',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

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

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="services"
    >
      <div className="container-custom">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            Services
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            What I Do
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Productized packages for common needs. Clear scope, clear deliverables, clear outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              whoFor={service.whoFor}
              timeline={service.timeline}
              cta={service.cta}
              index={index}
              onBookCall={scrollToContact}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
