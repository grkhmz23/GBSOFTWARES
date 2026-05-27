import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';
import DiagonalReveal from '@/components/DiagonalReveal';
import PillButton from '@/components/PillButton';
import { checkRateLimit, formatWaitTime } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/utils';
import emailjs from '@emailjs/browser';

gsap.registerPlugin(ScrollTrigger);

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_cxb26d4';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID ?? 'template_mj57ngy';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'cKs7isxAB4tBNN7B7';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setStage('surface'),
      onEnterBack: () => setStage('surface'),
    });
  }, [setStage]);

  useEffect(() => {
    if (!formRef.current) return;

    gsap.set(formRef.current, { y: 30, opacity: 0 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        gsap.to(formRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
          delay: 0.5,
        });
      },
      once: true,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMsg(null);

    if (honeypot) return;

    const name = sanitizeInput(formData.name, 100);
    const email = sanitizeInput(formData.email, 254);
    const message = sanitizeInput(formData.message, 2000);

    if (name.length < 2) { setErrorMsg('Please enter your name.'); setFormState('error'); return; }
    if (!EMAIL_RE.test(email)) { setErrorMsg('Please enter a valid email address.'); setFormState('error'); return; }
    if (message.length < 10) { setErrorMsg('Message is too short.'); setFormState('error'); return; }

    const rl = checkRateLimit('contact');
    if (!rl.allowed) {
      setErrorMsg(`Too many submissions. Please wait ${formatWaitTime(rl.waitMs)} before trying again.`);
      setFormState('error');
      return;
    }

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
      );
      setFormState('success');
      setFormData({ name: '', email: '', projectType: '', budget: '', timeline: '', message: '' });
    } catch {
      setErrorMsg(t('contact.form.error'));
      setFormState('error');
    }
  };

  const inputClass = 'w-full bg-transparent border-0 border-b border-gray2 py-3 text-body text-black placeholder:text-black/40 focus:outline-none focus:border-blue transition-colors duration-300';
  const selectClass = 'w-full bg-transparent border-0 border-b border-gray2 py-3 text-body text-black focus:outline-none focus:border-blue transition-colors duration-300 cursor-pointer';

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="stage-surface py-24 md:py-32 px-6 lg:px-12 relative z-[2]"
    >
      <div className="max-w-[800px] mx-auto">
        <DiagonalReveal className="mb-6">
          <h2 className="text-title-1 text-black">{t('contact.heading')}</h2>
        </DiagonalReveal>

        <div className="flex items-center gap-2 mb-12">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-body text-black/70">{t('contact.availability')}</span>
        </div>

        {/* Honeypot */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
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

        {errorMsg && (
          <div role="alert" className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm mb-6">
            {errorMsg}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 opacity-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              placeholder={t('contact.form.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
              required
              maxLength={100}
            />
            <input
              type="email"
              placeholder={t('contact.form.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
              required
              maxLength={254}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className={selectClass}
            >
              <option value="">{t('contact.form.projectType')}</option>
              {(t('contact.form.projectTypes', { returnObjects: true }) as string[]).map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className={selectClass}
            >
              <option value="">{t('contact.form.budget')}</option>
              {(t('contact.form.budgets', { returnObjects: true }) as string[]).map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className={selectClass}
            >
              <option value="">{t('contact.form.timeline')}</option>
              {(t('contact.form.timelines', { returnObjects: true }) as string[]).map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder={t('contact.form.message')}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={5}
            className={`${inputClass} resize-none`}
            required
            maxLength={2000}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <PillButton variant="filled" type="submit">
              {formState === 'submitting' ? '...' : t('contact.form.submit')}
            </PillButton>

            {formState === 'success' && (
              <span className="text-body-small text-green-600">{t('contact.form.success')}</span>
            )}
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-20 pt-12 border-t border-gray2/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-body-small text-black/70">
            <div>
              <a
                href={`mailto:${t('contact.email')}`}
                className="hover:text-blue transition-colors duration-300"
              >
                {t('contact.email')}
              </a>
            </div>
            <div>
              <p>{t('contact.responseTime')}</p>
              <p className="mt-1">{t('contact.timezone')}</p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com/grkhmz23/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue transition-colors duration-300"
              >
                {t('footer.social.github')}
              </a>
              <a
                href="https://www.linkedin.com/in/gorkhmaz-beydullayev/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue transition-colors duration-300"
              >
                {t('footer.social.linkedin')}
              </a>
              <a
                href="https://x.com/uncgorkh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue transition-colors duration-300"
              >
                {t('footer.social.twitter')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
