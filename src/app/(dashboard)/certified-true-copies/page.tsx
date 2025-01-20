// src\app\(dashboard)\requests\page.tsx
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header.tsx'
import { RequestsTableClient } from '@/components/custom/certified-true-copies/requests-table-client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { prisma } from '@/lib/prisma'
import { ExtendedCertifiedCopy } from '@/types/certified-true-copy'
import { Suspense } from 'react'

async function getRequests() {
  try {
    const requests = await prisma.certifiedCopy.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        attachment: true,
      },
    }) as unknown as ExtendedCertifiedCopy[]
    return requests
  } catch (error) {
    console.error('Error fetching request data:', error)
    return []
  }
}

function RequestsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Loading Requests</CardTitle>
        <CardDescription>
          Please wait while we fetch the request data...
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

export default async function RequestsPage() {
  const requests = await getRequests()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'Requests', href: '/requests', active: true }]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <Suspense fallback={<RequestsTableSkeleton />}>
          <RequestsTableClient requests={requests} />
        </Suspense>
      </div>
    </>
  )
}