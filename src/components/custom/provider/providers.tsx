'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import { BackupProvider } from '@/lib/context/BackupContext'
import { ThemeProvider } from '@/components/custom/provider/theme-provider'

import { Toaster } from 'sonner'

import i18n from '@/translation/i18n'
import Head from 'next/head'

export function Providers({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState('en')

    useEffect(() => {
        const storedLang = localStorage.getItem('language') || 'en'
        i18n.changeLanguage(storedLang)
        setLang(storedLang)

        // Dynamically update <html lang="...">
        document.documentElement.lang = storedLang
    }, [])

    return (
        <>
            <Head>
                <title>Legazpi City Civil Registry</title>
                <meta name="description" content="The official civil registry for Legazpi City." />
            </Head>

            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                <SessionProvider>
                    <BackupProvider>
                        {children}
                    </BackupProvider>
                </SessionProvider>

                <Toaster position="bottom-right" richColors closeButton theme="system" className="toaster-override" />
            </ThemeProvider>
        </>
    )
}
