'use client'

import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { BaseRegistryForm, DocumentStatus, FormType, User } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableRowActions } from './data-table-row-actions'
import { DateRange } from 'react-day-picker'

export interface ExtendedBaseRegistryForm extends BaseRegistryForm {
  preparedBy: User | null
  verifiedBy: User | null
}

const formTypeVariants: Record<
  FormType,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  MARRIAGE: { label: 'Marriage', variant: 'destructive' },
  BIRTH: { label: 'Birth', variant: 'secondary' },
  DEATH: { label: 'Death', variant: 'default' },
}

export const columns: ColumnDef<ExtendedBaseRegistryForm>[] = [
  {
    accessorKey: 'formType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Form Type' />
    ),
    cell: ({ row }) => {
      const formType = row.getValue('formType') as FormType
      const formTypeInfo = formTypeVariants[formType]
      return (
        <Badge variant={formTypeInfo.variant} className='font-medium'>
          {formTypeInfo.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'registryNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Registry Number' />
    ),
    cell: ({ row }) => {
      const registryNumber = row.getValue('registryNumber') as string
      return <span>{registryNumber}</span>
    },
  },
  {
    accessorKey: 'province',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Province' />
    ),
    cell: ({ row }) => {
      const province = row.getValue('province') as string
      return <span>{province}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'cityMunicipality',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City/Municipality' />
    ),
    cell: ({ row }) => {
      const cityMunicipality = row.getValue('cityMunicipality') as string
      return <span>{cityMunicipality}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'preparedBy',
    accessorFn: (row) => row.preparedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prepared By' />
    ),
    cell: ({ row }) => {
      const preparedBy = row.original.preparedBy?.name || 'N/A'
      return <span>{preparedBy}</span>
    },
    filterFn: (row, id, value: string[]) => {
      const preparerName = row.original.preparedBy?.name
      if (!value?.length) return true // If no filters selected, show all
      return value.includes(preparerName || '')
    },
  },
  {
    id: 'verifiedBy',
    accessorFn: (row) => row.verifiedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Verified By' />
    ),
    cell: ({ row }) => {
      const verifiedBy = row.original.verifiedBy?.name || 'N/A'
      return <span>{verifiedBy}</span>
    },
    filterFn: (row, id, value: string[]) => {
      const verifierName = row.original.verifiedBy?.name
      if (!value?.length) return true // If no filters selected, show all
      return value.includes(verifierName || '')
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as Date
      return <span>{format(createdAt, 'PPP')}</span>
    },
    filterFn: (row, id, filterValue: DateRange) => {
      if (!filterValue?.from) return true

      const rowDate = new Date(row.getValue(id))
      const start = new Date(filterValue.from)
      start.setHours(0, 0, 0, 0)

      if (!filterValue.to) {
        return rowDate >= start
      }

      const end = new Date(filterValue.to)
      end.setHours(23, 59, 59, 999)

      return rowDate >= start && rowDate <= end
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as DocumentStatus
      return (
        <Badge variant={status === 'PENDING' ? 'secondary' : 'default'}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />
    },
  },
]