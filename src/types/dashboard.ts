
// src/types/dashboard.ts
import { Session } from 'next-auth'

export interface DashboardHeaderProps {
    user?: Session['user']
    breadcrumbs?: {
        href?: string
        label: string
        active?: boolean
    }[]
}

export interface UserHeaderNavProps {
    user?: Session['user']
}