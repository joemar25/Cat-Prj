// src\app\api\forms\[id]\route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
    params: {
        id: string
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { documentUrl } = await request.json()

        // Validate required fields
        if (!documentUrl) {
            return NextResponse.json({
                error: 'Missing documentUrl field'
            }, { status: 400 })
        }

        // Validate form exists
        const existingForm = await prisma.baseRegistryForm.findUnique({
            where: { id: params.id }
        })

        if (!existingForm) {
            return NextResponse.json({
                error: 'Form not found'
            }, { status: 404 })
        }

        // Update the BaseRegistryForm
        const updatedForm = await prisma.baseRegistryForm.update({
            where: { id: params.id },
            data: { documentUrl },
        })

        return NextResponse.json({
            success: true,
            data: updatedForm
        }, { status: 200 })

    } catch (error) {
        console.error('Error updating BaseRegistryForm:', error)
        return NextResponse.json({
            error: 'Failed to update BaseRegistryForm',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const form = await prisma.baseRegistryForm.findUnique({
            where: { id: params.id },
            include: {
                birthCertificateForm: true,
                deathCertificateForm: true,
                marriageCertificateForm: true,
                preparedBy: true,
                verifiedBy: true,
            },
        })

        if (!form) {
            return NextResponse.json({
                error: 'Form not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: form
        }, { status: 200 })

    } catch (error) {
        console.error('Error fetching BaseRegistryForm:', error)
        return NextResponse.json({
            error: 'Failed to fetch BaseRegistryForm',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}