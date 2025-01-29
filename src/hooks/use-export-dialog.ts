"use client"

import { useMemo } from "react"
import { toast } from "sonner"

export const useExportDialog = <T extends { year: number }>(
    data: T[],
    setChartTypeAction: (type: string) => void
) => {
    const isMarriageData = useMemo(() => data.length > 0 && "totalMarriages" in data[0], [data])

    const handleChartTypeChange = (value: string) => {
        if (!isMarriageData) {
            setChartTypeAction(value)
        }
    }

    return { isMarriageData, handleChartTypeChange }
}

export const useChartExport = () => {
    const exportChart = async (chartHtml: string) => {
        try {
            if (!chartHtml) {
                toast.error("No chart data found.")
                console.error("Export Error: chartHtml is empty or undefined.")
                return
            }

            console.log("Exporting chart with data:", chartHtml)

            const response = await fetch("/api/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chartHtml }),
            })

            console.log("Export response status:", response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Export API Error:", errorText)
                throw new Error(errorText || "Failed to export chart")
            }

            // Convert response to blob
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
            const filename = `chart_${timestamp}.png`

            // Create a download link
            const link = document.createElement("a")
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success(`Chart exported as ${filename}`)
        } catch (error) {
            console.error("Export failed:", error)

            const errorMessage = error instanceof Error ? error.message : "Failed to export chart."
            toast.error(errorMessage)
        }
    }

    return { exportChart }
}