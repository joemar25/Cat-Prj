// src/app/api/queue/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const sort = searchParams.get('sort') || 'desc'

        const queues = await prisma.queue.findMany({
            where: status ? {
                status: status
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
        const body = await request.json()
        const { serviceType, userId, email, documents } = body

        const queue = await prisma.queue.create({
            data: {
                serviceType,
                userId,
                email,
                documents: documents || [],
                status: "waiting"
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

// Add this route to update queue status
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, status } = body

        const queue = await prisma.queue.update({
            where: { id },
            data: {
                status,
                completedAt: status === 'completed' ? new Date() : null
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