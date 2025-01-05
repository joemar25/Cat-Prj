// src\app\api\queue\route.ts
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { QueueStatus, ServiceType } from "@prisma/client"

export async function POST(request: NextRequest) {
    try {
        // Parse the body using .json() method
        const body = await request.json()

        // Validate service type
        if (!body.serviceType) {
            return NextResponse.json(
                { error: "Service type is required" },
                { status: 400 }
            )
        }

        // Validate service type against enum
        if (!Object.values(ServiceType).includes(body.serviceType)) {
            return NextResponse.json(
                { error: `Invalid service type. Must be one of: ${Object.values(ServiceType).join(', ')}` },
                { status: 400 }
            )
        }

        // Generate kiosk number
        const kioskNumber = Math.floor(Math.random() * 9000 + 1000)

        // Create queue entry
        const queue = await prisma.queue.create({
            data: {
                serviceType: body.serviceType as ServiceType,
                userId: body.userId || undefined,
                email: body.email || undefined,
                documents: body.documents || [],
                status: QueueStatus.WAITING,
                kioskNumber: kioskNumber
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

        return NextResponse.json({
            ...queue,
            kioskNumber // Explicitly return the kiosk number
        })
    } catch (error) {
        console.error('Queue creation error:', error)

        // Ensure proper error response formatting
        return NextResponse.json(
            {
                error: "Failed to create queue entry",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const sort = searchParams.get('sort') || 'desc'

        // Calculate timestamps for time windows
        const fiveSecondsAgo = new Date(Date.now() - 5000)
        const tenSecondsAgo = new Date(Date.now() - 10000)

        const queues = await prisma.queue.findMany({
            where: {
                ...(status === 'COMPLETED' ? {
                    status: QueueStatus.COMPLETED,
                    completedAt: {
                        gte: fiveSecondsAgo
                    }
                } : status === 'CANCELLED' ? {
                    status: QueueStatus.CANCELLED,
                    completedAt: {
                        gte: tenSecondsAgo
                    }
                } : (
                    status && status !== 'all'
                        ? { status: status as QueueStatus }
                        : {
                            OR: [
                                { status: { not: { in: [QueueStatus.COMPLETED, QueueStatus.CANCELLED] } } },
                                {
                                    AND: [
                                        { status: QueueStatus.COMPLETED },
                                        { completedAt: { gte: fiveSecondsAgo } }
                                    ]
                                },
                                {
                                    AND: [
                                        { status: QueueStatus.CANCELLED },
                                        { completedAt: { gte: tenSecondsAgo } }
                                    ]
                                }
                            ]
                        }
                ))
            },
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

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, status } = body

        const queue = await prisma.queue.update({
            where: { id },
            data: {
                status: status as QueueStatus,
                completedAt: status === QueueStatus.COMPLETED || status === QueueStatus.CANCELLED ? new Date() : null
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