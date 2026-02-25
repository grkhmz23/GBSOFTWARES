import { useEffect, useRef, useState } from 'react'
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

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

      // Form animation
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

      // Info animation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      className="section-padding relative scroll-margin"
      id="contact"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="container-custom relative z-10">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider mb-4">
            Contact
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Let's Build the Future
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how I can help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left: Info */}
          <div ref={infoRef}>
            <h3 className="font-heading text-xl font-bold text-white mb-6">
              What to Include
            </h3>
            <ul className="space-y-4 mb-8">
              {[
                'Brief description of your project',
                'Timeline and key milestones',
                'Budget range (helps me suggest the right approach)',
                'Any existing code or documentation',
              ].map((item, index) => (
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
                <span className="text-sm">Response time: Within 24 hours</span>
              </div>
              <div className="flex items-center gap-3 text-text">
                <MapPin className="w-5 h-5 text-cyan" />
                <span className="text-sm">Timezone: PST (UTC-8)</span>
              </div>
              <div className="flex items-center gap-3 text-text">
                <Mail className="w-5 h-5 text-cyan" />
                <span className="text-sm">gorkhmaz@example.com</span>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="mt-8">
              <p className="text-text-muted text-sm mb-4">
                Prefer to schedule directly?
              </p>
              <Button
                variant="outline"
                className="border-cyan text-cyan hover:bg-cyan hover:text-void"
                onClick={() => window.open('https://calendly.com', '_blank')}
              >
                Book a Call
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {isSubmitted ? (
              <div className="p-8 rounded-xl bg-surface/50 border border-cyan/30 text-center">
                <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-cyan" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-text-muted">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="p-6 md:p-8 rounded-xl bg-surface/50 border border-border-color space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-text">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      className="bg-void border-border-color text-white placeholder:text-text-muted focus:border-cyan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      className="bg-void border-border-color text-white placeholder:text-text-muted focus:border-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project" className="text-text">
                    Project Type
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-void border-border-color text-white">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-border-color">
                      <SelectItem value="mvp">MVP Sprint</SelectItem>
                      <SelectItem value="protocol">Protocol Engineering</SelectItem>
                      <SelectItem value="security">Security Audit</SelectItem>
                      <SelectItem value="custom">Custom Engagement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-text">
                      Budget Range
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-void border-border-color text-white">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-color">
                        <SelectItem value="10k">$10k - $25k</SelectItem>
                        <SelectItem value="25k">$25k - $50k</SelectItem>
                        <SelectItem value="50k">$50k - $100k</SelectItem>
                        <SelectItem value="100k">$100k+</SelectItem>
                        <SelectItem value="discuss">Let's discuss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-text">
                      Timeline
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-void border-border-color text-white">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-color">
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1month">Within 1 month</SelectItem>
                        <SelectItem value="3months">1-3 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-text">
                    Project Details
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, goals, and any specific requirements..."
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
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
