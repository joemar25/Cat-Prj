import { NextResponse } from 'next/server'
import { PrismaClient, Prisma, FormType } from '@prisma/client'
import {
    GroupByOption,
    ReportDataItem,
    groupDocumentsByPeriod,
    zeroFillMultipleYears,
    zeroFillGroups,
    countGlobalRegistrations,
} from '@/lib/report-helpers'
import { ApiResponse } from '@/types/report'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const groupBy = (searchParams.get('groupBy') || 'yearly') as GroupByOption
        const startDateParam = searchParams.get('startDate')
        const endDateParam = searchParams.get('endDate')
        const displayMode = searchParams.get('displayMode') || 'all'
        const classification = searchParams.get('classification') || 'all'
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10))

        // Build where clause for BaseRegistryForm (registration date & classification)
        const baseFormWhere: Prisma.BaseRegistryFormWhereInput = {}

        if (classification !== 'all') {
            baseFormWhere.formType = classification.toUpperCase() as FormType
        }

        // IMPORTANT: For filtering by registration date we apply the date filter to BaseRegistryForm.
        if (startDateParam && endDateParam) {
            baseFormWhere.createdAt = {
                gte: new Date(startDateParam),
                lte: new Date(endDateParam),
            }
        }

        // Build the document where clause to ensure at least one base form matches.
        const whereClause: Prisma.DocumentWhereInput = {
            BaseRegistryForm: {
                some: baseFormWhere,
            },
        }

        // Fetch documents along with their BaseRegistryForm data.
        const documents = await prisma.document.findMany({
            where: whereClause,
            include: {
                BaseRegistryForm: {
                    select: {
                        id: true,
                        formType: true,
                        createdAt: true,
                        documentId: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        })

        // Group documents by period using the earliest valid base form's createdAt.
        const groups = groupDocumentsByPeriod(documents, groupBy)

        // Use zero-fill helpers.
        let reportData: ReportDataItem[] = []
        if (!startDateParam && !endDateParam) {
            reportData = zeroFillMultipleYears(groups, groupBy, documents)
        } else {
            // Derive the years present in the filtered data.
            const yearsSet = new Set<number>()
            documents.forEach((doc) => {
                const validForms = doc.BaseRegistryForm.filter(
                    (form) => form.documentId && form.createdAt
                )
                if (validForms.length > 0) {
                    const earliest = new Date(
                        Math.min(...validForms.map((form) => new Date(form.createdAt).getTime()))
                    )
                    yearsSet.add(earliest.getFullYear())
                } else {
                    yearsSet.add(new Date(doc.createdAt).getFullYear())
                }
            })
            yearsSet.forEach((year) => {
                reportData = reportData.concat(zeroFillGroups(groups, groupBy, year.toString()))
            })
        }

        if (displayMode === 'hasDocuments') {
            reportData = reportData.filter((item) => item.totalDocuments > 0)
        }

        const totalGroups = reportData.length
        const paginatedData = reportData.slice((page - 1) * pageSize, page * pageSize)

        // Use the filtered documents for counts.
        const classificationCounts = countGlobalRegistrations(documents)

        // ===== NEW: Fetch all available years (ignoring any date filters) =====
        const allBaseForms = await prisma.baseRegistryForm.findMany({
            where: {
                documentId: { not: null },
            },
            select: { createdAt: true },
        })
        const availableYearsSet = new Set<number>()
        allBaseForms.forEach((form) => {
            availableYearsSet.add(new Date(form.createdAt).getFullYear())
        })
        const availableYears = Array.from(availableYearsSet).sort((a, b) => a - b)

        const response: ApiResponse = {
            data: paginatedData,
            meta: {
                totalGroups,
                page,
                pageSize,
                classification: classificationCounts,
                availableYears,
            },
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error in document report API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
