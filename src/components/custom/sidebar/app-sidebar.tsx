// src\components\custom\sidebar\app-sidebar.tsx
'use client'

import Image from 'next/image'

import { toast } from 'sonner'
import { NavMain } from './nav-main'
import { UserRole } from '@prisma/client'
import { Icons } from '@/components/ui/icons'
import { NavSecondary } from './nav-secondary'
import { Button } from '@/components/ui/button'
import { handleSignOut } from '@/hooks/auth-actions'
import { ComponentProps, useMemo, useState } from 'react'
import { useNavigationStore } from '@/lib/stores/navigation'
import { NavMainItem, NavSecondaryItem } from '@/lib/types/navigation'
import { navigationConfig, transformToMainNavItem, transformToSecondaryNavItem } from '@/lib/config/navigation'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  role: UserRole
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const { visibleMainItems, visibleSecondaryItems } = useNavigationStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const visibleMainNav = useMemo<NavMainItem[]>(() => {
    return navigationConfig.mainNav
      .filter((item) => visibleMainItems.includes(item.id))
      .map(transformToMainNavItem)
  }, [visibleMainItems])

  const visibleSecondaryNav = useMemo<NavSecondaryItem[]>(() => {
    return navigationConfig.secondaryNav
      .filter((item) => visibleSecondaryItems.includes(item.id))
      .map(transformToSecondaryNavItem)
  }, [visibleSecondaryItems])

  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await handleSignOut()
    toast.success("Successfully logged out", {
      duration: 3000,
    })
    setIsLoggingOut(false)
    closeLogout()
  }

  const roleLabel = {
    ADMIN: "Administrator",
    STAFF: "Staff",
    USER: "User",
  }

  return (
    <Sidebar variant="inset" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
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
                  <span
                    className="block font-semibold text-muted-foreground leading-normal break-words max-h-16 overflow-auto"
                    title="Quanby Queueing System"
                  >
                    Quanby Queueing System
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
            <div className="flex w-56 h-6 mb-2 hover:bg-muted p-2 ml-2 rounded-md cursor-pointer">
              <button
                className="text-red-600 flex justify-start text-sm items-center dark:text-red-400"
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
