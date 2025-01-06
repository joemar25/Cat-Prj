// src/types/dashboard.ts
import { User as NextAuthUser } from 'next-auth'
import { UserRole, Permission } from '@prisma/client'

interface ExtendedUser extends NextAuthUser {
    id: string
    role: UserRole
    permissions: Permission[]
}

export interface DashboardHeaderProps {
    user?: ExtendedUser
    breadcrumbs?: {
        href?: string
        label: string
        active?: boolean
    }[]
}

export interface UserHeaderNavProps {
    user?: ExtendedUser
}
