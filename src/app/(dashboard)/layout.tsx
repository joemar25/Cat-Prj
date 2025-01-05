import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/custom/sidebar/app-sidebar'
import { CountProvider } from '@/lib/context/count-context'
import { SessionProvider } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <CountProvider>
        <div className='min-h-screen flex flex-col'>
          <main className='flex-1 flex flex-col'>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </main>
        </div>
      </CountProvider>
    </SessionProvider>
  )
}