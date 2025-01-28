"use client";

import { useTranslation } from "react-i18next"; // Import the hook
import { Button } from "@/components/ui/button";
import { Chart } from "@/components/custom/reports/component/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExportDialogProps<T extends { year: number }> {
  data: T[];
  chartType: string;
  setChartTypeAction: (type: string) => void;
  dataKeyX: keyof T;
  dataKeysY: (keyof T)[];
}

export const ExportDialog = <T extends { year: number }>({
  data,
  chartType,
  setChartTypeAction,
  dataKeyX,
  dataKeysY,
}: ExportDialogProps<T>) => {
  const { t } = useTranslation(); // Use the translation hook

  // Check if the data is of type MarriageData (we can check for a unique property like 'totalMarriages')
  const isMarriageData = data.length > 0 && "totalMarriages" in data[0];

  // If it's MarriageData, set Area Chart as default and disable chart type selection
  const handleChartTypeChange = (value: string) => {
    if (!isMarriageData) {
      setChartTypeAction(value);
    }
  };

  return (
    <Dialog>
      {/* Single child inside DialogTrigger */}
      <>
    <DialogTrigger asChild>
        <Button variant="default">{t("exportDialog.export")}</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{t("exportDialog.exportData")}</DialogTitle>
        </DialogHeader>
        {/* Other content */}
    </DialogContent>
</>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("exportDialog.exportData")}</DialogTitle> {/* Translated title */}
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("exportDialog.exportAs")}</h3> {/* Translated section header */}
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
            <h3 className="text-sm font-medium">{t("exportDialog.exportChart")}</h3> {/* Translated section header */}

            {/* If it's MarriageData, only Area Chart is available */}
            {isMarriageData ? (
              <div className="space-y-2">
                <h4 className="text-sm">{t("exportDialog.areaChart")}</h4> {/* Translated chart option */}
                <Button variant="outline" className="w-full" disabled>
                  {t("exportDialog.areaChartDisabled")}
                </Button> {/* Disabled button with translated text */}
              </div>
            ) : (
              // For other data types, allow selecting chart type
              <Select onValueChange={handleChartTypeChange} value={chartType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("exportDialog.selectChartType")} /> {/* Translated placeholder */}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bar Chart">{t("exportDialog.barChart")}</SelectItem> {/* Translated option */}
                  <SelectItem value="Line Chart">{t("exportDialog.lineChart")}</SelectItem> {/* Translated option */}
                  <SelectItem value="Pie Chart">{t("exportDialog.pieChart")}</SelectItem> {/* Translated option */}
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
                  {t("exportDialog.downloadChart")} {/* Translated button text */}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
