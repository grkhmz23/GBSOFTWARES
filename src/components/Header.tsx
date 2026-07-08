import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStage } from '@/contexts/useStage';
import { EmailIcon, MenuIcon, CloseIcon } from './icons';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { stage } = useStage();
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isInverted = stage !== 'surface';
  const iconColor = isInverted ? '#FFFFFF' : '#000000';

  const navLinks = [
    { id: 'work', label: t('nav.work') },
    { id: 'capabilities', label: t('nav.capabilities') },
    { id: 'process', label: t('nav.process') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'experience', label: t('nav.experience') },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[5] h-[60px] flex items-center justify-between px-6 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer"
          aria-label={t('nav.goToTop')}
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-4 text-nav">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="transition-opacity duration-300 hover:opacity-70"
                style={{ color: iconColor }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex gap-2 text-nav">
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={`transition-all duration-300 ${i18n.language === 'en' ? 'font-semibold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
              style={{ color: iconColor }}
            >
              en
            </button>
            <button
              onClick={() => i18n.changeLanguage('fr')}
              className={`transition-all duration-300 ${i18n.language === 'fr' ? 'font-semibold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
              style={{ color: iconColor }}
            >
              fr
            </button>
          </div>

          <button
            onClick={() => scrollTo('contact')}
            className="flex items-center gap-2 text-nav transition-all duration-300 hover:opacity-70"
            style={{ color: iconColor }}
          >
            <span>{t('nav.getInTouch')}</span>
            <EmailIcon color={iconColor} />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label={t('nav.openMenu')}
        >
          <MenuIcon color={iconColor} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[8] bg-black flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-4 right-6"
            onClick={() => setMobileOpen(false)}
            aria-label={t('nav.closeMenu')}
          >
            <CloseIcon color="#FFFFFF" size={32} />
          </button>

          <nav className="flex flex-col items-center gap-6 text-title-3 text-white">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="hover:opacity-70 transition-opacity"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex gap-4 text-nav text-white">
            <button
              onClick={() => { i18n.changeLanguage('en'); setMobileOpen(false); }}
              className={`transition-all duration-300 ${i18n.language === 'en' ? 'font-semibold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
            >
              en
            </button>
            <button
              onClick={() => { i18n.changeLanguage('fr'); setMobileOpen(false); }}
              className={`transition-all duration-300 ${i18n.language === 'fr' ? 'font-semibold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
            >
              fr
            </button>
          </div>

          <button
            onClick={() => scrollTo('contact')}
            className="flex items-center gap-2 text-nav text-white hover:opacity-70 transition-opacity"
          >
            <span>{t('nav.getInTouch')}</span>
            <EmailIcon color="#FFFFFF" />
          </button>
        </div>
      )}
    </>
  );
}
