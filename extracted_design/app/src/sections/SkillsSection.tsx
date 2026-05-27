import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';

gsap.registerPlugin(ScrollTrigger);

function SkillCard({ title, details, index }: {
  title: string;
  details: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.set(cardRef.current, {
      rotateY: 90,
      opacity: 0,
    });

    ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(cardRef.current, {
          rotateY: 0,
          opacity: 1,
          duration: 1.5,
          delay: index * 0.15,
          ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        });
      },
      once: true,
    });
  }, [index]);

  return (
    <div
      className="w-full md:w-[220px] h-[300px] cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 border border-white/30 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:-translate-y-1"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-title-3 text-white font-semibold text-center">{title}</h3>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 border border-white/30 flex flex-col items-center justify-center p-6 bg-white/5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-body-small text-white/90 text-center leading-relaxed">
            {details}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
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
      onEnter: () => setStage('innerCore'),
      onEnterBack: () => setStage('innerCore'),
    });
  }, [setStage]);

  const categories = t('skills.categories', { returnObjects: true }) as Array<{ title: string; details: string }>;

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="stage-inner-core py-24 md:py-32 px-6 lg:px-12 relative z-[2] transition-colors duration-500"
    >
      <h2 className="text-title-2 text-white mb-16">{t('skills.heading')}</h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-stretch max-w-[1400px] mx-auto">
        {categories.map((cat, i) => (
          <SkillCard
            key={i}
            title={cat.title}
            details={cat.details}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
