import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStage } from '@/contexts/StageContext';
import { EmailIcon } from './icons';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { stage } = useStage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const heroHeight = window.innerHeight;
      const contactSection = document.getElementById('contact');
      const contactTop = contactSection ? contactSection.offsetTop : Infinity;

      if (scrollY > heroHeight * 0.8 && scrollY < contactTop - 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isInverted = stage !== 'surface';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[5] h-[60px] flex items-center justify-between px-6 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="cursor-pointer"
        aria-label="Go to top"
      >
        <svg width="40" height="20" viewBox="0 0 44 22" fill="none">
          <text
            x="0"
            y="18"
            fontFamily="Inter, Arial, sans-serif"
            fontSize="20"
            fontWeight="600"
            fill={isInverted ? '#FFFFFF' : '#000000'}
            className="transition-colors duration-500"
          >
            gb
          </text>
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-4">
        <div className="flex gap-2 text-nav">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`transition-all duration-300 ${i18n.language === 'en' ? 'font-semibold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
            style={{ color: isInverted ? '#FFFFFF' : '#000000' }}
          >
            en
          </button>
          <button
            onClick={() => i18n.changeLanguage('fr')}
            className={`transition-all duration-300 ${i18n.language === 'fr' ? 'font-semibold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
            style={{ color: isInverted ? '#FFFFFF' : '#000000' }}
          >
            fr
          </button>
        </div>
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className="flex items-center gap-2 text-nav transition-all duration-300 hover:opacity-70"
        style={{ color: isInverted ? '#FFFFFF' : '#000000' }}
      >
        <span>{t('nav.getInTouch')}</span>
        <EmailIcon color={isInverted ? '#FFFFFF' : '#000000'} />
      </button>
    </header>
  );
}
