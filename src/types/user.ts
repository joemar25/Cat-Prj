// src\types\user.ts
import { Permission, Profile, Role, User as PrismaUser } from '@prisma/client'

export interface UserWithRoleAndProfile extends PrismaUser {
    profile: Profile | null
    roles: {
        role: {
            id: string
            name: string
            description: string | null
            createdAt: Date
            updatedAt: Date
            permissions: {
                permission: Permission
            }[]
        }
    }[]
}

export type UserWithProfile = PrismaUser & {
    profile: Profile | null
}