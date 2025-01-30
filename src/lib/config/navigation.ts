import { Permission } from '@prisma/client'
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

interface UserWithPermissions {
    roles: {
        role: {
            name: string;
            permissions: {
                permission: Permission;
            }[];
        };
    }[];
}

// Helper function to check if user has permission
function hasPermission(user: UserWithPermissions, requiredPermission: Permission): boolean {
    return user.roles.some(userRole =>
        userRole.role.permissions.some(p => p.permission === requiredPermission)
    );
}

// Helper function to check if user has any of the required permissions
function hasAnyPermission(user: UserWithPermissions, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(permission => hasPermission(user, permission));
}

export function transformToMainNavItem(item: NavConfig, user: UserWithPermissions, t: Function): NavMainItem {
    const baseItem: NavMainItem = {
        title: t(item.id),
        url: item.url,
        notViewedCount: item.notViewedCount
    }

    if (item.iconName) {
        const Icon = Icons[item.iconName]
        if (Icon) {
            baseItem.icon = Icon as LucideIcon
        }
    }

    // Permission-based visibility rules
    switch (item.id) {
        case 'users':
            if (!hasAnyPermission(user, ['USER_READ', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE'])) {
                return { ...baseItem, hidden: true }
            }
            break;
        case 'certified-true-copies':
            if (!hasPermission(user, 'DOCUMENT_VERIFY')) {
                return { ...baseItem, hidden: true }
            }
            break;
        case 'reports':
            if (!hasPermission(user, 'REPORT_READ')) {
                return { ...baseItem, hidden: true }
            }
            break;
    }

    if (hasSubItems(item)) {
        baseItem.items = item.items
            .filter(subItem => {
                if (subItem.url === '/users') {
                    // Regular users management requires specific permissions
                    if (!REGULAR_USER_ACC) return false;
                    return hasPermission(user, 'USER_READ');
                }

                // Check role-specific permissions
                const isAdmin = user.roles.some(ur => ur.role.name === 'Super Admin' || ur.role.name === 'Admin');
                if (subItem.id === 'admin' && !isAdmin) return false;

                return true;
            })
            .map(subItem => ({
                title: t(subItem.id),
                url: subItem.url,
                notViewedCount: subItem.notViewedCount
            }))

        if (baseItem.items?.length === 0) {
            baseItem.items = undefined
        }
    }

    return baseItem
}

export function transformToSecondaryNavItem(item: NavConfig, t: Function): NavSecondaryItem {
    const IconComponent = item.iconName && Icons[item.iconName] ? Icons[item.iconName] as LucideIcon : undefined;

    const baseItem: NavSecondaryItem = {
        title: item.title || t(item.id),
        url: item.url,
        notViewedCount: item.notViewedCount,
        icon: IconComponent ?? Icons.folder,
    };

    return baseItem;
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
        {
            id: 'certified-true-copies',
            type: 'main',
            title: 'Manage CTC',
            url: '/certified-true-copies',
            iconName: 'lifeBuoy',
        },
        {
            id: 'reports',
            type: 'main',
            title: 'Report Generation',
            url: '/reports',
            iconName: 'report',
        },
        {
            id: 'feedback',
            type: 'main',
            title: 'Feedback',
            url: '/feedback',
            iconName: 'mail',
        },
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
       
    ],
    projectsNav: [
        {
            id: 'project-1',
            type: 'projects',
            title: 'Project One',
            url: '/projects/1',
            iconName: 'folder',
        },
        {
            id: 'project-2',
            type: 'projects',
            title: 'Project Two',
            url: '/projects/2',
            iconName: 'folder',
        },
    ],
} as const