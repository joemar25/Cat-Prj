// src\components\custom\reports\component\export-dialog.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Chart } from "@/components/custom/reports/component/chart"
import { BirthData, DeathData, MarriageData } from "@/lib/types/reports"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ReportData = BirthData | DeathData | MarriageData

interface ExportDialogProps<T extends ReportData[number]> {
    data: T[]
    chartType: string
    setChartTypeAction: (type: string) => void
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
}

export const ExportDialog = <T extends ReportData[number]>({
    data,
    chartType,
    setChartTypeAction,
    dataKeyX,
    dataKeysY,
}: ExportDialogProps<T>) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Export</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Data Export Section */}
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
                        <div className="space-y-4">
                            <Select
                                onValueChange={(value) => setChartTypeAction(value)}
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

                            {data && data.length > 0 && (
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
                </div>
            </DialogContent>
        </Dialog>
    )
}
