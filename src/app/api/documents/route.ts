// src\app\api\documents\route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async (req: Request) => {
    try {
        // First check if we can parse the request body
        let body
        try {
            body = await req.json()
        } catch (parseError) {
            console.log(parseError)
            return NextResponse.json({
                error: 'Invalid request body',
                details: 'Request body must be valid JSON'
            }, { status: 400 })
        }

        const { type, title, status } = body

        // Validate required fields
        if (!type || !title) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: {
                    type: type ? 'valid' : 'missing',
                    title: title ? 'valid' : 'missing'
                }
            }, { status: 400 })
        }

        // Create the document
        const document = await prisma.document.create({
            data: {
                type,
                title,
                status: status || 'PENDING',
            },
        })

        return NextResponse.json({ success: true, data: document }, { status: 201 })

    } catch (error) {
        console.error('Error creating document:', error)

        return NextResponse.json({
            error: 'Failed to create document',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}