import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './translations.json';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru', 'it'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
