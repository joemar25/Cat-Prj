// src\app\api\attachments\[id]\route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const DELETE = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        await prisma.attachment.delete({
            where: { id: params.id },
        })

        return NextResponse.json(
            { message: 'Attachment deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting attachment:', error)
        return NextResponse.json(
            { error: 'Failed to delete attachment' },
            { status: 500 }
        )
    }
}

export const PATCH = async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const { status } = await req.json()

        // Validate required fields
        if (!status) {
            return NextResponse.json(
                { error: 'Missing status field' },
                { status: 400 }
            )
        }

        // Update the attachment status
        const updatedAttachment = await prisma.attachment.update({
            where: { id: params.id },
            data: { status },
        })

        return NextResponse.json(updatedAttachment, { status: 200 })
    } catch (error) {
        console.error('Error updating attachment status:', error)
        return NextResponse.json(
            { error: 'Failed to update attachment status' },
            { status: 500 }
        )
    }
}