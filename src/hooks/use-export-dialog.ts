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
    const exportChart = async (chartElement: HTMLElement, chartType: string) => {
        try {
            if (!chartElement) {
                toast.error("No chart found to export.")
                return
            }

            // Temporarily disable all tooltips/hovers in the chart
            const tooltipElements = chartElement.querySelectorAll('.recharts-tooltip-wrapper')
            tooltipElements.forEach(tooltip => {
                if (tooltip instanceof HTMLElement) {
                    tooltip.style.display = 'none'
                }
            })

            // Add a class to disable hover effects
            chartElement.classList.add('exporting')

            // Configure html2canvas options
            const canvas = await html2canvas(chartElement, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                ignoreElements: (element) => {
                    // Ignore tooltip elements during capture
                    return element.classList.contains('recharts-tooltip-wrapper') ||
                        element.classList.contains('recharts-active')
                }
            })

            // Re-enable tooltips
            tooltipElements.forEach(tooltip => {
                if (tooltip instanceof HTMLElement) {
                    tooltip.style.display = ''
                }
            })

            // Remove the exporting class
            chartElement.classList.remove('exporting')

            const dataUrl = canvas.toDataURL("image/png")

            // Generate filename with timestamp and chart type
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
            const filename = `${chartType}_chart_${timestamp}.png`

            // Create and trigger download
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