import { useTranslation } from 'react-i18next';

interface FooterProps {
  onPrivacyClick: () => void;
}

export default function Footer({ onPrivacyClick }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="stage-surface py-6 px-6 lg:px-12 relative z-[2] border-t border-gray2/30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1400px] mx-auto">
        <p className="text-body-small text-black/60">
          {t('footer.copyright')}
        </p>

        <button
          onClick={onPrivacyClick}
          className="text-body-small text-black/60 hover:text-black hover:underline underline-offset-4 transition-all duration-300"
        >
          {t('footer.privacy', 'privacy policy')}
        </button>

        <div className="flex gap-6 text-body-small">
          <a
            href="https://github.com/grkhmz23/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-black hover:underline underline-offset-4 transition-all duration-300"
          >
            {t('footer.social.github')}
          </a>
          <a
            href="https://www.linkedin.com/in/gorkhmaz-beydullayev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-black hover:underline underline-offset-4 transition-all duration-300"
          >
            {t('footer.social.linkedin')}
          </a>
          <a
            href="https://x.com/uncgorkh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-black hover:underline underline-offset-4 transition-all duration-300"
          >
            {t('footer.social.twitter')}
          </a>
        </div>
      </div>
    </footer>
  );
}
