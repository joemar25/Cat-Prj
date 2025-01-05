'use client'

import { formatDateTime } from '@/utils/date'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect, Fragment } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardHeaderProps } from '@/types/dashboard'
import { ThemeChange } from '@/components/theme/theme-change'
import { UserHeaderNav } from '@/components/custom/dashboard/user-header-nav'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export function DashboardHeader({ user, breadcrumbs = [] }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)

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
        if (hour < 12) return 'Good morning,'
        if (hour < 17) return 'Good afternoon,'
        return 'Good evening,'
    }

    return (
        <header className='flex h-16 shrink-0 items-center px-4 justify-between mr-4 ml-4 mt-4 mb-2 rounded-lg shadow-sm border bg-popover'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-1' />
                {user ? (
                    <div className='flex items-center gap-2'>
                        <span className='text-muted-foreground'>
                            {getGreeting()}
                        </span>
                        <span className='font-semibold'>
                            {user.name}! ✨
                        </span>

                        {user.role && (
                            <span className='text-muted-foreground font-light'>
                                {user.role}
                            </span>
                        )}
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
                            <span>{formatDateTime(currentTime)}</span>
                            <span className="tabular-nums border-l pl-2 ml-2">
                                {formatTime(currentTime)}
                            </span>
                        </Button>
                    </div>
                )}
                <ThemeChange />
                <UserHeaderNav user={user} />
            </div>
        </header>
    )
}