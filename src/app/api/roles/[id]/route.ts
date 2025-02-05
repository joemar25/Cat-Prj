import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Permission } from "@prisma/client"
import { hasPermission } from "@/types/auth"
import { createRoleSchema } from "@/lib/types/roles"

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                roles: {
                    include: {
                        role: {
                            include: { permissions: true },
                        },
                    },
                },
            },
        })

        // Use optional chaining and provide a fallback empty array.
        const permissions =
            user?.roles.flatMap((ur) =>
                ur.role?.permissions.map((rp) => rp.permission) || []
            ) || []

        if (!hasPermission(permissions, Permission.ROLE_DELETE)) {
            return NextResponse.json(
                { success: false, error: "Insufficient permissions" },
                { status: 403 }
            )
        }

        const { id } = params
        const role = await prisma.role.findUnique({ where: { id } })

        if (!role) {
            return NextResponse.json(
                { success: false, error: "Role not found" },
                { status: 404 }
            )
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

// PUT endpoint for updating a role
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate the user
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Get the user details with roles and permissions.
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: {
                roles: {
                    include: {
                        role: { include: { permissions: true } },
                    },
                },
            },
        })

        const userPermissions =
            user?.roles.flatMap((ur) =>
                ur.role?.permissions.map((rp) => rp.permission) || []
            ) || []

        if (!hasPermission(userPermissions, Permission.ROLE_UPDATE)) {
            return NextResponse.json(
                { success: false, error: "Insufficient permissions" },
                { status: 403 }
            )
        }

        const { id } = params

        // Find the existing role.
        const role = await prisma.role.findUnique({ where: { id } })
        if (!role) {
            return NextResponse.json(
                { success: false, error: "Role not found" },
                { status: 404 }
            )
        }

        if (role.name === "Super Admin") {
            return NextResponse.json(
                { success: false, error: "Cannot update Super Admin role" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validatedData = createRoleSchema.parse(body)
        // validatedData should include: { name, description, permissions }

        if (role.name !== validatedData.name) {
            const existingRole = await prisma.role.findUnique({
                where: { name: validatedData.name },
            })
            if (existingRole) {
                return NextResponse.json(
                    { success: false, error: "Role name already exists" },
                    { status: 400 }
                )
            }
        }

        const updatedRole = await prisma.$transaction(async (tx) => {
            await tx.role.update({
                where: { id },
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                },
            })

            // Remove all existing permissions for the role.
            await tx.rolePermission.deleteMany({ where: { roleId: id } })

            // Insert the new set of permissions (if any), providing the roleName.
            if (validatedData.permissions && validatedData.permissions.length > 0) {
                await tx.rolePermission.createMany({
                    data: validatedData.permissions.map((permission: Permission) => ({
                        roleId: id,
                        permission,
                        roleName: validatedData.name,
                    })),
                })
            }

            return await tx.role.findUnique({
                where: { id },
                include: {
                    permissions: { select: { permission: true } },
                },
            })
        })

        return NextResponse.json(
            { success: true, role: updatedRole },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Error updating role:", error)
        return NextResponse.json(
            { success: false, error: error?.message || "Failed to update role" },
            { status: 500 }
        )
    }
}
