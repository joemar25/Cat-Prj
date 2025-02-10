// src/lib/config/navigation.ts
import { LucideIcon } from "lucide-react"
import { Permission } from "@prisma/client"
import { Icons } from "@/components/ui/icons"
import { UserWithPermissions, hasAnyPermission, getRoleSlug, canManageRole } from "@/types/auth"
import { NavMainItem, NavSecondaryItem, NavigationConfiguration } from "@/lib/types/navigation"
import { routeConfigs, RouteConfig } from "@/lib/config/route-config"

// Use the local constants rather than re-reading process.env directly.
const KIOSK = process.env.NEXT_PUBLIC_KIOSK === "true"

/**
 * Transforms a single route configuration into a NavMainItem.
 * Special handling is applied for the "users" route to create role management sub-items.
 */
export function transformToMainNavItem(
    route: RouteConfig,
    user: UserWithPermissions,
    roles: { id: string; name: string; permissions: { permission: Permission }[] }[],
    t: (key: string) => string
): NavMainItem & { id: string } { // Note the extra "id" property in the return type.
    // Gather the user’s permissions.
    const userPermissions = user.roles.flatMap((role) => role.role.permissions.map((p) => p.permission));

    const baseItem: NavMainItem & { id: string } = {
        id: route.id,
        title: t(route.id),
        url: route.path,
        notViewedCount: 0,
    };

    // Set the icon – fallback to folder.
    if (route.iconName && Icons[route.iconName]) {
        baseItem.icon = Icons[route.iconName] as LucideIcon;
    } else {
        baseItem.icon = Icons.folder;
    }

    // Check for required permissions for the route.
    if (route.requiredPermissions && route.requiredPermissions.length > 0) {
        if (!hasAnyPermission(userPermissions, route.requiredPermissions)) {
            return { ...baseItem, hidden: true };
        }
    }

    // Special handling for "users": add role-specific sub-items if allowed.
    if (route.id === "users") {
        if (!hasAnyPermission(userPermissions, [Permission.USER_READ])) {
            return { ...baseItem, hidden: true };
        }
        baseItem.items = roles
            .filter((role) =>
                canManageRole(userPermissions, role.permissions.map((p) => p.permission))
            )
            .map(({ name }) => ({
                title: `${name}s`,
                url: `/${route.id}/${getRoleSlug(name)}`,
            }));
    }

    return baseItem;
}

/**
 * Returns the main navigation items based on the centralized route config.
 * This function transforms all UI routes (and applies extra feature flags)
 * into a list of NavMainItem objects.
 */
export function getMainNavItems(
    user: UserWithPermissions,
    roles: { id: string; name: string; permissions: { permission: Permission }[] }[],
    t: (key: string) => string
): NavMainItem[] {
    return routeConfigs
        // Only include UI routes that are not hidden from navigation.
        .filter((route) => {
            // Exclude any routes explicitly marked as hidden.
            if (route.hideFromNav) return false;
            // For manage-queue, include only if KIOSK is true.
            if (route.id === "manage-queue" && !KIOSK) return false;
            return route.type === "ui";
        })
        .map((route) => transformToMainNavItem(route, user, roles, t));
}

/**
 * Transforms a route config into a secondary nav item.
 * (This can be used for additional navigation sections.)
 */
export function transformToSecondaryNavItem(routeId: string, t: (key: string) => string): NavSecondaryItem {
    const route = routeConfigs.find((r) => r.id === routeId)
    const IconComponent =
        route && route.iconName && Icons[route.iconName]
            ? (Icons[route.iconName] as LucideIcon)
            : Icons.folder

    return {
        title: route?.title || t(routeId),
        url: route?.path || "/",
        notViewedCount: 0,
        icon: IconComponent,
    }
}

/**
 * Example export of the navigation configuration.
 * You can use getMainNavItems(...) in your layout/page components.
 */
export const navigationConfig: NavigationConfiguration = {
    mainNav: [
        // Populate at runtime via getMainNavItems(user, roles, t)
    ],
    secondaryNav: [
        // You can add secondary nav items using transformToSecondaryNavItem()
    ],
    projectsNav: [
        {
            id: "notifications",
            type: "projects",
            title: "Notifications",
            url: "/notifications",
            iconName: "fileText",
        },
        {
            id: "settings",
            type: "projects",
            title: "Settings",
            url: "/settings",
            iconName: "gear",
        },
        {
            id: "help",
            type: "projects",
            title: "Help",
            url: "/help",
            iconName: "help",
        },
    ],
}
