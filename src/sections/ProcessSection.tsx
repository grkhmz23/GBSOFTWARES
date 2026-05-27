import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStage } from '@/contexts/StageContext';

gsap.registerPlugin(ScrollTrigger);

// Robot SVG component
function RobotSVG({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 50" className={className} fill="none">
      {/* Body */}
      <rect x="10" y="15" width="20" height="18" rx="3" fill="white" fillOpacity="0.9" />
      {/* Head */}
      <rect x="12" y="5" width="16" height="12" rx="3" fill="white" fillOpacity="0.9" />
      {/* Eyes */}
      <circle cx="17" cy="11" r="2" fill="#FE0F41" />
      <circle cx="23" cy="11" r="2" fill="#FE0F41" />
      {/* Antenna */}
      <line x1="20" y1="5" x2="20" y2="1" stroke="white" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="20" cy="1" r="1.5" fill="white" fillOpacity="0.7" />
      {/* Arms */}
      <line x1="10" y1="20" x2="4" y2="26" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
      <line x1="30" y1="20" x2="36" y2="26" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
      {/* Claws */}
      <path d="M2 24 L4 26 L2 28" stroke="white" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" fill="none" />
      <path d="M38 24 L36 26 L38 28" stroke="white" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round" fill="none" />
      {/* Legs */}
      <line x1="15" y1="33" x2="13" y2="42" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
      <line x1="25" y1="33" x2="27" y2="42" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
      {/* Feet */}
      <rect x="10" y="42" width="6" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="24" y="42" width="6" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

// Labyrinth path definition (SVG path for the 8 steps)
function LabyrinthDiagram({ activeStep }: { activeStep: number }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    ScrollTrigger.create({
      trigger: '#process',
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
      onUpdate: (self) => {
        if (pathRef.current) {
          gsap.to(pathRef.current, {
            strokeDashoffset: length * (1 - self.progress),
            duration: 0.3,
            ease: 'none',
          });
        }
      },
    });
  }, []);

  // Node positions for the labyrinth layout
  const nodes = [
    { x: 50, y: 50 },     // 1. strategy
    { x: 150, y: 100 },   // 2. architecture
    { x: 250, y: 60 },    // 3. ui/ux
    { x: 350, y: 130 },   // 4. backend
    { x: 280, y: 200 },   // 5. smart contracts
    { x: 180, y: 240 },   // 6. testing
    { x: 100, y: 190 },   // 7. deployment
    { x: 50, y: 280 },    // 8. iteration
  ];

  const pathD = nodes.reduce((acc, node, i) => {
    if (i === 0) return `M ${node.x} ${node.y}`;
    const prev = nodes[i - 1];
    const cpx1 = prev.x + (node.x - prev.x) * 0.5 + (i % 2 === 0 ? 20 : -20);
    const cpy1 = prev.y + (node.y - prev.y) * 0.3;
    const cpx2 = prev.x + (node.x - prev.x) * 0.5 + (i % 2 === 0 ? -20 : 20);
    const cpy2 = node.y - (node.y - prev.y) * 0.3;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${node.x} ${node.y}`;
  }, '');

  return (
    <svg viewBox="0 0 400 340" className="w-full max-w-[500px] h-auto">
      {/* Path */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Completed path segment (glows for active steps) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          strokeDasharray: pathRef.current?.getTotalLength() || 1000,
          strokeDashoffset: (pathRef.current?.getTotalLength() || 1000) * (1 - (activeStep + 1) / 8),
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={i}>
          {/* Node circle */}
          <circle
            cx={node.x}
            cy={node.y}
            r={i === activeStep ? 14 : 10}
            fill={i <= activeStep ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            style={{ transition: 'all 0.3s ease' }}
          />
          {/* Step number */}
          <text
            x={node.x}
            y={node.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={i <= activeStep ? '#FE0F41' : 'rgba(255,255,255,0.6)'}
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, Arial, sans-serif"
            style={{ transition: 'all 0.3s ease' }}
          >
            {i + 1}
          </text>

          {/* Robot at active step */}
          {i === activeStep && (
            <g style={{ transform: `translate(${node.x - 12}px, ${node.y - 35}px)` }}>
              <foreignObject x="0" y="0" width="24" height="30">
                <div className="w-full h-full">
                  <RobotSVG className="w-full h-full" />
                </div>
              </foreignObject>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function ProcessSection() {
  const { t } = useTranslation();
  const { setStage } = useStage();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

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
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
      onUpdate: (self) => {
        const step = Math.min(7, Math.floor(self.progress * 8));
        setActiveStep(step);
      },
    });
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const panel = sectionRef.current.querySelector('.step-panel');
    if (!panel) return;

    gsap.set(panel, { x: 50, opacity: 0 });
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        gsap.to(panel, {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        });
      },
      once: true,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="stage-outer-core py-24 md:py-32 px-6 lg:px-12 relative z-[2] transition-colors duration-500"
    >
      <h2 className="text-title-2 text-white mb-16">{t('process.heading')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start max-w-[1400px] mx-auto">
        {/* Labyrinth Diagram */}
        <div className="order-1">
          <LabyrinthDiagram activeStep={activeStep} />
        </div>

        {/* Step Detail Panel */}
        <div className="step-panel order-2 md:sticky md:top-32">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: i === activeStep ? 'white' : 'rgba(255,255,255,0.3)',
                    transform: i === activeStep ? 'scale(1.3)' : 'scale(1)',
                  }}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            <div className="transition-all duration-500">
              <span className="text-body-small text-white/50 block mb-2">
                step {activeStep + 1} of 8
              </span>
              <h3 className="text-title-3 text-white font-medium mb-4">
                {t(`process.steps.${activeStep}.title`)}
              </h3>
              <p className="text-body text-white/80">
                {t(`process.steps.${activeStep}.description`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
