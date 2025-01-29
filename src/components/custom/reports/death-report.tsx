"use client"

import { useTranslation } from 'react-i18next'
import { useReportsStore } from '@/state/use-reports-store'
import { DeathData } from '@/lib/types/reports'
import { TableCell } from '@/components/ui/table'
import { ReportComponent } from './component/report'

export const DeathReport = () => {
    const { t } = useTranslation()
    const { deathData, loading, error, fetchDeathData } = useReportsStore()

    return (
        <ReportComponent<DeathData[0]>
            title={t("deathReport.title")}
            data={deathData}
            loading={loading}
            error={error}
            fetchDataAction={fetchDeathData}
            tableHeaders={[
                t('deathReport.year'),
                t('deathReport.male'),
                t('deathReport.female'),
                t('deathReport.total')
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
