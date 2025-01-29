"use client"

import { toast } from "sonner"
import html2canvas from "html2canvas"

export const useExportDialog = <T extends { year: number }>(
    data: T[],
    setChartTypeAction: (type: string) => void
) => {
    const isMarriageData = data.length > 0 && "totalMarriages" in data[0]

    const handleChartTypeChange = (value: string) => {
        if (!isMarriageData) {
            setChartTypeAction(value)
        }
    }

    return { isMarriageData, handleChartTypeChange }
}

export const useChartExport = () => {
    const exportChart = async (chartElement: HTMLElement | null) => {
        try {
            if (!chartElement) {
                toast.error("No chart found to export.")
                return
            }

            // Convert chart to an image
            const canvas = await html2canvas(chartElement)
            const dataUrl = canvas.toDataURL("image/png")

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
            const filename = `chart_${timestamp}.png`

            // Create a download link
            const link = document.createElement("a")
            link.href = dataUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success(`Chart exported as ${filename}`)
        } catch (error) {
            console.error("Export failed:", error)
            toast.error("Failed to export chart.")
        }
    }

    return { exportChart }
}
