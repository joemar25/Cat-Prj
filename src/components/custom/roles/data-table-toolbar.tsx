"use client"

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

interface DataTableToolbarProps<TData extends Role> {
    table: Table<TData>
}

export function DataTableToolbar<TData extends Role>({ table }: DataTableToolbarProps<TData>) {
    const { t } = useTranslation()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    // Retrieve current user permissions from context.
    const { permissions } = useUser()

    // Check permissions for creating and exporting roles.
    const canCreate = hasPermission(permissions, Permission.ROLE_CREATE)
    const canExport = hasPermission(permissions, Permission.ROLE_EXPORT)

    // Get the "name" column for filtering.
    const nameColumn = table.getColumn("name")

    // Handle search filter on the name column.
    const handleSearch = useCallback((value: string) => {
        if (nameColumn) {
            nameColumn.setFilterValue(value)
        }
    }, [nameColumn])

    // Export function: extracts filtered rows from the table, converts them to CSV,
    // and triggers a download.
    const handleExport = useCallback(() => {
        const tableData = table.getFilteredRowModel().rows.map((row) => row.original)
        if (tableData.length === 0) {
            console.error("No data available to export")
            return
        }
        // Generate CSV headers from the keys of the first row.
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

    // Create role action: sends a POST request to create a role.
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
        <div className="flex items-center justify-between">
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
    )
}
