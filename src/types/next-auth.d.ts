// src/types/next-auth.d.ts
import "next-auth"
import { Permission } from "@prisma/client"

declare module "next-auth" {
    interface User {
        id: string
        role?: string
        permissions?: Permission[]
    }

    interface Session {
        user: User & {
            id: string
            role?: string
            permissions?: Permission[]
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role?: string
        permissions?: Permission[]
    }
}