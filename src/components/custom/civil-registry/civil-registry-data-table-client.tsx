'use client';

import {
  ExtendedBaseRegistryForm,
  getColumns,
} from '@/components/custom/civil-registry/columns';
import { DataTable } from '@/components/custom/civil-registry/data-table';
import { useTranslation } from 'react-i18next';

interface CivilRegistryDataTableProps {
  forms: ExtendedBaseRegistryForm[];
}

export function CivilRegistryDataTable({ forms }: CivilRegistryDataTableProps) {
  const { t } = useTranslation();
  const columns = getColumns(t);

  return <DataTable data={forms} columns={columns} selection={false} />;
}
