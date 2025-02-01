// src/app/api/users/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                active: true
            },
            where: {
                active: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json({ success: true, users }, { status: 200 })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        )
    }
}

