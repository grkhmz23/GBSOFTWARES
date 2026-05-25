import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight, Github, Mail, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { scrollToSection } from '@/lib/scroll-to-section'

const NAV_LINKS = [
  { label: 'Build', href: '#build' },
  { label: 'Process', href: '#process' },
  { label: 'Core', href: '#capabilities' },
  { label: 'Work', href: '#work' },
] as const

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' }
    )
  }, [])

  const handleNavClick = useCallback((href: string) => {
    scrollToSection(href)
    setIsMobileMenuOpen(false)
  }, [])

  const handleContactClick = useCallback(() => {
    scrollToSection('#contact')
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
        <div
          className="h-full origin-left bg-gradient-to-r from-cyan via-purple to-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)] transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ paddingTop: isScrolled ? '12px' : '0px' }}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled ? 'max-w-[1180px] px-4' : 'max-w-[1200px] px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`relative flex items-center justify-between transition-all duration-500 ${
              isScrolled
                ? 'h-14 px-4 sm:px-5 rounded-2xl glass-strong border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                : 'h-20 px-0'
            }`}
          >
            {isScrolled && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
              />
            )}

            {/* Logo */}
            <a
              href="#core-journey"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#core-journey')
              }}
              className="group flex items-center gap-3 shrink-0"
              aria-label="GB Softwares — home"
            >
              <span className="relative flex items-center">
                <span className="absolute -inset-2 rounded-full bg-cyan/0 group-hover:bg-cyan/10 blur-lg transition-all duration-300" />
                <img
                  src="/logo_transparent.png"
                  alt="GB Softwares"
                  className={`relative w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                    isScrolled ? 'h-9 md:h-11' : 'h-12 md:h-16'
                  }`}
                />
              </span>
            </a>

            {/* Center rail */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <div className="relative flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 backdrop-blur-md">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }}
                    className="relative z-10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] rounded-full text-text-muted hover:text-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="https://github.com/grkhmz23/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex text-text-muted hover:text-cyan transition-colors p-2 rounded-full hover:bg-white/[0.04]"
                aria-label="GitHub (opens in new tab)"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:gorkhmazb23@gmail.com"
                className="hidden sm:inline-flex text-text-muted hover:text-cyan transition-colors p-2 rounded-full hover:bg-white/[0.04]"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>

              <Button
                size="sm"
                className="hidden sm:inline-flex relative overflow-hidden bg-gradient-to-r from-cyan to-purple text-void font-semibold rounded-full hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-shadow duration-300"
                onClick={handleContactClick}
              >
                <span className="relative z-10 flex items-center">
                  Start a Project
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent hover:translate-x-full transition-transform duration-700" />
              </Button>

              {/* Mobile menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="text-white hover:bg-white/[0.06] rounded-full"
                  >
                    <Menu className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="glass-strong border-white/[0.08] w-[300px]"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10">
                      <img
                        src="/logo_transparent.png"
                        alt="GB Softwares"
                        className="h-10 w-auto object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      {NAV_LINKS.map((link, i) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNavClick(link.href)
                          }}
                          className="group flex items-center justify-between text-sm font-medium uppercase tracking-wider py-3.5 px-4 rounded-xl text-text-muted hover:text-white hover:bg-white/[0.04] border border-transparent min-h-[44px]"
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] opacity-40">0{i + 1}</span>
                            {link.label}
                          </span>
                          <ArrowUpRight
                            className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>

                    <div className="mt-auto pb-8">
                      <div className="flex items-center gap-2 mb-4 text-text-muted text-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                        Available for projects
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-cyan to-purple text-void font-semibold rounded-xl hover:opacity-90"
                        onClick={handleContactClick}
                      >
                        Start a Project
                      </Button>
                      <div className="mt-4 text-center text-xs text-text-muted font-mono">
                        gorkhmazb23@gmail.com
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
