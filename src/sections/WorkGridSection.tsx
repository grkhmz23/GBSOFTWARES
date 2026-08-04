import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/useStage';
import DiagonalReveal from '@/components/DiagonalReveal';

gsap.registerPlugin(ScrollTrigger);

// Cards render a live iframe preview of each site. If a site ever starts
// sending X-Frame-Options/frame-ancestors headers again, add an `img` field
// pointing at a screenshot in /assets to fall back to a static image.
const projects: { key: string; url: string; img?: string; span: string; offset: string }[] = [
  { key: 'whiteProtocol', url: 'https://www.thewhiteprotocol.com/', span: 'md:col-span-5', offset: 'md:mt-0' },
  { key: 'founderArena', url: 'https://www.founderarena.xyz/', span: 'md:col-span-4 md:col-start-8', offset: 'md:mt-24' },
  { key: 'swarpPay', url: 'https://www.swarppay.com/', span: 'md:col-span-4', offset: 'md:mt-16' },
  { key: 'humanRail', url: 'https://www.humanrail.org/', span: 'md:col-span-5 md:col-start-6', offset: 'md:mt-8' },
  { key: 'swarpConsulting', url: 'https://www.swarpconsulting.com/', span: 'md:col-span-5', offset: 'md:mt-20' },
  { key: 'swarpFoundation', url: 'https://www.swarpfoundation.com/', span: 'md:col-span-4 md:col-start-7', offset: 'md:mt-4' },
  { key: 'gorkh', url: 'https://www.gorkh.com/', span: 'md:col-span-4 md:col-start-2', offset: 'md:mt-12' },
  { key: 'desertRoseGin', url: 'https://www.thedesertrosegin.com/', span: 'md:col-span-5', offset: 'md:mt-0' },
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
    const items = itemRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

    items.forEach((el) => {
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
        if (items.includes(st.trigger as HTMLDivElement)) {
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
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label={t(`work.projects.${project.key}.title`)}
            >
              <DiagonalReveal className="mb-3">
                <div className="relative overflow-hidden aspect-[4/3] bg-gray1/5">
                  {project.img ? (
                    <img
                      src={project.img}
                      alt={t(`work.projects.${project.key}.title`)}
                      className="w-full h-full object-cover grayscale-img transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <iframe
                      src={project.url}
                      title={t(`work.projects.${project.key}.title`)}
                      loading="lazy"
                      tabIndex={-1}
                      className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 border-0 pointer-events-none grayscale-img transition-transform duration-700 group-hover:scale-[0.55]"
                    />
                  )}
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
            </a>
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
