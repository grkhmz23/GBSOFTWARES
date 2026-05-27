import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';
import PillButton from '@/components/PillButton';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  { key: 'webApps', number: '01' },
  { key: 'blockchain', number: '02' },
  { key: 'mobileApps', number: '03' },
  { key: 'desktopApps', number: '04' },
  { key: 'aiProducts', number: '05' },
  { key: 'mvpToProd', number: '06' },
];

function CapabilityRing({ number, title, orbit, index }: {
  number: string;
  title: string;
  orbit: string;
  index: number;
}) {
  return (
    <div
      className="capability-ring flex flex-col items-center justify-center relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Outer ring SVG */}
      <div className="relative w-[180px] h-[180px] md:w-[200px] md:h-[200px] animate-spin-slow">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ animationDirection: index % 2 === 0 ? 'normal' : 'reverse' }}
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Orbiting text */}
        <div
          className={`absolute inset-0 ${index % 2 === 0 ? 'animate-orbit' : 'animate-orbit-reverse'}`}
          style={{ animationDuration: `${20 + index * 3}s` }}
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-body-small text-white/70 whitespace-nowrap">
            {orbit}
          </span>
        </div>
      </div>

      {/* Number and title below ring */}
      <div className="mt-4 text-center">
        <span className="text-body-small text-white/50 block mb-1">{number}</span>
        <h3 className="text-title-3 text-white font-medium">{title}</h3>
      </div>
    </div>
  );
}

export default function CapabilitiesSection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setStage('mantle'),
      onEnterBack: () => setStage('mantle'),
    });
  }, [setStage]);

  useEffect(() => {
    if (!ringsRef.current) return;
    const rings = ringsRef.current.querySelectorAll('.capability-ring');

    gsap.set(rings, { scale: 0.5, opacity: 0 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        gsap.to(rings, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
          stagger: 0.1,
        });
      },
      once: true,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="stage-mantle py-24 md:py-32 px-6 lg:px-12 relative z-[2] transition-colors duration-500"
    >
      <h2 className="text-title-2 text-white mb-16">{t('capabilities.heading')}</h2>

      <div
        ref={ringsRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 max-w-[1200px] mx-auto place-items-center mb-16"
      >
        {capabilities.map((cap, i) => (
          <CapabilityRing
            key={cap.key}
            number={cap.number}
            title={t(`capabilities.items.${cap.key}.title`)}
            orbit={t(`capabilities.items.${cap.key}.orbit`)}
            index={i}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <PillButton onClick={() => alert('CV download coming soon!')}>
          {t('capabilities.downloadCV')}
        </PillButton>
      </div>
    </section>
  );
}
