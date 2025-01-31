// src/app/api/roles/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface RouteParams {
    params: { id: string }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = params
        await prisma.role.delete({ where: { id } })
        return NextResponse.json(
            { success: true, message: "Role deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting role:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete role" },
            { status: 500 }
        )
    }
}