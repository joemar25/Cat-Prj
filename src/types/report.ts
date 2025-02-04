export type GroupByOption = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
export type DisplayMode = "all" | "hasDocuments"
export type ClassificationFilter = "all" | "marriage" | "birth" | "death"

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

export interface ApiResponse {
    data: ReportDataItem[]
    meta: {
        totalGroups: number
        page: number
        pageSize: number
        classification: {
            marriage: number
            birth: number
            death: number
        }
        availableYears: number[]
    }
}