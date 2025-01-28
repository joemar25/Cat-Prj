'use client'

import { useCallback } from 'react'
import { User } from '@prisma/client'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { useTranslation } from 'react-i18next' // Import the useTranslation hook

interface DataTableToolbarProps<TData extends User> {
  table: Table<TData>
}

const verificationStatus = [
  { label: 'Verified', value: 'true' },
  { label: 'Unverified', value: 'false' },
]

export function DataTableToolbar<TData extends User>({
  table,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation() // Initialize the translation hook
  const isFiltered = table.getState().columnFilters.length > 0

  const nameColumn = table.getColumn('name')
  const statusColumn = table.getColumn('emailVerified')

  const handleSearch = useCallback(
    (value: string) => {
      nameColumn?.setFilterValue(value)
    },
    [nameColumn]
  )

  const handleExport = () => {
    console.log('Export functionality to be implemented')
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative">
          <Icons.search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('dataTableToolbar.searchPlaceholder')}
            value={(nameColumn?.getFilterValue() as string) ?? ''}
            onChange={(event) => handleSearch(event.target.value)}
            className="h-10 w-[200px] lg:w-[300px] pl-10"
          />
        </div>
         {/* 
        mar-note: Do not remove this comment, as this role column can be used for future purposes.
        {roleColumn && (
          <DataTableFacetedFilter
            column={roleColumn}
            title='Role'
            options={userRoles.map((role) => ({
              label: role.label,
              value: role.value,
              icon:
                role.value === UserRole.ADMIN
                  ? Icons.shield
                  : role.value === UserRole.STAFF
                    ? Icons.user
                    : Icons.userCog,
            }))}
          />
        )} */}

        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title={t('dataTableToolbar.status')} 
            options={verificationStatus}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-3"
          >
            {t('dataTableToolbar.resetFilters')}  {/* Use translated button text */}
            <Cross2Icon className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="h-10" onClick={handleExport}>
          <Icons.download className="mr-2 h-4 w-4" />
          {t('dataTableToolbar.scan')}  {/* Use translated button text */}
        </Button>
        <Button variant="outline" className="h-10" onClick={handleExport}>
          <Icons.download className="mr-2 h-4 w-4" />
          {t('dataTableToolbar.upload')}  {/* Use translated button text */}
        </Button>
        {/* <AddUserDialog
          onSuccess={() => {
            table.resetColumnFilters()
            table.resetSorting()
          }}
        /> */}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
