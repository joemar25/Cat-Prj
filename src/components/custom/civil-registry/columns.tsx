'use client'

import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { BaseRegistryForm, DocumentStatus, FormType, User, BirthCertificateForm, DeathCertificateForm, MarriageCertificateForm } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableRowActions } from './data-table-row-actions'
import { DateRange } from 'react-day-picker'

export interface ExtendedBaseRegistryForm extends BaseRegistryForm {
  preparedBy: User | null
  verifiedBy: User | null
  birthCertificateForm: BirthCertificateForm | null
  deathCertificateForm: DeathCertificateForm | null
  marriageCertificateForm: MarriageCertificateForm | null
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Form Type' />,
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
    accessorFn: (row) => {
      return JSON.stringify({
        registryNumber: row.registryNumber,
        pageNumber: row.pageNumber,
        bookNumber: row.bookNumber,
      });
    },
    id: 'registryDetails',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Registry Details' />,
    cell: ({ row }) => {
      const details = JSON.parse(row.getValue('registryDetails')) as {
        registryNumber: string;
        pageNumber: string;
        bookNumber: string;
      };

      return (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Registry:</span>
            <span className="text-sm text-muted-foreground">{details.registryNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Page:</span>
            <span className="text-sm text-muted-foreground">{details.pageNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Book:</span>
            <span className="text-sm text-muted-foreground">{details.bookNumber}</span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const details = JSON.parse(row.getValue(id)) as {
        registryNumber: string;
        pageNumber: string;
        bookNumber: string;
      };

      if (!value) return true;

      // Handle filtering for pageNumber and bookNumber
      if (typeof value === 'object' && 'pageNumber' in value && 'bookNumber' in value) {
        const { pageNumber, bookNumber } = value;
        const matchesPage = pageNumber ? details.pageNumber.toLowerCase().includes(pageNumber.toLowerCase()) : true;
        const matchesBook = bookNumber ? details.bookNumber.toLowerCase().includes(bookNumber.toLowerCase()) : true;
        return matchesPage && matchesBook;
      }

      return true;
    },
  },
  {
    accessorFn: (row) => {
      let details = '';
      if (row.formType === 'BIRTH' && row.birthCertificateForm) {
        const childName = typeof row.birthCertificateForm.childName === 'string'
          ? JSON.parse(row.birthCertificateForm.childName)
          : row.birthCertificateForm.childName;
        details = JSON.stringify({
          name: `${childName.first || ''} ${childName.middle || ''} ${childName.last || ''}`,
          sex: row.birthCertificateForm.sex,
          dateOfBirth: format(row.birthCertificateForm.dateOfBirth, 'PP'),
        });
      } else if (row.formType === 'DEATH' && row.deathCertificateForm) {
        const deceasedName = typeof row.deathCertificateForm.deceasedName === 'string'
          ? JSON.parse(row.deathCertificateForm.deceasedName)
          : row.deathCertificateForm.deceasedName;
        details = JSON.stringify({
          name: `${deceasedName.first || ''} ${deceasedName.middle || ''} ${deceasedName.last || ''}`,
          sex: row.deathCertificateForm.sex,
          dateOfDeath: format(row.deathCertificateForm.dateOfDeath, 'PP'),
        });
      } else if (row.formType === 'MARRIAGE' && row.marriageCertificateForm) {
        details = JSON.stringify({
          husband: `${row.marriageCertificateForm.husbandLastName}, ${row.marriageCertificateForm.husbandFirstName}`,
          wife: `${row.marriageCertificateForm.wifeLastName}, ${row.marriageCertificateForm.wifeFirstName}`,
          dateOfMarriage: format(row.marriageCertificateForm.dateOfMarriage, 'PP'),
        });
      }
      return details;
    },
    id: 'details',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Details' />,
    cell: ({ row }) => {
      const details = JSON.parse(row.getValue('details')) as {
        name?: string;
        sex?: string;
        dateOfBirth?: string;
        dateOfDeath?: string;
        husband?: string;
        wife?: string;
        dateOfMarriage?: string;
      };

      return (
        <div className="space-y-2">
          {details.name && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Name:</span>
              <span>{details.name}</span>
            </div>
          )}
          {details.sex && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Sex:</span>
              <span>{details.sex}</span>
            </div>
          )}
          {details.dateOfBirth && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Date:</span>
              <span>{details.dateOfBirth}</span>
            </div>
          )}
          {details.dateOfDeath && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Date:</span>
              <span>{details.dateOfDeath}</span>
            </div>
          )}
          {details.husband && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Husband:</span>
              <span>{details.husband}</span>
            </div>
          )}
          {details.wife && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Wife:</span>
              <span>{details.wife}</span>
            </div>
          )}
          {details.dateOfMarriage && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Date:</span>
              <span>{details.dateOfMarriage}</span>
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      const details = row.getValue(id) as string;
      if (!value?.length) return true;
      return value.some((val) => details.toLowerCase().includes(val.toLowerCase()));
    },
  },
  {
    accessorFn: (row) => `${row.province}, ${row.cityMunicipality}`,
    id: 'location',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Location' />,
    cell: ({ row }) => {
      const location = row.getValue('location') as string
      return (
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{location.split(', ')[0]}</span>
          <span className="text-sm text-muted-foreground">{location.split(', ')[1]}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const location = row.getValue(id) as string
      if (!value?.length) return true
      return value.some((val) => location.toLowerCase().includes(val.toLowerCase()))
    },
  },
  {
    id: 'preparedBy',
    accessorFn: (row) => row.preparedBy?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Prepared By' />,
    cell: ({ row }) => {
      const preparedBy = row.original.preparedBy?.name || 'N/A'
      return (
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{preparedBy}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const preparerName = row.original.preparedBy?.name
      if (!value?.length) return true
      return value.includes(preparerName || '')
    },
  },
  {
    id: 'verifiedBy',
    accessorFn: (row) => row.verifiedBy?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Verified By' />,
    cell: ({ row }) => {
      const verifiedBy = row.original.verifiedBy?.name || 'N/A'
      return (
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{verifiedBy}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const verifierName = row.original.verifiedBy?.name
      if (!value?.length) return true
      return value.includes(verifierName || '')
    },
  },
  {
    accessorFn: (row) => {
      const receivedBy = `${row.receivedBy || ''} ${row.receivedByPosition || ''}`.trim()
      const receivedDate = row.receivedDate ? format(row.receivedDate, 'PP') : 'N/A'
      return `${receivedBy} - ${receivedDate}`
    },
    id: 'received',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Received' />,
    cell: ({ row }) => {
      const received = row.getValue('received') as string
      return (
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{received.split(' - ')[0]}</span>
          <span className="text-sm text-muted-foreground">{received.split(' - ')[1]}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const received = row.getValue(id) as string
      if (!value?.length) return true
      return value.some((val) => received.toLowerCase().includes(val.toLowerCase()))
    },
  },
  {
    accessorFn: (row) => `${row.registeredBy || ''} ${row.registeredByPosition || ''}`.trim(),
    id: 'registeredBy',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Registered By' />,
    cell: ({ row }) => {
      const registeredBy = row.getValue('registeredBy') as string
      return (
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{registeredBy.split(' ')[0]}</span>
          <span className="text-sm text-muted-foreground">{registeredBy.split(' ').slice(1).join(' ')}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const registeredBy = row.getValue(id) as string
      if (!value?.length) return true
      return value.some((val) => registeredBy.toLowerCase().includes(val.toLowerCase()))
    },
  },
  {
    id: 'year',
    accessorFn: (row) => {
      const date = row.dateOfRegistration || row.createdAt;
      return new Date(date).getFullYear().toString();
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Year' />,
    cell: ({ row }) => {
      const year = row.getValue('year') as string;
      return <span>{year}</span>;
    },
    filterFn: (row, id, value: string[]) => {
      const year = row.getValue(id) as string;
      if (!value?.length) return true;
      return value.includes(year);
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
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
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as Date
      return <span>{format(createdAt, 'PPP')}</span>
    },
    filterFn: (row, id, filterValue) => {
      if (typeof filterValue === 'object' && 'from' in filterValue) {
        if (!filterValue) return true
        const rowDate = new Date(row.getValue(id))
        const range = filterValue as DateRange

        if (!range.from) return true

        const start = new Date(range.from)
        start.setHours(0, 0, 0, 0)

        if (!range.to) {
          return rowDate >= start
        }

        const end = new Date(range.to)
        end.setHours(23, 59, 59, 999)

        return rowDate >= start && rowDate <= end
      }

      if (Array.isArray(filterValue)) {
        if (!filterValue.length) return true
        const date = new Date(row.getValue(id))
        const year = date.getFullYear().toString()
        return filterValue.includes(year)
      }

      return true
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