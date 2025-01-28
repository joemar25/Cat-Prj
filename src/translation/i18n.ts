import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fil from './fil.json'

const resources = {
  en: { translation: en },
  fil: { translation: fil },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en', // Default to English if no language is set in localStorage
  fallbackLng: 'en', // Fallback to English in case the selected language is unavailable
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;


