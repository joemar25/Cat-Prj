'use client';

import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { BaseRegistryForm, FormType, User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { DataTableRowActions } from './data-table-row-actions';

export interface ExtendedBaseRegistryForm extends BaseRegistryForm {
  preparedBy: User | null;
  verifiedBy: User | null;
}

const formTypeVariants: Record<
  FormType,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  MARRIAGE: { label: 'Marriage', variant: 'destructive' },
  BIRTH: { label: 'Birth', variant: 'secondary' },
  DEATH: { label: 'Death', variant: 'default' },
};

export const columns: ColumnDef<ExtendedBaseRegistryForm>[] = [
  {
    accessorKey: 'formType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Form Type' />
    ),
    cell: ({ row }) => {
      const formType = row.getValue('formType') as FormType;
      const formTypeInfo = formTypeVariants[formType];
      return (
        <Badge variant={formTypeInfo.variant} className='font-medium'>
          {formTypeInfo.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'preparedBy',
    accessorFn: (row) => row.preparedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prepared By' />
    ),
    cell: ({ row }) => {
      const preparedBy = row.original.preparedBy?.name || 'N/A';
      return <span>{preparedBy}</span>;
    },
    filterFn: (row, id, value: string[]) => {
      const preparerName = row.original.preparedBy?.name;
      if (!value?.length) return true; // If no filters selected, show all
      return value.includes(preparerName || '');
    },
  },
  {
    id: 'verifiedBy',
    accessorFn: (row) => row.verifiedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Verified By' />
    ),
    cell: ({ row }) => {
      const verifiedBy = row.original.verifiedBy?.name || 'N/A';
      return <span>{verifiedBy}</span>;
    },
    filterFn: (row, id, value: string[]) => {
      const verifierName = row.original.verifiedBy?.name;
      if (!value?.length) return true; // If no filters selected, show all
      return value.includes(verifierName || '');
    },
  },
  {
    accessorKey: 'registryNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Registry Number' />
    ),
  },
  {
    accessorKey: 'province',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Province' />
    ),
  },
  {
    accessorKey: 'cityMunicipality',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City/Municipality' />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as Date;
      return <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>;
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];
