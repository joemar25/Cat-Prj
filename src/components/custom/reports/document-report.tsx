"use client"

import { useState } from "react"
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

// Supported grouping options.
export type GroupByOption = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

// Display modes: either show all periods or only those that have documents.
export type DisplayMode = "all" | "hasDocuments"

// Get current year as a string.
const currentYear = new Date().getFullYear().toString()

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Import your export hook.
// (Make sure the path matches where you store your export functions.)

export const DocumentReport = () => {
    // Default filter values.
    const defaultGroupBy: GroupByOption = "quarterly"
    const defaultYearFilter: string = currentYear
    const defaultMonthFilter: string = "All"
    const defaultDisplayMode: DisplayMode = "all"

    // State variables for filters.
    const [groupBy, setGroupBy] = useState<GroupByOption>(defaultGroupBy)
    const [yearFilter, setYearFilter] = useState<string>(defaultYearFilter)
    const [monthFilter, setMonthFilter] = useState<string>(defaultMonthFilter)
    const [displayMode, setDisplayMode] = useState<DisplayMode>(defaultDisplayMode)

    // Build query parameters based on the filters.
    const queryParams = new URLSearchParams()
    queryParams.append("groupBy", groupBy)
    queryParams.append("displayMode", displayMode)

    if (yearFilter !== "All") {
        if (monthFilter !== "All") {
            // When a specific month is selected, calculate startDate and endDate for that month.
            const yearNum = parseInt(yearFilter, 10)
            const monthNum = parseInt(monthFilter, 10)
            // Month is 0-indexed in Date, so subtract 1.
            const startDate = new Date(yearNum, monthNum - 1, 1)
            // End date: last day of the month. (Day 0 of the next month gives last day of current month.)
            const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999)
            queryParams.append("startDate", startDate.toISOString())
            queryParams.append("endDate", endDate.toISOString())
        } else {
            // If only a specific year is selected, use the year parameter.
            queryParams.append("year", yearFilter)
        }
    }

    const { data, error } = useSWR(
        `/api/reports/document?${queryParams.toString()}`,
        fetcher
    )

    // Reset filters to default values.
    const resetFilters = () => {
        setGroupBy(defaultGroupBy)
        setYearFilter(defaultYearFilter)
        setMonthFilter(defaultMonthFilter)
        setDisplayMode(defaultDisplayMode)
    }

    if (error)
        return (
            <div className="p-4 text-center text-destructive">
                Failed to load document report.
            </div>
        )
    if (!data)
        return <div className="p-4 text-center">Loading document report...</div>

    // Extract the paginated result from the response.
    const reportData = data.data || []

    // Initialize export functions using your hook.
    // For PDF export, we pass null as the chart element since we're exporting table data.
    const { exportToCSV, exportToExcel, exportToPDF } = useExportDialog(reportData, () => { }, "Document Request Report")

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Document Request & Processing Report</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                    Overview of civil registry document requests and processing times.
                </p>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-wrap gap-4">
                    {/* Grouping filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium" htmlFor="groupBy">
                            Group By:
                        </label>
                        <Select
                            value={groupBy}
                            onValueChange={(value: GroupByOption) => setGroupBy(value)}
                        >
                            <SelectTrigger className="w-[150px]">
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

                    {/* Year filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium" htmlFor="yearFilter">
                            Year:
                        </label>
                        <Select
                            value={yearFilter}
                            onValueChange={(value: string) => {
                                setYearFilter(value)
                                // When "All" is selected, reset monthFilter to "All".
                                if (value === "All") {
                                    setMonthFilter("All")
                                }
                            }}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                {/* List years as needed */}
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Month filter: enabled only when a specific year is selected */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium" htmlFor="monthFilter">
                            Month:
                        </label>
                        <Select
                            value={monthFilter}
                            onValueChange={(value: string) => setMonthFilter(value)}
                            disabled={yearFilter === "All"}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="1">January</SelectItem>
                                <SelectItem value="2">February</SelectItem>
                                <SelectItem value="3">March</SelectItem>
                                <SelectItem value="4">April</SelectItem>
                                <SelectItem value="5">May</SelectItem>
                                <SelectItem value="6">June</SelectItem>
                                <SelectItem value="7">July</SelectItem>
                                <SelectItem value="8">August</SelectItem>
                                <SelectItem value="9">September</SelectItem>
                                <SelectItem value="10">October</SelectItem>
                                <SelectItem value="11">November</SelectItem>
                                <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Display mode filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium" htmlFor="displayMode">
                            Display:
                        </label>
                        <Select
                            value={displayMode}
                            onValueChange={(value: DisplayMode) => setDisplayMode(value)}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select display mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                <SelectItem value="hasDocuments">Has Documents Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset Filters Button */}
                    <div className="flex items-center gap-2">
                        <Button onClick={resetFilters} variant="outline">
                            Reset Filters
                        </Button>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <Button onClick={() => exportToCSV(reportData)} variant="outline">
                        Export CSV
                    </Button>
                    <Button onClick={() => exportToExcel(reportData)} variant="outline">
                        Export Excel
                    </Button>
                    <Button onClick={() => exportToPDF(reportData, null)} variant="outline">
                        Export PDF
                    </Button>
                </div>

                {/* If no data is found, display a friendly message */}
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.map((item: any) => (
                                    <TableRow key={item.period}>
                                        <TableCell>{item.period}</TableCell>
                                        <TableCell className="text-right">{item.totalDocuments}</TableCell>
                                        <TableCell className="text-right">{item.processedDocuments}</TableCell>
                                        <TableCell className="text-right">{item.pendingDocuments}</TableCell>
                                        <TableCell className="text-right">{item.averageProcessingTime}</TableCell>
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
