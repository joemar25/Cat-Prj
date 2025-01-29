'use client'

import Image from 'next/image'

import { NavMain } from './nav-main'
import { UserRole } from '@prisma/client'
import { LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavProjects } from './nav-projects'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { NavSecondary } from './nav-secondary'
import { useNavigationStore } from '@/lib/stores/navigation'
import { navigationConfig, transformToMainNavItem, transformToSecondaryNavItem } from '@/lib/config/navigation'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

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

  const visibleProjectNav = useMemo(() => {
    return navigationConfig.projectsNav.map(item => {
      const translatedItem = { ...item, title: t(item.id) };

      // Ensure the icon is correctly cast to LucideIcon | null
      const IconComponent = (item.iconName ? Icons[item.iconName] : Icons.folder) as LucideIcon | null;

      return {
        title: translatedItem.title,
        url: translatedItem.url,
        icon: IconComponent,
      };
    });
  }, [t]);

  const visibleSecondaryNav = useMemo(() => {
    return navigationConfig.secondaryNav
      .filter(item => visibleSecondaryItems.includes(item.id))
      .map(item => {
        const translatedItem = { ...item, title: t(item.id) }
        return transformToSecondaryNavItem(translatedItem, t)
      })
  }, [visibleSecondaryItems, t])

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
        <NavProjects items={visibleProjectNav} />
        <NavSecondary items={visibleSecondaryNav} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
