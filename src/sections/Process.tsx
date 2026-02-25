import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, PenTool, Code, Rocket, HeadphonesIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  const steps = [
    {
      icon: Search,
      title: t('process.steps.discovery.title'),
      description: t('process.steps.discovery.description'),
      details: [
        t('process.steps.discovery.details.0'),
        t('process.steps.discovery.details.1'),
        t('process.steps.discovery.details.2'),
        t('process.steps.discovery.details.3'),
      ],
    },
    {
      icon: PenTool,
      title: t('process.steps.architecture.title'),
      description: t('process.steps.architecture.description'),
      details: [
        t('process.steps.architecture.details.0'),
        t('process.steps.architecture.details.1'),
        t('process.steps.architecture.details.2'),
        t('process.steps.architecture.details.3'),
      ],
    },
    {
      icon: Code,
      title: t('process.steps.build.title'),
      description: t('process.steps.build.description'),
      details: [
        t('process.steps.build.details.0'),
        t('process.steps.build.details.1'),
        t('process.steps.build.details.2'),
        t('process.steps.build.details.3'),
      ],
    },
    {
      icon: Rocket,
      title: t('process.steps.launch.title'),
      description: t('process.steps.launch.description'),
      details: [
        t('process.steps.launch.details.0'),
        t('process.steps.launch.details.1'),
        t('process.steps.launch.details.2'),
        t('process.steps.launch.details.3'),
      ],
    },
    {
      icon: HeadphonesIcon,
      title: t('process.steps.support.title'),
      description: t('process.steps.support.description'),
      details: [
        t('process.steps.support.details.0'),
        t('process.steps.support.details.1'),
        t('process.steps.support.details.2'),
        t('process.steps.support.details.3'),
      ],
    },
  ]

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
            {t('process.badge')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {t('process.title')}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
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

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => { stepsRef.current[index] = el }}
                className="relative flex gap-6 md:gap-8"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface border-2 border-cyan flex items-center justify-center z-10 relative">
                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-cyan" />
                  </div>
                </div>

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

          <div className="mt-16 pt-8 border-t border-border-color">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan text-xs font-mono">01</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {t('process.microDetails.weeklyDemo.title')}
                  </h4>
                  <p className="text-xs text-text-muted">
                    {t('process.microDetails.weeklyDemo.description')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan text-xs font-mono">02</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {t('process.microDetails.definitionOfDone.title')}
                  </h4>
                  <p className="text-xs text-text-muted">
                    {t('process.microDetails.definitionOfDone.description')}
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
