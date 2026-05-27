import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
    const items = sectionRef.current.querySelectorAll('.exp-item');

    gsap.set(items, { y: 30, opacity: 0 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        });
      },
      once: true,
    });
  }, []);

  const entries = t('experience.entries', { returnObjects: true }) as Array<{
    company: string;
    role: string;
    date: string;
    description: string;
    tags: string[];
  }>;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="stage-outer-core py-24 md:py-32 px-6 lg:px-12 relative z-[2] transition-colors duration-500"
    >
      <h2 className="text-title-2 text-white mb-16">{t('experience.heading')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
        {/* Experience List */}
        <div className="md:col-span-2 space-y-0">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="exp-item border-t border-white/20 py-6 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:pl-4"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <h3 className="text-title-3 text-white font-semibold">{entry.company}</h3>
                <span className="text-body-small text-white/50">{entry.date}</span>
              </div>
              <p className="text-body-small text-white/70 mt-1 mb-3">{entry.role}</p>
              <p className="text-body text-white/60 line-clamp-2">{entry.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {entry.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-[10px] md:text-body-small text-white/50 border border-white/20 px-3 py-1 rounded-pill"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-white/20" />
        </div>

        {/* Detail Panel - Desktop */}
        <div className="hidden md:block relative">
          <div className="sticky top-32">
            <div
              className="transition-all duration-500 ease-out overflow-hidden"
              style={{
                opacity: activeIndex !== null ? 1 : 0,
                transform: activeIndex !== null ? 'translateX(0)' : 'translateX(30px)',
              }}
            >
              {activeIndex !== null && (
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-title-3 text-white font-semibold mb-2">
                    {entries[activeIndex].company}
                  </h3>
                  <p className="text-body-small text-white/50 mb-1">{entries[activeIndex].role}</p>
                  <p className="text-body-small text-white/50 mb-4">{entries[activeIndex].date}</p>
                  <p className="text-body text-white/80 mb-4">
                    {entries[activeIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entries[activeIndex].tags.map((tag, j) => (
                      <span
                        key={j}
                        className="text-body-small text-white/60 border border-white/20 px-3 py-1 rounded-pill"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
