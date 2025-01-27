"use client"

import { useReportsStore } from '@/state/use-reports-store'
import { DeathData } from '@/lib/types/reports'
import { TableCell } from '@/components/ui/table'
import { ReportComponent } from './component/report'

export const DeathReport = () => {
    const { deathData, loading, error, fetchDeathData } = useReportsStore()

    return (
        <ReportComponent<DeathData[0]>
            title="Death Registrations"
            data={deathData}
            loading={loading}
            error={error}
            fetchDataAction={fetchDeathData}
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