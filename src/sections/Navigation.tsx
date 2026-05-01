import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, Calendar, Mail, Globe } from 'lucide-react'
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

  const navLinks = [
    { label: t('nav.work'), href: '#work' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.security'), href: '#security' },
    { label: t('nav.faq'), href: '#faq' },
  ]

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map(link => link.href.replace('#', ''))
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    )
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 1.5, ease: 'power2.out' }
    )
  }, [])

  const handleNavClick = useCallback((href: string) => {
    scrollToSection(href)
    setIsMobileMenuOpen(false)
  }, [])

  const handleBookingClick = useCallback(() => {
    scrollToSection('#booking')
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass border-b border-border-color'
          : 'bg-transparent'
      }`}
      style={{ height: isScrolled ? '60px' : '80px' }}
    >
      <div className="container-custom h-full flex items-center justify-between">
        {/* Left: Logo */}
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick('#hero') }} className="flex items-center gap-3">
          <img 
            src="/logo_transparent.png" 
            alt="Gorkhmaz Beydullayev" 
            className="h-8 md:h-10 w-auto object-contain"
          />
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
              aria-current={activeSection === link.href.replace('#', '') ? 'page' : undefined}
              className={`relative text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                activeSection === link.href.replace('#', '')
                  ? 'text-cyan'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.href.replace('#', '') && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-cyan" />
              )}
            </a>
          ))}
        </div>

        {/* Right: CTA + Status + Language Switcher */}
        <div className="flex items-center gap-4">
          {/* Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-color">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-text-muted">{t('nav.available')}</span>
          </div>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('language.switch')} className="text-text-muted hover:text-white">
                <Globe className="w-5 h-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface border-border-color">
              <DropdownMenuItem 
                onClick={() => changeLanguage('en')}
                className={`${i18n.language === 'en' ? 'text-cyan' : 'text-text'} cursor-pointer`}
              >
                {t('language.en')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeLanguage('fr')}
                className={`${i18n.language === 'fr' ? 'text-cyan' : 'text-text'} cursor-pointer`}
              >
                {t('language.fr')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CTA Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-cyan text-cyan hover:bg-cyan hover:text-void transition-all duration-300"
              onClick={handleBookingClick}
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              {t('nav.bookCall')}
            </Button>
            <a
              href="mailto:gorkhmazb23@gmail.com"
              className="text-text-muted hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label={t('nav.menu')} className="text-white">
                <Menu className="w-5 h-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface border-border-color">
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading font-semibold text-white">{t('nav.menu')}</span>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                      className={`text-left text-sm font-medium uppercase tracking-wider py-3 px-2 rounded-md transition-colors min-h-[44px] flex items-center ${
                        activeSection === link.href.replace('#', '')
                          ? 'text-cyan bg-cyan/10'
                          : 'text-text-muted hover:text-white hover:bg-surface'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="mt-auto pb-8">
                  <div className="flex items-center gap-2 mb-4 text-text-muted text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {t('nav.availableForProjects')}
                  </div>
                  <Button
                    className="w-full bg-cyan text-void hover:bg-cyan/90"
                    onClick={handleBookingClick}
                  >
                    <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('nav.bookCall')}
                  </Button>
                  <div className="mt-4 text-center text-xs text-text-muted">
                    gorkhmazb23@gmail.com · UTC-8
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
