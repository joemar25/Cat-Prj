"use client"

import { Fragment } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { UserHeaderNav } from "./user-header-nav"
import { Separator } from "@/components/ui/separator"
import { NotificationBell } from "./notification-bell"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardHeaderProps } from "@/types/dashboard"
import { ThemeChange } from "@/components/theme/theme-change"
import { Calendar as CalendarIcon, Menu } from "lucide-react"
import { LanguageSelector } from "@/components/custom/language/language-selector"
import { FullscreenToggle } from "@/components/custom/full-screen/fullscreen-toggle"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const TimeDisplay = dynamic(() => import("@/components/custom/time/time-display"), { ssr: false })

export function DashboardHeaderClient({ user, breadcrumbs = [] }: DashboardHeaderProps) {
    const pathname = usePathname()
    const isDashboardRoot = pathname === "/dashboard"
    const { t } = useTranslation()
    const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development"

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return t("greeting.morning")
        if (hour < 18) return t("greeting.afternoon")
        return t("greeting.evening")
    }

    return (
        <header className="relative z-20 flex h-16 shrink-0 items-center px-4 justify-between mx-4 rounded-lg shadow-sm border bg-popover">
            {/* Development Mode Indicator */}
            {isDevelopment && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-br-lg shadow-md">
                    Development Mode
                </div>
            )}

            {/* Left Section */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" aria-label="Toggle Sidebar">
                    <Menu className="h-5 w-5" />
                </SidebarTrigger>

                {user && isDashboardRoot ? (
                    <div className="hidden xl:flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground ">{getGreeting()},</span>
                        <span className="font-semibold text-foreground">
                            {user.name || user.username || user.email?.split('@')[0]}
                        </span>
                        <span className="text-accent-foreground">✨</span>
                    </div>
                ) : breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation="vertical" className="hidden sm:block h-4" />
                        <Breadcrumb className="hidden xl:flex ">
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
            <div className="ml-auto flex items-center gap-3 sm:gap-4 ">
                {/* Date & Time */}
                <div className="hidden xl:flex items-center">
                    <div className="flex items-center gap-2 text-sm border border-muted p-[5px] px-3 rounded-md bg-card">
                        <CalendarIcon className="h-6.5 w-4  text-muted-foreground" />
                        <TimeDisplay />
                    </div>
                </div>

                {/* Utilities */}
                <div className="flex items-center sm:gap-[0.6rem] gap-[1rem]">
                    <div className="hidden lg:flex gap-4">
                        <LanguageSelector />
                        <FullscreenToggle />
                        <ThemeChange />
                    </div>
                    {user && <NotificationBell userId={user.id} />}
                    <UserHeaderNav user={user} />
                </div>
            </div>
        </header>
    )
}
