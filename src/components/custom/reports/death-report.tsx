"use client"

import { useTranslation } from 'react-i18next';  // Import the useTranslation hook
import { useReportsStore } from '@/state/use-reports-store'
import { DeathData } from '@/lib/types/reports'
import { TableCell } from '@/components/ui/table'
import { ReportComponent } from './component/report'

export const DeathReport = () => {
    const { t } = useTranslation();  // Initialize the translation hook
    const { deathData, loading, error, fetchDeathData } = useReportsStore()

    return (
        <ReportComponent<DeathData[0]>
            title={t("deathReport.title")}
            data={deathData}
            loading={loading}
            error={error}
            fetchDataAction={fetchDeathData}
            tableHeaders={[
                t('deathReport.year'),  // Translate 'Year'
                t('deathReport.male'),  // Translate 'Male'
                t('deathReport.female'),  // Translate 'Female'
                t('deathReport.total')   // Translate 'Total'
            ]}
            renderTableRowAction={(entry) => (
                <>
                    <TableCell>{entry.year}</TableCell>
                    <TableCell>{entry.male}</TableCell>
                    <TableCell>{entry.female}</TableCell>
                    <TableCell>{entry.male + entry.female}</TableCell>
                </>
            )}
        />
    )
}
