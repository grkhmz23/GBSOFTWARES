import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/useStage';
import DiagonalReveal from '@/components/DiagonalReveal';
import PillButton from '@/components/PillButton';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudySection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setStage('outerCore'),
      onEnterBack: () => setStage('outerCore'),
    });
  }, [setStage]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const contentItems = sectionRef.current.querySelectorAll('.case-content');

    gsap.set(contentItems, { y: 30, opacity: 0 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 50%',
      onEnter: () => {
        gsap.to(contentItems, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
          delay: 0.5,
        });
      },
      once: true,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="case-study"
      className="stage-outer-core py-24 md:py-32 px-6 lg:px-12 relative z-[2] transition-colors duration-500"
    >
      <div className="max-w-[1200px] mx-auto">
        <DiagonalReveal className="mb-12">
          <div className="aspect-video overflow-hidden">
            <img
              src="/assets/case-study-hero.jpg"
              alt="The White Protocol"
              className="w-full h-full object-cover grayscale-img"
            />
          </div>
        </DiagonalReveal>

        <div className="space-y-6">
          <h2 className="case-content text-title-1 text-white opacity-0">
            {t('caseStudy.title')}
          </h2>

          <p className="case-content text-body text-white/80 max-w-[700px] opacity-0">
            {t('caseStudy.description')}
          </p>

          <div className="case-content flex flex-wrap gap-2 opacity-0">
            {(t('caseStudy.tags', { returnObjects: true }) as string[]).map((tag, i) => (
              <span
                key={i}
                className="text-body-small text-white/70 border border-white/30 px-4 py-1 rounded-pill"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="case-content flex gap-4 pt-4 opacity-0">
            <PillButton onClick={() => window.open('https://www.thewhiteprotocol.com/', '_blank')}>
              {t('caseStudy.viewProject')}
            </PillButton>
            <PillButton onClick={() => window.open('https://github.com', '_blank')}>
              {t('caseStudy.sourceCode')}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
