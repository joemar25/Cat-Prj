import { useTranslation } from "react-i18next"
import { useRef } from "react"
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
}

export const ExportDialog = <T extends { year: number }>({
  data,
  chartType,
  setChartTypeAction,
  dataKeyX,
  dataKeysY,
}: ExportDialogProps<T>) => {
  const { t } = useTranslation()
  const { isMarriageData, handleChartTypeChange } = useExportDialog(data, setChartTypeAction)
  const { exportChart } = useChartExport()
  const chartRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{t("exportDialog.export")}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("exportDialog.exportData")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("exportDialog.exportAs")}</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">CSV</Button>
              <Button variant="outline" className="flex-1">Excel</Button>
              <Button variant="outline" className="flex-1">PDF</Button>
            </div>
          </div>

          {/* Chart Export Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("exportDialog.exportChart")}</h3>

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

            {data.length > 0 && (
              <div className="border rounded-lg p-4" ref={chartRef}>
                <Chart
                  data={data}
                  chartType={chartType}
                  dataKeyX={dataKeyX}
                  dataKeysY={dataKeysY}
                  setChartTypeAction={setChartTypeAction}
                />
                <Button
                  className="w-full mt-4"
                  variant="default"
                  onClick={() => chartRef.current && exportChart(chartRef.current)}
                >
                  {t("exportDialog.downloadChart")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}