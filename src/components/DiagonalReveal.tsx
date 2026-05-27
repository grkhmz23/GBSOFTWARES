import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DiagonalRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function DiagonalReveal({ children, className = '' }: DiagonalRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mask = el.querySelector('.diagonal-mask') as HTMLElement;
    if (!mask) return;

    gsap.set(mask, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    });

    const tl = gsap.to(mask, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1.5,
      ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
      scrollTrigger: {
        trigger: el,
        start: 'top 65%',
        once: true,
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div className="diagonal-mask">
        {children}
      </div>
    </div>
  );
}
