"use client"

import { useTranslation } from 'react-i18next'
import { BirthData } from '@/lib/types/reports'
import { TableCell } from '@/components/ui/table'
import { ReportComponent } from './component/report'
import { useReportsStore } from '@/state/use-reports-store'

export const BirthReport = () => {
    const { birthData, loading, error, fetchBirthData } = useReportsStore()
    const { t } = useTranslation()

    return (
        <ReportComponent<BirthData[0]>
            title={t('birthReport.title')}
            data={birthData}
            loading={loading}
            error={error}
            fetchDataAction={fetchBirthData}
            tableHeaders={[
                t('birthReport.year'),
                t('birthReport.male'),
                t('birthReport.female'),
                t('birthReport.total'),
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