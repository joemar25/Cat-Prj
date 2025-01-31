"use client"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ComponentType } from "react"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { Table } from "@tanstack/react-table"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { ExtendedBaseRegistryForm } from "./columns"
import { FormType, Permission } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DataTableViewOptions } from "@/components/custom/table/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/custom/table/data-table-faceted-filter"
import { AddCivilRegistryFormDialog } from "@/components/custom/civil-registry/actions/add-form-dialog"
// import { AddCivilRegistryFormDialogPdf } from '@/components/custom/civil-registry/actions/upload-pdf-dialog'

import { useTranslation } from "react-i18next"
import { useUser } from "@/context/user-context"
import { hasPermission } from "@/types/auth"

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

  const canExport = hasPermission(permissions, Permission.REPORT_EXPORT)
  const canAdd = hasPermission(permissions, Permission.DOCUMENT_CREATE)

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

  const handleExport = () => {
    try {
      const tableData = table.getCoreRowModel().rows.map((row) => row.original)
      if (tableData.length === 0) {
        toast.error(t("No data available to export"))
        return
      }
      const headers = Object.keys(tableData[0]).join(",")
      const rows = tableData
        .map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(",")
        )
        .join("\n")
      const csvContent = `${headers}\n${rows}`
      const blob = new Blob([csvContent], { type: "text/csvcharset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "exported-data.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(t("Data exported successfully"))
    } catch (error) {
      toast.error(t("Failed to export data"))
      console.error("Export Error:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic">{t("Basic Search")}</TabsTrigger>
                <TabsTrigger value="advanced">{t("Name Search")}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    placeholder={t("Search forms...")}
                    onChange={(event) =>
                      table.setGlobalFilter(event.target.value)
                    }
                    className="w-full"
                  />
                  <Input
                    placeholder={t("Page number...")}
                    value={pageSearch}
                    onChange={(event) => handlePageSearch(event.target.value)}
                  />
                  <Input
                    placeholder={t("Book number...")}
                    value={bookSearch}
                    onChange={(event) => handleBookSearch(event.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced">
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
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="w-full sm:w-auto">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {canExport && (
                  <Button
                    variant={"outline"}
                    className="w-full sm:w-auto"
                    onClick={handleExport}
                  >
                    <Icons.download className="mr-2 h-4 w-4" />
                    {t("Export")}
                  </Button>
                )}
                <DataTableViewOptions table={table} />
              </div>
              {canAdd && (
                <div className="flex items-center gap-2">
                  <AddCivilRegistryFormDialog />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
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
        </div>

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
    </div>
  )
}