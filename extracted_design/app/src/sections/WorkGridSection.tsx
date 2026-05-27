import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';
import DiagonalReveal from '@/components/DiagonalReveal';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { key: 'whiteProtocol', img: '/assets/project-white-protocol.jpg', span: 'md:col-span-5', offset: 'md:mt-0' },
  { key: 'founderArena', img: '/assets/project-founder-arena.jpg', span: 'md:col-span-4 md:col-start-8', offset: 'md:mt-24' },
  { key: 'swarpPay', img: '/assets/project-swarppay.jpg', span: 'md:col-span-4', offset: 'md:mt-16' },
  { key: 'humanRail', img: '/assets/project-human-rail.jpg', span: 'md:col-span-5 md:col-start-6', offset: 'md:mt-8' },
  { key: 'maniaAtelier', img: '/assets/project-mania-atelier.jpg', span: 'md:col-span-5', offset: 'md:mt-20' },
  { key: 'swarpFoundation', img: '/assets/project-swarp-foundation.jpg', span: 'md:col-span-4 md:col-start-7', offset: 'md:mt-4' },
  { key: 'simFi', img: '/assets/project-simfi.jpg', span: 'md:col-span-4 md:col-start-2', offset: 'md:mt-12' },
  { key: 'desertRoseGin', img: '/assets/project-desert-rose-gin.jpg', span: 'md:col-span-5', offset: 'md:mt-0' },
];

export default function WorkGridSection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const speed = parseFloat(el.dataset.speed || '0');

      gsap.to(el, {
        y: () => speed * -100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (projects.some((_, i) => itemRefs.current[i] && st.trigger === itemRefs.current[i])) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="stage-surface py-24 md:py-32 px-6 lg:px-12 relative z-[2]"
    >
      <h2 className="text-title-2 mb-16">{t('work.heading')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {projects.map((project, i) => (
          <div
            key={project.key}
            ref={el => { itemRefs.current[i] = el; }}
            data-speed={String(0.3 + (i % 3) * 0.15)}
            className={`${project.span} ${project.offset} group cursor-pointer`}
          >
            <DiagonalReveal className="mb-3">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={project.img}
                  alt={t(`work.projects.${project.key}.title`)}
                  className="w-full h-full object-cover grayscale-img transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
              </div>
            </DiagonalReveal>

            <div className="opacity-0 translate-y-4" style={{ animation: `fadeInUp 1s ${0.5 + i * 0.1}s forwards` }}>
              <h3 className="text-body-small font-medium text-black">
                {t(`work.projects.${project.key}.title`)}
              </h3>
              <p className="text-body-small text-gray1/60 mt-1">
                {t(`work.projects.${project.key}.categories`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
