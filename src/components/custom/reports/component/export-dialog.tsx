"use client"

import { Button } from "@/components/ui/button"
import { Chart } from "@/components/custom/reports/component/chart"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExportDialogProps<T extends { year: number }> {
    data: T[]
    chartType: string
    setChartTypeAction: (type: string) => void
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
}

export const ExportDialog = <T extends { year: number }>({
    data,
    chartType,
    setChartTypeAction,
    dataKeyX,
    dataKeysY,
}: ExportDialogProps<T>) => {
    // Check if the data is of type MarriageData (we can check for a unique property like 'totalMarriages')
    const isMarriageData = data.length > 0 && "totalMarriages" in data[0]

    // If it's MarriageData, set Area Chart as default and disable chart type selection
    const handleChartTypeChange = (value: string) => {
        if (!isMarriageData) {
            setChartTypeAction(value)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"default"}>Export</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Export Options */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Export Data As</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                                CSV
                            </Button>
                            <Button variant="outline" className="flex-1">
                                Excel
                            </Button>
                            <Button variant="outline" className="flex-1">
                                PDF
                            </Button>
                        </div>
                    </div>

                    {/* Chart Export Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Export Chart</h3>

                        {/* If it's MarriageData, only Area Chart is available */}
                        {isMarriageData ? (
                            <div className="space-y-2">
                                <h4 className="text-sm">Area Chart</h4>
                                <Button variant="outline" className="w-full" disabled>
                                    Area Chart (Only for Marriage Data)
                                </Button>
                            </div>
                        ) : (
                            // For other data types, allow selecting chart type
                            <Select
                                onValueChange={handleChartTypeChange}
                                value={chartType}
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
                        )}

                        {data.length > 0 && (
                            <div className="border rounded-lg p-4">
                                <Chart
                                    data={data}
                                    chartType={chartType}
                                    dataKeyX={dataKeyX}
                                    dataKeysY={dataKeysY}
                                    setChartTypeAction={setChartTypeAction}
                                />
                                <Button className="w-full mt-4" variant="default">
                                    Download Chart as PNG
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
