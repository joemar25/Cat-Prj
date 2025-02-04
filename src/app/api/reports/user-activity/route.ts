import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getGroupKey = (date: Date, groupBy: 'monthly' | 'quarterly' | 'yearly') => {
    const d = new Date(date)
    const year = d.getFullYear()
    if (groupBy === 'monthly') {
        const month = String(d.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    }
    if (groupBy === 'quarterly') {
        const quarter = Math.floor(d.getMonth() / 3) + 1
        return `${year} Q${quarter}`
    }
    return `${year}`
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const groupBy = (searchParams.get('groupBy') || 'quarterly') as 'monthly' | 'quarterly' | 'yearly'
    if (!['monthly', 'quarterly', 'yearly'].includes(groupBy)) {
        return NextResponse.json({ message: 'Invalid groupBy value' }, { status: 400 })
    }

    // NEW: Date filtering parameters.
    const year = searchParams.get('year')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // NEW: Pagination for the grouped results.
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

    // Build filtering criteria.
    let whereClause: any = {}
    if (year) {
        whereClause.createdAt = {
            gte: new Date(`${year}-01-01T00:00:00.000Z`),
            lte: new Date(`${year}-12-31T23:59:59.999Z`)
        }
    } else if (startDate || endDate) {
        whereClause.createdAt = {}
        if (startDate) whereClause.createdAt.gte = new Date(startDate)
        if (endDate) whereClause.createdAt.lte = new Date(endDate)
    }

    try {
        // Fetch audit logs with filtering.
        const auditLogs = await prisma.auditLog.findMany({
            where: whereClause,
            select: {
                createdAt: true,
                userId: true,
                action: true,
            },
        })

        // Group the audit logs.
        type AuditGroup = {
            totalAuditLogs: number
            activeUsers: Set<string>
            actions: Record<string, number>
        }
        const groups: Record<string, AuditGroup> = {}

        auditLogs.forEach((log) => {
            const key = getGroupKey(log.createdAt, groupBy)
            if (!groups[key]) {
                groups[key] = { totalAuditLogs: 0, activeUsers: new Set(), actions: {} }
            }
            groups[key].totalAuditLogs++
            if (log.userId) {
                groups[key].activeUsers.add(log.userId)
            }
            if (log.action) {
                groups[key].actions[log.action] = (groups[key].actions[log.action] || 0) + 1
            }
        })

        const result = Object.entries(groups).map(([period, data]) => ({
            period,
            totalAuditLogs: data.totalAuditLogs,
            activeUsers: data.activeUsers.size,
            topAction: Object.entries(data.actions)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
        })).sort((a, b) => a.period.localeCompare(b.period))

        // NEW: Paginate the grouped results.
        const totalGroups = result.length
        const startIdx = (page - 1) * pageSize
        const paginatedResult = result.slice(startIdx, startIdx + pageSize)

        return NextResponse.json({
            data: paginatedResult,
            meta: {
                totalGroups,
                page,
                pageSize
            }
        })
    } catch (error) {
        console.error('Error fetching user activity report data:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
