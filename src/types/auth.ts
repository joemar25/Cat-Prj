// src\types\auth.ts
import { UserRole, Permission } from "@prisma/client"

/**
 * Maps user roles to their corresponding permissions
 * ADMIN: Full system access
 * STAFF: Operational access
 * USER: Basic access
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        // Queue Management
        Permission.QUEUE_VIEW,
        Permission.QUEUE_PROCESS,
        Permission.QUEUE_DELETE,
        Permission.QUEUE_UPDATE,
        Permission.QUEUE_ADD_NOTES,

        // User Management
        Permission.USERS_MANAGE,

        // Document Management
        Permission.DOCUMENTS_MANAGE,

        // Workflow Management
        Permission.WORKFLOW_MANAGE,

        // System Access
        Permission.REPORTS_VIEW,
        Permission.SYSTEM_SETTINGS
    ],
    [UserRole.STAFF]: [
        // Queue Management
        Permission.QUEUE_VIEW,
        Permission.QUEUE_PROCESS,
        Permission.QUEUE_UPDATE,
        Permission.QUEUE_ADD_NOTES,

        // Limited Document Access
        Permission.DOCUMENTS_MANAGE,

        // Reporting
        Permission.REPORTS_VIEW
    ],
    [UserRole.USER]: [
        // Basic Access
        Permission.QUEUE_VIEW
    ]
}

/**
 * Checks if a user has a specific permission
 * @param permissions - Array of user permissions
 * @param permission - Permission to check
 * @returns boolean indicating if user has the permission
 */
export function hasPermission(permissions: Permission[] | undefined, permission: Permission): boolean {
    if (!permissions) return false
    return permissions.includes(permission)
}

/**
 * Gets all permissions assigned to a specific role
 * @param role - UserRole to check
 * @returns Array of permissions for the role
 */
export function getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || []
}

/**
 * Checks if a user has any of the specified permissions
 * @param permissions - Array of user permissions
 * @param requiredPermissions - Array of permissions to check against
 * @returns boolean indicating if user has any of the permissions
 */
export function hasAnyPermission(
    permissions: Permission[] | undefined,
    requiredPermissions: Permission[]
): boolean {
    if (!permissions) return false
    return requiredPermissions.some(permission => permissions.includes(permission))
}

/**
 * Checks if a user has all of the specified permissions
 * @param permissions - Array of user permissions
 * @param requiredPermissions - Array of permissions to check against
 * @returns boolean indicating if user has all of the permissions
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
 * @param value - String to check
 * @returns boolean indicating if string is a valid Permission
 */
export function isValidPermission(value: string): value is Permission {
    return Object.values(Permission).includes(value as Permission)
}

/**
 * Get the highest role from an array of roles
 * @param roles - Array of UserRoles
 * @returns The highest priority role
 */
export function getHighestRole(roles: UserRole[]): UserRole {
    const rolePriority: Record<UserRole, number> = {
        [UserRole.ADMIN]: 3,
        [UserRole.STAFF]: 2,
        [UserRole.USER]: 1
    }

    return roles.reduce((highest, current) =>
        rolePriority[current] > rolePriority[highest] ? current : highest
        , UserRole.USER)
}