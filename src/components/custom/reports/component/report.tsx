"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DebugInfo {
    fetchAttempted: boolean
    lastFetchTime: string | null
}

interface ReportComponentProps<T> {
    title: string
    data: T[]
    loading: boolean
    error: string | null
    fetchDataAction: (startYear: number, endYear: number) => Promise<void>
    tableHeaders: string[]
    renderTableRowAction: (entry: T) => React.ReactNode
}

export const ReportComponent = <T,>({
    title,
    data,
    loading,
    error,
    fetchDataAction,
    tableHeaders,
    renderTableRowAction,
}: ReportComponentProps<T>) => {
    const [debugInfo, setDebugInfo] = useState<DebugInfo>({
        fetchAttempted: false,
        lastFetchTime: null,
    })
    const [yearFrom, setYearFrom] = useState(2019)
    const [yearTo, setYearTo] = useState(2025)
    const [chartType, setChartType] = useState("Bar Chart") // Default chart type

    useEffect(() => {
        const handleFetchData = async () => {
            setDebugInfo({
                fetchAttempted: true,
                lastFetchTime: new Date().toISOString(),
            })
            await fetchDataAction(yearFrom, yearTo)
        }

        handleFetchData()
    }, [fetchDataAction, yearFrom, yearTo])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    const years = Array.from({ length: 30 }, (_, i) => 2000 + i) // Years from 2000 to 2029

    return (
        <div className="w-full p-6 space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                                <Label htmlFor="yearFrom">Year From</Label>
                                <Select
                                    onValueChange={(value) => setYearFrom(Number(value))}
                                    defaultValue={yearFrom.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="yearTo">Year To</Label>
                                <Select
                                    onValueChange={(value) => setYearTo(Number(value))}
                                    defaultValue={yearTo.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={() => fetchDataAction(yearFrom, yearTo)}>Fetch Data</Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Export</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Export Data</DialogTitle>
                                    </DialogHeader>
                                    <div className="p-4 space-y-4">
                                        <p>Select export format:</p>
                                        <div className="flex gap-4">
                                            <Button>CSV</Button>
                                            <Button>Excel</Button>
                                            <Button>PDF</Button>
                                        </div>
                                        <p>Select chart type for PNG export:</p>
                                        <Select
                                            onValueChange={(value) => setChartType(value)}
                                            defaultValue={chartType}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Chart Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bar Chart">Bar Chart</SelectItem>
                                                <SelectItem value="Line Chart">Line Chart</SelectItem>
                                                <SelectItem value="Pie Chart">Pie Chart</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button className="w-full mt-4">Export as PNG ({chartType})</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Debug Info */}
            {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Debug Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm bg-gray-100 p-2 rounded-md">
                            {JSON.stringify(
                                {
                                    dataLength: data?.length || 0,
                                    isLoading: loading,
                                    errorMessage: error,
                                    debugInfo,
                                },
                                null,
                                2
                            )}
                        </pre>
                    </CardContent>
                </Card>
            )}

            {/* Data Table */}
            {data && data.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{title} Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {tableHeaders.map((header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((entry, index) => (
                                    <TableRow key={index}>
                                        {renderTableRowAction(entry)}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-4 text-yellow-600 bg-yellow-50 rounded-md">
                        No data found for the selected period.
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
