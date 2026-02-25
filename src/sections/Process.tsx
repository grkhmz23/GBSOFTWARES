import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, PenTool, Code, Rocket, HeadphonesIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Deep dive into your problem space. Define boundaries, identify risks, and establish clear success metrics.',
    details: ['Requirements gathering', 'Technical feasibility', 'Risk assessment', 'Scope definition'],
  },
  {
    icon: PenTool,
    title: 'Architecture',
    description: 'Design the system with security and scalability in mind. Blockchain-specific threat modeling included.',
    details: ['System design', 'Threat modeling', 'Data flow diagrams', 'Tech stack selection'],
  },
  {
    icon: Code,
    title: 'Build',
    description: 'Agile development with weekly demos. PR-based workflow with thorough code reviews.',
    details: ['Weekly demos', 'PR reviews', 'Test coverage', 'Documentation'],
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'CI/CD deployment with monitoring, runbooks, and a smooth handover process.',
    details: ['CI/CD pipeline', 'Monitoring setup', 'Runbooks', 'Team handover'],
  },
  {
    icon: HeadphonesIcon,
    title: 'Support',
    description: 'Optional ongoing support with SLA guarantees for critical systems.',
    details: ['24/7 monitoring', 'Incident response', 'Performance optimization', 'Feature iterations'],
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

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

      // Line draw animation
      if (lineRef.current) {
        const lineLength = lineRef.current.getTotalLength()
        gsap.set(lineRef.current, {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
        })

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        })
      }

      // Step animations
      stepsRef.current.forEach((step) => {
        if (step) {
          gsap.fromTo(
            step,
            { opacity: 0.3, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              scrollTrigger: {
                trigger: step,
                start: 'top 70%',
                end: 'top 30%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="process"
    >
      <div className="container-custom">
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            Process
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            How I Work
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            A proven process that reduces risk and delivers results.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line (SVG for animation) */}
          <svg
            className="absolute left-6 md:left-8 top-0 h-full w-1 hidden md:block"
            preserveAspectRatio="none"
          >
            <line
              ref={lineRef}
              x1="2"
              y1="3%"
              x2="2"
              y2="88%"
              stroke="#00F0FF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => { stepsRef.current[index] = el }}
                className="relative flex gap-6 md:gap-8"
              >
                {/* Node */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface border-2 border-cyan flex items-center justify-center z-10 relative">
                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-cyan" />
                  </div>

                </div>

                {/* Content */}
                <div className="flex-grow pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-cyan">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-text-muted mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.details.map((detail, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-surface border border-border-color text-xs text-text"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Micro-details */}
          <div className="mt-16 pt-8 border-t border-border-color">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan text-xs font-mono">01</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Weekly Demo + Changelog
                  </h4>
                  <p className="text-xs text-text-muted">
                    See progress every week with live demos and detailed changelogs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan text-xs font-mono">02</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Definition of Done
                  </h4>
                  <p className="text-xs text-text-muted">
                    Every feature includes tests, observability, and documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
