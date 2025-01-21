'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { NavMain } from './nav-main'
import { UserRole } from '@prisma/client'
import { Icons } from '@/components/ui/icons'
import { NavSecondary } from './nav-secondary'
import { Button } from '@/components/ui/button'
import { handleSignOut } from '@/hooks/auth-actions'
import { useNavigationStore } from '@/lib/stores/navigation'
import {
  navigationConfig,
  transformToMainNavItem,
  transformToSecondaryNavItem,
} from '@/lib/config/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type AppSidebarProps = {
  role: UserRole
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const { visibleMainItems, visibleSecondaryItems } = useNavigationStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  // Transform and filter navigation items
  const visibleMainNav = useMemo(() => {
    return navigationConfig.mainNav
      .filter(item => visibleMainItems.includes(item.id)) // Filter by visible items
      .map(item => transformToMainNavItem(item, role)) // Transform to NavMainItem
      .filter(item => !item.hidden); // Filter out hidden items
  }, [visibleMainItems, role])

  const visibleSecondaryNav = useMemo(() => {
    return navigationConfig.secondaryNav
      .filter(item => visibleSecondaryItems.includes(item.id)) // Filter by visible items
      .map(transformToSecondaryNavItem); // Transform to NavSecondaryItem
  }, [visibleSecondaryItems])

  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await handleSignOut()
    toast.success('Successfully logged out', { duration: 3000 })
    setIsLoggingOut(false)
    closeLogout()
  }

  const roleLabel = {
    ADMIN: 'Administrator',
    STAFF: 'Staff',
    USER: 'User',
  }

  return (
    <Sidebar variant="inset" {...props} className='border border-border p-0'>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b p-4 duration-300">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 ">
                {/* Logo */}
                <Image
                  src={"/images/lgu-legazpi.png"}
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                  className="rounded-full flex-shrink-0"
                />

                {/* Title */}
                <div className="flex-1 overflow-hidden">
                  <span className="block font-semibold text-muted-foreground leading-normal break-words max-h-16 overflow-auto">
                    Quanby Demo
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Role Panel */}
      <div className="p-4 border-b bg-muted">
        <div className="text-sm font-medium text-muted-foreground">
          {roleLabel[role]} Panel
        </div>
      </div>

      {/* Sidebar Content */}
      <SidebarContent>
        <NavMain items={visibleMainNav} />
        <NavSecondary items={visibleSecondaryNav} className="mt-auto" />
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
          <DialogTrigger asChild>
            <div className="flex pb-4 cursor-pointer">
              <button
                className="text-red-600 w-full flex rounded-md overflow-hidden duration-300 justify-start text-base p-2 items-center hover:text-white hover:bg-red-500 dark:hover:text-white dark:bg-muted dark:hover:bg-red-600 bg-muted dark:text-red-400"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.logout className="mr-2 h-4 w-4" />
                )}
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center justify-center text-center space-y-6 p-8 max-w-sm mx-auto rounded-lg">
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle className="text-lg font-semibold">Confirm Logout</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center space-x-4 mt-4">
              <Button
                onClick={closeLogout}
                variant="outline"
                className="px-4 py-2 text-sm rounded-md"
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Log out"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  )
}