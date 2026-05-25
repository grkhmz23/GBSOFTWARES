import { Github, Linkedin, Twitter } from 'lucide-react'
import { scrollToSection } from '@/lib/scroll-to-section'

const FOOTER_LINKS = [
  { label: 'Build', href: '#build' },
  { label: 'Process', href: '#process' },
  { label: 'Core', href: '#capabilities' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/grkhmz23/', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/gorkhmaz-beydullayev/', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/uncgorkh', label: 'Twitter' },
]

export default function Footer() {
  return (
    <footer className="relative py-12 border-t border-border-color overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>
      <div className="container-custom relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo_transparent.png"
              alt="GB Softwares"
              className="h-8 md:h-10 w-auto object-contain"
            />
            <div>
              <span className="font-heading font-semibold text-white text-sm">
                Gorkhmaz Beydullayev
              </span>
              <p className="text-xs text-text-muted">
                Built from idea to production.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-1">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href)
                }}
                className="text-xs text-text-muted hover:text-cyan transition-colors py-2 px-3 rounded-md min-h-[44px] flex items-center font-mono uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface border border-border-color flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/30 transition-all"
                aria-label={`${social.label} (opens in new tab)`}
              >
                <social.icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-color/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} GB Softwares — Gorkhmaz Beydullayev.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Available for projects
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
