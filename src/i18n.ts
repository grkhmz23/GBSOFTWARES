import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';

const LANGUAGE_STORAGE_KEY = 'gbsoftwares-language';
const savedLanguage = typeof window !== 'undefined'
  ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: savedLanguage === 'en' || savedLanguage === 'fr' ? savedLanguage : 'fr',
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
});

document.documentElement.lang = i18n.resolvedLanguage || 'fr';

export default i18n;
