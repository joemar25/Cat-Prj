// src/components/custom/dashboard/dashboard-header.tsx
import { auth } from '@/lib/auth'
import { DashboardHeaderProps } from '@/types/dashboard'
import { DashboardHeaderClient } from './dashboard-header-client'

export async function DashboardHeader({
    breadcrumbs = []
}: Omit<DashboardHeaderProps, 'user'>) {
    const session = await auth()
    return <DashboardHeaderClient user={session?.user} breadcrumbs={breadcrumbs} />
}