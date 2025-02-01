// src/types/auth.ts
import { Permission } from "@prisma/client"

export interface UserWithPermissions {
    roles: {
        role: {
            name: string;
            permissions: {
                permission: Permission;
            }[];
        };
    }[];
}

// Helper function to get URL-friendly role slugs
export function getRoleSlug(roleName: string): string {
    return roleName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
}

// Helper function to get display name from slug
export function getRoleDisplayName(slug: string): string | undefined {
    // Convert slug back to a potential role name
    return slug.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Checks if a user has a specific permission.
 * Supports both a flat array of Permission enums and an array of objects with a "permission" property.
 */
export function hasPermission(
    permissions: (Permission | { permission: Permission })[] | undefined,
    permission: Permission
): boolean {
    if (!permissions || !Array.isArray(permissions)) return false;

    // If the first element is an object, assume each element has a `permission` property.
    if (permissions.length > 0 && typeof permissions[0] === 'object' && permissions[0] !== null) {
        return (permissions as { permission: Permission }[]).some(
            (p) => p.permission === permission
        );
    }

    // Otherwise, assume it's a flat array of Permission enums.
    return (permissions as Permission[]).includes(permission);
}

/**
 * Checks if a user has any of the specified permissions
 */
export function hasAnyPermission(
    permissions: Permission[] | undefined,
    requiredPermissions: Permission[]
): boolean {
    if (!permissions || !Array.isArray(permissions)) return false;
    if (!requiredPermissions || !Array.isArray(requiredPermissions)) return false;
    return requiredPermissions.some(permission => permissions.includes(permission));
}

/**
 * Checks if a user has all of the specified permissions
 */
export function hasAllPermissions(
    permissions: Permission[] | undefined,
    requiredPermissions: Permission[]
): boolean {
    if (!permissions) return false;
    return requiredPermissions.every(permission => permissions.includes(permission));
}

/**
 * Type guard to check if a string is a valid Permission
 */
export function isValidPermission(value: string): value is Permission {
    return Object.values(Permission).includes(value as Permission);
}

/**
 * Checks if a user can manage users of a specific role based on permissions
 */
export function canManageRole(userPermissions: Permission[], targetRolePermissions: Permission[]): boolean {
    // A user can manage another role if they have all the permissions of that role
    // plus additional user management permissions
    return hasAllPermissions(userPermissions, targetRolePermissions) &&
        hasAnyPermission(userPermissions, ['USER_CREATE', 'USER_UPDATE', 'USER_DELETE'] as Permission[]);
}