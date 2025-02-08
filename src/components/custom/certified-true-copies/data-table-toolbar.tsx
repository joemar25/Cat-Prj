// src/components/custom/requests/data-table-toolbar.tsx
'use client'

import { useCallback, useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { CertifiedCopy, Permission } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { hasPermission } from '@/types/auth'
import { useUser } from '@/context/user-context'

interface DataTableToolbarProps<TData extends CertifiedCopy> {
  table: Table<TData>
}

const requestStatus = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export function DataTableToolbar<TData extends CertifiedCopy>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const requesterColumn = table.getColumn('requesterName')
  const statusColumn = table.getColumn('status')
  const { permissions } = useUser()
  const [formSelectionOpen, setFormSelectionOpen] = useState(false)

  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)

  const handleSearch = useCallback(
    (value: string) => {
      requesterColumn?.setFilterValue(value)
    },
    [requesterColumn]
  )

  const handleExport = () => {
    console.log('Export functionality to be implemented')
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-4'>
        <div className='relative'>
          <Icons.search className='absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <Input
            placeholder='Search requesters...'
            value={(requesterColumn?.getFilterValue() as string) ?? ''}
            onChange={(event) => handleSearch(event.target.value)}
            className='h-10 w-[200px] lg:w-[300px] pl-10'
          />
        </div>

        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title='Status'
            options={requestStatus}
          />
        )}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-10 px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-5 w-5' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-4'>
        <Button variant='outline' className='h-10' onClick={handleExport}>
          <Icons.download className='mr-2 h-4 w-4' />
          Export
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}