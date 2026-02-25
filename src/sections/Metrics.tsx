import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface MetricCardProps {
  value: string
  label: string
  suffix?: string
  prefix?: string
  delay: number
}

function MetricCard({ value, label, suffix = '', prefix = '', delay }: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''))

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card reveal animation
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Number counter animation
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: numericValue,
              duration: 2,
              delay: delay + 0.3,
              ease: 'power2.out',
              onUpdate: function () {
                setDisplayValue(Math.floor(this.targets()[0].val))
              },
            }
          )
        },
        once: true,
      })
    }, cardRef)

    return () => ctx.revert()
  }, [numericValue, delay])

  return (
    <div
      ref={cardRef}
      className="relative group p-6 md:p-8 rounded-xl bg-surface/50 border border-border-color backdrop-blur-sm hover:border-cyan/50 transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-baseline gap-1 mb-2">
          {prefix && (
            <span className="text-2xl md:text-3xl font-mono text-cyan">{prefix}</span>
          )}
          <span
            ref={numberRef}
            className="text-4xl md:text-5xl font-mono font-bold text-white"
          >
            {displayValue.toLocaleString()}
          </span>
          {suffix && (
            <span className="text-2xl md:text-3xl font-mono text-cyan">{suffix}</span>
          )}
        </div>
        <p className="text-sm md:text-base text-text-muted">{label}</p>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan/30 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

const metrics = [
  { value: '50', label: 'Projects Delivered', suffix: '+' },
  { value: '5', label: 'Years Experience', suffix: '+' },
  { value: '99', label: 'Uptime Achieved', suffix: '.9%' },
  { value: '10', label: 'Value Secured', prefix: '$', suffix: 'M+' },
]

export default function Metrics() {
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

  return (
    <section
      ref={sectionRef}
      className="section-padding relative"
      id="metrics"
    >
      <div className="container-custom">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            Results
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Proof of Work
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Numbers that speak to reliability, scale, and impact.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              value={metric.value}
              label={metric.label}
              suffix={metric.suffix}
              prefix={metric.prefix}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
