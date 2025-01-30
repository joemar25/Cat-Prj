// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { Permission } from "@prisma/client"
import type { NextRequest } from "next/server"
import { hasAllPermissions } from "@/types/auth"

export async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl

    // Auth routes handling
    if (pathname === "/auth") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.next()
    }

    // Protected routes (including API routes)
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard")) {
        if (!session) {
            // For API routes, return 401 instead of redirecting
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }
            return NextResponse.redirect(new URL("/auth", request.url))
        }
        return NextResponse.next()
    }

    // Restrict access to /users and its sub-routes to admins only
    if (pathname.startsWith("/users")) {
        if (!session) {
            return NextResponse.redirect(new URL("/auth", request.url))
        }

        // Check if the user has admin permissions
        const requiredPermissions = [
            Permission.USER_READ,
            Permission.USER_CREATE,
            Permission.USER_UPDATE
        ]

        if (!hasAllPermissions(session.user.permissions, requiredPermissions)) {
            // For API routes, return 403 instead of redirecting
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 })
            }
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/dashboard/:path*",
        "/auth",
        "/users/:path*",
    ]
}