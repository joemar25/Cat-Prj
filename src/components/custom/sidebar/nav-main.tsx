'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { type NavMainItem } from '@/lib/types/navigation'
import { useTranslation } from 'react-i18next'

interface NavMainProps {
  items: Array<NavMainItem & { icon?: LucideIcon }>
}

export function NavMain({ items }: NavMainProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveSubItem = item.items?.some(subItem => pathname === subItem.url)
          const isActive = pathname === item.url
          const ItemIcon = item.icon

          return (
            <Collapsible key={item.title} defaultOpen={hasActiveSubItem}>
              <SidebarMenuItem>
                <div className="flex items-center w-full justify-between">
                  {/* Sidebar Button (Left Side) */}
                  <SidebarMenuButton
                    asChild
                    onClick={() => item.click?.()}
                    tooltip={item.title}
                    className={`flex-1 flex items-center gap-2 transition-all duration-150 ease-in-out 
                      hover:bg-chart-1/30 active:scale-[0.98] py-5 px-4
                      ${isActive ? 'bg-chart-2 text-accent-foreground font-medium' : ''}
                    `}
                  >
                    <Link href={item.url} className='flex items-center gap-2 w-full'>
                      {ItemIcon && (
                        <ItemIcon className={`w-6 h-6 transition-colors duration-150 
                          ${isActive ? 'text-white' : 'text-muted-foreground'}
                        `} />
                      )}
                      <span className={`${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                        {item.title}
                      </span>
                      {item.notViewedCount !== undefined && item.notViewedCount > 0 && (
                        <Badge variant='default' className='text-xs px-1.5 py-0.5'>
                          {item.notViewedCount}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>

                  {/* Chevron Icon (Right Side) */}
                  {item.items?.length ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className={`transition-transform duration-150 ease-in-out 
                          hover:bg-accent/30 active:scale-[0.98]
                          ${hasActiveSubItem ? 'text-accent-foreground rotate-90' : 'text-muted-foreground'}
                        `}
                      >
                        <Icons.chevronRight className="w-5 h-5" />
                        <span className='sr-only'>Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                  ) : null}
                </div>

                {/* Collapsible Submenu */}
                {item.items?.length ? (
                  <CollapsibleContent className='pl-6 transition-all duration-200 ease-in-out'>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              onClick={() => subItem.click?.()}
                              className={`transition-all duration-150 ease-in-out 
                                hover:bg-accent/50 active:scale-[0.98]
                                ${isSubActive ? 'bg-accent/80 text-accent-foreground font-medium' : ''}
                              `}
                            >
                              <Link href={subItem.url} className="flex items-center gap-2">
                                <span>{subItem.title}</span>
                                {subItem.notViewedCount !== undefined && subItem.notViewedCount > 0 && (
                                  <Badge variant='destructive' className='text-xs px-1.5 py-0.5'>
                                    {subItem.notViewedCount}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
