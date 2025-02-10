// src/lib/config/route-config.ts
import { Permission } from "@prisma/client"

/**
 * Define the types of routes available.
 *
 * - "ui": Routes that render pages and are typically used for navigation.
 * - "api": Backend API endpoints.
 * - "public": Routes that are accessible without authentication.
 */
export type RouteType = "ui" | "api" | "public"

/**
 * Centralized route configuration interface.
 */
export interface RouteConfig {
    /** Unique identifier for the route */
    id: string
    /** The URL path for the route */
    path: string
    /** The type of route: UI, API, or public */
    type: RouteType
    /** Optional title for UI routes (displayed in navigation) */
    title?: string
    /**
     * Name of the icon from the Icons collection (imported from '@/components/ui/icons').
     * Use the key of the icon you want to display.
     */
    iconName?: keyof typeof import('@/components/ui/icons').Icons
    /**
     * For UI routes, if defined, the user must have at least one of these permissions
     * in order for the route to be visible or accessible.
     */
    requiredPermissions?: Permission[]
    /**
     * If true, the route should be hidden from the navigation.
     */
    hideFromNav?: boolean
}

/**
 * Centralized route configuration array.
 * Update this list as your application’s routes change.
 */
export const routeConfigs: RouteConfig[] = [
    // ========= UI Routes =========
    {
        id: "dashboard",
        path: "/dashboard",
        type: "ui",
        title: "Dashboard",
        iconName: "layoutDashboard",
        requiredPermissions: [], // No permission required
    },
    {
        id: "civil-registry",
        path: "/civil-registry",
        type: "ui",
        title: "Civil Registry",
        iconName: "briefcase",
        requiredPermissions: [Permission.DOCUMENT_READ],
    },
    {
        id: "certified-true-copies",
        path: "/certified-true-copies",
        type: "ui",
        title: "Transactions",
        iconName: "building",
        requiredPermissions: [Permission.DOCUMENT_VERIFY],
    },
    {
        id: "manage-queue",
        path: "/manage-queue",
        type: "ui",
        title: "Manage Queue",
        iconName: "userCheck",
        requiredPermissions: [], // This route will be conditionally shown in navigation based on NEXT_PUBLIC_KIOSK.
    },
    {
        id: "notifications",
        path: "/notifications",
        type: "ui",
        title: "Notifications",
        iconName: "fileText",
        requiredPermissions: [], // Define if you want to restrict access
        hideFromNav: true,
    },
    {
        id: "permissions",
        path: "/permissions",
        type: "ui",
        title: "Permissions",
        iconName: "shield",
        requiredPermissions: [], // Define required permissions if needed
        hideFromNav: true,
    },
    {
        id: "profile",
        path: "/profile",
        type: "ui",
        title: "Profile",
        iconName: "user",
        requiredPermissions: [], // Typically available to any authenticated user
        hideFromNav: true,
    },
    {
        id: "settings",
        path: "/settings",
        type: "ui",
        title: "Settings",
        iconName: "user",
        requiredPermissions: [], // Typically available to any authenticated user
        hideFromNav: true,
    },
    {
        id: "help",
        path: "/help",
        type: "ui",
        title: "Help",
        iconName: "help",
        requiredPermissions: [], // Typically available to any authenticated user
        hideFromNav: true,
    },
    // These certificate request routes are hidden from navigation:
    {
        id: "requests-birth-cert",
        path: "/requests/birth-cert",
        type: "ui",
        title: "Birth Cert Request",
        requiredPermissions: [],
        hideFromNav: true,
    },
    {
        id: "requests-death-cert",
        path: "/requests/death-cert",
        type: "ui",
        title: "Death Cert Request",
        requiredPermissions: [],
        hideFromNav: true,
    },
    {
        id: "requests-marriage-cert",
        path: "/requests/marriage-cert",
        type: "ui",
        title: "Marriage Cert Request",
        requiredPermissions: [],
        hideFromNav: true,
    },
    {
        id: "users",
        path: "/users",
        type: "ui",
        title: "Manage Users",
        iconName: "user",
        requiredPermissions: [
            Permission.USER_READ,
            Permission.USER_CREATE,
            Permission.USER_UPDATE,
        ],
    },
    {
        id: "roles",
        path: "/roles",
        type: "ui",
        title: "Roles & Permissions",
        iconName: "shield",
        requiredPermissions: [Permission.USER_DELETE],
    },
    {
        id: "settings",
        path: "/settings",
        type: "ui",
        title: "Settings",
        iconName: "settings",
        requiredPermissions: [Permission.SYSTEM_SETTINGS_READ],
    },
    {
        id: "users-role",
        path: "/users/:role",
        type: "ui",
        title: "Manage Users by Role",
        requiredPermissions: [
            Permission.USER_READ,
            Permission.USER_CREATE,
            Permission.USER_UPDATE,
        ],
        hideFromNav: true,
    },
    {
        id: "reports",
        path: "/reports",
        type: "ui",
        title: "Reports",
        iconName: "report",
        requiredPermissions: [Permission.REPORT_READ],
    },
    {
        id: "feedback",
        path: "/feedback",
        type: "ui",
        title: "Feedback",
        iconName: "mail",
        requiredPermissions: [Permission.FEEDBACK_READ],
    },

    // ========= API Routes =========
    {
        id: "api-attachments",
        path: "/api/attachments",
        type: "api",
    },
    {
        id: "api-attachments-id",
        path: "/api/attachments/:id",
        type: "api",
    },
    {
        id: "api-auth",
        path: "/api/auth/:...nextauth",
        type: "api",
    },
    {
        id: "api-check-registry-number",
        path: "/api/check-registry-number",
        type: "api",
    },
    {
        id: "api-dashboard-queue",
        path: "/api/dashboard/queue",
        type: "api",
    },
    {
        id: "api-documents",
        path: "/api/documents",
        type: "api",
    },
    {
        id: "api-download",
        path: "/api/download",
        type: "api",
    },
    {
        id: "api-feedback",
        path: "/api/feedback",
        type: "api",
    },
    {
        id: "api-feedback-id",
        path: "/api/feedback/:id",
        type: "api",
    },
    {
        id: "api-forms-id",
        path: "/api/forms/:id",
        type: "api",
    },
    {
        id: "api-notifications-page",
        path: "/api/notifications/page",
        type: "api",
    },
    {
        id: "api-notifications-page-id",
        path: "/api/notifications/page/:id",
        type: "api",
    },
    {
        id: "api-notifications",
        path: "/api/notifications",
        type: "api",
    },
    {
        id: "api-notifications-id",
        path: "/api/notifications/:id",
        type: "api",
    },
    {
        id: "api-preview",
        path: "/api/preview",
        type: "api",
    },
    {
        id: "api-profile",
        path: "/api/profile",
        type: "api",
    },
    {
        id: "api-public-requests",
        path: "/api/public-requests",
        type: "api",
    },
    {
        id: "api-queue",
        path: "/api/queue",
        type: "api",
    },
    {
        id: "api-reports-birth",
        path: "/api/reports/birth",
        type: "api",
    },
    {
        id: "api-reports-death",
        path: "/api/reports/death",
        type: "api",
    },
    {
        id: "api-reports-marriage",
        path: "/api/reports/marriage",
        type: "api",
    },
    {
        id: "api-roles",
        path: "/api/roles",
        type: "api",
    },
    {
        id: "api-roles-id",
        path: "/api/roles/:id",
        type: "api",
    },
    {
        id: "api-upload",
        path: "/api/upload",
        type: "api",
    },
    {
        id: "api-upload-avatar",
        path: "/api/upload-avatar",
        type: "api",
    },
    {
        id: "api-users",
        path: "/api/users",
        type: "api",
    },
    {
        id: "api-users-change-password",
        path: "/api/users/:id/change-password",
        type: "api",
    },
    {
        id: "api-users-profile",
        path: "/api/users/:id/profile",
        type: "api",
    },

    // ========= Public Routes =========
    {
        id: "root",
        path: "/",
        type: "public",
        title: "Home",
    },
    {
        id: "public-request",
        path: "/public-request",
        type: "public",
        title: "Public Request",
    },
    {
        id: "queue",
        path: "/queue",
        type: "public",
        title: "Queue",
    },
    {
        id: "register",
        path: "/register",
        type: "public",
        title: "Register",
    },
    {
        id: "test-page",
        path: "/test-page",
        type: "public",
        title: "Test Page",
    },
]
