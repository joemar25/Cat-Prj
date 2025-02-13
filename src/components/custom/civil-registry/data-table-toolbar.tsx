"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ComponentType } from "react"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { hasPermission } from "@/types/auth"
import { Icons } from "@/components/ui/icons"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { Cross2Icon } from "@radix-ui/react-icons"
import { CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ExtendedBaseRegistryForm } from "./columns"
import { FormType, Permission } from "@prisma/client"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DataTableViewOptions } from "@/components/custom/table/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/custom/table/data-table-faceted-filter"
import { AddCivilRegistryFormDialog } from "@/components/custom/civil-registry/actions/add-form-dialog"
import * as Tooltip from "@radix-ui/react-tooltip"

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

  const formTypeColumn = table.getColumn("formType")
  const preparedByColumn = table.getColumn("preparedBy")
  const verifiedByColumn = table.getColumn("verifiedBy")
  const createdAtColumn = table.getColumn("createdAt")
  const statusColumn = table.getColumn("status")
  const yearColumn = table.getColumn("year")
  const registryDetailsColumn = table.getColumn("registryDetails")
  const detailsColumn = table.getColumn("details")
  const canAdd = hasPermission(permissions, Permission.DOCUMENT_CREATE)

  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    const defaultVisibleColumns = [
      'formType',
      'registryDetails',
      'details',
      'preparedBy',
      'verifiedBy',
      'registeredBy',
      'status',
      'createdAt',
      'hasCTC',
    ]

    table.getAllColumns().forEach((column) => {
      const columnId = column.id
      const isVisible = defaultVisibleColumns.includes(columnId)
      if (column.getCanHide()) {
        column.toggleVisibility(isVisible)
      }
    })
  }, [table])

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
  }

  const handleToggleTab = (tab: string) => {
    setActiveTab((prev) => (prev === tab ? null : tab))
  }

  return (
    <div className="space-y-4 relative">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icons.infoCircledIcon className="h-5 w-5 cursor-pointer absolute -top-2 left-2" />
          </Tooltip.Trigger>
          <Tooltip.Content
            className="bg-white dark:bg-muted p-4 rounded shadow-lg max-w-md z-50 mt-20"
            side="right"
          >
            <AlertTitle>{t('summary_view_civil')}</AlertTitle>
            <AlertDescription>
              {t('dashboard_description_civil')}
            </AlertDescription>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>


      <div className="flex flex-col sm:flex-row">
        <div className="flex-1">
          <CardContent className="p-2.5">
            <div className="flex items-center justify-center w-full">
              <div className={`flex gap-6 justify-center w-full max-w-[1000px] ${activeTab === null ? "" : "h-12"}`}>
                <button
                  className={`hover:border-chart-2/50 dark:hover:border-chart-3 w-full max-h-9 flex items-center justify-center text-center rounded-lg p-2 transition-all
        ${activeTab === "basic" ? "rounded-md bg-chart-3 text-white border border-chart-2/50 dark:border-chart-3" : "border"}`}
                  onClick={() => handleToggleTab("basic")}
                >
                  {t("Basic Search")}
                </button>
                <button
                  className={`hover:border-chart-2/50 dark:hover:border-chart-3 w-full max-h-9 flex items-center justify-center text-center rounded-lg p-2 transition-all
        ${activeTab === "advanced" ? "rounded-md bg-chart-3 text-white border border-chart-2/50 dark:border-chart-3" : "border"}`}
                  onClick={() => handleToggleTab("advanced")}
                >
                  {t("Name Search")}
                </button>
              </div>
            </div>

            {/* Basic Search Input Fields */}
            {activeTab === "basic" && (
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder={t("Search forms...")}
                  onChange={(event) => table.setGlobalFilter(event.target.value)}
                  className="w-full h-8.5"
                />
                <Input
                  placeholder={t("Page number...")}
                  value={pageSearch}
                  onChange={(event) => handlePageSearch(event.target.value)}
                  className="w-full h-8.5"
                />
                <Input
                  placeholder={t("Book number...")}
                  value={bookSearch}
                  onChange={(event) => handleBookSearch(event.target.value)}
                  className="w-full h-8.5"
                />
              </div>
            )}

            {/* Advanced Search Input Fields */}
            {activeTab === "advanced" && (
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder={t("First name")}
                  value={firstNameSearch}
                  onChange={(event) => {
                    setFirstNameSearch(event.target.value)
                    if (detailsColumn) {
                      detailsColumn.setFilterValue([
                        event.target.value,
                        middleNameSearch,
                        lastNameSearch,
                      ])
                    }
                  }}
                  className="w-full h-8.5"
                />
                <Input
                  placeholder={t("Middle name")}
                  value={middleNameSearch}
                  onChange={(event) => {
                    setMiddleNameSearch(event.target.value)
                    if (detailsColumn) {
                      detailsColumn.setFilterValue([
                        firstNameSearch,
                        event.target.value,
                        lastNameSearch,
                      ])
                    }
                  }}
                  className="w-full h-8.5"
                />
                <Input
                  placeholder={t("Last name")}
                  value={lastNameSearch}
                  onChange={(event) => {
                    setLastNameSearch(event.target.value)
                    if (detailsColumn) {
                      detailsColumn.setFilterValue([
                        firstNameSearch,
                        middleNameSearch,
                        event.target.value,
                      ])
                    }
                  }}
                  className="w-full h-8.5"
                />
              </div>
            )}
          </CardContent>
        </div>
      </div>

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

            {isFiltered && (
              <Button variant="ghost" onClick={handleReset} size="sm">
                {t("Reset")}
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {canAdd && (
            <div className="flex items-center gap-2">
              <AddCivilRegistryFormDialog />
            </div>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  )
}