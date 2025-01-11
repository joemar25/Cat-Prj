// src/app/api/notifications/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params
    const { read } = await request.json()

    try {
        const notification = await prisma.notification.update({
            where: { id },
            data: { read, readAt: new Date() },
        })
        return NextResponse.json(notification)
    } catch (error) {
        console.error("Failed to mark notification as read:", error)
        return NextResponse.json(
            { error: "Failed to mark notification as read" },
            { status: 500 }
        )
    }
}