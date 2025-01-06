// src/app/(dashboard)/users/staffs/page.tsx
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Skeleton } from '@/components/ui/skeleton'
import { columns } from '@/components/custom/users/columns'
import { DataTable } from '@/components/custom/users/data-table'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'STAFF',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        profile: {
          select: {
            phoneNumber: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
      },
    })
    return users
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Loading Users</CardTitle>
        <CardDescription>Please wait while we fetch the user data...</CardDescription>
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

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Users', href: '/manage-users', active: true },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<UsersTableSkeleton />}>
          <DataTable
            data={users}
            columns={columns}
            selection={false}
          />
        </Suspense>
      </div>
    </>
  )
}