"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Menu } from "lucide-react"
import { DashboardHeaderProps } from "@/types/dashboard"
import { Fragment } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserHeaderNav } from "./user-header-nav"
import { NotificationBell } from "./notification-bell"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { LanguageSelector } from "@/components/custom/language/language-selector"
import { FullscreenToggle } from "@/components/custom/full-screen/fullscreen-toggle"
import { ThemeChange } from "@/components/theme/theme-change"

const TimeDisplay = dynamic(() => import("@/components/custom/time-display"), { ssr: false })

export function DashboardHeaderClient({ user, breadcrumbs = [] }: DashboardHeaderProps) {
    const pathname = usePathname()
    const isDashboardRoot = pathname === "/dashboard"
    const { t } = useTranslation()

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return t("greeting.morning")
        if (hour < 18) return t("greeting.afternoon")
        return t("greeting.evening")
    }

    return (
        <header className="z-20  flex h-16 shrink-0 items-center px-4 justify-between mx-4 rounded-lg shadow-sm border bg-popover">
            {/* Left Section */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" aria-label="Toggle Sidebar">
                    <Menu className="h-5 w-5" />
                </SidebarTrigger>

                {user && isDashboardRoot ? (
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-muted-foreground">{getGreeting()},</span>
                        <span className="font-semibold text-foreground">
                            {user.name || user.username || user.email?.split('@')[0]}
                        </span>
                        <span className="text-accent-foreground">✨</span>
                    </div>
                ) : breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation="vertical" className="hidden sm:block h-4" />
                        <Breadcrumb className="hidden sm:flex">
                            <BreadcrumbList>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <Fragment key={index}>
                                        {index < breadcrumbs.length - 1 ? (
                                            <>
                                                <BreadcrumbItem className="hidden md:block">
                                                    <BreadcrumbLink href={breadcrumb.href || "#"}>
                                                        {t(breadcrumb.label)}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className="hidden md:block" />
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

            {/* Right Section */}
            <div className="ml-auto flex items-center gap-3 sm:gap-4">
                {/* Date & Time */}
                <div className="hidden sm:flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-card"
                    >
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <TimeDisplay />
                    </Button>
                </div>

                {/* Utilities */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex gap-2">
                        <LanguageSelector />
                        <FullscreenToggle />
                        <ThemeChange />
                    </div>

                    {/* Notifications & User */}
                    {user && <NotificationBell userId={user.id} />}
                    <UserHeaderNav user={user} />
                </div>
            </div>
        </header>
    )
}