"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useExportDialog } from "@/hooks/use-export-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"

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

interface ApiResponse {
    data: ReportDataItem[]
    meta: {
        classification: {
            marriage: number
            birth: number
            death: number
        }
        availableYears: number[]
    }
}

export type GroupByOption = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
export type DisplayMode = "all" | "hasDocuments"
export type ClassificationFilter = "all" | "marriage" | "birth" | "death"

const defaultGroupBy: GroupByOption = "yearly"
const defaultYearFilter: string = "All"
const defaultMonthFilter: string = "All"
const defaultDisplayMode: DisplayMode = "all"
const defaultClassification: ClassificationFilter = "all"

const fetcher = async (url: string): Promise<ApiResponse> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }
    return response.json()
}

export const DocumentReport = () => {
    const [availableYears, setAvailableYears] = useState<string[]>([])
    const [groupBy, setGroupBy] = useState<GroupByOption>(defaultGroupBy)
    const [yearFilter, setYearFilter] = useState<string>(defaultYearFilter)
    const [monthFilter, setMonthFilter] = useState<string>(defaultMonthFilter)
    const [displayMode, setDisplayMode] = useState<DisplayMode>(defaultDisplayMode)
    const [classification, setClassification] = useState<ClassificationFilter>(defaultClassification)

    const queryParams = new URLSearchParams()
    queryParams.append("groupBy", groupBy)
    queryParams.append("displayMode", displayMode)
    queryParams.append("classification", classification)
    if (yearFilter !== "All") {
        if (monthFilter !== "All") {
            const yearNum = parseInt(yearFilter, 10)
            const monthNum = parseInt(monthFilter, 10)
            const startDate = new Date(yearNum, monthNum - 1, 1)
            const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999)
            queryParams.append("startDate", startDate.toISOString())
            queryParams.append("endDate", endDate.toISOString())
        } else {
            queryParams.append("year", yearFilter)
        }
    }

    const { data, error } = useSWR<ApiResponse>(
        `/api/reports/document?${queryParams.toString()}`,
        fetcher
    )

    useEffect(() => {
        if (data?.meta?.availableYears) {
            const availableYearsData = data.meta.availableYears
            const uniqueYears = Array.from(new Set<number>(availableYearsData))
            const sortedYears = uniqueYears.sort((a: number, b: number) => b - a)
            setAvailableYears(sortedYears.map((year: number) => year.toString()))
            if (yearFilter !== "All" && !uniqueYears.includes(parseInt(yearFilter))) {
                setYearFilter("All")
            }
        }
    }, [data?.meta?.availableYears, yearFilter])

    // Compute a flag to check if any filter is different from its default.
    const filtersChanged =
        groupBy !== defaultGroupBy ||
        yearFilter !== defaultYearFilter ||
        monthFilter !== defaultMonthFilter ||
        displayMode !== defaultDisplayMode ||
        classification !== defaultClassification

    const resetFilters = () => {
        setGroupBy(defaultGroupBy)
        setYearFilter(defaultYearFilter)
        setMonthFilter(defaultMonthFilter)
        setDisplayMode(defaultDisplayMode)
        setClassification(defaultClassification)
    }

    if (error)
        return (
            <div className="p-4 text-center text-destructive">
                Failed to load document report.
            </div>
        )
    if (!data)
        return <div className="p-4 text-center">Loading document report...</div>

    console.log('Raw API Response:', data)
    const reportData: ReportDataItem[] = Array.isArray(data?.data) ? data.data : []

    // Calculate the classification summary based on the current filter.
    let classificationSummary = data.meta?.classification
    if (classification !== "all") {
        classificationSummary = {
            marriage: classification === "marriage" ? classificationSummary.marriage : 0,
            birth: classification === "birth" ? classificationSummary.birth : 0,
            death: classification === "death" ? classificationSummary.death : 0,
        }
    }

    const exportData = reportData.map((item: ReportDataItem) => ({
        ...item,
        averageProcessingTime: item.averageProcessingTime.toString(),
    })) as Record<string, unknown>[]

    const { exportToCSV, exportToExcel, exportToPDF } = useExportDialog(
        exportData,
        () => { },
        "Document Request Report"
    )

    return (
        <Card className="p-4">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Document Request & Processing Report</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Overview of civil registry document requests and processing times.
                    </p>
                    {classificationSummary && (
                        <div className="mt-1 text-sm">
                            Classification Summary:&nbsp;
                            <span>Marriage: {classificationSummary.marriage}</span>,&nbsp;
                            <span>Birth: {classificationSummary.birth}</span>,&nbsp;
                            <span>Death: {classificationSummary.death}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {filtersChanged && (
                        <Button onClick={resetFilters} variant="outline" size="sm">
                            Reset Filters
                        </Button>
                    )}
                    {/* Export buttons are always visible and aligned with Help */}
                    <Button onClick={() => exportToCSV()} variant="outline" size="sm">
                        Export CSV
                    </Button>
                    <Button onClick={() => exportToExcel()} variant="outline" size="sm">
                        Export Excel
                    </Button>
                    <Button onClick={() => exportToPDF()} variant="outline" size="sm">
                        Export PDF
                    </Button>
                    {/* Help */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                Help
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Average Processing Time Formula</DialogTitle>
                                <DialogDescription>
                                    The average processing time is calculated as the difference (in days)
                                    between the <strong>earliest Base Registry Form's</strong> creation date
                                    (the registration time) and the <strong>Document's</strong> creation date
                                    (the processing time). For documents with multiple forms, the earliest
                                    Base Registry Form date is used.
                                    <br />
                                    <br />
                                    The formula is:
                                    <br />
                                    <code>
                                        Average Time = Σ (Document.createdAt - EarliestBaseForm.createdAt) / N
                                    </code>
                                    <br />
                                    where N is the number of documents.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Group By:</label>
                        <Select value={groupBy} onValueChange={(value: GroupByOption) => setGroupBy(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Year:</label>
                        <Select
                            value={yearFilter}
                            onValueChange={(value: string) => {
                                setYearFilter(value)
                                if (value === "All") setMonthFilter("All")
                            }}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                {availableYears.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Month:</label>
                        <Select
                            value={monthFilter}
                            onValueChange={(value: string) => setMonthFilter(value)}
                            disabled={yearFilter === "All"}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <SelectItem key={month} value={month.toString()}>
                                        {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Display:</label>
                        <Select value={displayMode} onValueChange={(value: DisplayMode) => setDisplayMode(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select display mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                <SelectItem value="hasDocuments">Has Documents Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Classification:</label>
                        <Select value={classification} onValueChange={(value: ClassificationFilter) => setClassification(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select classification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="marriage">Marriage</SelectItem>
                                <SelectItem value="birth">Birth</SelectItem>
                                <SelectItem value="death">Death</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {reportData.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No documents found matching the selected filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Period</TableHead>
                                    <TableHead className="text-right">Total Documents</TableHead>
                                    <TableHead className="text-right">Processed</TableHead>
                                    <TableHead className="text-right">Pending</TableHead>
                                    <TableHead className="text-right">Avg. Processing Time</TableHead>
                                    <TableHead className="text-right">Marriage</TableHead>
                                    <TableHead className="text-right">Birth</TableHead>
                                    <TableHead className="text-right">Death</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.map((item: ReportDataItem) => (
                                    <TableRow key={item.period}>
                                        <TableCell>{item.period}</TableCell>
                                        <TableCell className="text-right">{item.totalDocuments}</TableCell>
                                        <TableCell className="text-right">{item.processedDocuments}</TableCell>
                                        <TableCell className="text-right">{item.pendingDocuments}</TableCell>
                                        <TableCell className="text-right">{item.averageProcessingTime}</TableCell>
                                        <TableCell className="text-right">{item.marriageCount}</TableCell>
                                        <TableCell className="text-right">{item.birthCount}</TableCell>
                                        <TableCell className="text-right">{item.deathCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
