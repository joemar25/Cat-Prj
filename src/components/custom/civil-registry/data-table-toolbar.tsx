'use client'

import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { FormType } from '@prisma/client'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { toast } from 'sonner'
import { AddCivilRegistryFormDialog } from './actions/add-form-dialog'
import { ExtendedBaseRegistryForm } from './columns'
import { AddCivilRegistryFormDialogPdf } from './actions/upload-pdf-dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

interface DataTableToolbarProps {
  table: Table<ExtendedBaseRegistryForm>
}

const formTypes = [
  { label: 'Marriage', value: FormType.MARRIAGE },
  { label: 'Birth', value: FormType.BIRTH },
  { label: 'Death', value: FormType.DEATH },
] as const

function ScanFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="h-10">
          <Icons.post className="mr-2 h-4 w-4" />
          Scan Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan Form</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">Scanner functionality to be implemented</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const formTypeColumn = table.getColumn('formType')
  const preparedByColumn = table.getColumn('preparedBy')
  const verifiedByColumn = table.getColumn('verifiedBy')
  const createdAtColumn = table.getColumn('createdAt')

  // Get unique preparer options
  const preparerOptions = Array.from(
    new Set(
      table.getRowModel().rows.map((row) => row.original.preparedBy?.name)
    )
  )
    .filter(Boolean)
    .map((name) => ({
      label: name as string,
      value: name as string,
      icon: Icons.user,
    }))

  // Get unique verifier options
  const verifierOptions = Array.from(
    new Set(
      table.getRowModel().rows.map((row) => row.original.verifiedBy?.name)
    )
  )
    .filter(Boolean)
    .map((name) => ({
      label: name as string,
      value: name as string,
      icon: Icons.user,
    }))

  const handleSearch = (value: string) => {
    table.setGlobalFilter(value)
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (createdAtColumn) {
      if (range?.from) {
        const filterValue = {
          from: range.from,
          to: range.to || range.from
        }
        createdAtColumn.setFilterValue(filterValue)
      } else {
        createdAtColumn.setFilterValue(undefined)
      }
    }
  }

  const handleReset = () => {
    table.resetColumnFilters()
    setDateRange(undefined)
  }

  const handleExport = () => {
    try {
      const tableData = table.getCoreRowModel().rows.map((row) => row.original)
      if (tableData.length === 0) {
        toast.error('No data available to export')
        return
      }
      const headers = Object.keys(tableData[0]).join(',')
      const rows = tableData
        .map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(',')
        )
        .join('\n')
      const csvContent = `${headers}\n${rows}`
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'exported-data.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
      console.error('Export Error:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Top row with search and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-[300px]">
          <Icons.search className="absolute h-4 w-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search forms..."
            onChange={(event) => handleSearch(event.target.value)}
            className="w-full pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center space-x-4">
          <Button variant="outline" className="h-10" onClick={handleExport}>
            <Icons.download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <ScanFormDialog />
          <AddCivilRegistryFormDialog />
          <AddCivilRegistryFormDialogPdf />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Filters section */}
      <div className="flex flex-wrap gap-2">
        {/* Existing filters */}
        <div className="flex flex-wrap gap-2">
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
          {preparedByColumn && preparerOptions.length > 0 && (
            <DataTableFacetedFilter
              column={preparedByColumn}
              title="Prepared By"
              options={preparerOptions}
            />
          )}
          {verifiedByColumn && verifierOptions.length > 0 && (
            <DataTableFacetedFilter
              column={verifiedByColumn}
              title="Verified By"
              options={verifierOptions}
            />
          )}
        </div>

        {/* Date range picker and reset button */}
        <div className="flex gap-2 items-start">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {isFiltered && (
            <Button variant="ghost" onClick={handleReset} size="sm">
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}