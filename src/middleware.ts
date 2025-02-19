// src/middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasAnyPermission } from '@/types/auth'
import { routeConfigs } from '@/lib/config/route-config'

export async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl
    const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

    // Allow public access to the roles API endpoint only in development mode
    if (isDevelopment && pathname === '/api/roles') {
        return NextResponse.next()
    }

    // Handle authentication for the /auth page
    if (pathname === '/') {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    // Match protected routes and enforce session
    const matchingRoute = routeConfigs.find((route) => pathname.startsWith(route.path))

    if (matchingRoute?.type !== 'public' && !session) {
        return pathname.startsWith('/api/')
            ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            : NextResponse.redirect(new URL('/', request.url))
    }

    // Enforce permission checks for routes with specific permissions
    if (matchingRoute?.requiredPermissions?.length) {
        if (!hasAnyPermission(session!.user.permissions, matchingRoute.requiredPermissions)) {
            return pathname.startsWith('/api/')
                ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                : NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/civil-registry/:path*',
        '/certified-true-copies/:path*',
        '/feedback/:path*',
        '/manage-queue/:path*',
        '/notifications/:path*',
        '/permissions/:path*',
        '/profile/:path*',
        '/reports/:path*',
        '/requests/:path*',
        '/roles/:path*',
        '/settings/:path*',
        '/users/:path*',
        '/api/:path*',

        // mar-note: add new routes here
        '/help/:path*'
    ],
}
