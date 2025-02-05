// src/components/custom/provider/translation-provider.tsx
'use client'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/translation/i18n'

export default function TranslationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleStorageChange = () => {
      const currentLang = localStorage.getItem('language')
      if (currentLang && i18n.language !== currentLang) {
        i18n.changeLanguage(currentLang)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!mounted) return <>{children}</>

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}