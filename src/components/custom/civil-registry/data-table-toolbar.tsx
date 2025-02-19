"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ComponentType } from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { hasPermission } from "@/types/auth"
import { Icons } from "@/components/ui/icons"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // <-- Make sure you have this component available
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ExtendedBaseRegistryForm } from "./columns"
import { FormType, Permission } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DataTableViewOptions } from "@/components/custom/table/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/custom/table/data-table-faceted-filter"
import { AddCivilRegistryFormDialog } from "@/components/custom/civil-registry/actions/add-form-dialog"

interface DataTableToolbarProps {
  table: Table<ExtendedBaseRegistryForm>
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
  const [availableYears, setAvailableYears] = useState<
    Array<{
      label: string
      value: string
      icon: ComponentType<{ className?: string }>
    }>
  >([])
  const [pageSearch, setPageSearch] = useState<string>("")
  const [bookSearch, setBookSearch] = useState<string>("")
  const [firstNameSearch, setFirstNameSearch] = useState<string>("")
  const [middleNameSearch, setMiddleNameSearch] = useState<string>("")
  const [lastNameSearch, setLastNameSearch] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const formTypeColumn = table.getColumn("formType")
  const preparedByColumn = table.getColumn("preparedBy")
  const verifiedByColumn = table.getColumn("verifiedBy")
  const createdAtColumn = table.getColumn("createdAt")
  const statusColumn = table.getColumn("status")
  const yearColumn = table.getColumn("year")
  const registryDetailsColumn = table.getColumn("registryDetails")
  const detailsColumn = table.getColumn("details")
  const canAdd = hasPermission(permissions, Permission.DOCUMENT_CREATE)

  // Control which columns are visible by default
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
    ]

    table.getAllColumns().forEach((column) => {
      const columnId = column.id
      const isVisible = defaultVisibleColumns.includes(columnId)
      if (column.getCanHide()) {
        column.toggleVisibility(isVisible)
      }
    })
  }, [table])

  // Collect unique years from the table data
  useEffect(() => {
    const rows = table.getFilteredRowModel().rows
    const uniqueYears = new Set<number>()

    rows.forEach((row) => {
      if (row.original.createdAt) {
        const date = new Date(row.original.createdAt)
        uniqueYears.add(date.getFullYear())
      }
    })

    const years = Array.from(uniqueYears)
      .sort((a, b) => b - a)
      .map((year) => ({
        label: year.toString(),
        value: year.toString(),
        icon: Icons.calendar,
      }))

    setAvailableYears(years)
  }, [table])

  const statusOptions = [
    { label: t("Pending"), value: "PENDING", icon: Icons.clock },
    { label: t("Verified"), value: "VERIFIED", icon: Icons.check },
  ]

  const preparerOptions = Array.from(
    new Set(
      table
        .getRowModel()
        .rows.map((row) => row.original.preparedBy?.name)
        .filter((name): name is string => typeof name === "string")
    )
  ).map((name) => ({
    label: name,
    value: name,
    icon: Icons.user,
  }))

  const verifierOptions = Array.from(
    new Set(
      table
        .getRowModel()
        .rows.map((row) => row.original.verifiedBy?.name)
        .filter((name): name is string => typeof name === "string")
    )
  ).map((name) => ({
    label: name,
    value: name,
    icon: Icons.user,
  }))

  // Handlers for search fields
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

  // For date range filtering
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
    setPageSearch("")
    setBookSearch("")
    setFirstNameSearch("")
    setMiddleNameSearch("")
    setLastNameSearch("")
  }

  // Refresh the page (or re-fetch data)
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
          {/* SEARCH FIELDS */}
          <div className="w-full max-w-5xl py-4 mx-auto">
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

      {/* FACETED FILTERS AND CONTROLS */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        {/* LEFT SIDE: Faceted filters */}
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
          {statusColumn && (
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

          {/* DATE RANGE PICKER */}
          <div className="flex gap-2 items-start">
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

            {/* RESET BUTTON (only visible if filters are applied) */}
            {isFiltered && (
              <Button variant="ghost" onClick={handleReset} size="sm">
                {t("Reset")}
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Add, View options, and Refresh */}
        <div className="flex items-center gap-4">
          {canAdd && (
            <div className="flex items-center gap-2">
              <AddCivilRegistryFormDialog />
            </div>
          )}

          <DataTableViewOptions table={table} />

          <Button variant="outline" onClick={handleRefresh}>
            <Icons.refresh
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
