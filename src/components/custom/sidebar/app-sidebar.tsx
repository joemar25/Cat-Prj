'use client'

import Image from 'next/image'

import { toast } from 'sonner'
import { NavMain } from './nav-main'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { NavSecondary } from './nav-secondary'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { useCount } from '@/lib/context/count-context'
import { useNavigationStore } from '@/lib/stores/navigation'
import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { NavMainItem, NavSecondaryItem } from '@/lib/types/navigation'
import { navigationConfig, transformToMainNavItem, transformToSecondaryNavItem } from '@/lib/config/navigation'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { handleSignOut } from '@/hooks/auth-actions'

type AppSidebarProps = ComponentProps<typeof Sidebar>

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { visibleMainItems, visibleSecondaryItems, visibleSubItems } = useNavigationStore()
  const { data: session } = useSession()
  const { tab, getInitialCount, updateCount } = useCount()


  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)


  const router = useRouter()

  const closeLogout = () => setIsLogoutOpen(false)

  const visibleSecondaryNav = useMemo<NavSecondaryItem[]>(() => {
    return navigationConfig.secondaryNav
      .filter((item) => visibleSecondaryItems.includes(item.id))
      .map(transformToSecondaryNavItem)
  }, [visibleSecondaryItems])

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg" asChild>
              <span className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[state=open]:hover:bg-transparent data-[state=open]:hover:text-inherit group-data-[collapsible=icon]:!size-8 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-transparent hover:focus-ring-0 hover:text-inherit h-12 text-sm group-data-[collapsible=icon]:!p-0">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">
                    {/* removed truncate */}
                    Intellectual Property Office of the Philippines
                  </span>
                </div>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavSecondary items={visibleSecondaryNav} className='mt-auto' />
      </SidebarContent>

      <SidebarFooter>
        <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
          <DialogTrigger asChild>
            <div className='flex w-56 h-6 mb-2 hover:bg-sidebar-accent p-2 ml-2 rounded-md cursor-pointer'>
              <button
                className='text-red-600 flex justify-start text-sm items-center dark:text-red-400'
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Icons.logout className='mr-2 h-4 w-4' />
                )}
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center justify-center text-center space-y-6 p-8 max-w-sm mx-auto rounded-lg' aria-describedby=''>
            <DialogHeader className='flex flex-col items-center'>
              <DialogTitle className='text-lg font-semibold'>Confirm Logout</DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex justify-center space-x-4 mt-4'>
              <Button
                onClick={closeLogout}
                variant='outline'
                className='px-4 py-2 text-sm rounded-md'
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignOut}
                className='px-4 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700 disabled:bg-red-400'
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    Logging out...
                  </>
                ) : (
                  'Log out'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  )
}