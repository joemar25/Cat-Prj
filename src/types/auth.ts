// src\types\auth.ts
import { Permission } from "@prisma/client"

/**
 * Predefined permission sets for different role types
 */
export const ROLE_PERMISSIONS = {
    'Super Admin': [
        'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE',
        'ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE',
        'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_DELETE', 'DOCUMENT_VERIFY',
        'REPORT_CREATE', 'REPORT_READ', 'REPORT_EXPORT',
        'AUDIT_LOG_READ'
    ] as Permission[],

    'Admin': [
        'USER_READ', 'USER_CREATE', 'USER_UPDATE',
        'DOCUMENT_CREATE', 'DOCUMENT_READ', 'DOCUMENT_UPDATE', 'DOCUMENT_VERIFY',
        'REPORT_READ', 'REPORT_EXPORT',
        'AUDIT_LOG_READ'
    ] as Permission[],

    'Staff': [
        'DOCUMENT_READ', 'DOCUMENT_CREATE', 'DOCUMENT_VERIFY',
        'REPORT_READ'
    ] as Permission[],

    'User': [
        'DOCUMENT_READ',
        'REPORT_READ'
    ] as Permission[]
}

/**
 * Checks if a user has a specific permission
 */
export function hasPermission(permissions: Permission[] | undefined, permission: Permission): boolean {
    if (!permissions || !Array.isArray(permissions)) return false
    return permissions.includes(permission)
}

/**
 * Gets all permissions for a given role name
 */
export function getRolePermissions(roleName: string): Permission[] {
    return ROLE_PERMISSIONS[roleName as keyof typeof ROLE_PERMISSIONS] || []
}

/**
 * Checks if a user has any of the specified permissions
 */

export function hasAnyPermission(
    permissions: Permission[] | undefined,
    requiredPermissions: Permission[]
): boolean {
    if (!permissions || !Array.isArray(permissions)) return false
    if (!requiredPermissions || !Array.isArray(requiredPermissions)) return false
    return requiredPermissions.some(permission => permissions.includes(permission))
}

/**
 * Checks if a user has all of the specified permissions
 */
export function hasAllPermissions(
    permissions: Permission[] | undefined,
    requiredPermissions: Permission[]
): boolean {
    if (!permissions) return false
    return requiredPermissions.every(permission => permissions.includes(permission))
}

/**
 * Type guard to check if a string is a valid Permission
 */
export function isValidPermission(value: string): value is Permission {
    return Object.values(Permission).includes(value as Permission)
}

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