import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { UsersTableClient } from '@/components/custom/users/users-table-client'
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

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
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
    console.error('Error fetching admin users:', error)
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
          <UsersTableClient users={users} />
        </Suspense>
      </div>
    </>
  )
}