"use client"

import { useReportsStore } from '@/state/use-reports-store'
import { BirthData } from '@/lib/types/reports'
import { ReportComponent } from './component/report'
import { TableCell } from '@/components/ui/table'

export const BirthReport = () => {
    const { birthData, loading, error, fetchBirthData } = useReportsStore()

    return (
        <ReportComponent<BirthData[0]>
            title="Birth Registrations"
            data={birthData}
            loading={loading}
            error={error}
            fetchDataAction={fetchBirthData}
            tableHeaders={['Year', 'Male', 'Female', 'Total']}
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
