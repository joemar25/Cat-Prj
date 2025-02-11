'use client'

import { useCallback, useState } from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useTranslation } from "react-i18next"
import { Role, Permission } from "@prisma/client"
import { CreateRoleDialog } from "./components/create-role-dialog"
import { DataTableViewOptions } from "@/components/custom/table/data-table-view-options"
import { useUser } from "@/context/user-context"
import { hasPermission } from "@/types/auth"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Link } from "lucide-react"
import * as Tooltip from '@radix-ui/react-tooltip'  // Import Tooltip

interface DataTableToolbarProps<TData extends Role> {
    table: Table<TData>
}

export function DataTableToolbar<TData extends Role>({ table }: DataTableToolbarProps<TData>) {
    const { t } = useTranslation()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const { permissions } = useUser()

    const canCreate = hasPermission(permissions, Permission.ROLE_CREATE)
    const canExport = hasPermission(permissions, Permission.ROLE_EXPORT)

    const nameColumn = table.getColumn("name")

    const handleSearch = useCallback((value: string) => {
        if (nameColumn) {
            nameColumn.setFilterValue(value)
        }
    }, [nameColumn])

    const handleExport = useCallback(() => {
        const tableData = table.getFilteredRowModel().rows.map((row) => row.original)
        if (tableData.length === 0) {
            console.error("No data available to export")
            return
        }
        const headers = Object.keys(tableData[0]).join(",")
        const rows = tableData
            .map((row) =>
                Object.values(row)
                    .map((value) =>
                        `"${value !== undefined && value !== null ? String(value).replace(/"/g, '""') : ""}"`
                    )
                    .join(",")
            )
            .join("\n")
        const csvContent = `${headers}\n${rows}`
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "roles_export.csv"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.info("Roles exported successfully")
    }, [table])

    const handleCreateRole = useCallback(async (data: any) => {
        try {
            const response = await fetch("/api/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error("Failed to create role")
        } catch (error) {
            console.error("Error creating role:", error)
        }
    }, [])

    return (
        <div className="relative">
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <Icons.infoCircledIcon className="h-5 w-5 cursor-pointer absolute left-2 -top-7"/>
                    </Tooltip.Trigger>
                    <Tooltip.Content 
                        className="bg-white p-4 rounded shadow-lg max-w-md z-50 dark:bg-muted mt-20" 
                        side="right"
                    >
                        <AlertTitle>{t("summary_view_role")}</AlertTitle>
                        <AlertDescription>
                            {t("dashboard_description_role")}
                        </AlertDescription>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>

            <div className="flex items-center justify-between mt-4">
                {/* Left side: Search input */}
                <div className="flex flex-1 items-center space-x-4">
                    <div className="relative">
                        <Icons.search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder={t("Search roles...")}
                            value={(nameColumn?.getFilterValue() as string) ?? ""}
                            onChange={(event) => handleSearch(event.target.value)}
                            className="h-10 w-[200px] lg:w-[300px] pl-10"
                        />
                    </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center space-x-4">
                    {canCreate && (
                        <Button
                            variant="default"
                            className="h-10"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Icons.plus className="mr-2 h-4 w-4" />
                            {t("Create Role")}
                        </Button>
                    )}
                    {canExport && (
                        <Button variant="outline" className="h-10" onClick={handleExport}>
                            <Icons.download className="mr-2 h-4 w-4" />
                            {t("Export")}
                        </Button>
                    )}
                    <DataTableViewOptions table={table} />
                </div>

                {/* Create Role Dialog */}
                <CreateRoleDialog
                    isOpen={isCreateDialogOpen}
                    onOpenChangeAction={async (open) => setIsCreateDialogOpen(open)}
                    createRoleAction={handleCreateRole}
                />
            </div>
        </div>
    )
}
