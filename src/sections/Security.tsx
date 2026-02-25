import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Check, 
  Key, 
  ShieldCheck, 
  Gauge, 
  FileSearch, 
  Bell, 
  RefreshCw,
  Lock,
  AlertTriangle
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Security() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const findingsRef = useRef<HTMLDivElement>(null)

  const securityItems = [
    {
      icon: Key,
      title: t('security.items.keyManagement.title'),
      description: t('security.items.keyManagement.description'),
    },
    {
      icon: ShieldCheck,
      title: t('security.items.inputValidation.title'),
      description: t('security.items.inputValidation.description'),
    },
    {
      icon: Gauge,
      title: t('security.items.rateLimiting.title'),
      description: t('security.items.rateLimiting.description'),
    },
    {
      icon: FileSearch,
      title: t('security.items.onchainInvariants.title'),
      description: t('security.items.onchainInvariants.description'),
    },
    {
      icon: Bell,
      title: t('security.items.monitoring.title'),
      description: t('security.items.monitoring.description'),
    },
    {
      icon: RefreshCw,
      title: t('security.items.upgradeStrategy.title'),
      description: t('security.items.upgradeStrategy.description'),
    },
  ]

  const sampleFindings = [
    {
      severity: t('security.sampleFindings.high.severity'),
      title: t('security.sampleFindings.high.title'),
      description: t('security.sampleFindings.high.description'),
      fix: t('security.sampleFindings.high.fix'),
    },
    {
      severity: t('security.sampleFindings.medium.severity'),
      title: t('security.sampleFindings.medium.title'),
      description: t('security.sampleFindings.medium.description'),
      fix: t('security.sampleFindings.medium.fix'),
    },
  ]

  const mindsetItems = [
    t('security.mindset.items.0'),
    t('security.mindset.items.1'),
    t('security.mindset.items.2'),
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

      if (gridRef.current) {
        const items = gridRef.current.children
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      gsap.fromTo(
        findingsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: findingsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getSeverityClass = (severity: string) => {
    if (severity === 'High' || severity === 'Élevé') {
      return 'bg-red-500/20 text-red-400'
    } else if (severity === 'Medium' || severity === 'Moyen') {
      return 'bg-yellow-500/20 text-yellow-400'
    }
    return 'bg-blue-500/20 text-blue-400'
  }

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="security"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div ref={headerRef} className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
                {t('security.badge')}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                {t('security.title')}
              </h2>
              <p className="text-text-muted">
                {t('security.subtitle')}
              </p>
            </div>

            <div ref={gridRef} className="grid sm:grid-cols-2 gap-4">
              {securityItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-surface/50 border border-border-color hover:border-cyan/30 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan/20 transition-colors">
                      <item.icon className="w-4 h-4 text-cyan" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={findingsRef}>
            <div className="mb-6">
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {t('security.sampleFindings.title')}
              </h3>
              <p className="text-sm text-text-muted">
                {t('security.sampleFindings.subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {sampleFindings.map((finding, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg bg-surface border border-border-color"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${getSeverityClass(finding.severity)}`}
                    >
                      {finding.severity}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {finding.title}
                    </h4>
                  </div>
                  <p className="text-xs text-text-muted mb-3">
                    {finding.description}
                  </p>
                  <div className="flex items-start gap-2 text-xs">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-text">{finding.fix}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-cyan/5 border border-cyan/20">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-cyan" />
                <span className="text-sm font-semibold text-white">
                  {t('security.mindset.title')}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-text-muted">
                {mindsetItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
