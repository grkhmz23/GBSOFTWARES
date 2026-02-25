import { useEffect, useRef } from 'react'
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

const securityItems = [
  {
    icon: Key,
    title: 'Key Management',
    description: 'Secure secret handling, hardware wallets, and key rotation policies.',
  },
  {
    icon: ShieldCheck,
    title: 'Input Validation',
    description: 'Strict validation at all boundaries, sanitization, and auth checks.',
  },
  {
    icon: Gauge,
    title: 'Rate Limiting',
    description: 'Abuse prevention through throttling and request limits.',
  },
  {
    icon: FileSearch,
    title: 'Onchain Invariants',
    description: 'Property-based testing and formal verification where applicable.',
  },
  {
    icon: Bell,
    title: 'Monitoring & Alerting',
    description: 'Real-time anomaly detection and incident response playbooks.',
  },
  {
    icon: RefreshCw,
    title: 'Upgrade Strategy',
    description: 'Proxy patterns, migration plans, and rollback procedures.',
  },
]

const sampleFindings = [
  {
    severity: 'High',
    title: 'Reentrancy in Withdrawal',
    description: 'External call before state update could allow recursive withdrawals.',
    fix: 'Implemented checks-effects-interactions pattern.',
  },
  {
    severity: 'Medium',
    title: 'Missing Input Validation',
    description: 'User-provided address not validated before storage.',
    fix: 'Added zero-address and contract checks.',
  },
]

export default function Security() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const findingsRef = useRef<HTMLDivElement>(null)

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

      // Grid items animation
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

      // Findings animation
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

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="security"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Security Checklist */}
          <div>
            <div ref={headerRef} className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
                Security First
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Security & Reliability
              </h2>
              <p className="text-text-muted">
                Security isn't an afterthought—it's built into every layer. Here's how I approach it.
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

          {/* Right: Sample Findings */}
          <div ref={findingsRef}>
            <div className="mb-6">
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Sample Findings
              </h3>
              <p className="text-sm text-text-muted">
                Redacted examples from real security reviews.
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
                      className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                        finding.severity === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : finding.severity === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
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

            {/* Additional trust signals */}
            <div className="mt-6 p-4 rounded-lg bg-cyan/5 border border-cyan/20">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-cyan" />
                <span className="text-sm font-semibold text-white">
                  Security-First Mindset
                </span>
              </div>
              <ul className="space-y-2 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-cyan" />
                  Threat modeling for every blockchain project
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-cyan" />
                  Property-based testing with Foundry
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-cyan" />
                  Regular dependency audits and updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
