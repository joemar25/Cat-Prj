// src/app/(dashboard)/users/page.tsx
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header.tsx'
import { columns } from '@/components/custom/users/columns'
import { DataTable } from '@/components/custom/users/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'

// Environment variable
const REGULAR_USER_ACC = process.env.NEXT_PUBLIC_REGULAR_USER_ACC === 'true'

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        // Query 'STAFF' if REGULAR_USER_ACC is false, otherwise query 'USER'
        role: REGULAR_USER_ACC ? 'USER' : 'STAFF',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        profile: true,
      },
    })
    return users
  } catch (error) {
    console.error('Error fetching user data:', error)
    return []
  }
}

function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Loading Users</CardTitle>
        <CardDescription>
          Please wait while we fetch the user data...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full' />
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
        breadcrumbs={[{ label: 'Users', href: '/manage-users', active: true }]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <Suspense fallback={<UsersTableSkeleton />}>
          <DataTable data={users} columns={columns} selection={false} />
        </Suspense>
      </div>
    </>
  )
}