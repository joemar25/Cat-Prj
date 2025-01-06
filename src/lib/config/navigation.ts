import type { LucideIcon } from 'lucide-react'

import { Icons } from '@/components/ui/icons'
import {
    type NavConfig,
    type NavMainItem,
    type NavSecondaryItem,
    type NavigationConfiguration,
    hasSubItems,
} from '@/lib/types/navigation'
import { UserRole } from '@prisma/client'

export function transformToMainNavItem(item: NavConfig, role: UserRole): NavMainItem {
    const baseItem: NavMainItem = {
        title: item.title,
        url: item.url,
        notViewedCount: item.notViewedCount,
    }

    if (item.iconName && item.iconName in Icons) {
        baseItem.icon = Icons[item.iconName] as LucideIcon
    }

    if (hasSubItems(item)) {
        baseItem.items = item.items
            .filter(subItem => {
                // Admin can see all sub-items
                if (role === 'ADMIN') return true

                // Staff can only see regular users
                if (role === 'STAFF' && subItem.url === '/users') {
                    return true
                }

                // Regular users and other roles should not see any sub-items
                return false
            })
            .map(subItem => ({
                title: subItem.title,
                url: subItem.url,
                notViewedCount: subItem.notViewedCount,
            }))

        // Ensure dropdown is only visible if there are items for this role
        if (baseItem.items?.length === 0) {
            baseItem.items = undefined
        }
    }

    return baseItem
}

export function transformToSecondaryNavItem(item: NavConfig): NavSecondaryItem {
    const baseItem: NavSecondaryItem = {
        title: item.title,
        url: item.url,
        notViewedCount: item.notViewedCount,
    }

    if (item.iconName && item.iconName in Icons) {
        baseItem.icon = Icons[item.iconName] as LucideIcon
    }

    return baseItem
}

export const navigationConfig: NavigationConfiguration = {
    mainNav: [
        {
            id: 'dashboard',
            type: 'main',
            title: 'Dashboard',
            url: '/dashboard',
            iconName: 'layoutDashboard',
        },
        {
            id: 'manage-queue',
            type: 'main',
            title: 'Manage Queue',
            url: '/manage-queue',
            iconName: 'userCheck',
        },
        {
            id: 'users',
            type: 'main',
            title: 'Manage Users',
            url: '/users',
            iconName: 'user',
            items: [
                {
                    id: 'admin',
                    title: 'Admin',
                    url: '/users/admin',
                },
                {
                    id: 'staffs',
                    title: 'Staffs',
                    url: '/users/staffs',
                },
                {
                    id: 'regular-users',
                    title: 'Regular Users',
                    url: '/users',
                },
            ],
        },
        {
            id: 'settings',
            type: 'main',
            title: 'Settings',
            url: '/settings',
            iconName: 'settings',
        },
    ],
    secondaryNav: [
        {
            id: 'feedback',
            type: 'secondary',
            title: 'Send Feedback',
            url: '/feedback',
            iconName: 'messageSquare',
        },
    ],
} as const