// src/translation/i18n.ts
'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fil from './fil.json'

const resources = {
  en: { translation: en },
  fil: { translation: fil },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
