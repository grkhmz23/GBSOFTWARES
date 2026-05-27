import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';
import DiagonalReveal from '@/components/DiagonalReveal';
import PillButton from '@/components/PillButton';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    // Simulate form submission
    setTimeout(() => {
      if (formData.name && formData.email && formData.message) {
        setFormState('success');
        setFormData({ name: '', email: '', projectType: '', budget: '', timeline: '', message: '' });
      } else {
        setFormState('error');
      }
      setTimeout(() => setFormState('idle'), 3000);
    }, 1000);
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

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 opacity-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              placeholder={t('contact.form.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
            />
            <input
              type="email"
              placeholder={t('contact.form.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
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
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <PillButton variant="filled" type="submit">
              {formState === 'submitting' ? '...' : t('contact.form.submit')}
            </PillButton>

            {formState === 'success' && (
              <span className="text-body-small text-green-600">{t('contact.form.success')}</span>
            )}
            {formState === 'error' && (
              <span className="text-body-small text-red-500">{t('contact.form.error')}</span>
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
