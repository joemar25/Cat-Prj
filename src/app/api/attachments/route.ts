// src\app\api\attachments\route.ts
import { NextResponse } from 'next/server'
import { PrismaClient, AttachmentType } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async (req: Request) => {
    try {
        const payload = await req.json()
        console.log('Received payload:', payload)

        const { userId, documentId, type, fileUrl, fileName, fileSize, mimeType } = payload

        // Check document exists first
        const document = await prisma.document.findUnique({
            where: { id: documentId }
        })

        if (!document) {
            return NextResponse.json({
                error: 'Document not found',
                documentId
            }, { status: 404 })
        }

        // Check user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json({
                error: 'User not found',
                userId
            }, { status: 404 })
        }

        // Validate required fields
        const missingFields = []
        if (!userId) missingFields.push('userId')
        if (!documentId) missingFields.push('documentId')
        if (!type) missingFields.push('type')
        if (!fileUrl) missingFields.push('fileUrl')
        if (!fileName) missingFields.push('fileName')
        if (!fileSize) missingFields.push('fileSize')
        if (!mimeType) missingFields.push('mimeType')

        if (missingFields.length > 0) {
            return NextResponse.json({
                error: 'Missing required fields',
                missingFields
            }, { status: 400 })
        }

        // Create the attachment record
        const attachment = await prisma.attachment.create({
            data: {
                userId,
                documentId,
                type: type as AttachmentType,
                fileUrl,
                fileName,
                fileSize,
                mimeType,
                status: 'PENDING',
            },
        })

        return NextResponse.json({ success: true, data: attachment }, { status: 201 })

    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({
            error: 'Failed to create attachment record',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}