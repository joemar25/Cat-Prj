// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { hasAnyPermission } from "@/types/auth"
import type { NextRequest } from "next/server"
import { routeConfigs, RouteConfig } from "@/lib/config/route-config"

export async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl

    // Redirect authenticated users away from the auth page.
    if (pathname === "/auth") {
        if (session) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.next()
    }

    // Find a matching route config (if any). You might want to check only UI/API routes.
    const matchingRoute: RouteConfig | undefined = routeConfigs.find((route) =>
        // A simple check: does the current pathname start with the route's path?
        // (For more advanced matching (e.g., dynamic segments), consider using a library.)
        pathname.startsWith(route.path)
    )

    // If the route is protected (i.e. type is 'ui' or 'api') and no session exists, redirect accordingly.
    if (matchingRoute && matchingRoute.type !== "public" && !session) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.redirect(new URL("/auth", request.url))
    }

    // If the route requires specific permissions, check them.
    if (
        matchingRoute &&
        matchingRoute.requiredPermissions &&
        matchingRoute.requiredPermissions.length > 0
    ) {
        // At this point, session is defined.
        if (!hasAnyPermission(session!.user.permissions, matchingRoute.requiredPermissions)) {
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
        "/auth",
        "/dashboard/:path*",
        "/civil-registry/:path*",
        "/certified-true-copies/:path*",
        "/feedback/:path*",
        "/manage-queue/:path*",
        "/notifications/:path*",
        "/permissions/:path*",
        "/profile/:path*",
        "/reports/:path*",
        "/requests/:path*",
        "/roles/:path*",
        "/settings/:path*",
        "/users/:path*",
        // Include API routes if desired.
        "/api/:path*",
    ],
}
