import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Chart } from "@/components/custom/reports/component/charts"
import { useChartExport, useExportDialog } from "@/hooks/use-export-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ExportDialogProps<T extends { year: number }> {
  data: T[]
  chartType: string
  setChartTypeAction: (type: string) => void
  dataKeyX: keyof T
  dataKeysY: (keyof T)[]
  title: string
}

export const ExportDialog = <T extends { year: number }>({
  data,
  chartType,
  setChartTypeAction,
  dataKeyX,
  dataKeysY,
  title,
}: ExportDialogProps<T>) => {
  const { t } = useTranslation()

  // Hooks for export functions
  const {
    isMarriageData,
    handleChartTypeChange,
    exportToCSV,
    exportToExcel,
    exportToPDF
  } = useExportDialog(data, setChartTypeAction, title)

  const { exportChart } = useChartExport()
  const chartRef = useRef<HTMLDivElement>(null)

  // Handle chart export
  const handleExport = async () => {
    if (chartRef.current) {
      const chartTypeIndicator = chartType.toLowerCase().replace(/\s+/g, '_')
      await exportChart(chartRef.current, chartTypeIndicator, title)
    } else {
      console.error("Chart reference is not available.")
    }
  }

  // Export data functions
  const handleCSVExport = () => exportToCSV()
  const handleExcelExport = () => exportToExcel()

  const handlePDFExport = async () => {
    if (chartRef.current) {
      await exportToPDF(chartRef.current)
    } else {
      console.error("Chart reference is not available for PDF export.")
    }
  }

  return (
    <>
      <style jsx global>{`
        .exporting .recharts-tooltip-wrapper,
        .exporting .recharts-active {
          display: none !important;
        }
        
        .exporting .recharts-default-tooltip {
          display: none !important;
        }
        
        .exporting *[role="button"],
        .exporting .recharts-tooltip,
        .exporting .recharts-tooltip-item {
          pointer-events: none !important;
          opacity: 0 !important;
        }
      `}</style>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">{t("exportDialog.export")}</Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("exportDialog.exportData")} - {title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Data Export Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("exportDialog.exportAs")}</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleCSVExport}>
                  CSV
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleExcelExport}>
                  Excel
                </Button>
                <Button variant="outline" className="flex-1" onClick={handlePDFExport}>
                  PDF
                </Button>
              </div>
            </div>

            {/* Chart Export Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t("exportDialog.exportChart")}</h3>

              {/* Chart Type Selection */}
              {isMarriageData ? (
                <div className="space-y-2">
                  <h4 className="text-sm">{t("exportDialog.areaChart")}</h4>
                  <Button variant="outline" className="w-full" disabled>
                    {t("exportDialog.areaChartDisabled")}
                  </Button>
                </div>
              ) : (
                <Select onValueChange={handleChartTypeChange} value={chartType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("exportDialog.selectChartType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bar Chart">{t("exportDialog.barChart")}</SelectItem>
                    <SelectItem value="Line Chart">{t("exportDialog.lineChart")}</SelectItem>
                    <SelectItem value="Donut Chart">{t("exportDialog.donutChart")}</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Chart Display */}
              {data.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-center border rounded-lg p-4">
                    <div ref={chartRef}>
                      <Chart
                        data={data}
                        chartType={chartType}
                        dataKeyX={dataKeyX}
                        dataKeysY={dataKeysY}
                        setChartTypeAction={setChartTypeAction}
                      />
                    </div>
                  </div>

                  {/* Download Chart Button */}
                  <Button className="w-full" variant="default" onClick={handleExport}>
                    {t("exportDialog.downloadChart")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
