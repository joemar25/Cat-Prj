"use client"

import { useTranslation } from 'react-i18next'; // Import the hook
import { Label } from "@/components/ui/label"
import { ExportDialog } from "@/components/custom/reports/component/export-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersProps<T> {
    yearFrom: number
    yearTo: number
    setYearFromAction: (year: number) => void
    setYearToAction: (year: number) => void
    data: T[]
    chartType: string
    setChartTypeAction: (type: string) => void
    dataKeyX: keyof T
    dataKeysY: (keyof T)[]
}

export const Filters = <T extends { year: number }>({
    yearFrom,
    yearTo,
    setYearFromAction,
    setYearToAction,
    data,
    chartType,
    setChartTypeAction,
    dataKeyX,
    dataKeysY,
}: FiltersProps<T>) => {
    const { t } = useTranslation(); // Get the translation function

    const years = Array.from({ length: 30 }, (_, i) => 2000 + i)

    return (
        <div className="space-y-4">
            {/* Grid layout for Year selection and Export Dialog */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Year From */}
                <div>
                    <Label htmlFor="yearFrom">{t('filters.yearFrom')}</Label> {/* Translated string */}
                    <Select
                        onValueChange={(value) => setYearFromAction(Number(value))}
                        defaultValue={yearFrom.toString()}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('filters.selectYear')} /> {/* Translated placeholder */}
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Year To */}
                <div>
                    <Label htmlFor="yearTo">{t('filters.yearTo')}</Label> {/* Translated string */}
                    <Select
                        onValueChange={(value) => setYearToAction(Number(value))}
                        defaultValue={yearTo.toString()}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('filters.selectYear')} /> {/* Translated placeholder */}
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Export Dialog */}
                <div className="flex justify-start sm:justify-end">
                    <ExportDialog
                        data={data}
                        chartType={chartType}
                        setChartTypeAction={setChartTypeAction}
                        dataKeyX={dataKeyX}
                        dataKeysY={dataKeysY}
                    />
                </div>
            </div>
        </div>
    )
}
