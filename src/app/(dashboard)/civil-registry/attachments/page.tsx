// src/app/(dashboard)/civil-registry/attachments/page.tsx
import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardHeader } from '@/components/custom/dashboard/dashboard-header'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { AttachmentsTable, AttachmentWithCertifiedCopies } from '@/components/custom/civil-registry/components/attachment-table'

async function getFormData(formId: string) {
    try {
        const form = await prisma.baseRegistryForm.findUnique({
            where: { id: formId },
            include: {
                // Include the document with attachments and their certified copies.
                document: {
                    include: {
                        attachments: {
                            include: { certifiedCopies: true },
                            orderBy: { updatedAt: 'desc' },
                        },
                    },
                },
                preparedBy: true,
                verifiedBy: true,
                birthCertificateForm: true,
                marriageCertificateForm: true,
                deathCertificateForm: true,
            },
        })

        return {
            attachments:
                (form?.document?.attachments as AttachmentWithCertifiedCopies[]) ?? [],
            formType: form?.formType ?? null,
            form,
        }
    } catch (error) {
        console.error('Error:', error)
        return { attachments: [], formType: null, form: null }
    }
}

function AttachmentsPageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    Loading Attachments
                </CardTitle>
                <CardDescription>
                    Please wait while we fetch the attachments...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

interface AttachmentsPageProps {
    searchParams: { formId?: string }
}

export default async function AttachmentsPage({
    searchParams,
}: AttachmentsPageProps) {
    // Resolve the searchParams before destructuring
    const sp = await Promise.resolve(searchParams)
    const formId = sp.formId
    if (!formId) notFound()

    const { attachments, formType, form } = await getFormData(formId)
    if (!formType || !form) notFound()

    return (
        <>
            <DashboardHeader
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard', active: false },
                    { label: 'Civil Registry', href: '/civil-registry', active: false },
                    {
                        label: 'Attachments',
                        href: `/civil-registry/attachments?formId=${formId}`,
                        active: true,
                    },
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Back button placed at the top for consistency */}
                <Link href="/civil-registry">
                    <Button variant={'default'} size={'sm'}>
                        Back to Civil Registry
                    </Button>
                </Link>
                <Suspense fallback={<AttachmentsPageSkeleton />}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                Attachments
                            </CardTitle>
                            <CardDescription>
                                List of attachments for Form <strong>{formId}</strong>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {attachments.length > 0 ? (
                                <AttachmentsTable
                                    attachments={attachments}
                                    canDelete={true}
                                    formType={formType}
                                    formData={form}
                                />
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No attachments available.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </Suspense>
            </div>
        </>
    )
}
