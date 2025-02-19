// src/app/(dashboard)/users/page.tsx
import { Suspense, type FC } from 'react'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { UsersClientPage, UsersTableSkeleton } from '@/components/custom/users/client/users-client'

import { PageProps } from '@/lib/types/page'
import { Breadcrumb } from '@/types/dashboard'

const breadcrumbs: Breadcrumb[] = [
  { label: 'Dashboard', href: '/dashboard', active: false },
  { label: 'Users', href: '/manage-staffs', active: true },
] as const

const UsersPage: FC<PageProps> = () => {
  return (
    <div>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersClientPage />
        </Suspense>
      </div>
    </div>
  )
}

export default UsersPage