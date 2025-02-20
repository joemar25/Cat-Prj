"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ComponentType } from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { DateRange } from "react-day-picker"
import { hasPermission } from "@/types/auth"
import { Icons } from "@/components/ui/icons"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { FormType, Permission, DocumentStatus } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { BaseRegistryFormWithRelations } from "@/hooks/civil-registry-action"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DataTableViewOptions } from "@/components/custom/table/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/custom/table/data-table-faceted-filter"
import { AddCivilRegistryFormDialog } from "@/components/custom/civil-registry/actions/add-form-dialog"
import { AlertCircle, Info } from 'lucide-react'

interface DataTableToolbarProps {
  table: Table<BaseRegistryFormWithRelations>
}

const formTypes = [
  { label: "Marriage", value: FormType.MARRIAGE },
  { label: "Birth", value: FormType.BIRTH },
  { label: "Death", value: FormType.DEATH },
]

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const router = useRouter()
  const isFiltered = table.getState().columnFilters.length > 0

  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [availableYears, setAvailableYears] = useState<Array<{
    label: string
    value: string
    icon: ComponentType<{ className?: string }>
  }>>([])
  const [statusOptions, setStatusOptions] = useState<Array<{
    label: string
    value: DocumentStatus
    icon: ComponentType<{ className?: string }>
  }>>([])
  const [pageSearch, setPageSearch] = useState<string>("")
  const [bookSearch, setBookSearch] = useState<string>("")
  const [firstNameSearch, setFirstNameSearch] = useState<string>("")
  const [middleNameSearch, setMiddleNameSearch] = useState<string>("")
  const [lastNameSearch, setLastNameSearch] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Get status icon based on status
  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'PENDING':
        return Icons.clock
      case 'VERIFIED':
        return Icons.check
      case 'LATE_REGISTRATION':
        return AlertCircle
      default:
        return Info
    }
  }

  // Collect unique statuses from data
  useEffect(() => {
    const rows = table.getPreFilteredRowModel().rows
    const uniqueStatuses = new Set<DocumentStatus>()

    rows.forEach((row) => {
      const status = row.original.status
      if (status) {
        uniqueStatuses.add(status)
      }
    })

    const statuses = Array.from(uniqueStatuses)
      .sort()
      .map((status) => ({
        label: t(status.toLowerCase()),
        value: status,
        icon: getStatusIcon(status)
      }))

    setStatusOptions(statuses)
  }, [table.getPreFilteredRowModel().rows, t])

  // Get unique years
  useEffect(() => {
    const rows = table.getPreFilteredRowModel().rows
    const uniqueYears = new Set<string>()

    rows.forEach((row) => {
      const date = row.original.dateOfRegistration || row.original.createdAt
      if (date) {
        const year = new Date(date).getFullYear().toString()
        uniqueYears.add(year)
      }
    })

    const years = Array.from(uniqueYears)
      .sort((a, b) => b.localeCompare(a))
      .map((year) => ({
        label: year,
        value: year,
        icon: Icons.calendar,
      }))

    setAvailableYears(years)
  }, [table.getPreFilteredRowModel().rows])

  // Get preparers for filter
  const preparerOptions = useMemo(() => {
    const uniquePreparers = new Set<string>()

    table.getPreFilteredRowModel().rows.forEach((row) => {
      if (row.original.preparedBy?.name) {
        uniquePreparers.add(row.original.preparedBy.name)
      }
    })

    return Array.from(uniquePreparers)
      .map(name => ({
        label: name,
        value: name,
        icon: Icons.user
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [table.getPreFilteredRowModel().rows])

  // Get verifiers for filter
  const verifierOptions = useMemo(() => {
    const uniqueVerifiers = new Set<string>()

    table.getPreFilteredRowModel().rows.forEach((row) => {
      if (row.original.verifiedBy?.name) {
        uniqueVerifiers.add(row.original.verifiedBy.name)
      }
    })

    return Array.from(uniqueVerifiers)
      .map(name => ({
        label: name,
        value: name,
        icon: Icons.user
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [table.getPreFilteredRowModel().rows])

  const formTypeColumn = table.getColumn("formType")
  const preparedByColumn = table.getColumn("preparedBy")
  const verifiedByColumn = table.getColumn("verifiedBy")
  const createdAtColumn = table.getColumn("createdAt")
  const statusColumn = table.getColumn("status")
  const yearColumn = table.getColumn("year")
  const registryDetailsColumn = table.getColumn("registryDetails")
  const detailsColumn = table.getColumn("details")
  const canAdd = hasPermission(permissions, Permission.DOCUMENT_CREATE)

  useEffect(() => {
    const defaultVisibleColumns = [
      "formType",
      "registryDetails",
      "details",
      "preparedBy",
      "verifiedBy",
      "registeredBy",
      "status",
      "createdAt",
      "hasCTC",
      "Year"
    ]

    table.getAllColumns().forEach((column) => {
      const columnId = column.id
      const isVisible = defaultVisibleColumns.includes(columnId)
      if (column.getCanHide()) {
        column.toggleVisibility(isVisible)
      }
    })
  }, [table])


  // Collect years from data
  useEffect(() => {
    const rows = table.getPreFilteredRowModel().rows
    const uniqueYears = new Set<string>()

    rows.forEach((row) => {
      const rowData = row.original
      const date = rowData.dateOfRegistration || rowData.createdAt
      if (date) {
        const year = new Date(date).getFullYear().toString()
        uniqueYears.add(year)
      }
    })

    const years = Array.from(uniqueYears)
      .sort((a, b) => b.localeCompare(a))
      .map((year) => ({
        label: year,
        value: year,
        icon: Icons.calendar,
      }))

    setAvailableYears(years)
  }, [table.getPreFilteredRowModel().rows])

  // Column definitions
  const formTypes = [
    { label: "Marriage", value: FormType.MARRIAGE },
    { label: "Birth", value: FormType.BIRTH },
    { label: "Death", value: FormType.DEATH },
  ]

  // Handle search fields
  const handlePageSearch = (value: string) => {
    setPageSearch(value)
    if (registryDetailsColumn) {
      registryDetailsColumn.setFilterValue({
        pageNumber: value,
        bookNumber: bookSearch,
      })
    }
  }

  const handleBookSearch = (value: string) => {
    setBookSearch(value)
    if (registryDetailsColumn) {
      registryDetailsColumn.setFilterValue({
        pageNumber: pageSearch,
        bookNumber: value,
      })
    }
  }

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

  const handleReset = () => {
    table.resetColumnFilters()
    setDateRange(undefined)
    setPageSearch("")
    setBookSearch("")
    setFirstNameSearch("")
    setMiddleNameSearch("")
    setLastNameSearch("")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-4 relative">
      <Card>
        <CardContent className="space-y-6">
          <div className="w-full max-w-5xl py-4 mx-auto">
            {/* Row 1: Global Search, Page Number, Book Number */}
            <div className="grid grid-cols-3 gap-4">
              {/* Global Search */}
              <div className="flex flex-col">
                <Label htmlFor="globalSearch" className="text-sm font-medium">
                  {t("Global Search")}
                </Label>
                <div className="relative mt-1">
                  <Icons.search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="globalSearch"
                    placeholder={t("Search forms...")}
                    className="pl-8"
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Page Number */}
              <div className="flex flex-col">
                <Label htmlFor="pageNumber" className="text-sm font-medium">
                  {t("Page number")}
                </Label>
                <div className="relative mt-1">
                  <Icons.hash className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="pageNumber"
                    placeholder={t("Enter page #")}
                    className="pl-8"
                    value={pageSearch}
                    onChange={(e) => handlePageSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Book Number */}
              <div className="flex flex-col">
                <Label htmlFor="bookNumber" className="text-sm font-medium">
                  {t("Book number")}
                </Label>
                <div className="relative mt-1">
                  <Icons.book className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bookNumber"
                    placeholder={t("Enter book #")}
                    className="pl-8"
                    value={bookSearch}
                    onChange={(e) => handleBookSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Name Search Fields */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* First Name */}
              <div className="flex flex-col">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  {t("First name")}
                </Label>
                <div className="relative mt-1">
                  <Icons.user className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder={t("Enter first name")}
                    className="pl-8"
                    value={firstNameSearch}
                    onChange={(e) => {
                      setFirstNameSearch(e.target.value)
                      if (detailsColumn) {
                        detailsColumn.setFilterValue([
                          e.target.value,
                          middleNameSearch,
                          lastNameSearch,
                        ])
                      }
                    }}
                  />
                </div>
              </div>

              {/* Middle Name */}
              <div className="flex flex-col">
                <Label htmlFor="middleName" className="text-sm font-medium">
                  {t("Middle name")}
                </Label>
                <div className="relative mt-1">
                  <Icons.user className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="middleName"
                    placeholder={t("Enter middle name")}
                    className="pl-8"
                    value={middleNameSearch}
                    onChange={(e) => {
                      setMiddleNameSearch(e.target.value)
                      if (detailsColumn) {
                        detailsColumn.setFilterValue([
                          firstNameSearch,
                          e.target.value,
                          lastNameSearch,
                        ])
                      }
                    }}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  {t("Last name")}
                </Label>
                <div className="relative mt-1">
                  <Icons.user className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="lastName"
                    placeholder={t("Enter last name")}
                    className="pl-8"
                    value={lastNameSearch}
                    onChange={(e) => {
                      setLastNameSearch(e.target.value)
                      if (detailsColumn) {
                        detailsColumn.setFilterValue([
                          firstNameSearch,
                          middleNameSearch,
                          e.target.value,
                        ])
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {formTypeColumn && (
            <DataTableFacetedFilter
              column={formTypeColumn}
              title={t("Form Type")}
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

          {statusColumn && statusOptions.length > 0 && (
            <DataTableFacetedFilter
              column={statusColumn}
              title={t("Status")}
              options={statusOptions}
            />
          )}

          {yearColumn && availableYears.length > 0 && (
            <DataTableFacetedFilter
              column={yearColumn}
              title={t("Year")}
              options={availableYears}
            />
          )}

          {preparedByColumn && preparerOptions.length > 0 && (
            <DataTableFacetedFilter
              column={preparedByColumn}
              title={t("Prepared By")}
              options={preparerOptions}
            />
          )}

          {verifiedByColumn && verifierOptions.length > 0 && (
            <DataTableFacetedFilter
              column={verifiedByColumn}
              title={t("Verified By")}
              options={verifierOptions}
            />
          )}

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal h-8",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Icons.calendar className="mr-2 h-4 w-4" />
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
                  <span>{t("Pick a date range")}</span>
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

          {/* Reset button */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2 lg:px-3"
            >
              {t("Reset")}
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {canAdd && (
            <div className="flex items-center gap-2">
              <AddCivilRegistryFormDialog />
            </div>
          )}

          <DataTableViewOptions table={table} />

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <Icons.refresh
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}