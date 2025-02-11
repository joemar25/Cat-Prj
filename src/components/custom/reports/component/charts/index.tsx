"use client"

import { BarChartComponent } from "@/components/custom/reports/component/charts/bar-chart-component"
import { LineChartComponent } from "@/components/custom/reports/component/charts/line-chart-component"
import { AreaChartComponent } from "@/components/custom/reports/component/charts/area-chart-component"
import { DonutChartComponent } from "@/components/custom/reports/component/charts/donut-chart-component"

interface ChartProps<T extends Record<string, any>> {
    data: T[]
    chartType: string
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
    setChartTypeAction: (type: string) => void
}

export const Chart = <T extends Record<string, any>>({
    data,
    chartType,
    dataKeyX,
    dataKeysY,
}: ChartProps<T>) => {
    const resolveCssVariable = (variableName: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()

    const COLORS = [
        `hsl(${resolveCssVariable('--chart-1')})`,
        `hsl(${resolveCssVariable('--chart-2')})`,
        `hsl(${resolveCssVariable('--chart-3')})`,
        `hsl(${resolveCssVariable('--chart-4')})`,
        `hsl(${resolveCssVariable('--chart-5')})`,
    ]

    // Calculate total for DonutChartComponent
    const aggregatedData = dataKeysY.map((key) => ({
        name: String(key),
        value: data.reduce((sum, entry) => sum + (entry[key] || 0), 0),
    }))
    const total = aggregatedData.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="w-full">
            {chartType === "Bar Chart" && (
                <BarChartComponent data={data} dataKeyX={dataKeyX} dataKeysY={dataKeysY} colors={COLORS} />
            )}
            {chartType === "Line Chart" && (
                <LineChartComponent data={data} dataKeyX={dataKeyX} dataKeysY={dataKeysY} colors={COLORS} />
            )}
            {chartType === "Donut Chart" && (
                <DonutChartComponent data={aggregatedData} total={total} />
            )}
            {chartType === "Area Chart" && (
                <AreaChartComponent data={data} dataKeyX={dataKeyX} dataKeysY={dataKeysY} colors={COLORS} />
            )}
        </div>
    )
}
