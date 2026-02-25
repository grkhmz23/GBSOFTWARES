import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    question: 'What do you need from me to start?',
    answer: 'A clear problem statement, any existing documentation or code, and access to stakeholders for discovery calls. The more context you provide upfront, the faster we can move. Ideally, come with: user stories, wireframes (if applicable), and a rough timeline.',
  },
  {
    question: 'How do pricing and milestones work?',
    answer: 'I typically work with milestone-based payments tied to deliverables. For example: 30% upfront, 40% at midpoint demo, 30% at final delivery. This aligns incentives and reduces risk for both parties.',
  },
  {
    question: 'Do you do fixed-price or hourly?',
    answer: 'I prefer fixed-price for well-defined scopes (like the MVP Sprint) and hourly/retainer for ongoing or exploratory work. We\'ll discuss what makes sense for your project during the discovery call.',
  },
  {
    question: 'Can you audit existing code?',
    answer: 'Yes. I offer security reviews and code audits for smart contracts and Web3 applications. This includes threat modeling, vulnerability assessment, and a detailed report with prioritized fixes.',
  },
  {
    question: 'Do you provide ongoing maintenance?',
    answer: 'Yes, through monthly retainer agreements. This includes monitoring, bug fixes, performance optimization, and feature iterations. SLAs available for critical systems.',
  },
  {
    question: 'What chains/stacks do you work with?',
    answer: 'Primary: Solana (Rust/Anchor), Ethereum (Solidity/Foundry), Next.js/React, Node.js, PostgreSQL, Redis, Kubernetes. I\'m also comfortable learning new stacks if your project requires it.',
  },
  {
    question: 'How do you handle timezones?',
    answer: 'I\'m based in PST (UTC-8) and have worked with teams across US, EU, and APAC. I adjust my schedule for important meetings and use async communication (Notion, Slack, Loom) to keep things moving.',
  },
  {
    question: 'What\'s your typical response time?',
    answer: 'For active projects: same day for Slack, within 24 hours for email. For urgent issues (production outages), I\'m available via phone/Signal.',
  },
]

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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

      // Accordion animation
      gsap.fromTo(
        accordionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: accordionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="faq"
    >
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div ref={headerRef} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
              FAQ
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Common Questions
            </h2>
            <p className="text-text-muted">
              Quick answers to remove blockers. Have more? Let's talk.
            </p>
          </div>

          <div ref={accordionRef}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border-color rounded-lg bg-surface/30 px-6 data-[state=open]:border-cyan/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-white hover:text-cyan py-4 text-sm md:text-base font-medium [&[data-state=open]>svg]:rotate-45">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-muted text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-text-muted mb-4">
              Still have questions?
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                const element = document.querySelector('#contact')
                if (element) {
                  const offset = 100
                  const elementPosition = element.getBoundingClientRect().top + window.scrollY
                  window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth',
                  })
                }
              }}
              className="inline-flex items-center gap-2 text-cyan hover:underline"
            >
              Let's discuss your project
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
