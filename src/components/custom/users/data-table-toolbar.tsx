'use client'

import { useCallback, useState } from 'react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Permission } from '@prisma/client'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { Cross2Icon } from '@radix-ui/react-icons'
import { AddUserDialog } from './actions/add-user-dialog'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'

interface DataTableToolbarProps<TData extends User> {
  table: Table<TData>
  role?: string
}

const verificationStatus = [
  { label: 'Verified', value: 'true' },
  { label: 'Unverified', value: 'false' },
]

export function DataTableToolbar<TData extends User>({
  table, role
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const router = useRouter()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const isFiltered = table.getState().columnFilters.length > 0

  const nameColumn = table.getColumn('name')
  const statusColumn = table.getColumn('emailVerified')

  const canExport = hasPermission(permissions, Permission.REPORT_EXPORT)
  const canAddUser = hasPermission(permissions, Permission.USER_CREATE)

  const handleSearch = useCallback(
    (value: string) => {
      nameColumn?.setFilterValue(value)
    },
    [nameColumn]
  )

  const handleExport = () => {
    if (canExport) {
      console.log('Export functionality to be implemented')
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className='relative'>
      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative">
            <Icons.search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder={t('dataTableToolbar.searchPlaceholder')}
              value={(nameColumn?.getFilterValue() as string) ?? ''}
              onChange={(event) => handleSearch(event.target.value)}
              className="h-10 w-[200px] lg:w-[300px] pl-10"
            />
          </div>

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
              {t('dataTableToolbar.resetFilters')}
              <Cross2Icon className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {canExport && (
            <Button variant="outline" onClick={handleExport}>
              <Icons.download className="mr-2 h-4 w-4" />
              {t('dataTableToolbar.export')}
            </Button>
          )}

          {canAddUser && (
            <AddUserDialog
              onSuccess={() => {
                table.resetColumnFilters()
                table.resetSorting()
              }}
              role={role}
            />
          )}

          <DataTableViewOptions table={table} />

          <Button variant="outline" onClick={handleRefresh}>
            <Icons.refresh
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
