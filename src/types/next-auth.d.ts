// src/types/next-auth.d.ts
import { Permission } from '@prisma/client'
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        roles: string[]
        permissions: Permission[]
    }

    interface Session {
        user: {
            id: string
            roles: string[]
            permissions: Permission[]
            emailVerified: boolean
            username: string | null
            active: boolean
            createdAt: Date
            updatedAt: Date
            lastLoginAt: Date | null
            language: string | null
        } & DefaultSession["user"]
    }

}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        roles: string[]
        permissions: Permission[]
    }
}