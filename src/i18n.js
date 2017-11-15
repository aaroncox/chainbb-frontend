import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import sprintf from 'i18next-sprintf-postprocessor';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .use(sprintf)
  .init({
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
    react: {
      wait: true
    }
  });


export default i18n;
