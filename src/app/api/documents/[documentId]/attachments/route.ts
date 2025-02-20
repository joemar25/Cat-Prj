// src/app/api/documents/[documentId]/attachments/route.ts
import { PrismaClient, AttachmentType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(
    request: NextRequest,
    { params }: { params: { documentId: string } }
) {
    const { documentId } = params
    const requestData = await request.json()
    console.log('Received request:', requestData)

    const { userId, fileUrl, fileName, fileSize, mimeType, type } = requestData

    try {
        // Check if the document exists
        const existingDocument = await prisma.document.findUnique({
            where: { id: documentId },
        })

        if (!existingDocument) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // Create a new attachment and associate it with the existing document
        const attachment = await prisma.attachment.create({
            data: {
                userId,
                documentId,
                type: type as AttachmentType,
                fileUrl,
                fileName,
                fileSize,
                mimeType,
            },
        })

        return NextResponse.json(attachment)
    } catch (error) {
        console.error('Error creating attachment:', error)
        return NextResponse.json({ error: 'An error occurred while creating the attachment.' }, { status: 500 })
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { documentId: string } }
) {
    const { documentId } = params

    try {
        const attachments = await prisma.attachment.findMany({
            where: { documentId },
            orderBy: { uploadedAt: 'desc' },
        })

        return NextResponse.json(attachments)
    } catch (error) {
        console.error('Error fetching attachments:', error)
        return NextResponse.json({ error: 'An error occurred while fetching attachments.' }, { status: 500 })
    }
}