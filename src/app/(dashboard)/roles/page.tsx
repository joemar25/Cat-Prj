import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/custom/roles/data-table'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getRoles() {
  const roles = await prisma.role.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      permissions: {
        select: {
          permission: true,
        },
      },
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  return roles.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    permissions: item.permissions.map((p) => p.permission),
    users: item.users.map((u) => u.user),
  }))
}

function RoleTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Loading role</CardTitle>
        <CardDescription>Please wait while we fetch the role data...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function RolePage() {
  const roles = await getRoles()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard', active: false },
          { label: 'Role', href: '/role', active: true },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<RoleTableSkeleton />}>
          <DataTable
            data={roles}
            selection={false}
          />
        </Suspense>
      </div>
    </>
  )
}