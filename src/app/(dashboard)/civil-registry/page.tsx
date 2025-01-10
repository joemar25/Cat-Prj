// src/app/(dashboard)/civil-registry/page.tsx
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header.tsx'
import { DataTable } from '@/components/custom/civil-registry/data-table'
import { columns } from '@/components/custom/civil-registry/columns'
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

async function getCivilRegistryForms() {
  try {
    const forms = await prisma.baseRegistryForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        preparedBy: true,
        verifiedBy: true,
      },
    });
    return forms;
  } catch (error) {
    console.error('Error fetching civil registry forms:', error);
    return [];
  }
}

function CivilRegistryFormsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Loading Forms</CardTitle>
        <CardDescription>
          Please wait while we fetch the civil registry forms...
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

export default async function CivilRegistryPage() {
  const forms = await getCivilRegistryForms()

  return (
    <>
      <DashboardHeader
        breadcrumbs={[{ label: 'Civil Registry', href: '/civil-registry', active: true }]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <Suspense fallback={<CivilRegistryFormsTableSkeleton />}>
          <DataTable data={forms} columns={columns} selection={false} />
        </Suspense>
      </div>
    </>
  )
}