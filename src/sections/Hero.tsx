import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Github, FileCode, Shield, Rocket, Terminal, Cpu, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import InteractiveBlockchain from './InteractiveBlockchain'

gsap.registerPlugin(ScrollTrigger)

// Typing effect hook
function useTypingEffect(text: string, speed: number = 50, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index))
          index++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayedText, isComplete }
}

// Floating code snippet component
function FloatingCodeSnippet({ 
  code, 
  position, 
  delay,
  language 
}: { 
  code: string
  position: { x: string; y: string }
  delay: number
  language: string
}) {
  const snippetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!snippetRef.current) return
    
    const el = snippetRef.current
    
    gsap.fromTo(el,
      { opacity: 0, scale: 0.8, y: 30 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        delay: delay + 2,
        ease: 'back.out(1.7)'
      }
    )

    gsap.to(el, {
      y: '+=15',
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 2
    })

    gsap.to(el, {
      rotateX: 5,
      rotateY: -5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, [delay])

  return (
    <div
      ref={snippetRef}
      className="absolute hidden lg:block"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
        opacity: 0
      }}
    >
      <div className="bg-surface/80 backdrop-blur-md border border-cyan/20 rounded-lg p-3 shadow-glow">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border-color/50">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <span className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] text-text-muted font-mono ml-2">{language}</span>
        </div>
        <pre className="text-[10px] font-mono text-cyan/80 whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  )
}

// Matrix rain effect component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = Array(Math.floor(columns)).fill(1)

    let animationId: number
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-30 pointer-events-none"
    />
  )
}

// Particle cursor trail
function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: 30 + Math.random() * 20
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1 / p.maxLife

        if (p.life <= 0) return false

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 240, 255, ${p.life * 0.5})`
        ctx.fill()

        return true
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[5] pointer-events-none"
    />
  )
}

// Glitch text effect
function GlitchText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const triggerGlitch = () => {
      gsap.to(containerRef.current, {
        x: () => (Math.random() - 0.5) * 4,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0 })
        }
      })
    }

    const interval = setInterval(triggerGlitch, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute inset-0 text-red-500 opacity-0 translate-x-[2px]"
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute inset-0 text-cyan opacity-0 -translate-x-[2px]"
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  )
}

const codeSnippets = [
  {
    code: `fn transfer(
  ctx: Context<Transfer>,
  amount: u64
) -> Result<()> {
  // Secure transfer logic
}`,
    position: { x: '5%', y: '20%' },
    delay: 0,
    language: 'anchor.rs'
  },
  {
    code: `contract SecureVault {
  mapping(address => uint256) balances;
  
  function deposit() external {
    balances[msg.sender] += msg.value;
  }
}`,
    position: { x: '75%', y: '15%' },
    delay: 0.3,
    language: 'solidity'
  },
  {
    code: `const indexer = new Indexer({
  rpc: process.env.RPC_URL,
  redis: redisClient,
  db: postgresPool
});`,
    position: { x: '80%', y: '60%' },
    delay: 0.6,
    language: 'typescript'
  },
  {
    code: `#[test]
fn test_overflow_protection() {
  let result = safe_add(
    u64::MAX, 1
  );
  assert!(result.is_err());
}`,
    position: { x: '3%', y: '65%' },
    delay: 0.9,
    language: 'rust'
  }
]

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  
  const { displayedText: headlineText, isComplete: headlineComplete } = useTypingEffect(
    t('hero.headline'),
    40,
    1800
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(terminalRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, delay: 1.5, ease: 'power3.out' }
      )

      const revealItems = contentRef.current?.querySelectorAll('.reveal-item')
      if (revealItems && revealItems.length > 0) {
        gsap.fromTo(revealItems,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15,
            delay: 2.5,
            ease: 'power2.out'
          }
        )
      }

      gsap.fromTo(statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 3.5, ease: 'power2.out' }
      )

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (contentRef.current) {
            gsap.to(contentRef.current, {
              opacity: 1 - self.progress * 1.5,
              y: self.progress * 80,
              duration: 0.1,
            })
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (selector: string) => {
    const element = document.querySelector(selector)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  const trustBadges = [
    { icon: Github, label: t('hero.trustBadges.openSource') },
    { icon: FileCode, label: t('hero.trustBadges.productionApps') },
    { icon: Shield, label: t('hero.trustBadges.securityAudits') },
    { icon: Rocket, label: t('hero.trustBadges.solanaStack') },
    { icon: Terminal, label: t('hero.trustBadges.fullStack') },
    { icon: Cpu, label: t('hero.trustBadges.smartContracts') },
    { icon: Database, label: t('hero.trustBadges.indexing') },
  ]

  const stats = [
    { value: '50+', label: t('hero.stats.projects') },
    { value: '$10M+', label: t('hero.stats.secured') },
    { value: '99.9%', label: t('hero.stats.uptime') },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      id="hero"
    >
      <MatrixRain />
      
      <div className="absolute inset-0 z-[1]">
        <InteractiveBlockchain />
      </div>

      <CursorParticles />

      {codeSnippets.map((snippet, index) => (
        <FloatingCodeSnippet key={index} {...snippet} />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/95 to-void/70 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/80 z-[2]" />

      <div
        ref={contentRef}
        className="relative z-10 container-custom pt-32 pb-20"
      >
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 max-w-2xl">
            <div 
              ref={terminalRef}
              className="mb-8 opacity-0"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-surface/80 border border-cyan/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="font-mono text-xs text-cyan">{t('hero.terminalPrefix')}</span>
                <span className="font-mono text-xs text-text-muted">{t('hero.terminalCommand')}</span>
              </div>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 min-h-[1.2em]">
              <GlitchText 
                text={headlineText}
                className={headlineComplete ? '' : 'border-r-2 border-cyan animate-pulse'}
              />
            </h1>

            <p className="reveal-item text-lg md:text-xl text-text-muted mb-8 leading-relaxed opacity-0">
              {t('hero.subheadline', {
                shippedFast: t('hero.shippedFast'),
                securedProperly: t('hero.securedProperly')
              })}
            </p>

            <div className="reveal-item flex flex-wrap gap-3 mb-10 opacity-0">
              {['Rust/Solana', 'Solidity', 'React/Next.js', 'Node.js', 'PostgreSQL'].map((tech, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-surface border border-cyan/20 text-xs font-mono text-cyan/80 hover:border-cyan/50 hover:text-cyan transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="reveal-item flex flex-wrap gap-4 mb-12 opacity-0">
              <Button
                size="lg"
                className="bg-cyan text-void hover:bg-cyan/90 font-semibold group relative overflow-hidden"
                onClick={() => scrollToSection('#contact')}
              >
                <span className="relative z-10 flex items-center">
                  {t('hero.ctaBookCall')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan to-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border-color text-white hover:bg-surface hover:border-cyan/30 group"
                onClick={() => scrollToSection('#work')}
              >
                {t('hero.ctaViewWork')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div 
              ref={statsRef}
              className="reveal-item grid grid-cols-3 gap-6 opacity-0"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="font-mono text-2xl md:text-3xl font-bold text-cyan">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 hidden lg:block">
            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div 
                  className="absolute inset-0 rounded-2xl bg-surface/60 border border-cyan/10 backdrop-blur-sm"
                  style={{ 
                    transform: 'translateX(20px) translateY(-20px) rotateY(-5deg)',
                    opacity: 0.5 
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-2xl bg-surface/80 border border-cyan/20 backdrop-blur-sm"
                  style={{ 
                    transform: 'translateX(10px) translateY(-10px) rotateY(-3deg)',
                    opacity: 0.7 
                  }}
                />
                <div className="absolute inset-0 rounded-2xl bg-surface border border-cyan/30 backdrop-blur-md p-6 flex flex-col justify-between"
                  style={{ transform: 'perspective(1000px) rotateY(5deg)' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-cyan">{t('hero.latestCommit')}</span>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="font-mono text-sm text-text-muted mb-2">
                      feat: implement secure vault contract
                    </div>
                    <div className="text-xs text-text-muted/60">
                      2 hours ago • 847 additions
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
                        <span className="text-cyan text-xs font-bold">G</span>
                      </div>
                      <div>
                        <div className="text-sm text-white">Gorkhmaz Beydullayev</div>
                        <div className="text-xs text-text-muted">{t('hero.role')}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {['Solidity', 'Rust', 'TypeScript'].map((lang, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 rounded bg-cyan/10 text-[10px] text-cyan font-mono"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -inset-4 bg-cyan/5 rounded-3xl blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="reveal-item mt-16 pt-8 border-t border-border-color/50 opacity-0">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-text-muted hover:text-cyan transition-colors cursor-default group"
              >
                <badge.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
