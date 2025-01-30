// src\types\user.ts
import { Permission, Profile, Role, User as PrismaUser } from '@prisma/client'

export interface UserWithRoleAndProfile extends PrismaUser {
    profile: Profile | null
    roles: {
        role: Role & {
            permissions: {
                permission: Permission
            }[]
        }
    }[]
}

export type UserWithProfile = PrismaUser & {
    profile: Profile | null
}