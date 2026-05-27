import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to('.loader-overlay', {
        yPercent: -100,
        duration: 1.5,
        ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        onComplete: () => setVisible(false),
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="loader-overlay fixed inset-0 z-[7] bg-white flex items-center justify-center"
    >
      <div className="text-display text-black tracking-tight">gb</div>
    </div>
  );
}
