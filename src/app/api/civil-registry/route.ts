// src/api/(dashboard)/civil-registry/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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
                documents: {
                    include: {
                        document: {
                            include: {
                                attachments: {
                                    include: { certifiedCopies: true },
                                    orderBy: { updatedAt: 'desc' },
                                },
                            },
                        },
                    },
                },
            },
        })

        const processedForms = forms.map((form) => {
            const latestDocument = form.documents[0]?.document
            const latestAttachment = latestDocument?.attachments?.[0]
            const hasCTC = (latestAttachment?.certifiedCopies?.length ?? 0) > 0
            return { ...form, hasCTC }
        })

        return NextResponse.json(processedForms)
    } catch (error) {
        console.error('Error fetching civil registry forms:', error)
        return NextResponse.json(
            { error: 'Error fetching civil registry forms' },
            { status: 500 }
        )
    }
}