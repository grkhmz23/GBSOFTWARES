import { useTranslation } from 'react-i18next'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  const footerLinks = [
    { label: t('nav.work'), href: '#work' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.security'), href: '#security' },
    { label: t('nav.faq'), href: '#faq' },
    { label: t('nav.bookCall'), href: '#contact' },
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/grkhmz23/', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/gorkhmaz-beydullayev/', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/uncgorkh', label: 'Twitter' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  return (
    <footer className="py-12 border-t border-border-color">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_transparent.png" 
              alt="Logo" 
              className="w-8 h-8 rounded object-cover"
            />
            <div>
              <span className="font-heading font-semibold text-white text-sm">
                Gorkhmaz Beydullayev
              </span>
              <p className="text-xs text-text-muted">
                {t('footer.builtWith')}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-text-muted hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface border border-border-color flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-color/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t('footer.available')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
