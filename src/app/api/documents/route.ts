import { PrismaClient, DocumentStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const requestData = await request.json()
    console.log('Received request:', requestData)

    const { userId, formId, formType, registryNumber, fileUrl, fileName, fileSize, mimeType, type, title, status } = requestData

    try {
        const document = await prisma.document.create({
            data: {
                type,
                title,
                status: status || DocumentStatus.PENDING,
                metadata: {},
                BaseRegistryForm: {
                    connect: { id: formId },
                },
                attachments: {
                    create: {
                        userId,
                        type,
                        fileUrl,
                        fileName,
                        fileSize,
                        mimeType,
                    },
                },
            },
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error('Error creating document:', error)
        return NextResponse.json({ error: 'An error occurred while creating the document.' }, { status: 500 })
    }
}