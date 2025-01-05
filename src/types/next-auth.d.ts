// src/types/next-auth.d.ts
import { UserRole, Permission } from '@prisma/client'
import "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        role: UserRole
        permissions: Permission[]
    }

    interface Session {
        user: User & {
            id: string
            role: UserRole
            permissions: Permission[]
        }
    }
}