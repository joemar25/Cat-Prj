// src/app/api/roles/[id]/route.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Permission } from "@prisma/client"
import { hasPermission } from "@/types/auth"

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: { roles: { include: { role: { include: { permissions: true } } } } }
        })

        const permissions = user?.roles.flatMap(ur => ur.role.permissions.map(rp => rp.permission)) || []
        if (!hasPermission(permissions, Permission.ROLE_DELETE)) {
            return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
        }

        const { id } = params
        const role = await prisma.role.findUnique({ where: { id } })

        if (!role) {
            return NextResponse.json({ success: false, error: "Role not found" }, { status: 404 })
        }

        if (role.name === "Super Admin") {
            return NextResponse.json(
                { success: false, error: "Cannot delete Super Admin role" },
                { status: 403 }
            )
        }

        await prisma.role.delete({ where: { id } })
        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error("Error deleting role:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete role" },
            { status: 500 }
        )
    }
}