// src/types/dashboard.ts
import { User } from 'next-auth'
import { Permission } from '@prisma/client'

// Extend the base NextAuth User type
export interface ExtendedUser extends User {
    id: string
    roles: string[]
    permissions: Permission[]
    username: string | null
    active: boolean
    lastLoginAt: Date | null
    language: string | null
}

export interface DashboardHeaderProps {
    user?: ExtendedUser
    breadcrumbs?: Breadcrumb[]
}

export interface Breadcrumb {
    href?: string
    label: string
    active?: boolean
}

export interface UserHeaderNavProps {
    user?: ExtendedUser
}