// src/app/api/documents/route.ts
import { PrismaClient, DocumentStatus, AttachmentType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const requestData = await request.json()
    console.log('Received request:', requestData)

    const { userId, formId, fileUrl, fileName, fileSize, mimeType, type, title, status } = requestData

    try {
        // Check if a document already exists for the given formId
        const existingFormDocument = await prisma.baseRegistryFormDocument.findFirst({
            where: {
                baseRegistryFormId: formId,
            },
            include: {
                document: true,
            },
        })

        let document;

        if (existingFormDocument) {
            // If a document exists, create a new attachment and associate it with the existing document
            document = existingFormDocument.document;
        } else {
            // If no document exists, create a new document and associate it with the form
            document = await prisma.document.create({
                data: {
                    type: type as AttachmentType,
                    title,
                    status: status ? (status as DocumentStatus) : DocumentStatus.PENDING,
                    metadata: {},
                    baseRegistryForms: {
                        create: {
                            baseRegistryFormId: formId,
                        },
                    },
                },
            })
        }

        // Create a new attachment and associate it with the document
        const attachment = await prisma.attachment.create({
            data: {
                userId,
                documentId: document.id,
                type: type as AttachmentType,
                fileUrl,
                fileName,
                fileSize,
                mimeType,
            },
        })

        return NextResponse.json({ document, attachment })
    } catch (error) {
        console.error('Error creating document or attachment:', error)
        return NextResponse.json({ error: 'An error occurred while creating the document or attachment.' }, { status: 500 })
    }
}