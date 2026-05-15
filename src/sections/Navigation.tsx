import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, Calendar, Mail, Globe, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { scrollToSection } from '@/lib/scroll-to-section'

gsap.registerPlugin(ScrollTrigger)

export default function Navigation() {
  const { t, i18n } = useTranslation()
  const navRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const navLinks = [
    { label: t('nav.work'), href: '#work' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.security'), href: '#security' },
    { label: t('nav.faq'), href: '#faq' },
  ]

  const activeIndex = navLinks.findIndex(
    (l) => l.href === `#${activeSection}`
  )

  // Sliding glow indicator
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const indicatorRef = useRef<HTMLSpanElement>(null)

  const moveIndicator = useCallback((index: number) => {
    const el = linkRefs.current[index]
    const indicator = indicatorRef.current
    if (!el || !indicator) return
    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      autoAlpha: 1,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [])

  const hideIndicator = useCallback(() => {
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, { autoAlpha: 0, duration: 0.3 })
    }
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(
        docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
      )
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map((link) => link.href.replace('#', ''))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    )

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.4, ease: 'power3.out' }
    )
  }, [])

  // Keep indicator synced to active section + language/resize
  useEffect(() => {
    if (activeIndex >= 0) moveIndicator(activeIndex)
    else hideIndicator()
  }, [activeIndex, moveIndicator, hideIndicator, i18n.language, isScrolled])

  useEffect(() => {
    const onResize = () => {
      if (activeIndex >= 0) moveIndicator(activeIndex)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIndex, moveIndicator])

  const handleNavClick = useCallback((href: string) => {
    scrollToSection(href)
    setIsMobileMenuOpen(false)
  }, [])

  const handleBookingClick = useCallback(() => {
    scrollToSection('#booking')
    setIsMobileMenuOpen(false)
  }, [])

  // Magnetic CTA
  const ctaRef = useRef<HTMLButtonElement>(null)
  const handleCtaMove = (e: React.MouseEvent) => {
    const el = ctaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.35,
      y: (e.clientY - r.top - r.height / 2) * 0.35,
      duration: 0.4,
      ease: 'power3.out',
    })
  }
  const handleCtaLeave = () => {
    if (ctaRef.current)
      gsap.to(ctaRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      })
  }

  // Mobile menu staggered entrance
  const mobileLinksRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isMobileMenuOpen && mobileLinksRef.current) {
      const items = mobileLinksRef.current.querySelectorAll('.m-link')
      gsap.fromTo(
        items,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.06,
          delay: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Scroll progress beam */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-cyan via-purple to-cyan origin-left transition-transform duration-150 ease-out shadow-[0_0_10px_rgba(0,240,255,0.6)]"
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
            isScrolled
              ? 'max-w-[1180px] px-4'
              : 'max-w-[1200px] px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`relative flex items-center justify-between transition-all duration-500 ${
              isScrolled
                ? 'h-14 px-4 sm:px-5 rounded-2xl glass-strong border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                : 'h-20 px-0'
            }`}
          >
            {/* Animated gradient hairline (scrolled) */}
            {isScrolled && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
              />
            )}

            {/* Left: Logo */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#hero')
              }}
              className="group flex items-center gap-3 shrink-0"
              aria-label="Gorkhmaz Beydullayev — home"
            >
              <span className="relative flex items-center">
                <span className="absolute -inset-2 rounded-full bg-cyan/0 group-hover:bg-cyan/10 blur-lg transition-all duration-300" />
                <img
                  src="/logo_transparent.png"
                  alt="Gorkhmaz Beydullayev"
                  className={`relative w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                    isScrolled ? 'h-9 md:h-11' : 'h-12 md:h-16'
                  }`}
                />
              </span>
            </a>

            {/* Center: Pill rail nav (desktop) */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <div
                className="relative flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 backdrop-blur-md"
                onMouseLeave={() => {
                  if (activeIndex >= 0) moveIndicator(activeIndex)
                  else hideIndicator()
                }}
              >
                {/* Sliding glow indicator */}
                <span
                  ref={indicatorRef}
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 bottom-1.5 rounded-full bg-cyan/10 border border-cyan/30 shadow-[0_0_18px_rgba(0,240,255,0.25)] opacity-0"
                  style={{ width: 0 }}
                />
                {navLinks.map((link, i) => {
                  const isActive =
                    activeSection === link.href.replace('#', '')
                  return (
                    <a
                      key={link.href}
                      ref={(el) => {
                        linkRefs.current[i] = el
                      }}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href)
                      }}
                      onMouseEnter={() => moveIndicator(i)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative z-10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-colors duration-200 ${
                        isActive
                          ? 'text-cyan'
                          : 'text-text-muted hover:text-white'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Right: Status + Language + CTA */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Status Pill */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs text-text-muted">
                  {t('nav.available')}
                </span>
              </div>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('language.switch')}
                    className="text-text-muted hover:text-cyan hover:bg-white/[0.04] rounded-full"
                  >
                    <Globe className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-strong border-white/[0.08]"
                >
                  <DropdownMenuItem
                    onClick={() => changeLanguage('en')}
                    className={`${
                      i18n.language === 'en' ? 'text-cyan' : 'text-text'
                    } cursor-pointer`}
                  >
                    {t('language.en')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeLanguage('fr')}
                    className={`${
                      i18n.language === 'fr' ? 'text-cyan' : 'text-text'
                    } cursor-pointer`}
                  >
                    {t('language.fr')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* CTA + email (desktop) */}
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="mailto:gorkhmazb23@gmail.com"
                  className="text-text-muted hover:text-cyan transition-colors p-2 rounded-full hover:bg-white/[0.04]"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </a>
                <Button
                  ref={ctaRef}
                  onMouseMove={handleCtaMove}
                  onMouseLeave={handleCtaLeave}
                  size="sm"
                  className="relative overflow-hidden bg-gradient-to-r from-cyan to-purple text-void font-semibold rounded-full hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-shadow duration-300"
                  onClick={handleBookingClick}
                >
                  <span className="relative z-10 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('nav.bookCall')}
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent hover:translate-x-full transition-transform duration-700" />
                </Button>
              </div>

              {/* Mobile menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('nav.menu')}
                    className="text-white hover:bg-white/[0.06] rounded-full"
                  >
                    <Menu className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="glass-strong border-white/[0.08] w-[300px]"
                >
                  <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex items-center gap-3 mb-10">
                      <img
                        src="/logo_transparent.png"
                        alt="Gorkhmaz Beydullayev"
                        className="h-10 w-auto object-contain"
                      />
                    </div>

                    <div
                      ref={mobileLinksRef}
                      className="flex flex-col gap-1 overflow-y-auto"
                    >
                      {navLinks.map((link, i) => {
                        const isActive =
                          activeSection === link.href.replace('#', '')
                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault()
                              handleNavClick(link.href)
                            }}
                            className={`m-link group flex items-center justify-between text-sm font-medium uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all min-h-[44px] ${
                              isActive
                                ? 'text-cyan bg-cyan/10 border border-cyan/20'
                                : 'text-text-muted hover:text-white hover:bg-white/[0.04] border border-transparent'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="font-mono text-[10px] opacity-40">
                                0{i + 1}
                              </span>
                              {link.label}
                            </span>
                            <ArrowUpRight
                              className={`w-4 h-4 transition-all ${
                                isActive
                                  ? 'opacity-100'
                                  : 'opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0'
                              }`}
                              aria-hidden="true"
                            />
                          </a>
                        )
                      })}
                    </div>

                    <div className="mt-auto pb-8">
                      <div className="flex items-center gap-2 mb-4 text-text-muted text-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                        {t('nav.availableForProjects')}
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-cyan to-purple text-void font-semibold rounded-xl hover:opacity-90"
                        onClick={handleBookingClick}
                      >
                        <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                        {t('nav.bookCall')}
                      </Button>
                      <div className="mt-4 text-center text-xs text-text-muted font-mono">
                        gorkhmazb23@gmail.com · UTC-8
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
