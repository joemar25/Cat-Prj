'use client';

import StatusDropdown from '@/components/custom/civil-registry/components/status-dropdown';
import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DataTableRowActions } from './data-table-row-actions';

import {
  Attachment,
  BaseRegistryForm,
  BirthCertificateForm,
  CertifiedCopy,
  DeathCertificateForm,
  Document,
  DocumentStatus,
  FormType,
  MarriageCertificateForm,
  User,
} from '@prisma/client';

export interface ExtendedBaseRegistryForm extends BaseRegistryForm {
  preparedBy: User | null;
  verifiedBy: User | null;
  birthCertificateForm: BirthCertificateForm | null;
  deathCertificateForm: DeathCertificateForm | null;
  marriageCertificateForm: MarriageCertificateForm | null;
  document:
    | (Document & {
        attachments: (Attachment & {
          certifiedCopies: CertifiedCopy[];
        })[];
      })
    | null;
}

const formTypeVariants: Record<
  FormType,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  MARRIAGE: { label: 'Marriage', variant: 'destructive' },
  BIRTH: { label: 'Birth', variant: 'secondary' },
  DEATH: { label: 'Death', variant: 'default' },
};

/**
 * Create your columns by passing the translation function `t` (from useTranslation).
 */
export const getColumns = (
  t: (key: string) => string
): ColumnDef<ExtendedBaseRegistryForm>[] => [
  {
    accessorKey: 'formType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('formType')} />
    ),
    cell: ({ row }) => {
      const formType = row.getValue('formType') as FormType;
      const formTypeInfo = formTypeVariants[formType];
      return (
        <Badge
          variant={formTypeInfo.variant}
          className={`font-medium ${
            formTypeInfo.label.toLowerCase() === 'marriage'
              ? 'bg-blue-500/30 dark:bg-blue-500/50 dark:text-accent-foreground text-blue-500 hover:bg-blue-500/30'
              : formTypeInfo.label.toLowerCase() === 'death'
              ? 'bg-muted text-accent-foreground hover:bg-muted'
              : formTypeInfo.label.toLowerCase() === 'birth'
              ? 'bg-green-500/30 dark:bg-green-500/50 text-green-500 dark:text-accent-foreground hover:bg-green-500/30'
              : ''
          }`}
        >
          {t(formTypeInfo.label.toLowerCase())}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('registryDetails')} />
    ),
    cell: ({ row }) => {
      const details = JSON.parse(row.getValue('registryDetails')) as {
        registryNumber: string;
        pageNumber: string;
        bookNumber: string;
      };
      return (
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{t('registry')}:</span>
            <span className='text-sm text-muted-foreground'>
              {details.registryNumber}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{t('page')}:</span>
            <span className='text-sm text-muted-foreground'>
              {details.pageNumber}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{t('book')}:</span>
            <span className='text-sm text-muted-foreground'>
              {details.bookNumber}
            </span>
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
      if (
        typeof value === 'object' &&
        'pageNumber' in value &&
        'bookNumber' in value
      ) {
        const { pageNumber, bookNumber } = value;
        const matchesPage = pageNumber
          ? details.pageNumber.toLowerCase().includes(pageNumber.toLowerCase())
          : true;
        const matchesBook = bookNumber
          ? details.bookNumber.toLowerCase().includes(bookNumber.toLowerCase())
          : true;
        return matchesPage && matchesBook;
      }

      return true;
    },
  },
  {
    accessorFn: (row) => {
      let details = '';
      if (row.formType === 'BIRTH' && row.birthCertificateForm) {
        const childName =
          typeof row.birthCertificateForm.childName === 'string'
            ? JSON.parse(row.birthCertificateForm.childName)
            : row.birthCertificateForm.childName;
        details = JSON.stringify({
          firstName: childName.firstName || '',
          middleName: childName.middleName || '',
          lastName: childName.lastName || '',
          sex: row.birthCertificateForm.sex,
          dateOfBirth: format(row.birthCertificateForm.dateOfBirth, 'PP'),
        });
      } else if (row.formType === 'DEATH' && row.deathCertificateForm) {
        const deceasedName =
          typeof row.deathCertificateForm.deceasedName === 'string'
            ? JSON.parse(row.deathCertificateForm.deceasedName)
            : row.deathCertificateForm.deceasedName;
        details = JSON.stringify({
          firstName: deceasedName.first || '',
          middleName: deceasedName.middle || '',
          lastName: deceasedName.last || '',
          sex: row.deathCertificateForm.sex,
          dateOfDeath: format(row.deathCertificateForm.dateOfDeath, 'PP'),
        });
      } else if (row.formType === 'MARRIAGE' && row.marriageCertificateForm) {
        details = JSON.stringify({
          husbandFirstName: row.marriageCertificateForm.husbandFirstName,
          husbandLastName: row.marriageCertificateForm.husbandLastName,
          wifeFirstName: row.marriageCertificateForm.wifeFirstName,
          wifeLastName: row.marriageCertificateForm.wifeLastName,
          dateOfMarriage: format(
            row.marriageCertificateForm.dateOfMarriage,
            'PP'
          ),
        });
      }
      return details;
    },
    id: 'details',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('details')} />
    ),
    cell: ({ row }) => {
      const details = JSON.parse(row.getValue('details')) as {
        firstName?: string;
        middleName?: string;
        lastName?: string;
        sex?: string;
        dateOfBirth?: string;
        dateOfDeath?: string;
        husbandFirstName?: string;
        husbandLastName?: string;
        wifeFirstName?: string;
        wifeLastName?: string;
        dateOfMarriage?: string;
      };

      return (
        <div className='space-y-2'>
          {(details.firstName || details.middleName || details.lastName) && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('name')}:</span>
              <span>{`${details.firstName || ''} ${details.middleName || ''} ${
                details.lastName || ''
              }`}</span>
            </div>
          )}
          {details.sex && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('sex')}:</span>
              <span>{details.sex}</span>
            </div>
          )}
          {details.dateOfBirth && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('dateOfBirth')}:</span>
              <span>{details.dateOfBirth}</span>
            </div>
          )}
          {details.dateOfDeath && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('dateOfDeath')}:</span>
              <span>{details.dateOfDeath}</span>
            </div>
          )}
          {(details.husbandFirstName || details.husbandLastName) && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('husband')}:</span>
              <span>{`${details.husbandFirstName || ''} ${
                details.husbandLastName || ''
              }`}</span>
            </div>
          )}
          {(details.wifeFirstName || details.wifeLastName) && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('wife')}:</span>
              <span>{`${details.wifeFirstName || ''} ${
                details.wifeLastName || ''
              }`}</span>
            </div>
          )}
          {details.dateOfMarriage && (
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{t('dateOfMarriage')}:</span>
              <span>{details.dateOfMarriage}</span>
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // Early return if value is not in expected format
      if (!Array.isArray(value)) return true;

      try {
        const details = JSON.parse(row.getValue(id)) as {
          firstName?: string;
          middleName?: string;
          lastName?: string;
          husbandFirstName?: string;
          husbandLastName?: string;
          wifeFirstName?: string;
          wifeLastName?: string;
        };

        const [firstNameSearch, middleNameSearch, lastNameSearch] = value as [
          string,
          string,
          string
        ];

        if (!firstNameSearch && !middleNameSearch && !lastNameSearch) {
          return true;
        }

        if (details.firstName || details.middleName || details.lastName) {
          const firstMatch =
            !firstNameSearch ||
            (details.firstName?.toLowerCase() || '').includes(
              firstNameSearch.toLowerCase()
            );
          const middleMatch =
            !middleNameSearch ||
            (details.middleName?.toLowerCase() || '').includes(
              middleNameSearch.toLowerCase()
            );
          const lastMatch =
            !lastNameSearch ||
            (details.lastName?.toLowerCase() || '').includes(
              lastNameSearch.toLowerCase()
            );
          return firstMatch && middleMatch && lastMatch;
        }

        const husbandFirstMatch =
          !firstNameSearch ||
          (details.husbandFirstName?.toLowerCase() || '').includes(
            firstNameSearch.toLowerCase()
          );
        const husbandLastMatch =
          !lastNameSearch ||
          (details.husbandLastName?.toLowerCase() || '').includes(
            lastNameSearch.toLowerCase()
          );
        const wifeFirstMatch =
          !firstNameSearch ||
          (details.wifeFirstName?.toLowerCase() || '').includes(
            firstNameSearch.toLowerCase()
          );
        const wifeLastMatch =
          !lastNameSearch ||
          (details.wifeLastName?.toLowerCase() || '').includes(
            lastNameSearch.toLowerCase()
          );

        return (
          (husbandFirstMatch && husbandLastMatch) ||
          (wifeFirstMatch && wifeLastMatch)
        );
      } catch (error) {
        console.error(error);
        return true;
      }
    },
  },
  {
    accessorFn: (row) => `${row.province}, ${row.cityMunicipality}`,
    id: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('location')} />
    ),
    cell: ({ row }) => {
      const location = row.getValue('location') as string;
      const [province, city] = location.split(', ');
      return (
        <div className='flex flex-col space-y-1'>
          <span className='font-medium'>{province}</span>
          <span className='text-sm text-muted-foreground'>{city}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      const location = row.getValue(id) as string;
      if (!value?.length) return true;
      return value.some((val) =>
        location.toLowerCase().includes(val.toLowerCase())
      );
    },
  },
  {
    id: 'preparedBy',
    accessorFn: (row) => row.preparedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('preparedBy')} />
    ),
    cell: ({ row }) => {
      const preparedBy = row.original.preparedBy?.name || 'N/A';
      return (
        <div className='flex flex-col space-y-1'>
          <span className='font-medium'>{preparedBy}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      const preparerName = row.original.preparedBy?.name;
      if (!value?.length) return true;
      return value.includes(preparerName || '');
    },
  },
  {
    id: 'verifiedBy',
    accessorFn: (row) => row.verifiedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('verifiedBy')} />
    ),
    cell: ({ row }) => {
      const verifiedBy = row.original.verifiedBy?.name || 'N/A';
      return (
        <div className='flex flex-col space-y-1'>
          <span className='font-medium'>{verifiedBy}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      const verifierName = row.original.verifiedBy?.name;
      if (!value?.length) return true;
      return value.includes(verifierName || '');
    },
  },
  {
    accessorFn: (row) => {
      const receivedBy = `${row.receivedBy || ''} ${
        row.receivedByPosition || ''
      }`.trim();
      const receivedDate = row.receivedDate
        ? format(row.receivedDate, 'PP')
        : 'N/A';
      return `${receivedBy} - ${receivedDate}`;
    },
    id: 'received',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('received')} />
    ),
    cell: ({ row }) => {
      const received = row.getValue('received') as string;
      const [by, date] = received.split(' - ');
      return (
        <div className='flex flex-col space-y-1'>
          <span className='font-medium'>{by}</span>
          <span className='text-sm text-muted-foreground'>{date}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      const received = row.getValue(id) as string;
      if (!value?.length) return true;
      return value.some((val) =>
        received.toLowerCase().includes(val.toLowerCase())
      );
    },
  },
  {
    accessorFn: (row) =>
      `${row.registeredBy || ''} ${row.registeredByPosition || ''}`.trim(),
    id: 'registeredBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('registeredBy')} />
    ),
    cell: ({ row }) => {
      const registeredBy = row.getValue('registeredBy') as string;
      const [name, ...rest] = registeredBy.split(' ');
      return (
        <div className='flex flex-col space-y-1'>
          <span className='font-medium'>{name}</span>
          <span className='text-sm text-muted-foreground'>
            {rest.join(' ')}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      const registeredBy = row.getValue(id) as string;
      if (!value?.length) return true;
      return value.some((val) =>
        registeredBy.toLowerCase().includes(val.toLowerCase())
      );
    },
  },
  {
    id: 'year',
    accessorFn: (row) => {
      const date = row.dateOfRegistration || row.createdAt;
      return new Date(date).getFullYear().toString();
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('year')} />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('status')} />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as DocumentStatus;
      return (
        <StatusDropdown
          formId={row.original.id}
          currentStatus={status}
          onStatusChange={(newStatus) => {
            row.original.status = newStatus;
          }}
        />
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('createdAt')} />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as Date;
      return <span>{format(createdAt, 'PPP')}</span>;
    },
    filterFn: (row, id, filterValue) => {
      if (typeof filterValue === 'object' && 'from' in filterValue) {
        if (!filterValue) return true;
        const rowDate = new Date(row.getValue(id));
        const range = filterValue as DateRange;

        if (!range.from) return true;

        const start = new Date(range.from);
        start.setHours(0, 0, 0, 0);

        if (!range.to) {
          return rowDate >= start;
        }

        const end = new Date(range.to);
        end.setHours(23, 59, 59, 999);

        return rowDate >= start && rowDate <= end;
      }

      if (Array.isArray(filterValue)) {
        if (!filterValue.length) return true;
        const date = new Date(row.getValue(id));
        const year = date.getFullYear().toString();
        return filterValue.includes(year);
      }

      return true;
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('Actions')} />
    ),
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];
