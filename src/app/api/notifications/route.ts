// src/app/api/notifications/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
        console.error("User ID is required") // Debugging
        return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                read: false,
            },
        })
        return NextResponse.json(notifications)
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        )
    }
}