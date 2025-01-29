'use client'

import { formatDateTime } from '@/utils/date'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { UserHeaderNav } from './user-header-nav'
import { Separator } from '@/components/ui/separator'
import { NotificationBell } from './notification-bell'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardHeaderProps } from '@/types/dashboard'
import { Calendar as CalendarIcon, Menu } from 'lucide-react'
import { ThemeChange } from '@/components/theme/theme-change'
import { useState, useEffect, useMemo, Fragment } from 'react'
import { LanguageSelector } from '@/components/custom/language/language-selector'
import { FullscreenToggle } from '@/components/custom/full-screen/fullscreen-toggle'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export function DashboardHeaderClient({ user, breadcrumbs = [] }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date>(new Date())
    const pathname = usePathname()
    const isDashboardRoot = pathname === '/dashboard'
    const { t } = useTranslation()

    // Update time every second (optimized)
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Memoized date-time formatting (reduces unnecessary recalculations)
    const formattedTime = useMemo(() => new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(currentTime), [currentTime])

    const getGreeting = useMemo(() => {
        const hour = currentTime.getHours()
        if (hour < 12) return t('greeting_morning')
        if (hour < 17) return t('greeting_afternoon')
        return t('greeting_evening')
    }, [currentTime, t])

    return (
        <header className='z-20 flex h-16 shrink-0 items-center px-4 justify-between mx-4 rounded-lg shadow-sm border bg-popover'>
            {/* Left Section (Sidebar Menu & Breadcrumbs) */}
            <div className='flex items-center gap-2'>
                {/* Sidebar Menu (Always Visible) */}
                <SidebarTrigger className='-ml-1' aria-label="Toggle Sidebar">
                    <Menu className="h-5 w-5" />
                </SidebarTrigger>

                {user && isDashboardRoot ? (
                    <div className='hidden sm:flex items-center gap-2 text-sm sm:text-base'>
                        <span className='text-muted-foreground'>{getGreeting}</span>
                        <span className='font-semibold'>{user.name}! ✨</span>
                    </div>
                ) : breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation='vertical' className='hidden sm:block h-4' />
                        <Breadcrumb className='hidden sm:flex'>
                            <BreadcrumbList>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <Fragment key={index}>
                                        {index < breadcrumbs.length - 1 ? (
                                            <>
                                                <BreadcrumbItem className='hidden md:block'>
                                                    <BreadcrumbLink href={breadcrumb.href || '#'}>
                                                        {t(breadcrumb.label)}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className='hidden md:block' />
                                            </>
                                        ) : (
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>{t(breadcrumb.label)}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        )}
                                    </Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </>
                ) : null}
            </div>

            {/* Right Section (Utilities) */}
            <div className='ml-auto flex items-center gap-3 sm:gap-4'>
                {/* Date & Time Display (Hidden on Mobile) */}
                <div className='hidden sm:flex items-center gap-2'>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 h-9 px-4 py-2 bg-card text-sm"
                        aria-label="Current Date and Time"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span>{t('date_format', { date: formatDateTime(currentTime) })}</span>
                        <span className="tabular-nums border-l pl-2 ml-2">{formattedTime}</span>
                    </Button>
                </div>

                {/* Show only essential items on Mobile */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Optional Features - Hidden on Mobile */}
                    <div className="hidden sm:flex gap-2">
                        <LanguageSelector />
                        <FullscreenToggle />
                        <ThemeChange />
                    </div>

                    {/* Notifications (Always Visible) */}
                    {user && <NotificationBell userId={user.id} />}

                    {/* User Avatar (Always Visible) */}
                    <UserHeaderNav user={user} />
                </div>
            </div>
        </header>
    )
}
