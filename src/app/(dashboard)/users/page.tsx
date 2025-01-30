import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Skeleton } from '@/components/ui/skeleton'
import { UsersTableClient } from '@/components/custom/users/users-table-client'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Environment variable
const REGULAR_USER_ACC = process.env.NEXT_PUBLIC_REGULAR_USER_ACC === 'true'

async function getStaffUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              // Query 'USER' role if REGULAR_USER_ACC is true, otherwise query 'STAFF' role
              name: REGULAR_USER_ACC ? 'USER' : 'STAFF',
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        profile: true, // Include the user's profile
        roles: {
          include: {
            role: {
              include: {
                permissions: true, // Include the role's permissions
              },
            },
          },
        },
      },
    })
    return users
  } catch (error) {
    console.error('Error fetching staff user data:', error)
    return []
  }
}

function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Loading Staff Users</CardTitle>
        <CardDescription>
          Please wait while we fetch the staff user data...
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

export default async function StaffUsersPage() {
  const users = await getStaffUsers()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'Staff Users', href: '/manage-staffs', active: true }]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTableClient users={users} />
        </Suspense>
      </div>
    </>
  )
}