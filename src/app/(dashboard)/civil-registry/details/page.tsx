// src/app/(dashboard)/civil-registry/details/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import { BaseDetailsCard } from '@/components/custom/civil-registry/components/base-details-card'
import { CertificateDetails } from '@/components/custom/civil-registry/components/certificate-details'

interface DetailsPageProps {
    searchParams: { formId?: string }
}

async function getFormDetails(formId: string) {
    const form = await prisma.baseRegistryForm.findUnique({
        where: { id: formId },
        include: {
            preparedBy: true,
            verifiedBy: true,
            documents: {
                include: {
                    document: {
                        include: {
                            attachments: {
                                include: { certifiedCopies: true },
                                orderBy: { uploadedAt: 'desc' },
                            },
                        },
                    },
                },
            },
            marriageCertificateForm: true,
            birthCertificateForm: true,
            deathCertificateForm: true,
        },
    })
    return form
}

export default async function ViewDetailsPage({ searchParams }: DetailsPageProps) {
    // Await searchParams before destructuring
    const sp = await Promise.resolve(searchParams)
    const formId = sp.formId
    if (!formId) {
        notFound()
    }
    const form = await getFormDetails(formId)
    if (!form) {
        notFound()
    }

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard', active: false },
                    { label: 'Civil Registry', href: '/civil-registry', active: false },
                    { label: 'Form Details', href: `/civil-registry/details?formId=${formId}`, active: true },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Link href="/civil-registry">
                    <Button variant="default" size="sm">
                        Back to Civil Registry
                    </Button>
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BaseDetailsCard form={form} />
                    <CertificateDetails form={form} />
                </div>
            </div>
        </>
    )
}
