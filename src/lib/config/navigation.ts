// src/lib/config/navigation.ts
import { Icons } from '@/components/ui/icons'
import type { LucideIcon } from 'lucide-react'
import {
    type NavConfig,
    type NavMainItem,
    type NavSecondaryItem,
    type NavigationConfiguration,
    hasSubItems,
} from '@/lib/types/navigation'

// Helper function to transform config to main nav item
export function transformToMainNavItem(item: NavConfig): NavMainItem {
    const baseItem: NavMainItem = {
        title: item.title,
        url: item.url,
        notViewedCount: item.notViewedCount,
    }

    if (item.iconName && item.iconName in Icons) {
        baseItem.icon = Icons[item.iconName] as LucideIcon
    }

    if (hasSubItems(item)) {
        baseItem.items = item.items.map(subItem => ({
            title: subItem.title,
            url: subItem.url,
            notViewedCount: subItem.notViewedCount,
        }))
    }

    return baseItem
}

// Helper function to transform config to secondary nav item
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
        // {
        //     id: 'documents',
        //     type: 'main',
        //     title: 'Documents',
        //     url: '/documents',
        //     iconName: 'folder',
        //     items: [
        //         {
        //             id: 'dispatch',
        //             title: 'Owned',
        //             url: '/documents/dispatch',
        //         },
        //         {
        //             id: 'intransit',
        //             title: 'In Transit',
        //             url: '/documents/intransit',
        //         },
        //         {
        //             id: 'received',
        //             title: 'Received',
        //             url: '/documents/recieved',
        //         },
        //         {
        //             id: 'completed',
        //             title: 'Completed',
        //             url: '/documents/completed',
        //         },
        //     ],
        // },
        // {
        //     id: 'reports',
        //     type: 'main',
        //     title: 'Reports',
        //     url: '/reports',
        //     iconName: 'fileText',
        // },
        {
            id: 'users',
            type: 'main',
            title: 'Manage Users',
            url: '/users',
            iconName: 'user',
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