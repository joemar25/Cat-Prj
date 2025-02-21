import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/report'
import { PrismaClient, Prisma, FormType } from '@prisma/client'
import { GroupByOption, ReportDataItem, groupDocumentsByPeriod, zeroFillMultipleYears, zeroFillGroups, countGlobalRegistrations, DocumentWithBaseRegistryForm } from '@/lib/report-helpers'

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

        // Build the document where clause using the relation through BaseRegistryFormDocument
        const whereClause: Prisma.DocumentWhereInput = {
            baseRegistryForms: {
                some: {
                    baseRegistryForm: baseFormWhere
                }
            },
        }

        // Fetch documents along with their BaseRegistryForm data.
        const documents = await prisma.document.findMany({
            where: whereClause,
            include: {
                baseRegistryForms: {
                    include: {
                        baseRegistryForm: {
                            select: {
                                id: true,
                                formType: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        })

        // Transform the documents to include flattened baseRegistryForm data
        // that's compatible with your report-helpers functions
        const transformedDocuments: DocumentWithBaseRegistryForm[] = documents.map(doc => {
            // Create a compatible BaseRegistryForm array with documentId
            const baseForms = doc.baseRegistryForms.map(relation => ({
                id: relation.baseRegistryForm.id,
                formType: relation.baseRegistryForm.formType,
                documentId: doc.id, // Add documentId which is the current document's id
                createdAt: relation.baseRegistryForm.createdAt
            }));

            return {
                ...doc,
                BaseRegistryForm: baseForms
            } as DocumentWithBaseRegistryForm;
        });

        // Group documents by period using the earliest valid base form's createdAt.
        const groups = groupDocumentsByPeriod(transformedDocuments, groupBy)

        // Use zero-fill helpers.
        let reportData: ReportDataItem[] = []
        if (!startDateParam && !endDateParam) {
            reportData = zeroFillMultipleYears(groups, groupBy, transformedDocuments)
        } else {
            // Derive the years present in the filtered data.
            const yearsSet = new Set<number>()
            transformedDocuments.forEach((doc) => {
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

        // Use the transformed documents for counts.
        const classificationCounts = countGlobalRegistrations(transformedDocuments)

        // ===== NEW: Fetch all available years (ignoring any date filters) =====
        const allBaseForms = await prisma.baseRegistryForm.findMany({
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