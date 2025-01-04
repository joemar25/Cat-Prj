// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl

    // Auth routes handling
    if (pathname === "/auth/sign-in" || pathname === "/auth/sign-up") {
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
            return NextResponse.redirect(new URL("/auth/sign-in", request.url))
        }
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/dashboard/:path*",
        "/auth/sign-in",
        "/auth/sign-up"
    ]
}