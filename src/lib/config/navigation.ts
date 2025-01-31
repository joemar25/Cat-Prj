// src/lib/config/navigation.ts

import { Permission } from "@prisma/client"
import { Icons } from "@/components/ui/icons"
import { NavConfig, NavMainItem, NavSecondaryItem, NavigationConfiguration } from "@/lib/types/navigation"
import { UserWithPermissions, hasAnyPermission, getRoleSlug, canManageRole } from "@/types/auth"
import type { LucideIcon } from "lucide-react"

// Environment variables
const KIOSK = process.env.NEXT_PUBLIC_KIOSK === "true"
const SETTINGS = process.env.NEXT_PUBLIC_SETTINGS === "true"

// Define permission requirements for each navigation item
const navPermissionRequirements = {
    dashboard: [] as Permission[],
    "manage-queue": [] as Permission[],
    users: {
        view: ["USER_READ"] as Permission[],
        manage: ["USER_CREATE", "USER_UPDATE", "USER_DELETE"] as Permission[],
    },
    "civil-registry": ["DOCUMENT_READ"],
    "certified-true-copies": ["DOCUMENT_VERIFY"],
    reports: ["REPORT_READ"],
    feedback: [],
    settings: [],
} as const

// Fetch roles with permissions
export async function getRoles(): Promise<{ id: string; name: string; permissions: { permission: Permission }[] }[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles`, {
            cache: "no-store",
        })
        const data = await response.json()

        if (!data.success) throw new Error("Failed to fetch roles")

        // Fetch permissions for each role to ensure complete data
        const rolesWithPermissions = await Promise.all(
            data.roles.map(async (role: { id: string; name: string }) => {
                const permissionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roles/${role.id}/permissions`, {
                    cache: "no-store",
                })
                const permissionsData = await permissionsResponse.json()
                return {
                    id: role.id,
                    name: role.name,
                    permissions: permissionsData.permissions || [],
                }
            })
        )

        return rolesWithPermissions
    } catch (error) {
        console.error("Error fetching roles:", error)
        return []
    }
}

export function transformToMainNavItem(
    item: NavConfig,
    user: UserWithPermissions,
    roles: { id: string; name: string; permissions: { permission: Permission }[] }[],
    t: (key: string) => string
): NavMainItem {
    const baseItem: NavMainItem = {
        title: t(item.id),
        url: item.url,
        notViewedCount: item.notViewedCount,
    };

    if (item.iconName && Icons[item.iconName]) {
        baseItem.icon = Icons[item.iconName] as LucideIcon;
    } else {
        baseItem.icon = Icons.folder; // Fallback icon
    }

    const userPermissions = user.roles.flatMap((role) => role.role.permissions.map((p) => p.permission));

    const requiredPermissions = navPermissionRequirements[item.id as keyof typeof navPermissionRequirements];
    if (Array.isArray(requiredPermissions) && requiredPermissions.length > 0) {
        if (!hasAnyPermission(userPermissions, requiredPermissions)) {
            return { ...baseItem, hidden: true };
        }
    }

    if (item.id === "users") {
        if (!hasAnyPermission(userPermissions, navPermissionRequirements.users.view)) {
            return { ...baseItem, hidden: true };
        }

        baseItem.items = roles
            .filter((role) => canManageRole(userPermissions, role.permissions.map((p) => p.permission)))
            .map(({ name }) => ({
                title: `${name}s`,
                url: `/users/${getRoleSlug(name)}`,
            }));
    }

    return baseItem;
}

export function transformToSecondaryNavItem(item: NavConfig, t: (key: string) => string): NavSecondaryItem {
    const IconComponent = item.iconName && Icons[item.iconName] ? (Icons[item.iconName] as LucideIcon) : undefined

    return {
        title: item.title || t(item.id),
        url: item.url,
        notViewedCount: item.notViewedCount,
        icon: IconComponent ?? Icons.folder,
    }
}

export const navigationConfig: NavigationConfiguration = {
    mainNav: [
        {
            id: "dashboard",
            type: "main",
            title: "Dashboard",
            url: "/dashboard",
            iconName: "layoutDashboard",
        },
        ...(KIOSK
            ? [
                {
                    id: "manage-queue",
                    type: "main",
                    title: "Manage Queue",
                    url: "/manage-queue",
                    iconName: "userCheck",
                } as const,
            ]
            : []),
        {
            id: "users",
            type: "main",
            title: "Manage Users",
            url: "/users",
            iconName: "user",
            items: [],
        },
        {
            id: "civil-registry",
            type: "main",
            title: "Civil Registry",
            url: "/civil-registry",
            iconName: "briefcase",
        },
        {
            id: "certified-true-copies",
            type: "main",
            title: "Manage CTC",
            url: "/certified-true-copies",
            iconName: "lifeBuoy",
        },
        {
            id: "reports",
            type: "main",
            title: "Report Generation",
            url: "/reports",
            iconName: "report",
        },
        {
            id: "feedback",
            type: "main",
            title: "Feedback",
            url: "/feedback",
            iconName: "mail",
        },
        ...(SETTINGS
            ? [
                {
                    id: "settings",
                    type: "main",
                    title: "Settings",
                    url: "/settings",
                    iconName: "settings",
                } as const,
            ]
            : []),
    ],
    secondaryNav: [
        // {
        //     id: "notifications",
        //     type: "secondary",
        //     title: "Notifications",
        //     url: "/notifications",
        //     iconName: "messageSquare",
        // },
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
}
