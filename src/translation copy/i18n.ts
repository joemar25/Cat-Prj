import i18n from 'i18next'
import en from './en.json'
import fil from './fil.json'

import { initReactI18next } from 'react-i18next'

const defaultLanguage = typeof window !== 'undefined'
  ? localStorage.getItem('language') || 'en'
  : 'en'

const resources = {
  en: { translation: en },
  fil: { translation: fil },
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
}

export default i18n