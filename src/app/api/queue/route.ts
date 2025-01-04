// src/app/api/queue/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { QueueStatus, ServiceType } from "@prisma/client"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const sort = searchParams.get('sort') || 'desc'

        const queues = await prisma.queue.findMany({
            where: status && status !== 'all' ? {
                status: status as QueueStatus
            } : undefined,
            orderBy: [
                { createdAt: sort === 'desc' ? 'desc' : 'asc' }
            ],
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(queues)
    } catch (error) {
        console.error('Queue fetch error:', error)
        return NextResponse.json(
            { error: "Failed to fetch queue" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        // Check content type and request method
        const contentType = request.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            return NextResponse.json(
                { error: "Invalid content type. Expected application/json" },
                { status: 400 }
            )
        }

        // Log raw request body for debugging
        const rawBody = await request.text()
        console.log('Raw request body:', rawBody)

        // Parse the body
        let body;
        try {
            body = JSON.parse(rawBody)
        } catch (parseError) {
            console.error('JSON parsing error:', parseError)
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            )
        }

        // Validate required fields
        const { serviceType, userId, email, documents } = body

        // Validate serviceType
        if (!Object.values(ServiceType).includes(serviceType)) {
            return NextResponse.json(
                { error: `Invalid service type. Must be one of: ${Object.values(ServiceType).join(', ')}` },
                { status: 400 }
            )
        }

        const queue = await prisma.queue.create({
            data: {
                serviceType: serviceType as ServiceType,
                userId: userId || undefined,
                email: email || undefined,
                documents: documents || [],
                status: QueueStatus.WAITING, // Always set to WAITING, ignore client-provided status
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(queue)
    } catch (error) {
        console.error('Queue creation error:', error)
        return NextResponse.json(
            { error: "Failed to create queue entry" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, status } = body

        const queue = await prisma.queue.update({
            where: { id },
            data: {
                status: status as QueueStatus,
                completedAt: status === QueueStatus.COMPLETED ? new Date() : null
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(queue)
    } catch (error) {
        console.error('Queue update error:', error)
        return NextResponse.json(
            { error: "Failed to update queue entry" },
            { status: 500 }
        )
    }
}