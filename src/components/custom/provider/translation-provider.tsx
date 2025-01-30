'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n from '@/translation/i18n'

export default function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Handle language changes in localStorage
    const handleStorageChange = () => {
      const currentLang = localStorage.getItem('language')
      if (currentLang && i18n.language !== currentLang) {
        i18n.changeLanguage(currentLang)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}