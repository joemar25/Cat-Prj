"use client"

import { useEffect, useState } from "react"
import { Filters } from "@/components/custom/reports/component/filters"
import { BirthData, DeathData, MarriageData } from "@/lib/types/reports"
import { DataTable } from "@/components/custom/reports/component/data-table"
import { DebugInfo } from "@/components/custom/reports/component/debug-info"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportSkeleton } from "./report-skeleton"

type ReportData = BirthData | DeathData | MarriageData

interface DebugInfo {
    fetchAttempted: boolean
    lastFetchTime: string | null
}

interface ReportComponentProps<T extends ReportData[number]> {
    title: string
    data: T[]
    loading: boolean
    error: string | null
    fetchDataAction: (startYear: number, endYear: number) => Promise<void>
    tableHeaders: string[]
    renderTableRowAction: (entry: T) => React.ReactNode
}

export const ReportComponent = <T extends ReportData[number]>({
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
    const [chartType, setChartType] = useState("Bar Chart")

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

    if (loading) return (
        <div className="w-full min-h-screen ">
            <ReportSkeleton />
        </div>
    )

    if (error) return <div>Error: {error}</div>

    // Ensure data is valid before attempting to determine keys
    const dataKeysY =
        data && data.length > 0
            ? "male" in data[0]
                ? (["male", "female"] as (keyof T)[])
                : "totalMarriages" in data[0]
                    ? (["totalMarriages", "residents", "nonResidents"] as (keyof T)[])
                    : []
            : []

    return (
        <div className="w-full my-2 space-y-4">
            {/* {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
                <DebugInfo
                    dataLength={data?.length || 0}
                    loading={loading}
                    error={error}
                    debugInfo={debugInfo}
                />
            )} */}

            <Card className="p-2.5">
                {/* <CardHeader>
                    <CardTitle className="text-lg font-bold">{title}</CardTitle>
                </CardHeader> */}
                <CardContent className="py-2 px-1">
                    <Filters
                        yearFrom={yearFrom}
                        yearTo={yearTo}
                        setYearFromAction={setYearFrom}
                        setYearToAction={setYearTo}
                        data={data}
                        chartType={chartType}
                        setChartTypeAction={setChartType}
                        dataKeyX={"year"}
                        dataKeysY={dataKeysY}
                        title={title}
                    />
                </CardContent>

                {data && data.length > 0 ? (
                    <DataTable
                        title={title}
                        data={data}
                        tableHeaders={tableHeaders}
                        renderTableRowAction={renderTableRowAction}
                    />
                ) : (
                    <CardContent className="my-4 rounded-md">
                        No data found for the selected period.
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
