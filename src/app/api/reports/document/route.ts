import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import {
    GroupByOption,
    groupDocumentsByPeriod,
    zeroFillGroups,
    zeroFillMultipleYears,
    countGlobalRegistrations,
    ReportDataItem,
    DocumentWithBaseRegistryForm,
} from '@/lib/report-helpers';

const prisma = new PrismaClient();

interface ApiResponse {
    data: ReportDataItem[];
    meta: {
        totalGroups: number;
        page: number;
        pageSize: number;
        classification: {
            marriage: number;
            birth: number;
            death: number;
        };
        availableYears: number[];
    };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse and validate parameters.
        const groupBy = (searchParams.get('groupBy') || 'quarterly') as GroupByOption;
        if (!['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].includes(groupBy)) {
            return NextResponse.json({ error: 'Invalid groupBy value' }, { status: 400 });
        }

        const yearParam = searchParams.get('year');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const displayMode = searchParams.get('displayMode') || 'all';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10));

        // Build where clause for filtering documents by createdAt date.
        const whereClause: Prisma.DocumentWhereInput = {};
        if (yearParam) {
            whereClause.createdAt = {
                gte: new Date(`${yearParam}-01-01T00:00:00.000Z`),
                lte: new Date(`${yearParam}-12-31T23:59:59.999Z`)
            };
        } else if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate);
            if (endDate) whereClause.createdAt.lte = new Date(endDate);
        }

        // Only fetch documents that have an attached BaseRegistryForm.
        whereClause.BaseRegistryForm = { some: {} };

        // Fetch documents along with their BaseRegistryForm data (including createdAt for processing time).
        const documents: DocumentWithBaseRegistryForm[] = await prisma.document.findMany({
            where: whereClause,
            include: {
                BaseRegistryForm: {
                    select: {
                        id: true,
                        formType: true,
                        documentId: true,
                        createdAt: true,
                    },
                },
            },
        });

        // Determine the full available year range based on the registration dates (earliest BaseRegistryForm.createdAt).
        let availableYears: number[] = [];
        if (documents.length > 0) {
            const registrationYears = documents.map((doc) => {
                const validForms = doc.BaseRegistryForm.filter(form => form.documentId && form.createdAt);
                return validForms.length > 0
                    ? new Date(Math.min(...validForms.map(form => new Date(form.createdAt).getTime()))).getFullYear()
                    : new Date(doc.createdAt).getFullYear();
            });
            const minYear = Math.min(...registrationYears);
            const maxYear = Math.max(...registrationYears);
            for (let year = minYear; year <= maxYear; year++) {
                availableYears.push(year);
            }
        }

        // Group the documents by the selected period (using the registration date).
        const groups = groupDocumentsByPeriod(documents, groupBy);

        let result: ReportDataItem[] = [];
        if (yearParam) {
            result = zeroFillGroups(groups, groupBy, yearParam);
        } else {
            result = zeroFillMultipleYears(groups, groupBy, documents);
        }

        if (displayMode === 'hasDocuments') {
            result = result.filter((r) => r.totalDocuments > 0);
        }

        const { totalMarriageCount, totalBirthCount, totalDeathCount } = countGlobalRegistrations(documents);

        const totalGroups = result.length;
        const startIdx = (page - 1) * pageSize;
        const paginatedResult = result.slice(startIdx, startIdx + pageSize);

        const response: ApiResponse = {
            data: paginatedResult,
            meta: {
                totalGroups,
                page,
                pageSize,
                classification: {
                    marriage: totalMarriageCount,
                    birth: totalBirthCount,
                    death: totalDeathCount,
                },
                availableYears,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching document report data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
