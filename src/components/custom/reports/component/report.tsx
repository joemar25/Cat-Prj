"use client"

import { useEffect, useState } from "react"
import { Filters } from "@/components/custom/reports/component/filters"
import { BirthData, DeathData, MarriageData } from "@/lib/types/reports"
import { DataTable } from "@/components/custom/reports/component/data-table"
import { DebugInfo } from "@/components/custom/reports/component/debug-info"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportDialog } from "@/components/custom/reports/component/export-dialog"

type ReportData = BirthData | DeathData | MarriageData;

interface DebugInfo {
    fetchAttempted: boolean;
    lastFetchTime: string | null;
}

interface ReportComponentProps<T extends ReportData[number]> {
    title: string;
    data: T[];
    loading: boolean;
    error: string | null;
    fetchDataAction: (startYear: number, endYear: number) => Promise<void>;
    tableHeaders: string[];
    renderTableRowAction: (entry: T) => React.ReactNode;
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
    });
    const [yearFrom, setYearFrom] = useState(2019);
    const [yearTo, setYearTo] = useState(2025);
    const [chartType, setChartType] = useState("Bar Chart");

    useEffect(() => {
        const handleFetchData = async () => {
            setDebugInfo({
                fetchAttempted: true,
                lastFetchTime: new Date().toISOString(),
            });
            await fetchDataAction(yearFrom, yearTo);
        };

        handleFetchData();
    }, [fetchDataAction, yearFrom, yearTo]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Ensure data is valid before attempting to determine keys
    const dataKeyX = "year"; // All schemas have "year"
    const dataKeysY =
        data && data.length > 0
            ? "male" in data[0]
                ? (["male", "female"] as (keyof T)[])
                : "totalMarriages" in data[0]
                    ? (["totalMarriages", "residents", "nonResidents"] as (keyof T)[])
                    : []
            : [];

    return (
        <div className="w-full p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Filters
                        yearFrom={yearFrom}
                        yearTo={yearTo}
                        setYearFromAction={setYearFrom}
                        setYearToAction={setYearTo}
                        fetchDataAction={fetchDataAction}
                    />
                    <div className="flex gap-4 mt-4">
                        <ExportDialog
                            data={data}
                            chartType={chartType}
                            setChartTypeAction={setChartType}
                            dataKeyX={dataKeyX}
                            dataKeysY={dataKeysY}
                        />
                    </div>
                </CardContent>
            </Card>

            {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
                <DebugInfo
                    dataLength={data?.length || 0}
                    loading={loading}
                    error={error}
                    debugInfo={debugInfo}
                />
            )}

            {data && data.length > 0 ? (
                <DataTable
                    title={title}
                    data={data}
                    tableHeaders={tableHeaders}
                    renderTableRowAction={renderTableRowAction}
                />
            ) : (
                <Card>
                    <CardContent className="p-4 text-yellow-600 bg-yellow-50 rounded-md">
                        No data found for the selected period.
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
