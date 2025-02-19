import { CivilRegistryDataTable } from '@/components/custom/civil-registry/civil-registry-data-table-client';
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';

async function getCivilRegistryForms() {
  try {
    const forms = await prisma.baseRegistryForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        preparedBy: true,
        verifiedBy: true,
        birthCertificateForm: true,
        deathCertificateForm: true,
        marriageCertificateForm: true,
        document: {
          include: {
            attachments: {
              include: { certifiedCopies: true },
              orderBy: { updatedAt: 'desc' },
            },
          },
        },
      },
    });

    // Safely check for certified copies
    return forms.map((form) => {
      const latestAttachment = form.document?.attachments?.[0];
      const hasCTC = (latestAttachment?.certifiedCopies?.length ?? 0) > 0;

      return { ...form, hasCTC };
    });
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
  );
}

export default async function CivilRegistryPage() {
  const forms = await getCivilRegistryForms();

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard', active: false },
          { label: 'Civil Registry', href: '/civil-registry', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <Suspense fallback={<CivilRegistryFormsTableSkeleton />}>
          <CivilRegistryDataTable forms={forms} />
        </Suspense>
      </div>
    </>
  );
}
