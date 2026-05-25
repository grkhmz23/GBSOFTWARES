import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import emailjs from '@emailjs/browser'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Clock, Mail, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { checkRateLimit, formatWaitTime } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_cxb26d4'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID ?? 'template_mj57ngy'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'cKs7isxAB4tBNN7B7'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (isSubmitted && successRef.current) successRef.current.focus()
  }, [isSubmitted])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0 : 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: reducedMotion ? 0 : 0.7,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: reducedMotion ? 0 : 0.7,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [reducedMotion])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  })

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (honeypot) return

    const name = sanitizeInput(formData.name, 100)
    const email = sanitizeInput(formData.email, 254)
    const message = sanitizeInput(formData.message, 2000)

    if (name.length < 2) { setError('Please enter your name.'); return }
    if (!EMAIL_RE.test(email)) { setError('Please enter a valid email address.'); return }
    if (message.length < 10) { setError('Message is too short.'); return }

    const rl = checkRateLimit('contact')
    if (!rl.allowed) {
      setError(`Too many submissions. Please wait ${formatWaitTime(rl.waitMs)} before trying again.`)
      return
    }

    setIsSubmitting(true)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          project_type: sanitizeInput(formData.projectType, 50),
          budget: sanitizeInput(formData.budget, 50),
          timeline: sanitizeInput(formData.timeline, 50),
          message,
        },
        EMAILJS_PUBLIC_KEY
      )
      setIsSubmitted(true)
    } catch {
      setError(t('contact.error', 'Something went wrong. Please email me directly.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden scroll-mt-24"
    >
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(112,0,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,240,255,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div ref={headerRef} className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-white/[0.03] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
              Launch · 06
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Contact <span className="text-gradient">GB Softwares.</span>
          </h2>
          <p className="text-text-muted">
            Tell me what you're building — the rougher the idea, the better. I'll come back
            with a real opinion on shape, stack, and timeline.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          <div ref={infoRef}>
            <h3 className="font-heading text-xl font-bold text-white mb-6">
              What to include
            </h3>
            <ul className="space-y-4 mb-8">
              {[
                'What the product does and who it\'s for',
                'Where you are now — sketch, MVP, or scaling?',
                'Constraints — budget, deadline, regulatory',
                'Any existing tech you want to keep',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-text">
                  <span className="w-6 h-6 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan text-xs font-mono">{index + 1}</span>
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 p-6 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/[0.06]">
              <div className="flex items-center gap-3 text-text">
                <Clock className="w-5 h-5 text-cyan" />
                <span className="text-sm">Replies within 24 hours, weekdays</span>
              </div>
              <div className="flex items-center gap-3 text-text">
                <MapPin className="w-5 h-5 text-cyan" />
                <span className="text-sm">Working across UTC ±8</span>
              </div>
              <div className="flex items-center gap-3 text-text">
                <Mail className="w-5 h-5 text-cyan" />
                <a
                  href="mailto:gorkhmazb23@gmail.com"
                  className="text-sm hover:text-cyan transition-colors"
                >
                  gorkhmazb23@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            {isSubmitted ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="relative p-8 rounded-2xl bg-black/40 border border-cyan/30 text-center outline-none backdrop-blur-xl"
              >
                <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-cyan" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Message launched.
                </h3>
                <p className="text-text-muted text-sm">
                  I'll reply within 24 hours, weekdays. Check your inbox.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="relative p-6 md:p-8 rounded-2xl bg-black/40 border border-white/[0.06] space-y-5 backdrop-blur-xl"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,240,255,0.18), transparent 30%, transparent 70%, rgba(112,0,255,0.18))',
                    WebkitMask:
                      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    padding: '1px',
                    borderRadius: 'inherit',
                  }}
                />

                {/* Honeypot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                  }}
                >
                  <label htmlFor="hp_contact">Website</label>
                  <input
                    id="hp_contact"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {error && (
                  <div role="alert" className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-text text-xs font-mono uppercase tracking-wider">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your name"
                      required
                      maxLength={100}
                      className="bg-void/60 border-white/10 text-white placeholder:text-text-muted/60 focus:border-cyan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text text-xs font-mono uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@domain.com"
                      required
                      maxLength={254}
                      className="bg-void/60 border-white/10 text-white placeholder:text-text-muted/60 focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-project" className="text-text text-xs font-mono uppercase tracking-wider">
                    Project type
                  </Label>
                  <Select value={formData.projectType} onValueChange={(v) => handleChange('projectType', v)}>
                    <SelectTrigger
                      id="contact-project"
                      className="bg-void/60 border-white/10 text-white"
                    >
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-white/10">
                      <SelectItem value="web">Web app</SelectItem>
                      <SelectItem value="blockchain">Blockchain / smart contracts</SelectItem>
                      <SelectItem value="mobile">Mobile app</SelectItem>
                      <SelectItem value="desktop">Desktop app</SelectItem>
                      <SelectItem value="ai">AI product</SelectItem>
                      <SelectItem value="mvp">MVP → production</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-budget" className="text-text text-xs font-mono uppercase tracking-wider">
                      Budget
                    </Label>
                    <Select value={formData.budget} onValueChange={(v) => handleChange('budget', v)}>
                      <SelectTrigger id="contact-budget" className="bg-void/60 border-white/10 text-white">
                        <SelectValue placeholder="Range" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-white/10">
                        <SelectItem value="10k">Under $10k</SelectItem>
                        <SelectItem value="25k">$10k – $25k</SelectItem>
                        <SelectItem value="50k">$25k – $50k</SelectItem>
                        <SelectItem value="100k">$50k – $100k+</SelectItem>
                        <SelectItem value="discuss">Let's discuss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-timeline" className="text-text text-xs font-mono uppercase tracking-wider">
                      Timeline
                    </Label>
                    <Select value={formData.timeline} onValueChange={(v) => handleChange('timeline', v)}>
                      <SelectTrigger id="contact-timeline" className="bg-void/60 border-white/10 text-white">
                        <SelectValue placeholder="When" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-white/10">
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1month">~1 month</SelectItem>
                        <SelectItem value="3months">~3 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-text text-xs font-mono uppercase tracking-wider">
                    What are you building?
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Sketch, problem, constraints — rough thoughts welcome."
                    rows={5}
                    required
                    maxLength={2000}
                    className="bg-void/60 border-white/10 text-white placeholder:text-text-muted/60 focus:border-cyan"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan to-purple text-void hover:opacity-90 font-semibold shadow-[0_8px_30px_rgba(0,240,255,0.2)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Launching…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
