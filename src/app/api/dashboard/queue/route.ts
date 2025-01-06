// src/app/api/dashboard/queue/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/types/auth"
import { Permission, Prisma, QueueStatus } from "@prisma/client"

async function checkUserPermission() {
    const session = await auth()
    if (!session) {
        return { allowed: false, error: "Unauthorized" }
    }

    if (!hasPermission(session.user.permissions as Permission[], Permission.QUEUE_VIEW)) {
        return { allowed: false, error: "Insufficient permissions" }
    }

    return { allowed: true, session }
}

export async function GET(request: Request) {
    try {
        const { allowed, error } = await checkUserPermission()
        if (!allowed) {
            return NextResponse.json({ error }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const aggregate = searchParams.get("aggregate") === "true"

        // Fetch aggregate stats for all statuses
        if (aggregate) {
            const stats = await prisma.queue.groupBy({
                by: ["status"],
                _count: {
                    status: true,
                },
            })

            const total = await prisma.queue.count()

            return NextResponse.json({
                stats,
                total,
            })
        }

        // Fetch paginated queues
        const status = searchParams.get("status")
        const sort = searchParams.get("sort") || "desc"
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        const where: Prisma.QueueWhereInput | undefined =
            status && status !== "all" ? { status: status as QueueStatus } : undefined

        const [queues, total] = await Promise.all([
            prisma.queue.findMany({
                where,
                orderBy: { createdAt: sort === "desc" ? "desc" : "asc" },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                skip,
                take: limit,
            }),
            prisma.queue.count({ where }),
        ])

        // console.log("API Response:", { queues, total })

        return NextResponse.json({
            queues,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        })
    } catch (error) {
        console.error("Queue fetch error:", error)
        return NextResponse.json(
            { error: "Failed to fetch queues" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const { allowed, error } = await checkUserPermission()
        if (!allowed) {
            return NextResponse.json({ error }, { status: 401 })
        }

        const body = await request.json()
        const { id, status, action, notes } = body

        // Handle different actions
        switch (action) {
            case 'update':
                const updateData: Prisma.QueueUpdateInput = {}

                // Handle status update
                if (status) {
                    updateData.status = status as QueueStatus
                    updateData.completedAt = status === QueueStatus.COMPLETED ? new Date() : null
                }

                // Handle notes update
                if (notes !== undefined) {
                    updateData.processingNotes = notes
                }

                const updatedQueue = await prisma.queue.update({
                    where: { id },
                    data: updateData,
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                })
                return NextResponse.json(updatedQueue)

            case 'delete':
                await prisma.queue.delete({
                    where: { id }
                })
                return NextResponse.json({ success: true })

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                )
        }
    } catch (error) {
        console.error('Queue update error:', error)
        return NextResponse.json(
            { error: "Failed to update queue" },
            { status: 500 }
        )
    }
}