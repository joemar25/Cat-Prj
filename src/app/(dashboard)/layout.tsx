import { AppSidebar } from '@/components/custom/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

type ChildrenProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: ChildrenProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className='flex-1'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}