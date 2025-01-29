// src/components/custom/dashboard/dashboard-header.tsx
import { auth } from '@/lib/auth'
import { DashboardHeaderProps } from '@/types/dashboard'
import { UserRole, Permission, User } from '@prisma/client'
import { DashboardHeaderClient } from './dashboard-header-client'

export async function DashboardHeader({
    breadcrumbs = []
}: Omit<DashboardHeaderProps, 'user'>) {
    const session = await auth()

    return <DashboardHeaderClient
        user={session?.user as (User & {
            id: string
            role: UserRole
            permissions: Permission[]
        })}
        breadcrumbs={breadcrumbs}
    />
}