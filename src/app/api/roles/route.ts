import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createRoleSchema } from '@/lib/types/roles'
import { Permission } from '@prisma/client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = createRoleSchema.parse(body)

        // Check if role name already exists (server-side precaution)
        const existingRole = await prisma.role.findUnique({
            where: { name: validatedData.name },
        })

        if (existingRole) {
            return NextResponse.json(
                { success: false, error: 'Role name already exists' },
                { status: 400 }
            )
        }

        // Create role with permissions in a transaction.
        const newRole = await prisma.$transaction(async (tx) => {
            // Create the role.
            const role = await tx.role.create({
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                },
            })

            // Create permissions. We now supply the required roleName.
            await tx.rolePermission.createMany({
                data: validatedData.permissions.map((permission: Permission) => ({
                    roleId: role.id,
                    permission,
                    roleName: role.name, // required field
                })),
            })

            // Return the created role with its permissions.
            return await tx.role.findUnique({
                where: { id: role.id },
                include: {
                    permissions: {
                        select: { permission: true },
                    },
                },
            })
        })

        return NextResponse.json({ success: true, role: newRole }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating role:', error)
        return NextResponse.json(
            { success: false, error: error?.message || 'Failed to create role' },
            { status: 400 }
        )
    }
}

export async function GET() {
    try {
        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                permissions: {
                    select: { permission: true },
                },
            },
        })

        return NextResponse.json({ success: true, roles }, { status: 200 })
    } catch (error) {
        console.error('Error fetching roles:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch roles' },
            { status: 500 }
        )
    }
}

// output:
// {
//   "success": true,
//   "roles": [
//     {
//       "id": "9717fdc3-2a10-4d72-a423-f1ac76bcabb9",
//       "name": "Super Admin"
//     },
//     {
//       "id": "0f3b6f4e-83c0-474f-a169-8285971cf587",
//       "name": "Admin"
//     },
//     {
//       "id": "3809aa5e-a991-47cd-b4fa-80cf84df77ea",
//       "name": "Registrar Officer"
//     },
//     {
//       "id": "aae38aed-e411-478e-98e5-b8e69bc5e43a",
//       "name": "Records Officer"
//     },
//     {
//       "id": "c43c2c49-f108-48f6-a046-f0e8cf76d685",
//       "name": "Verification Officer"
//     },
//     {
//       "id": "8b47e3f2-3d31-41cf-be35-2d7c77a6bf76",
//       "name": "Clerk"
//     }
//   ]
// }