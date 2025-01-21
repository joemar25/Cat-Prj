import { UserRole } from '@prisma/client'
import { Icons } from '@/components/ui/icons'
import { NavConfig, NavMainItem, NavSecondaryItem, NavigationConfiguration, hasSubItems } from '@/lib/types/navigation'

import type { LucideIcon } from 'lucide-react'

// Environment variables
const KIOSK = process.env.NEXT_PUBLIC_KIOSK === 'true'
const SETTINGS = process.env.NEXT_PUBLIC_SETTINGS === 'true'
const DEBUG = process.env.NEXT_PUBLIC_NODE_ENV === 'development'
const REGULAR_USER_ACC = process.env.NEXT_PUBLIC_REGULAR_USER_ACC === 'true'

// Debug logs
if (typeof window !== 'undefined' && DEBUG) {
    console.log('KIOSK env:', process.env.NEXT_PUBLIC_KIOSK)
    console.log('SETTINGS env:', process.env.NEXT_PUBLIC_SETTINGS)
    console.log('REGULAR_USER_ACC env:', process.env.NEXT_PUBLIC_REGULAR_USER_ACC)
    console.log('KIOSK value:', KIOSK)
    console.log('SETTINGS value:', SETTINGS)
    console.log('REGULAR_USER_ACC value:', REGULAR_USER_ACC)
}

// Transform functions
export function transformToMainNavItem(item: NavConfig, role: UserRole): NavMainItem {
    const baseItem: NavMainItem = {
        title: item.title,
        url: item.url,
        notViewedCount: item.notViewedCount
    }

    if (item.iconName) {
        const Icon = Icons[item.iconName]
        if (Icon) {
            baseItem.icon = Icon as LucideIcon
        }
    }

    // Only show "Manage Users" for admins
    if (item.id === 'users' && role !== 'ADMIN') {
        return { ...baseItem, hidden: true } // Hide the item for non-admins
    }

    if (hasSubItems(item)) {
        baseItem.items = item.items
            .filter(subItem => {
                // Admin can see all sub-items
                if (role === 'ADMIN') return true

                // Staff can only see regular users if REGULAR_USER_ACC is true
                if (role === 'STAFF' && subItem.url === '/users') {
                    return REGULAR_USER_ACC // Only show regular users if REGULAR_USER_ACC is true
                }

                // Regular users and other roles should not see any sub-items
                return false
            })
            .map(subItem => ({
                title: subItem.title,
                url: subItem.url,
                notViewedCount: subItem.notViewedCount
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
        notViewedCount: item.notViewedCount
    }

    if (item.iconName) {
        const Icon = Icons[item.iconName]
        if (Icon) {
            baseItem.icon = Icon as LucideIcon
        }
    }

    return baseItem
}

// Navigation configuration
export const navigationConfig: NavigationConfiguration = {
    mainNav: [
        {
            id: 'dashboard',
            type: 'main',
            title: 'Dashboard',
            url: '/dashboard',
            iconName: 'layoutDashboard',
        },
        // Always include KIOSK when env is true
        ...(KIOSK ? [
            {
                id: 'manage-queue',
                type: 'main',
                title: 'Manage Queue',
                url: '/manage-queue',
                iconName: 'userCheck',
            } as const,
        ] : []),
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
                // Only include regular-users if REGULAR_USER_ACC is true
                ...(REGULAR_USER_ACC ? [
                    {
                        id: 'regular-users',
                        title: 'Regular Users',
                        url: '/users',
                    },
                ] : []),
            ],
        },
        {
            id: 'civil-registry',
            type: 'main',
            title: 'Civil Registry',
            url: '/civil-registry',
            iconName: 'briefcase',
        },
        // {
        //     id: 'requests',
        //     type: 'main',
        //     title: 'Manage Requests',
        //     url: '/requests',
        //     iconName: 'tag',
        //     items: [
        //         {
        //             id: 'birth',
        //             title: 'Birth Cert',
        //             url: '/requests/birth-cert',
        //         },
        //         {
        //             id: 'marriage',
        //             title: 'Marriage Cert',
        //             url: '/requests/marriage-cert',
        //         },
        //         {
        //             id: 'death',
        //             title: 'Death Cert',
        //             url: '/requests/death-cert',
        //         },
        //     ],
        // },
        {
            id: 'certified-true-copies',
            type: 'main',
            title: 'Mangage CTC',
            url: '/certified-true-copies',
            iconName: 'lifeBuoy',
        },
        {
            id: 'feedback',
            type: 'main',
            title: 'Feedback',
            url: '/feedback',
            iconName: 'mail',
        },
        // Always include Settings when env is true
        ...(SETTINGS ? [
            {
                id: 'settings',
                type: 'main',
                title: 'Settings',
                url: '/settings',
                iconName: 'settings',
            } as const,
        ] : []),
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