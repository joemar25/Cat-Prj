// src/utils/list-all-pages.ts
import fs from 'fs'
import path from 'path'

/**
 * Scans the Next.js App Router directory (src/app) for pages and API routes,
 * and returns an array of route paths.
 */
export function listAllPages(): string[] {
    const baseDirectory = 'src/app'
    const basePath = path.join(process.cwd(), baseDirectory)

    if (!fs.existsSync(basePath)) {
        throw new Error(`Directory not found: ${basePath}`)
    }

    return listAppRouter(basePath)
}

function listAppRouter(basePath: string): string[] {
    const routes: string[] = []

    const traverse = (currentPath: string, currentRoute: string = '') => {
        const files = fs.readdirSync(currentPath)

        files.forEach((file) => {
            const fullPath = path.join(currentPath, file)
            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {
                // Skip private folders (starting with '_')
                // For route groups (folders in parentheses), we always traverse them;
                // but later we decide whether to include the group name based on the route.
                if (!file.startsWith('_')) {
                    traverse(fullPath, `${currentRoute}/${file}`)
                }
            } else if (isPageFile(file)) {
                // For a file, derive its route from the current route path.
                // First, replace dynamic segments (e.g., [id] -> :id)
                let routePath = currentRoute.replace(/\[([^\]]+)\]/g, ':$1')

                // If the route is not an API route, remove any route group segments.
                if (!routePath.startsWith('/api')) {
                    routePath = routePath.replace(/\/\([^)]+\)/g, '')
                }
                // Remove any parallel route segments (folders starting with '@')
                routePath = routePath.replace(/\/@[^/]+/g, '')

                // Use "/" if nothing remains
                const normalizedRoute = routePath || '/'
                if (!routes.includes(normalizedRoute)) {
                    routes.push(normalizedRoute)
                }
            }
        })
    }

    traverse(basePath)
    return routes
}

function isPageFile(filename: string): boolean {
    // Only consider files named "page" or "route" with one of these extensions.
    return /^(page|route)\.(tsx|ts|js|jsx)$/.test(filename)
}

// Command line execution support
if (require.main === module) {
    try {
        const result = listAllPages()
        console.log(`Discovered ${result.length} routes in app router:`)
        console.log(result.join('\n'))
    } catch (error) {
        console.error('Error listing pages:')
        console.error(error instanceof Error ? error.message : error)
        process.exit(1)
    }
}

// Example usage:
// console.log(listAllPages('app')) // For App Router
// console.log(listAllPages('pages')) // For Pages Router

// Import and use in your code:
// import { listAllPages } from '@/utils/list-all-pages'
// // For App Router
// const appRoutes = listAllPages('app')
// console.log('App Router Pages:', appRoutes)
// // For Pages Router
// const pagesRoutes = listAllPages('pages')
// console.log('Pages Router Pages:', pagesRoutes)

// Or run directly with ts - node:
// npx ts - node src / utils / list - all - pages.ts
// or
// # List pages router routes
// npm run list-pages -- pages

// # List app router routes
// npm run list-pages -- app
