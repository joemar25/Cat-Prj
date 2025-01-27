"use client"

import { useReportsStore } from '@/state/use-reports-store'
import { MarriageData } from '@/lib/types/reports'
import { TableCell } from '@/components/ui/table'
import { ReportComponent } from './component/report'

export const MarriageReport = () => {
    const { marriageData, loading, error, fetchMarriageData } = useReportsStore()

    const calculatePercentage = (part: number, total: number) => {
        if (total === 0) return 0
        return ((part / total) * 100).toFixed(2)
    }

    return (
        <ReportComponent<MarriageData[0]>
            title="Marriage Registrations"
            data={marriageData}
            loading={loading}
            error={error}
            fetchDataAction={fetchMarriageData}
            tableHeaders={['Year', 'Total Marriages', 'Residents', 'Non-Residents', 'Resident %', 'Non-Resident %']}
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
