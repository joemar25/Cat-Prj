'use client'

import Image from 'next/image'

import { toast } from 'sonner'
import { NavMain } from './nav-main'
import { UserRole } from '@prisma/client'
import { useMemo, useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { NavSecondary } from './nav-secondary'
import { Button } from '@/components/ui/button'
import { handleSignOut } from '@/hooks/auth-actions'
import { useNavigationStore } from '@/lib/stores/navigation'
import { navigationConfig, transformToMainNavItem, transformToSecondaryNavItem } from '@/lib/config/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

type AppSidebarProps = {
  role: UserRole
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const { t } = useTranslation()
  const { visibleMainItems, visibleSecondaryItems } = useNavigationStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  // Transform and filter navigation items
  const visibleMainNav = useMemo(() => {
    return navigationConfig.mainNav
      .filter(item => visibleMainItems.includes(item.id))
      .map(item => {
        const translatedItem = { ...item, title: t(item.id) }
        return transformToMainNavItem(translatedItem, role, t)
      })
      .filter(item => !item.hidden)
  }, [visibleMainItems, role, t])

  const visibleSecondaryNav = useMemo(() => {
    return navigationConfig.secondaryNav
      .filter(item => visibleSecondaryItems.includes(item.id))
      .map(item => {
        const translatedItem = { ...item, title: t(item.id) }
        return transformToSecondaryNavItem(translatedItem, t)
      })
  }, [visibleSecondaryItems, t])

  const closeLogout = () => setIsLogoutOpen(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await handleSignOut()
    toast.success(t('logging-out'), { duration: 3000 })
    setIsLoggingOut(false)
    closeLogout()
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
                <Image src={"/images/new.png"} alt="Logo" width={45} height={45} priority className="rounded-full flex-shrink-0" />

                {/* Title */}
                <div className="flex-1 overflow-hidden">
                  <span className="block font-semibold text-muted-foreground leading-normal break-words max-h-16 overflow-auto">
                    Legazpi City Civil Registry
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Role Panel */}
      <div className="p-4 border-b bg-muted">
        <div className="text-sm text-center font-medium text-muted-foreground">
          {t(role)} {t('panel').toUpperCase()}
        </div>
      </div>

      {/* Sidebar Content */}
      <SidebarContent>
        <NavMain items={visibleMainNav} />
        <NavSecondary items={visibleSecondaryNav} className="mt-auto" />
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        {/* Logout Dialog */}
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
                {isLoggingOut ? t('logging-out') : t('log-out')}
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center justify-center text-center space-y-6 p-8 max-w-sm mx-auto rounded-lg">
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle className="text-lg font-semibold">{t('confirm-logout')}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t('are-you-sure')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center space-x-4 mt-4">
              <Button
                onClick={closeLogout}
                variant="outline"
                className="px-4 py-2 text-sm rounded-md"
                disabled={isLoggingOut}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-sm text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    {t('logging-out')}
                  </>
                ) : (
                  t('log-out')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  )
}
