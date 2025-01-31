"use client"

import { useTranslation } from 'react-i18next'
import { TableCell } from '@/components/ui/table'
import { MarriageData } from '@/lib/types/reports'
import { ReportComponent } from './component/report'
import { useReportsStore } from '@/state/use-reports-store'

export const MarriageReport = () => {
    const { t } = useTranslation()
    const { marriageData, loading, error, fetchMarriageData } = useReportsStore()

    const calculatePercentage = (part: number, total: number) => {
        if (total === 0) return 0
        return ((part / total) * 100).toFixed(2)
    }

    return (
        <ReportComponent<MarriageData[0]>
            title={t('marriageReport.title')}
            data={marriageData}
            loading={loading}
            error={error}
            fetchDataAction={fetchMarriageData}
            tableHeaders={[
                t('marriageReport.year'),
                t('marriageReport.totalMarriages'),
                t('marriageReport.residents'),
                t('marriageReport.nonResidents'),
                t('marriageReport.residentPercentage'),
                t('marriageReport.nonResidentPercentage')
            ]}
            renderTableRowAction={(entry) => {
                const residentPercentage = calculatePercentage(entry.residents, entry.totalMarriages)
                const nonResidentPercentage = calculatePercentage(entry.nonResidents, entry.totalMarriages)

                return (
                    <>
                        <TableCell>{entry.year}</TableCell>
                        <TableCell>{entry.totalMarriages}</TableCell>
                        <TableCell>{entry.residents}</TableCell>
                        <TableCell>{entry.nonResidents}</TableCell>
                        <TableCell>{residentPercentage}%</TableCell>
                        <TableCell>{nonResidentPercentage}%</TableCell>
                    </>
                )
            }}
        />
    )
}
