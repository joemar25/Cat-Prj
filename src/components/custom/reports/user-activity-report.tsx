// src/components/custom/reports/user-activity-report.tsx
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const UserActivityReport = () => {
    const [groupBy, setGroupBy] = useState<"monthly" | "quarterly" | "yearly">(
        "quarterly"
    )
    // Keep track of current page and pageSize for pagination.
    const [page, setPage] = useState(1)
    const pageSize = 20

    // Include page and pageSize in the request.
    const { data, error } = useSWR(
        `/api/reports/user-activity?groupBy=${groupBy}&page=${page}&pageSize=${pageSize}`,
        fetcher
    )

    if (error)
        return (
            <div className="p-4 text-center text-destructive">
                Failed to load user activity report
            </div>
        )
    if (!data)
        return (
            <div className="p-4 text-center">
                Loading user activity report...
            </div>
        )

    // Extract the grouped data and meta info.
    const reportData = data.data || [] // the array of grouped rows
    const { totalGroups } = data.meta || { totalGroups: 0 }
    const totalPages = Math.ceil(totalGroups / pageSize)

    // Handlers for pagination
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1)
    }
    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1)
    }

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>User Activity Report</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                    Overview of system activity through audit logs, including total actions,
                    active users, and top action.
                </p>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center gap-4">
                    <label htmlFor="groupBy" className="text-sm font-medium">
                        Group By:
                    </label>
                    <Select
                        value={groupBy}
                        onValueChange={(value: "monthly" | "quarterly" | "yearly") => {
                            setGroupBy(value)
                            setPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead className="text-right">Total Audit Logs</TableHead>
                                <TableHead className="text-right">Active Users</TableHead>
                                <TableHead className="text-right">Top Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportData.map((item: any) => (
                                <TableRow key={item.period}>
                                    <TableCell>{item.period}</TableCell>
                                    <TableCell className="text-right">
                                        {item.totalAuditLogs}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.activeUsers}
                                    </TableCell>
                                    <TableCell className="text-right">{item.topAction}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination Controls */}
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
