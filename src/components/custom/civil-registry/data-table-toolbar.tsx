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
// import { AddCivilRegistryFormDialogPdf } from './actions/upload-pdf-dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { ComponentType } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DataTableToolbarProps {
  table: Table<ExtendedBaseRegistryForm>
}

const formTypes = [
  { label: 'Marriage', value: FormType.MARRIAGE },
  { label: 'Birth', value: FormType.BIRTH },
  { label: 'Death', value: FormType.DEATH },
]

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [availableYears, setAvailableYears] = useState<
    Array<{ label: string; value: string; icon: ComponentType<{ className?: string }> }>
  >([])
  const [pageSearch, setPageSearch] = useState<string>('')
  const [bookSearch, setBookSearch] = useState<string>('')
  const [firstNameSearch, setFirstNameSearch] = useState<string>('')
  const [lastNameSearch, setLastNameSearch] = useState<string>('')
  const [middleNameSearch, setMiddleNameSearch] = useState<string>('')

  const formTypeColumn = table.getColumn('formType')
  const preparedByColumn = table.getColumn('preparedBy')
  const verifiedByColumn = table.getColumn('verifiedBy')
  const createdAtColumn = table.getColumn('createdAt')
  const statusColumn = table.getColumn('status')
  const yearColumn = table.getColumn('year')
  const registryDetailsColumn = table.getColumn('registryDetails')
  const detailsColumn = table.getColumn('details')

  // Generate available years from the data
  useEffect(() => {
    const rows = table.getFilteredRowModel().rows
    const uniqueYears = new Set<number>()

    // Extract years from all rows
    rows.forEach((row) => {
      if (row.original.createdAt) {
        const date = new Date(row.original.createdAt)
        uniqueYears.add(date.getFullYear())
      }
    })

    // Convert Set to array, sort in descending order, and format
    const years = Array.from(uniqueYears)
      .sort((a, b) => b - a)
      .map((year) => ({
        label: year.toString(),
        value: year.toString(),
        icon: Icons.calendar,
      }))

    setAvailableYears(years)
  }, [table])

  // Status options with proper typing matching the component interface
  const statusOptions = [
    { label: 'Pending', value: 'PENDING', icon: Icons.clock },
    { label: 'Verified', value: 'VERIFIED', icon: Icons.check },
  ]

  // Get unique preparer options
  const preparerOptions = Array.from(
    new Set(
      table.getRowModel().rows
        .map((row) => row.original.preparedBy?.name)
        .filter((name): name is string => typeof name === 'string')
    )
  ).map((name) => ({
    label: name,
    value: name,
    icon: Icons.user,
  }))

  // Get unique verifier options
  const verifierOptions = Array.from(
    new Set(
      table.getRowModel().rows
        .map((row) => row.original.verifiedBy?.name)
        .filter((name): name is string => typeof name === 'string')
    )
  ).map((name) => ({
    label: name,
    value: name,
    icon: Icons.user,
  }))

  // Handle page number search
  const handlePageSearch = (value: string) => {
    setPageSearch(value)
    if (registryDetailsColumn) {
      registryDetailsColumn.setFilterValue({ pageNumber: value, bookNumber: bookSearch })
    }
  }

  // Handle book number search
  const handleBookSearch = (value: string) => {
    setBookSearch(value)
    if (registryDetailsColumn) {
      registryDetailsColumn.setFilterValue({ pageNumber: pageSearch, bookNumber: value })
    }
  }

  // Handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (createdAtColumn) {
      if (range?.from) {
        createdAtColumn.setFilterValue(range)
      } else {
        createdAtColumn.setFilterValue(undefined)
      }
    }
  }

  // Reset all filters
  const handleReset = () => {
    table.resetColumnFilters()
    setDateRange(undefined)
    setPageSearch('')
    setBookSearch('')
  }

  // Handle data export
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
      const blob = new Blob([csvContent], { type: 'text/csvcharset=utf-8' })
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
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Section */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Search</TabsTrigger>
                <TabsTrigger value="advanced">Name Search</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="col-span-full md:col-span-2 lg:col-span-1">
                    <Input
                      placeholder="Search forms..."
                      onChange={(event) => table.setGlobalFilter(event.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Page number..."
                      value={pageSearch}
                      onChange={(event) => handlePageSearch(event.target.value)}
                    />
                    <Input
                      placeholder="Book number..."
                      value={bookSearch}
                      onChange={(event) => handleBookSearch(event.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    placeholder="First name"
                    value={firstNameSearch}
                    onChange={(event) => {
                      setFirstNameSearch(event.target.value);
                      if (detailsColumn) {
                        detailsColumn.setFilterValue([
                          event.target.value,
                          middleNameSearch,
                          lastNameSearch
                        ]);
                      }
                    }}
                  />
                  <Input
                    placeholder="Middle name"
                    value={middleNameSearch}
                    onChange={(event) => {
                      setMiddleNameSearch(event.target.value);
                      if (detailsColumn) {
                        detailsColumn.setFilterValue([
                          firstNameSearch,
                          event.target.value,
                          lastNameSearch
                        ]);
                      }
                    }}
                  />
                  <Input
                    placeholder="Last name"
                    value={lastNameSearch}
                    onChange={(event) => {
                      setLastNameSearch(event.target.value);
                      if (detailsColumn) {
                        detailsColumn.setFilterValue([
                          firstNameSearch,
                          middleNameSearch,
                          event.target.value
                        ]);
                      }
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Actions Section */}
        <Card className="w-full sm:w-auto">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={"outline"}
                  className="w-full sm:w-auto"
                  onClick={handleExport}
                >
                  <Icons.download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <DataTableViewOptions table={table} />
              </div>
              <div className="flex items-center gap-2">
                <AddCivilRegistryFormDialog />
                {/* <AddCivilRegistryFormDialogPdf /> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters section */}
      <div className="flex flex-wrap gap-2">
        {/* Filters */}
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
          {statusColumn && (
            <DataTableFacetedFilter
              column={statusColumn}
              title="Status"
              options={statusOptions}
            />
          )}
          {yearColumn && availableYears.length > 0 && (
            <DataTableFacetedFilter
              column={yearColumn}
              title="Year"
              options={availableYears}
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

        {/* Date range picker */}
        <div className="flex gap-2 items-start">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
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
  );
}