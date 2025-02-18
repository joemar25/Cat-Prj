import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { getRoleDisplayName } from '@/types/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { UserWithRoleAndProfile } from '@/types/user'
import { UsersTableClient } from '@/components/custom/users/users-table-client'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
                permissions: {
                  select: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match UserWithRoleAndProfile type
    return users.map(user => ({
      ...user,
      roles: user.roles.map(userRole => ({
        role: {
          ...userRole.role!,
          permissions: userRole.role!.permissions.map(p => ({
            permission: p.permission
          }))
        }
      }))
    })) as UserWithRoleAndProfile[]
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

export default async function UsersPage({ params }: { params: { role: string } }) {
  const { role } = await params

  const users = await getUsers(role)
  const roleName = getRoleDisplayName(role)

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

  // Retrieve the role id based on the role name
  const roleData = await prisma.role.findUnique({
    where: { name: roleName }
  })
  const roleId = roleData?.id || ''

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
          <UsersTableClient users={users} role={roleId} />
        </Suspense>
      </div>
    </>
  )
}
