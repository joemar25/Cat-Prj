import './globals.css'

import localFont from 'next/font/local'

import { Metadata } from 'next'
import { Providers } from '@/components/custom/provider/providers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Legazpi City Civil Registry',
  description: 'The official civil registry for Legazpi City.',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <body className="text-foreground" data-theme="light">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
