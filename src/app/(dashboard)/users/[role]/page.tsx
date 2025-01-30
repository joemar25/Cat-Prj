import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { getRoleDisplayName } from '@/types/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { UsersTableClient } from '@/components/custom/users/users-table-client'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
  params: { role: string }
}

async function getUsers(roleSlug: string) {
  try {
    const roleName = getRoleDisplayName(roleSlug)
    if (!roleName) return []

    const users = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: roleName
            }
          }
        }
      },
      include: {
        profile: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Loading Users</CardTitle>
        <CardDescription>
          Please wait while we fetch the user data...
        </CardDescription>
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

export default async function UsersPage({ params }: PageProps) {
  const users = await getUsers(params.role)
  const roleName = getRoleDisplayName(params.role)

  if (!roleName) {
    // Handle invalid role slug
    return (
      <div className="flex flex-1 items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-destructive">Invalid Role</CardTitle>
            <CardDescription>
              The specified role does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Users', href: '/users', active: false },
          { label: roleName, active: true }
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTableClient users={users} />
        </Suspense>
      </div>
    </>
  )
}