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

gsap.registerPlugin(ScrollTrigger)

// EmailJS configuration
// Service ID: service_cxb26d4 (already set)
// You still need: Template ID and Public Key from EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_cxb26d4'
const EMAILJS_TEMPLATE_ID = 'template_mj57ngy'
const EMAILJS_PUBLIC_KEY = 'cKs7isxAB4tBNN7B7'

export default function Contact() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          project_type: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      
      setIsSubmitted(true)
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(t('contact.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatToIncludeItems = [
    t('contact.whatToInclude.items.0'),
    t('contact.whatToInclude.items.1'),
    t('contact.whatToInclude.items.2'),
    t('contact.whatToInclude.items.3'),
  ]

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="contact"
    >
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="container-custom relative z-10">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div ref={infoRef}>
            <h3 className="font-heading text-xl font-bold text-white mb-6">
              {t('contact.whatToInclude.title')}
            </h3>
            <ul className="space-y-4 mb-8">
              {whatToIncludeItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-text">
                  <span className="w-5 h-5 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyan text-xs">{index + 1}</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-4 p-6 rounded-xl bg-surface/50 border border-border-color">
              <div className="flex items-center gap-3 text-text">
                <Clock className="w-5 h-5 text-cyan" />
                <span className="text-sm">{t('contact.info.responseTime')}</span>
              </div>
              <div className="flex items-center gap-3 text-text">
                <MapPin className="w-5 h-5 text-cyan" />
                <span className="text-sm">{t('contact.info.timezone')}</span>
              </div>
              <div className="flex items-center gap-3 text-text">
                <Mail className="w-5 h-5 text-cyan" />
                <span className="text-sm">{t('contact.info.email')}</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-text-muted text-sm mb-4">
                {t('contact.schedule.question')}
              </p>
              <Button
                variant="outline"
                className="border-cyan text-cyan hover:bg-cyan hover:text-void"
                onClick={() => window.open('https://calendly.com', '_blank')}
              >
                {t('contact.schedule.button')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div>
            {isSubmitted ? (
              <div className="p-8 rounded-xl bg-surface/50 border border-cyan/30 text-center">
                <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-cyan" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  {t('contact.success.title')}
                </h3>
                <p className="text-text-muted">
                  {t('contact.success.message')}
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-6 md:p-8 rounded-xl bg-surface/50 border border-border-color space-y-6"
              >
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-text">
                      {t('contact.form.name')}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder={t('contact.form.namePlaceholder')}
                      required
                      className="bg-void border-border-color text-white placeholder:text-text-muted focus:border-cyan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text">
                      {t('contact.form.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder={t('contact.form.emailPlaceholder')}
                      required
                      className="bg-void border-border-color text-white placeholder:text-text-muted focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project" className="text-text">
                    {t('contact.form.projectType')}
                  </Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)}>
                    <SelectTrigger className="bg-void border-border-color text-white">
                      <SelectValue placeholder={t('contact.form.projectTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border-color">
                      <SelectItem value="mvp">{t('contact.form.services.mvp')}</SelectItem>
                      <SelectItem value="protocol">{t('contact.form.services.protocol')}</SelectItem>
                      <SelectItem value="security">{t('contact.form.services.security')}</SelectItem>
                      <SelectItem value="custom">{t('contact.form.services.custom')}</SelectItem>
                      <SelectItem value="other">{t('contact.form.services.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-text">
                      {t('contact.form.budget')}
                    </Label>
                    <Select value={formData.budget} onValueChange={(value) => handleChange('budget', value)}>
                      <SelectTrigger className="bg-void border-border-color text-white">
                        <SelectValue placeholder={t('contact.form.budgetPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-color">
                        <SelectItem value="10k">{t('contact.form.budgetOptions.10k')}</SelectItem>
                        <SelectItem value="25k">{t('contact.form.budgetOptions.25k')}</SelectItem>
                        <SelectItem value="50k">{t('contact.form.budgetOptions.50k')}</SelectItem>
                        <SelectItem value="100k">{t('contact.form.budgetOptions.100k')}</SelectItem>
                        <SelectItem value="discuss">{t('contact.form.budgetOptions.discuss')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-text">
                      {t('contact.form.timeline')}
                    </Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleChange('timeline', value)}>
                      <SelectTrigger className="bg-void border-border-color text-white">
                        <SelectValue placeholder={t('contact.form.timelinePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-color">
                        <SelectItem value="asap">{t('contact.form.timelineOptions.asap')}</SelectItem>
                        <SelectItem value="1month">{t('contact.form.timelineOptions.1month')}</SelectItem>
                        <SelectItem value="3months">{t('contact.form.timelineOptions.3months')}</SelectItem>
                        <SelectItem value="flexible">{t('contact.form.timelineOptions.flexible')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-text">
                    {t('contact.form.projectDetails')}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder={t('contact.form.projectDetailsPlaceholder')}
                    rows={5}
                    required
                    className="bg-void border-border-color text-white placeholder:text-text-muted focus:border-cyan resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan text-void hover:bg-cyan/90 font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t('contact.form.sending')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('contact.form.send')}
                      <Send className="w-4 h-4" />
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
