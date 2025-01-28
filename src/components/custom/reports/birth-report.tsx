"use client";

import { useReportsStore } from '@/state/use-reports-store';
import { BirthData } from '@/lib/types/reports';
import { ReportComponent } from './component/report';
import { TableCell } from '@/components/ui/table';
import { useTranslation } from 'react-i18next'; // Import the translation hook

export const BirthReport = () => {
    const { birthData, loading, error, fetchBirthData } = useReportsStore();
    const { t } = useTranslation(); // Initialize the translation hook

    return (
        <ReportComponent<BirthData[0]>
            title={t('birthReport.title')} // Translated title
            data={birthData}
            loading={loading}
            error={error}
            fetchDataAction={fetchBirthData}
            tableHeaders={[
                t('birthReport.year'), // Translated table headers
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
    );
};``