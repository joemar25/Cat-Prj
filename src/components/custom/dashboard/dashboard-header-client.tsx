'use client'

import { formatDateTime } from '@/utils/date'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserHeaderNav } from './user-header-nav'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect, Fragment } from 'react'
import { NotificationBell } from './notification-bell'
import { Calendar as CalendarIcon } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardHeaderProps } from '@/types/dashboard'
import { ThemeChange } from '@/components/theme/theme-change'
import { LanguageSelector } from '@/components/custom/language/language-selector'
import { FullscreenToggle } from '@/components/custom/fullscreen/fullscreen-toggle'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useTranslation } from 'react-i18next' // Import the useTranslation hook

export function DashboardHeaderClient({ user, breadcrumbs = [] }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const pathname = usePathname()
    const isDashboardRoot = pathname === '/dashboard'
    const { t } = useTranslation() // Initialize the translation hook

    useEffect(() => {
        setCurrentTime(new Date())
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(date)
    }

    const getGreeting = () => {
        const hour = currentTime?.getHours() || 0
        if (hour < 12) return t('greeting_morning') // Translate morning greeting
        if (hour < 17) return t('greeting_afternoon') // Translate afternoon greeting
        return t('greeting_evening') // Translate evening greeting
    }

    return (
        <header className='z-20 flex h-16 shrink-0 items-center px-4 justify-between mx-4 rounded-lg shadow-sm border bg-popover'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-1' />
                {user && isDashboardRoot ? (
                    <div className='flex items-center gap-2'>
                        <span className='text-muted-foreground'>
                            {getGreeting()}
                        </span>
                        <span className='font-semibold'>
                            {user.name}! ✨
                        </span>
                    </div>
                ) : breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <Fragment key={index}>
                                        {index < breadcrumbs.length - 1 ? (
                                            <>
                                                <BreadcrumbItem className='hidden md:block'>
                                                    <BreadcrumbLink href={breadcrumb.href || '#'}>
                                                        {breadcrumb.label}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className='hidden md:block' />
                                            </>
                                        ) : (
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        )}
                                    </Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </>
                ) : null}
            </div>

            <div className='ml-auto flex items-center gap-4'>
                {currentTime && (
                    <div className='flex items-center gap-2'>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 h-9 px-4 py-2 bg-card"
                        >
                            <CalendarIcon className="h-4 w-4" />
                            <span>{t('date_format', { date: formatDateTime(currentTime) })}</span>
                            <span className="tabular-nums border-l pl-2 ml-2">
                                {t('time_format', { time: formatTime(currentTime) })}
                            </span>
                        </Button>
                    </div>
                )}
                <LanguageSelector />
                <FullscreenToggle />
                <ThemeChange />
                {user && <NotificationBell userId={user.id} />}
                <UserHeaderNav user={user} />
            </div>
        </header>
    )
}