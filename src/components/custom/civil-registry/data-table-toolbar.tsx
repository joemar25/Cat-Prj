'use client'

import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { BaseRegistryForm, FormType } from '@prisma/client'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { useCallback } from 'react'
import { AddCivilRegistryFormDialog } from './actions/add-form-dialog'

interface DataTableToolbarProps<TData extends BaseRegistryForm> {
  table: Table<TData>
}

const formTypes = [
  { label: 'Marriage', value: FormType.MARRIAGE },
  { label: 'Birth', value: FormType.BIRTH },
  { label: 'Death', value: FormType.DEATH },
]

export function DataTableToolbar<TData extends BaseRegistryForm>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const formTypeColumn = table.getColumn('formType')
  const preparedByColumn = table.getColumn('preparedBy')
  const verifiedByColumn = table.getColumn('verifiedBy')

  const handleSearch = useCallback(
    (value: string) => {
      formTypeColumn?.setFilterValue(value)
    },
    [formTypeColumn]
  )

  const handleExport = () => {
    console.log('Export functionality to be implemented')
  }

  const handleScanForm = () => {
    console.log('Scanning form functionality to be implemented')
    // Implement scanning functionality here
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative">
          <Icons.search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search forms..."
            value={(formTypeColumn?.getFilterValue() as string) ?? ''}
            onChange={(event) => handleSearch(event.target.value)}
            className="h-10 w-[200px] lg:w-[300px] pl-10"
          />
        </div>

        {formTypeColumn && (
          <DataTableFacetedFilter
            column={formTypeColumn}
            title="Form Type"
            options={formTypes.map((type) => ({
              label: type.label,
              value: type.value,
              icon:
                type.value === FormType.MARRIAGE
                  ? Icons.heart
                  : type.value === FormType.BIRTH
                    ? Icons.baby
                    : Icons.skull,
            }))}
          />
        )}

        {preparedByColumn && (
          <DataTableFacetedFilter
            column={preparedByColumn}
            title="Prepared By"
            options={[]} // Add options dynamically if needed
          />
        )}

        {verifiedByColumn && (
          <DataTableFacetedFilter
            column={verifiedByColumn}
            title="Verified By"
            options={[]} // Add options dynamically if needed
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="h-10" onClick={handleExport}>
          <Icons.download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button variant={"default"} className="h-10" onClick={handleScanForm}>
          <Icons.post className="mr-2 h-4 w-4" />
          Scan Form
        </Button>

        <AddCivilRegistryFormDialog />

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
