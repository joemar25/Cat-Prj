import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/custom/sidebar/app-sidebar'
import { CountProvider } from '@/lib/context/count-context'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
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
  )
}