// src/types/next-auth.d.ts
import { UserRole, Permission } from '@prisma/client'
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        role: UserRole
        permissions: Permission[]
    }

    interface Session {
        user: {
            id: string
            role: UserRole
            permissions: Permission[]
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: UserRole
        permissions: Permission[]
    }
}