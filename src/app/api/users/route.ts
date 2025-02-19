// src/app/api/users/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                username: true,
                emailVerified: true,
                active: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                                permissions: {
                                    select: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                active: true
            },
            orderBy: {
                updatedAt: 'desc'
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