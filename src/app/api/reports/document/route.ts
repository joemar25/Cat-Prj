import { NextResponse } from 'next/server'
import { PrismaClient, DocumentStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Helper: returns a grouping key based on createdAt date.
const getGroupKey = (
    date: Date,
    groupBy: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
) => {
    const d = new Date(date)
    const year = d.getFullYear()

    if (groupBy === 'daily') {
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    if (groupBy === 'weekly') {
        const week = getWeekNumber(d)
        return `${year} W${week}`
    }

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

// Helper: Calculate ISO week number.
const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
    return weekNo
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    // Extended grouping type.
    const groupBy = (searchParams.get('groupBy') || 'quarterly') as
        | 'daily'
        | 'weekly'
        | 'monthly'
        | 'quarterly'
        | 'yearly'
    if (!['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].includes(groupBy)) {
        return NextResponse.json({ message: 'Invalid groupBy value' }, { status: 400 })
    }

    // Filtering parameters.
    // When a specific year is provided, we use it to fill in the full range.
    const yearParam = searchParams.get('year')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Pagination parameters.
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

    // Read display mode.
    // "all" means show every period (including zero-filled ones);
    // "hasDocuments" means filter out periods with 0 documents.
    const displayMode = (searchParams.get('displayMode') || 'all') as "all" | "hasDocuments"

    // Build a filter for the Prisma query.
    let whereClause: any = {}
    if (yearParam) {
        whereClause.createdAt = {
            gte: new Date(`${yearParam}-01-01T00:00:00.000Z`),
            lte: new Date(`${yearParam}-12-31T23:59:59.999Z`)
        }
    } else if (startDate || endDate) {
        whereClause.createdAt = {}
        if (startDate) whereClause.createdAt.gte = new Date(startDate)
        if (endDate) whereClause.createdAt.lte = new Date(endDate)
    }

    try {
        const documents = await prisma.document.findMany({
            where: whereClause,
            select: {
                createdAt: true,
                updatedAt: true,
                status: true,
            },
        })

        // Aggregate the documents into groups.
        type DocGroup = {
            totalDocuments: number
            processedDocuments: number
            pendingDocuments: number
            totalProcessingTime: number
            countForAvg: number
        }
        const groups: Record<string, DocGroup> = {}

        documents.forEach((doc) => {
            const key = getGroupKey(doc.createdAt, groupBy)
            if (!groups[key]) {
                groups[key] = {
                    totalDocuments: 0,
                    processedDocuments: 0,
                    pendingDocuments: 0,
                    totalProcessingTime: 0,
                    countForAvg: 0,
                }
            }
            groups[key].totalDocuments++
            if (doc.status === DocumentStatus.VERIFIED) {
                groups[key].processedDocuments++
            } else if (doc.status === DocumentStatus.PENDING) {
                groups[key].pendingDocuments++
            }
            const processingTime =
                (new Date(doc.updatedAt).getTime() - new Date(doc.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            groups[key].totalProcessingTime += processingTime
            groups[key].countForAvg++
        })

        let result: Array<{
            period: string
            totalDocuments: number
            processedDocuments: number
            pendingDocuments: number
            averageProcessingTime: string
        }> = []

        if (groupBy === 'quarterly') {
            if (yearParam) {
                const quarters = [`${yearParam} Q1`, `${yearParam} Q2`, `${yearParam} Q3`, `${yearParam} Q4`]
                result = quarters.map(period => {
                    const data = groups[period] || {
                        totalDocuments: 0,
                        processedDocuments: 0,
                        pendingDocuments: 0,
                        totalProcessingTime: 0,
                        countForAvg: 0,
                    }
                    return {
                        period,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }
                })
            } else {
                const years = new Set<string>()
                Object.keys(groups).forEach((key) => {
                    const [year] = key.split(" ")
                    years.add(year)
                })
                years.forEach((year) => {
                    const quarters = [`${year} Q1`, `${year} Q2`, `${year} Q3`, `${year} Q4`]
                    quarters.forEach(period => {
                        const data = groups[period] || {
                            totalDocuments: 0,
                            processedDocuments: 0,
                            pendingDocuments: 0,
                            totalProcessingTime: 0,
                            countForAvg: 0,
                        }
                        result.push({
                            period,
                            totalDocuments: data.totalDocuments,
                            processedDocuments: data.processedDocuments,
                            pendingDocuments: data.pendingDocuments,
                            averageProcessingTime:
                                data.countForAvg > 0
                                    ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                    : '0 days',
                        })
                    })
                })
                result.sort((a, b) => a.period.localeCompare(b.period))
            }
        } else if (groupBy === 'yearly') {
            if (yearParam) {
                const yearKey = yearParam
                const data = groups[yearKey] || {
                    totalDocuments: 0,
                    processedDocuments: 0,
                    pendingDocuments: 0,
                    totalProcessingTime: 0,
                    countForAvg: 0,
                }
                result = [{
                    period: yearKey,
                    totalDocuments: data.totalDocuments,
                    processedDocuments: data.processedDocuments,
                    pendingDocuments: data.pendingDocuments,
                    averageProcessingTime:
                        data.countForAvg > 0
                            ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                            : '0 days'
                }]
            } else {
                result = Object.entries(groups)
                    .filter(([period]) => /^\d{4}$/.test(period))
                    .map(([period, data]) => ({
                        period,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }))
                    .sort((a, b) => a.period.localeCompare(b.period))
            }
        } else if (groupBy === 'monthly') {
            if (yearParam) {
                const months: string[] = []
                for (let i = 1; i <= 12; i++) {
                    months.push(`${yearParam}-${String(i).padStart(2, '0')}`)
                }
                result = months.map(month => {
                    const data = groups[month] || {
                        totalDocuments: 0,
                        processedDocuments: 0,
                        pendingDocuments: 0,
                        totalProcessingTime: 0,
                        countForAvg: 0,
                    }
                    return {
                        period: month,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }
                })
            } else {
                result = Object.entries(groups)
                    .filter(([period]) => /^\d{4}-\d{2}$/.test(period))
                    .map(([period, data]) => ({
                        period,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }))
                    .sort((a, b) => a.period.localeCompare(b.period))
            }
        } else if (groupBy === 'weekly') {
            if (yearParam) {
                const weeks: string[] = []
                for (let i = 1; i <= 53; i++) {
                    weeks.push(`${yearParam} W${i}`)
                }
                result = weeks.map(week => {
                    const data = groups[week] || {
                        totalDocuments: 0,
                        processedDocuments: 0,
                        pendingDocuments: 0,
                        totalProcessingTime: 0,
                        countForAvg: 0,
                    }
                    return {
                        period: week,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }
                })
            } else {
                result = Object.entries(groups)
                    .filter(([period]) => /^\d{4} W\d+$/.test(period))
                    .map(([period, data]) => ({
                        period,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }))
                    .sort((a, b) => a.period.localeCompare(b.period))
            }
        } else if (groupBy === 'daily') {
            if (yearParam) {
                const days: string[] = []
                let current = new Date(`${yearParam}-01-01T00:00:00Z`)
                const end = new Date(`${yearParam}-12-31T00:00:00Z`)
                while (current <= end) {
                    const day = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
                    days.push(day)
                    current.setDate(current.getDate() + 1)
                }
                result = days.map(day => {
                    const data = groups[day] || {
                        totalDocuments: 0,
                        processedDocuments: 0,
                        pendingDocuments: 0,
                        totalProcessingTime: 0,
                        countForAvg: 0,
                    }
                    return {
                        period: day,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }
                })
            } else {
                result = Object.entries(groups)
                    .filter(([period]) => /^\d{4}-\d{2}-\d{2}$/.test(period))
                    .map(([period, data]) => ({
                        period,
                        totalDocuments: data.totalDocuments,
                        processedDocuments: data.processedDocuments,
                        pendingDocuments: data.pendingDocuments,
                        averageProcessingTime:
                            data.countForAvg > 0
                                ? (data.totalProcessingTime / data.countForAvg).toFixed(1) + ' days'
                                : '0 days',
                    }))
                    .sort((a, b) => a.period.localeCompare(b.period))
            }
        }

        // Final filtering: if displayMode is "hasDocuments", filter out any period with 0 documents.
        if (displayMode === "hasDocuments") {
            result = result.filter(r => r.totalDocuments > 0)
        }

        // Apply pagination.
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
        console.error('Error fetching document report data:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
