import { Document, DocumentStatus, FormType } from '@prisma/client'

export type GroupByOption = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

/**
 * Custom interface for BaseRegistryForm with an added documentId field
 * This is necessary because in the DB schema, documentId is accessed through the join table
 */
export interface BaseRegistryFormWithDocumentId {
    id: string
    formType: FormType
    createdAt: Date
    documentId: string
}

/**
 * Represents a Document along with its attached BaseRegistryForm records,
 * using only the selected fields.
 */
export type DocumentWithBaseRegistryForm = Document & {
    BaseRegistryForm: BaseRegistryFormWithDocumentId[]
}

/**
 * Returns a grouping key for a given date based on the groupBy option.
 */
export const getGroupKey = (date: Date, groupBy: GroupByOption): string => {
    const d = new Date(date)
    const year = d.getFullYear()
    switch (groupBy) {
        case 'daily': {
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        }
        case 'weekly': {
            const week = getWeekNumber(d)
            return `${year} W${week}`
        }
        case 'monthly': {
            const month = String(d.getMonth() + 1).padStart(2, '0')
            return `${year}-${month}`
        }
        case 'quarterly': {
            const quarter = Math.floor(d.getMonth() / 3) + 1
            return `${year} Q${quarter}`
        }
        case 'yearly':
            return year.toString()
        default:
            return year.toString()
    }
}

/**
 * Calculate ISO week number for a given date.
 */
export const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7 // Sunday (0) becomes 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Holds the statistics for a grouped period.
 */
export interface DocumentGroup {
    totalDocuments: number
    processedDocuments: number
    pendingDocuments: number
    totalProcessingTime: number // Sum (in days) of processing times
    countForAvg: number // Number of documents used for averaging processing time
    marriageCount: number
    birthCount: number
    deathCount: number
}

/**
 * Structure for a report item.
 */
export interface ReportDataItem {
    period: string
    totalDocuments: number
    processedDocuments: number
    pendingDocuments: number
    averageProcessingTime: string
    marriageCount: number
    birthCount: number
    deathCount: number
}

/**
 * Group documents by a period using the earliest BaseRegistryForm.createdAt as the registration date.
 *
 * For each document:
 * 1. Filter for valid base forms (ones with a documentId and createdAt).
 * 2. Use the earliest base form’s createdAt as the registration date.
 * 3. Compute processing time as (document.createdAt - registration date) in days.
 * 4. Update classification counts for each valid base form.
 */
export const groupDocumentsByPeriod = (
    documents: DocumentWithBaseRegistryForm[],
    groupBy: GroupByOption
): Record<string, DocumentGroup> => {
    const groups: Record<string, DocumentGroup> = {}

    documents.forEach((doc) => {
        // Filter base forms that are linked and have a valid createdAt.
        const validForms = doc.BaseRegistryForm.filter(form => form.documentId && form.createdAt)
        if (validForms.length === 0) return // Should not happen if filtering is done in the query

        // Use the earliest base form createdAt as the registration date.
        const earliestTime = Math.min(...validForms.map(form => new Date(form.createdAt).getTime()))
        const registrationDate = new Date(earliestTime)

        // Use the registration date for grouping.
        const key = getGroupKey(registrationDate, groupBy)
        if (!groups[key]) {
            groups[key] = {
                totalDocuments: 0,
                processedDocuments: 0,
                pendingDocuments: 0,
                totalProcessingTime: 0,
                countForAvg: 0,
                marriageCount: 0,
                birthCount: 0,
                deathCount: 0,
            }
        }
        const group = groups[key]

        group.totalDocuments++
        if (doc.status === DocumentStatus.VERIFIED) {
            group.processedDocuments++
        } else if (doc.status === DocumentStatus.PENDING) {
            group.pendingDocuments++
        }

        // Compute processing time as difference between document.createdAt and the registration date.
        const processingTime =
            (new Date(doc.createdAt).getTime() - registrationDate.getTime()) /
            (1000 * 60 * 60 * 24)
        group.totalProcessingTime += processingTime
        group.countForAvg++

        // Update classification counts for each valid base form.
        validForms.forEach((form) => {
            if (form.formType === FormType.MARRIAGE) {
                group.marriageCount++
            } else if (form.formType === FormType.BIRTH) {
                group.birthCount++
            } else if (form.formType === FormType.DEATH) {
                group.deathCount++
            }
        })
    })

    return groups
}

/**
 * Zero-fill groups for a given year and grouping option.
 * For example, for quarterly grouping for year "2024", ensure that "2024 Q1" to "2024 Q4"
 * are always returned even if some have no documents.
 */
export const zeroFillGroups = (
    groups: Record<string, DocumentGroup>,
    groupBy: GroupByOption,
    yearParam: string
): ReportDataItem[] => {
    let periods: string[] = []
    if (groupBy === 'quarterly') {
        periods = [`${yearParam} Q1`, `${yearParam} Q2`, `${yearParam} Q3`, `${yearParam} Q4`]
    } else if (groupBy === 'monthly') {
        for (let i = 1; i <= 12; i++) {
            periods.push(`${yearParam}-${String(i).padStart(2, '0')}`)
        }
    } else if (groupBy === 'weekly') {
        for (let i = 1; i <= 53; i++) {
            periods.push(`${yearParam} W${i}`)
        }
    } else if (groupBy === 'daily') {
        let current = new Date(`${yearParam}-01-01T00:00:00Z`)
        const end = new Date(`${yearParam}-12-31T00:00:00Z`)
        while (current <= end) {
            const day = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
            periods.push(day)
            current.setDate(current.getDate() + 1)
        }
    } else if (groupBy === 'yearly') {
        periods = [yearParam]
    }

    return periods.map((period) => {
        const data = groups[period] || {
            totalDocuments: 0,
            processedDocuments: 0,
            pendingDocuments: 0,
            totalProcessingTime: 0,
            countForAvg: 0,
            marriageCount: 0,
            birthCount: 0,
            deathCount: 0,
        }
        return {
            period,
            totalDocuments: data.totalDocuments,
            processedDocuments: data.processedDocuments,
            pendingDocuments: data.pendingDocuments,
            averageProcessingTime:
                data.countForAvg > 0 ? `${(data.totalProcessingTime / data.countForAvg).toFixed(1)} days` : '0 days',
            marriageCount: data.marriageCount,
            birthCount: data.birthCount,
            deathCount: data.deathCount,
        }
    })
}

/**
 * When no specific year is provided, zero-fill across all years available in the data.
 *
 * This helper now scans *all* base form createdAt dates across every document to determine the
 * earliest and latest years available. It then calls zeroFillGroups for each year in that range.
 */
export const zeroFillMultipleYears = (
    groups: Record<string, DocumentGroup>,
    groupBy: GroupByOption,
    documents: DocumentWithBaseRegistryForm[]
): ReportDataItem[] => {
    if (documents.length === 0) return []

    // Collect all the years from the base forms’ createdAt values.
    const years: number[] = []
    documents.forEach((doc) => {
        doc.BaseRegistryForm.forEach((form) => {
            if (form.documentId && form.createdAt) {
                years.push(new Date(form.createdAt).getFullYear())
            }
        })
    })

    // If no valid base form dates were found, use the document createdAt dates.
    if (years.length === 0) {
        documents.forEach((doc) => {
            years.push(new Date(doc.createdAt).getFullYear())
        })
    }

    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    let results: ReportDataItem[] = []

    for (let year = minYear; year <= maxYear; year++) {
        const yearStr = year.toString()
        results = results.concat(zeroFillGroups(groups, groupBy, yearStr))
    }
    return results
}

/**
 * Count global registration totals by iterating over each document’s base registry forms.
 */
export const countGlobalRegistrations = (
    documents: DocumentWithBaseRegistryForm[]
): { marriage: number; birth: number; death: number } => {
    let totalMarriageCount = 0
    let totalBirthCount = 0
    let totalDeathCount = 0
    documents.forEach((doc) => {
        doc.BaseRegistryForm.forEach((form) => {
            if (form.documentId) {
                if (form.formType === FormType.MARRIAGE) {
                    totalMarriageCount++
                } else if (form.formType === FormType.BIRTH) {
                    totalBirthCount++
                } else if (form.formType === FormType.DEATH) {
                    totalDeathCount++
                }
            }
        })
    })
    return { marriage: totalMarriageCount, birth: totalBirthCount, death: totalDeathCount }
}
