// src/types/auth.ts
import { UserRole, Permission } from "@prisma/client"

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        Permission.QUEUE_VIEW,
        Permission.QUEUE_PROCESS,
        Permission.QUEUE_DELETE,
        Permission.QUEUE_UPDATE,
        Permission.QUEUE_ADD_NOTES,
        Permission.USERS_MANAGE
    ],
    [UserRole.STAFF]: [
        Permission.QUEUE_VIEW,
        Permission.QUEUE_PROCESS,
        Permission.QUEUE_UPDATE,
        Permission.QUEUE_ADD_NOTES
    ],
    [UserRole.USER]: [
        Permission.QUEUE_VIEW
    ]
}

export function hasPermission(permissions: Permission[] | undefined, permission: Permission): boolean {
    if (!permissions) return false
    return permissions.includes(permission)
}